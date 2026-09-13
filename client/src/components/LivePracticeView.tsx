import React, { useEffect, useRef, useState } from 'react';
import {
  Square,
  Pause,
  Play,
  RotateCcw,
  Mic,
  Sparkles,
  Shield,
  Eye,
  Activity,
  Gauge,
  Zap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  LiveCue,
  ObservableVisualSignals,
  SessionConfig
} from '../types';
import { AudioCaptureService } from '../services/audioCapture';
import { VisualDeliveryAnalyzer } from '../services/visualDelivery';
import { LiveCueEngine } from '../services/cueEngine';
import { AnalyzedLine, analyzeSpokenLine } from '../services/liveLineAnalyzer';

interface LivePracticeViewProps {
  config: SessionConfig;
  onFinishSession: (finalTranscript: string, durationSeconds: number, visualSignals?: ObservableVisualSignals, audioBlob?: Blob) => void;
  onCancelSession: () => void;
  isApiConfigured: boolean;
}

export const LivePracticeView: React.FC<LivePracticeViewProps> = ({
  config,
  onFinishSession,
  onCancelSession,
  isApiConfigured,
}) => {
  // Timer & state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Audio & speech
  const [committedTranscript, setCommittedTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioEnergy, setAudioEnergy] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [isSilent, setIsSilent] = useState(false);

  // Real-time Line-by-Line Analysis & Formatted Better State
  const [analyzedLines, setAnalyzedLines] = useState<AnalyzedLine[]>([]);
  const [liveFeedbackMode, setLiveFeedbackMode] = useState<'active' | 'subtle'>('active');

  // Subtle Live Cue
  const [activeCue, setActiveCue] = useState<LiveCue | null>(null);

  // Visual signals
  const [visualSignals, setVisualSignals] = useState<ObservableVisualSignals | undefined>();
  const [cameraActive, setCameraActive] = useState(false);

  // Refs for services & sockets
  const audioServiceRef = useRef<AudioCaptureService | null>(null);
  const visualAnalyzerRef = useRef<VisualDeliveryAnalyzer | null>(null);
  const cueEngineRef = useRef<LiveCueEngine>(new LiveCueEngine());
  const socketRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const wordsSpokenSincePauseRef = useRef<number>(0);
  const silenceStartRef = useRef<number>(Date.now());
  const audioBlobRef = useRef<Blob | undefined>();

  // Demo simulator state
  const isDemo = config.isDemo || !isApiConfigured;
  const demoIntervalRef = useRef<any>(null);

  // Process and analyze each committed spoken sentence
  const handleNewCommittedSentence = (sentenceText: string) => {
    const trimmed = sentenceText.trim();
    if (!trimmed) return;

    // 1. Instant client-side analysis (sub-20ms)
    const localAnalysis = analyzeSpokenLine(trimmed, elapsedSeconds);
    setAnalyzedLines((prev) => [localAnalysis, ...prev]);

    // 2. Asynchronous server polish via Gemini 3.6 Flash when API key is active
    if (isApiConfigured && !isDemo) {
      fetch('/api/analyze-line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineText: trimmed,
          scenario: config.scenario,
          audience: config.audience
        })
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.formattedBetter) {
            setAnalyzedLines((prev) =>
              prev.map((line) =>
                line.id === localAnalysis.id
                  ? {
                      ...line,
                      formattedBetter: res.formattedBetter,
                      score: res.score ?? line.score,
                      statusTag: res.status ?? line.statusTag,
                      coachingTip: res.coachingTip ?? line.coachingTip
                    }
                  : line
              )
            );
          }
        })
        .catch(() => {
          // Keep local analysis silently
        });
    }
  };

  // 1. Initialize Audio & WebSocket / Demo Pipeline
  useEffect(() => {
    cueEngineRef.current.reset();

    // Start elapsed timer
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Initialize Audio Capture
    const audioService = new AudioCaptureService();
    audioServiceRef.current = audioService;

    // Connect WebSocket if in live mode
    if (!isDemo) {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/live`;
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to communication_coach server live proxy');
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'transcription') {
              if (msg.interim) {
                setInterimTranscript(msg.interim);
              }
              if (msg.final) {
                setCommittedTranscript((prev) => (prev ? `${prev} ${msg.final}` : msg.final));
                setInterimTranscript('');
                wordsSpokenSincePauseRef.current = 0;
                handleNewCommittedSentence(msg.final);
              }
            }
          } catch (e) {
            console.warn('WS message parse error:', e);
          }
        };

        ws.onerror = (err) => {
          console.warn('Live WebSocket error, continuing in local mode:', err);
        };
      } catch (err) {
        console.warn('Could not establish Live WebSocket:', err);
      }
    } else {
      // Demo Mode Simulator: simulate live transcription stream
      startDemoSimulation();
    }

    // Start physical microphone capture
    audioService
      .startCapture(
        {
          onPcmChunk: (base64) => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && !isPaused) {
              socketRef.current.send(
                JSON.stringify({
                  type: 'audio',
                  data: base64,
                })
              );
            }
          },
          onEnergyLevel: (energy) => {
            if (!isPaused) setAudioEnergy(energy);
          },
          onSilenceState: (silent) => {
            setIsSilent(silent);
            if (silent) {
              silenceStartRef.current = Date.now();
              wordsSpokenSincePauseRef.current = 0;
              if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ type: 'audio_stream_end' }));
              }
            }
          },
          onError: (err) => {
            console.error('Audio capture error:', err);
          },
        },
        config.storageMode === 'full'
      )
      .then(() => setMicActive(true))
      .catch((err) => {
        console.warn('Microphone permission denied or unavailable:', err);
        setMicActive(false);
      });

    // 2. Initialize Optional Camera Analysis if chosen
    if (config.cameraMode === 'mic_and_visual' && videoRef.current) {
      const visualAnalyzer = new VisualDeliveryAnalyzer();
      visualAnalyzerRef.current = visualAnalyzer;
      visualAnalyzer
        .start(videoRef.current)
        .then(() => setCameraActive(true))
        .catch((err) => {
          console.warn('Camera permission unavailable, falling back to mic only:', err);
          setCameraActive(false);
        });
    }

    return () => {
      cleanup();
    };
  }, []);

  // Demo simulation text stream
  const startDemoSimulation = () => {
    const demoSentences = [
      'Our Q3 delivery date basically moved out two weeks because of Stripe Level 1 certification.',
      'Our internal checkout engine actually passed QA on Tuesday, so the code is ready.',
      'Rather than letting one vendor block the entire launch, we kind of feature-flagged secondary payment methods.',
      'In our canary test with Acme Corp, query resolution dropped from 4 minutes down to 850 milliseconds.',
      'This guarantees 92% of domestic card transactions launch strictly on schedule for November 18th.'
    ];

    let sentenceIndex = 0;
    let wordIndex = 0;
    let currentWords = demoSentences[0].split(' ');

    demoIntervalRef.current = setInterval(() => {
      if (isPaused) return;

      if (wordIndex < currentWords.length) {
        // Stream next words
        const partial = currentWords.slice(0, wordIndex + 1).join(' ');
        setInterimTranscript(partial);
        setAudioEnergy(0.45 + Math.random() * 0.35); // simulate vocal energy
        wordIndex++;
      } else {
        // Commit sentence
        const completed = demoSentences[sentenceIndex];
        setCommittedTranscript((prev) => (prev ? `${prev} ${completed}` : completed));
        setInterimTranscript('');
        handleNewCommittedSentence(completed);
        sentenceIndex = (sentenceIndex + 1) % demoSentences.length;
        currentWords = demoSentences[sentenceIndex].split(' ');
        wordIndex = 0;
        setAudioEnergy(0.08); // brief pause
      }
    }, 450);
  };

  // 3. Live Cue Evaluation Loop (Evaluates subtle next cues at natural pauses)
  useEffect(() => {
    if (isPaused) return;

    const fullText = `${committedTranscript} ${interimTranscript}`.trim();
    const words = fullText.split(/\s+/).filter(Boolean);
    const silenceDuration = isSilent ? Date.now() - silenceStartRef.current : 0;

    cueEngineRef.current.evaluateCue(
      {
        scenario: config.scenario,
        intensity: config.coachingIntensity,
        elapsedSeconds,
        targetDurationSeconds: config.targetDuration,
        totalWordCount: words.length,
        recentWordsCount: wordsSpokenSincePauseRef.current,
        isSilent,
        silenceDurationMs: silenceDuration,
        fullTranscript: fullText,
      },
      (cue) => {
        setActiveCue(cue);
      }
    );

    // Update visual signals periodically if active
    if (visualAnalyzerRef.current && cameraActive) {
      setVisualSignals(visualAnalyzerRef.current.getSignals());
    }
  }, [elapsedSeconds, isSilent, committedTranscript, interimTranscript, isPaused]);

  const cleanup = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    if (audioServiceRef.current) {
      audioBlobRef.current = audioServiceRef.current.stopCapture();
    }
    if (visualAnalyzerRef.current) {
      visualAnalyzerRef.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleFinish = () => {
    cleanup();
    const finalTranscript = `${committedTranscript} ${interimTranscript}`.trim();
    const finalSignals = visualAnalyzerRef.current ? visualAnalyzerRef.current.getSignals() : undefined;
    onFinishSession(finalTranscript, elapsedSeconds, finalSignals, audioBlobRef.current);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = Math.min(100, Math.round((elapsedSeconds / config.targetDuration) * 100));

  // Dynamic Live Metrics calculations
  const totalSpokenWords = (committedTranscript + ' ' + interimTranscript).split(/\s+/).filter(Boolean).length;
  const currentWpm = elapsedSeconds > 4 ? Math.round((totalSpokenWords / elapsedSeconds) * 60) : 135;
  const totalFillersCount = analyzedLines.reduce((acc, l) => acc + l.fillersFound.length, 0);

  // WPM status label & styling
  const getPacingFeedback = (wpm: number) => {
    if (wpm > 165) return { label: 'Rushing (slow down)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (wpm < 110 && elapsedSeconds > 8) return { label: 'Slow (build momentum)', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    return { label: 'Optimal Cadence', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  };
  const pacingInfo = getPacingFeedback(currentWpm);

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between rounded-2xl border border-studio-800 bg-studio-950 p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6">
      
      {/* Background Studio Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

      {/* Top Header & Live Mode Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-studio-800/80 pb-4">
        
        {/* Scenario Info */}
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-sky-400">
              {config.scenario} Studio
            </span>
            <span className="text-studio-600">•</span>
            <span className="text-xs text-studio-400 capitalize">
              Audience: {config.audience.replace('_', ' ')}
            </span>
          </div>
          <h2 className="text-base font-bold text-white">
            {config.prompt ? config.prompt.title : config.customTopic || 'Open Speaking Practice'}
          </h2>
        </div>

        {/* Live Controls & Mode Toggle */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Active Live Feedback vs Subtle Toggle */}
          <div className="flex items-center bg-studio-900 p-1 rounded-lg border border-studio-800">
            <button
              onClick={() => setLiveFeedbackMode('active')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                liveFeedbackMode === 'active'
                  ? 'bg-sky-500 text-studio-950 shadow-sm'
                  : 'text-studio-400 hover:text-white'
              }`}
            >
              <Zap className="h-3 w-3" />
              <span>Active Feedback</span>
            </button>
            <button
              onClick={() => setLiveFeedbackMode('subtle')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                liveFeedbackMode === 'subtle'
                  ? 'bg-studio-800 text-white shadow-sm'
                  : 'text-studio-400 hover:text-white'
              }`}
            >
              Subtle Cue Only
            </button>
          </div>

          {/* Storage Mode Badge */}
          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-studio-900 border border-studio-800 text-studio-300">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="capitalize font-medium">{config.storageMode.replace('_', ' ')}</span>
          </div>

          {/* Sensor indicator */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-studio-900 border border-studio-800 text-studio-300">
            <Mic className={`h-3.5 w-3.5 ${audioEnergy > 0.1 ? 'text-emerald-400 animate-pulse' : 'text-studio-500'}`} />
            <span>{micActive ? 'Mic Live' : 'Simulation'}</span>
          </div>
        </div>
      </div>

      {/* ACTIVE LIVE FEEDBACK HUD (Real-Time Pacing, Filler Counter, & Cadence) */}
      {liveFeedbackMode === 'active' && (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-studio-900/60 p-3.5 rounded-xl border border-studio-800 text-xs">
          
          {/* 1. Live WPM Cadence Speedometer */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-studio-400 text-[11px]">
              <Gauge className="h-3.5 w-3.5 text-sky-400" />
              <span>Speaking Speed</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-white">{currentWpm}</span>
              <span className="text-[10px] text-studio-500 font-mono">WPM</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${pacingInfo.color}`}>
                {pacingInfo.label}
              </span>
            </div>
          </div>

          {/* 2. Live Filler Words Counter */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-studio-400 text-[11px]">
              <AlertTriangle className={`h-3.5 w-3.5 ${totalFillersCount > 0 ? 'text-amber-400' : 'text-studio-500'}`} />
              <span>Fillers Detected</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-xl font-bold font-mono ${totalFillersCount > 3 ? 'text-amber-400' : 'text-white'}`}>
                {totalFillersCount}
              </span>
              <span className="text-[10px] text-studio-400">
                {totalFillersCount === 0 ? 'Clean speech' : `${totalFillersCount} in session`}
              </span>
            </div>
          </div>

          {/* 3. Sentences Analyzed Count */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-studio-400 text-[11px]">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>Lines Scored Live</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-white">{analyzedLines.length}</span>
              <span className="text-[10px] text-studio-400">sentences parsed</span>
            </div>
          </div>

          {/* 4. Thought Boundary & Breath Status */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-studio-400 text-[11px]">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              <span>Thought Boundary</span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className={`h-2 w-2 rounded-full ${isSilent ? 'bg-purple-400 animate-pulse' : 'bg-studio-700'}`} />
              <span className="text-xs font-medium text-studio-200">
                {isSilent ? 'Breathing pause' : 'Speaking actively'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Middle Stage: Timer, Audio Energy & Real-Time Line Feed */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Timer, Visualizer, Next Cue, & Live Subtitles */}
        <div className={`space-y-5 text-center ${liveFeedbackMode === 'active' ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          
          {/* Large Calm Timer */}
          <div className="space-y-1.5">
            <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white select-none">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-xs font-mono text-studio-400 flex items-center justify-center space-x-2">
              <span>Target: {formatTime(config.targetDuration)}</span>
              <span>•</span>
              <span className={elapsedSeconds > config.targetDuration ? 'text-amber-400 font-semibold' : 'text-studio-400'}>
                {elapsedSeconds > config.targetDuration ? 'Wrap up' : `${progressPct}%`}
              </span>
            </div>

            {/* Target Progress Bar */}
            <div className="max-w-xs mx-auto h-1.5 bg-studio-850 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-300 ${
                  elapsedSeconds > config.targetDuration ? 'bg-amber-400' : 'bg-sky-400'
                }`}
                style={{ width: `${Math.min(100, progressPct)}%` }}
              />
            </div>
          </div>

          {/* Audio Energy Visualizer Bars */}
          <div className="flex items-center justify-center space-x-1.5 h-8 py-1">
            {Array.from({ length: 14 }).map((_, i) => {
              const baseHeight = 3;
              const variance = Math.sin((i / 14) * Math.PI) * (audioEnergy * 28);
              const barHeight = Math.max(baseHeight, Math.min(30, baseHeight + variance));
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    audioEnergy > 0.08 ? 'bg-sky-400' : 'bg-studio-800'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
              );
            })}
          </div>

          {/* Subtle Live Cue (Governor) */}
          <div className="min-h-[44px] flex items-center justify-center">
            {activeCue ? (
              <div className="animate-cue-in inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-200 text-xs font-medium shadow-md shadow-sky-500/10">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>{activeCue.text}</span>
              </div>
            ) : (
              <div className="text-[11px] text-studio-600 font-mono italic">
                {isPaused ? 'Session paused' : 'Listening quietly at natural thought boundaries...'}
              </div>
            )}
          </div>

          {/* Live Subtitle / Interim Speech Window */}
          <div className="rounded-xl border border-studio-800 bg-studio-900/60 p-4 text-left max-h-36 overflow-y-auto space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-studio-500 flex items-center justify-between">
              <span>Active Speech Preview</span>
              <span className="text-studio-600 text-[10px]">Streaming</span>
            </div>
            <div className="text-xs leading-relaxed">
              {interimTranscript ? (
                <span className="text-sky-300 italic">{interimTranscript}</span>
              ) : committedTranscript ? (
                <span className="text-studio-400 text-[11px]">Last spoke: “{committedTranscript.slice(-70)}...”</span>
              ) : (
                <span className="text-studio-500 italic">Speak clearly into your microphone...</span>
              )}
            </div>
          </div>

          {/* Optional Camera Preview Widget */}
          {config.cameraMode === 'mic_and_visual' && (
            <div className="rounded-xl border border-studio-800 bg-studio-900/70 p-3 space-y-2 text-left">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-studio-300">Observable Framing</span>
                <span className="text-[10px] text-emerald-400 font-mono">100% On-Device</span>
              </div>
              <div className="relative aspect-video rounded-lg bg-black overflow-hidden border border-studio-800">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              </div>
              {visualSignals && (
                <div className="flex justify-between text-[10px] font-mono text-studio-400 pt-0.5">
                  <span>Gaze: {visualSignals.gazeAlignmentScore}%</span>
                  <span>Framing: {visualSignals.framingStatus}</span>
                  <span>Head: {visualSignals.headMovementLevel}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: REAL-TIME LINE-BY-LINE ANALYSIS & "FORMATTED BETTER" STREAM */}
        {liveFeedbackMode === 'active' && (
          <div className="lg:col-span-7 rounded-2xl border border-studio-800 bg-studio-900/80 p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-studio-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-white">
                  Real-Time Line Analysis & Formatted Better
                </h3>
              </div>
              <span className="text-[10px] text-studio-400">
                Analyzed live as you speak
              </span>
            </div>

            {/* Scrollable List of Analyzed Lines */}
            <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3">
              {analyzedLines.length === 0 ? (
                <div className="py-12 text-center text-xs text-studio-500 italic space-y-2">
                  <MessageSquare className="h-8 w-8 text-studio-700 mx-auto" />
                  <p>Speak a sentence. As you pause, each line will be analyzed live right here with its score and a sharper "Formatted Better" alternative.</p>
                </div>
              ) : (
                analyzedLines.map((line, idx) => (
                  <div
                    key={line.id}
                    className="rounded-xl border border-studio-800 bg-studio-850/90 p-4 space-y-2.5 transition-all animate-cue-in"
                  >
                    {/* Line Header: Timestamp + Score Badge + Status Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-studio-400 bg-studio-800 px-1.5 py-0.5 rounded">
                          {formatTime(line.timestampSeconds)}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          Score: <span className={line.score >= 85 ? 'text-emerald-400' : line.score >= 70 ? 'text-sky-400' : 'text-amber-400'}>{line.score}</span>/100
                        </span>
                      </div>

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${line.statusColor}`}>
                        {line.statusTag}
                      </span>
                    </div>

                    {/* What User Spoke (Highlighting Fillers) */}
                    <div className="text-xs text-studio-200 leading-relaxed font-sans">
                      <span className="text-[10px] uppercase font-mono text-studio-400 block mb-0.5">You Said:</span>
                      “{line.originalText}”
                    </div>

                    {/* Inline Formatted Better Suggestion Box */}
                    <div className="rounded-lg bg-studio-900 p-3 border border-sky-500/30 space-y-1">
                      <div className="flex items-center space-x-1.5 text-sky-300 text-[11px] font-bold">
                        <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                        <span>Formatted Better:</span>
                      </div>
                      <p className="text-xs text-emerald-300 font-medium font-serif italic leading-relaxed">
                        “{line.formattedBetter}”
                      </p>
                      {line.coachingTip && (
                        <div className="text-[10px] text-studio-400 pt-0.5">
                          💡 {line.coachingTip}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Studio Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-studio-800 pt-4">
        
        {/* Cancel / Discard */}
        <button
          onClick={onCancelSession}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-studio-400 hover:text-rose-400 hover:bg-studio-900 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Discard Session</span>
        </button>

        {/* Center Actions: Pause / Resume & Finish Session */}
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePause}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-studio-700 bg-studio-850 hover:bg-studio-800 text-xs font-semibold text-white transition-colors"
          >
            {isPaused ? <Play className="h-4 w-4 text-emerald-400" /> : <Pause className="h-4 w-4 text-amber-400" />}
            <span>{isPaused ? 'Resume Practice' : 'Pause Practice'}</span>
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-xs font-bold text-studio-950 transition-all shadow-lg shadow-sky-500/25"
          >
            <Square className="h-4 w-4 fill-studio-950" />
            <span>Finish & Review Debrief</span>
          </button>
        </div>

        {/* Right Status info */}
        <div className="text-[11px] font-mono text-studio-500 flex items-center space-x-2">
          <span>{config.isDemo ? 'Demo Mode active' : 'Gemini 3.5 Live Active'}</span>
        </div>

      </div>

    </div>
  );
};
