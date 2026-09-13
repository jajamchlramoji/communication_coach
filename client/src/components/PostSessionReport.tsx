import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Smile,
  Shield,
  Layers,
  Clock,
  RotateCcw,
  Volume2,
  Quote,
  ChevronDown,
  ChevronUp,
  Share2,
  Trash2
} from 'lucide-react';
import { CoachingReport, SessionConfig } from '../types';

interface PostSessionReportProps {
  report: CoachingReport;
  config: SessionConfig;
  audioBlob?: Blob;
  onRetryExercise: (focusedSkill: string, prompt: string) => void;
  onDone: () => void;
  onDeleteSession?: () => void;
}

export const PostSessionReport: React.FC<PostSessionReportProps> = ({
  report,
  config,
  audioBlob,
  onRetryExercise,
  onDone,
  onDeleteSession,
}) => {
  const [expandedReplayLine, setExpandedReplayLine] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Audio recording URL if mode 3
  const audioUrl = React.useMemo(() => {
    return audioBlob ? URL.createObjectURL(audioBlob) : null;
  }, [audioBlob]);

  React.useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      
      {/* 1. Header Banner & Storage Tier Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-studio-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-sky-400">
              Coaching Debrief
            </span>
            <span className="text-studio-600">•</span>
            <span className="text-xs text-studio-400 capitalize">
              {report.scenario} • {report.durationSeconds}s • {report.wordsPerMinute} WPM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Performance Analysis & Actionable Debrief
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-studio-900 border border-studio-800 text-xs text-studio-300">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="capitalize">{config.storageMode.replace('_', ' ')}</span>
          </div>

          <button
            onClick={onDone}
            className="px-4 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-xs font-semibold text-white border border-studio-700 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* 2. One-Sentence Summary & "What People Will Remember" Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* One-Sentence Summary */}
        <div className="md:col-span-7 rounded-2xl border border-studio-800 bg-studio-900/70 p-6 space-y-3">
          <div className="text-xs uppercase tracking-wider font-mono text-studio-400 font-semibold">
            One-Sentence Executive Summary
          </div>
          <p className="text-base text-studio-100 leading-relaxed font-medium">
            {report.oneSentenceSummary}
          </p>
        </div>

        {/* Overall Score Dial & WPM */}
        <div className="md:col-span-5 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-mono text-sky-400 font-semibold">
              Speaking Standard Score
            </div>
            <div className="text-4xl font-black text-white mt-1">
              {report.overallScore}<span className="text-lg text-studio-400 font-normal">/100</span>
            </div>
            <div className="text-xs text-studio-400 mt-1">
              {report.wordsPerMinute} WPM • {report.wordCount} words
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <TrendingUp className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* "What People Will Remember" (Critical High-Leverage Memory Anchor) */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-studio-900 to-studio-900 p-6 sm:p-7 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider">
          <Quote className="h-4 w-4" />
          <span>What People Will Remember</span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-white font-serif italic leading-relaxed">
          {report.whatPeopleWillRemember}
        </p>
        <p className="text-xs text-studio-400">
          This was your single most durable memory anchor — concrete, visual, or contrasting enough to stick in the listener's head.
        </p>
      </div>

      {/* Local Audio Playback if Full Recording Mode was authorized */}
      {audioUrl && (
        <div className="rounded-xl border border-studio-800 bg-studio-900/60 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Volume2 className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="text-xs font-semibold text-white">Full Session Audio Playback</div>
              <div className="text-[11px] text-studio-400">Stored strictly in your local browser IndexedDB</div>
            </div>
          </div>
          <audio controls src={audioUrl} className="h-8 max-w-xs" />
        </div>
      )}

      {/* 3. Seven-Dimension Explainable Scorecard */}
      <div className="rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-7 space-y-6">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-white">Explainable Scorecard</h2>
          <p className="text-xs text-studio-400">Every score is tied to observable evidence in your speech.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { key: 'clarity', title: 'Clarity & Phrasing', data: report.scorecard.clarity },
            { key: 'concision', title: 'Concision & WPM', data: report.scorecard.concision },
            { key: 'structure', title: 'Structure & Progression', data: report.scorecard.structure },
            { key: 'storytelling', title: 'Storytelling & Anchors', data: report.scorecard.storytelling },
            { key: 'engagement', title: 'Audience Engagement', data: report.scorecard.engagement },
            { key: 'delivery', title: 'Delivery & Pacing', data: report.scorecard.delivery },
            { key: 'purposefulWit', title: 'Purposeful Wit & Levity', data: report.scorecard.purposefulWit },
          ].map(({ key, title, data }) => (
            <div key={key} className="rounded-xl bg-studio-850 p-4 border border-studio-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{title}</span>
                <span className="text-sm font-mono font-bold text-sky-400">{data.score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-studio-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full"
                  style={{ width: `${data.score}%` }}
                />
              </div>
              <p className="text-xs text-studio-300 leading-relaxed pt-1">{data.evidence}</p>
              <div className="text-[10px] text-studio-500 font-mono italic">
                Benchmark: {data.benchmark}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Three Strengths (Quoted precise moments) */}
      <div className="rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-7 space-y-5">
        <div className="border-b border-studio-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Three Precise Strengths</span>
            </h2>
            <p className="text-xs text-studio-400">Exact timestamped moments where your communication excelled.</p>
          </div>
        </div>

        <div className="space-y-4">
          {report.strengths.map((s, idx) => (
            <div key={idx} className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{idx + 1}. {s.title}</h3>
                {s.timestamp && (
                  <span className="text-[11px] font-mono text-studio-400 bg-studio-800 px-2 py-0.5 rounded">
                    {s.timestamp}
                  </span>
                )}
              </div>
              <p className="text-xs text-studio-300 leading-relaxed">{s.explanation}</p>
              <div className="rounded bg-studio-900 p-2.5 border border-studio-800 text-xs text-emerald-300/90 font-serif italic">
                “{s.quotedMoment}”
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Three Highest-Leverage Improvements (Direct, Constructive, Before/After) */}
      <div className="rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-7 space-y-5">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-amber-400 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Three Highest-Leverage Improvements</span>
          </h2>
          <p className="text-xs text-studio-400">Direct, high-standard adjustments that immediately elevate your delivery.</p>
        </div>

        <div className="space-y-4">
          {report.improvements.map((imp, idx) => (
            <div key={idx} className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Priority #{imp.priority}: {imp.area}</h3>
              </div>
              <p className="text-xs text-studio-300 leading-relaxed">{imp.actionableFix}</p>
              
              {/* Contrast Example Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg bg-studio-900 p-3 border border-rose-500/20 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-400 block">
                    Observed Moment (Before):
                  </span>
                  <p className="text-xs text-studio-300 italic">{imp.contrastExample.before}</p>
                </div>
                <div className="rounded-lg bg-studio-900 p-3 border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-400 block">
                    High-Impact Alternative (After):
                  </span>
                  <p className="text-xs text-emerald-200 font-medium">{imp.contrastExample.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Story Map: Hook → Context → Tension → Insight → Example → Takeaway */}
      <div className="rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-7 space-y-5">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="h-5 w-5 text-sky-400" />
            <span>Story Map Architecture</span>
          </h2>
          <p className="text-xs text-studio-400">
            Evaluating the 6 essential chapters of memorable communication.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {report.storyMap.map((elem) => (
            <div
              key={elem.stage}
              className={`p-4 rounded-xl border transition-all ${
                elem.present
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-studio-800 bg-studio-850/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {elem.label}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    elem.present
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-studio-800 text-studio-500'
                  }`}
                >
                  {elem.present ? 'Present' : 'Missing'}
                </span>
              </div>
              <p className="text-xs text-studio-300 leading-relaxed mb-2">{elem.feedback}</p>
              {elem.quotedText && (
                <div className="rounded bg-studio-900/80 p-2 border border-studio-800/80 text-[11px] text-studio-300 italic font-serif">
                  “{elem.quotedText}”
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Friction Spots Breakdown */}
      <div className="rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-7 space-y-4">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-white">Friction Spots Breakdown</h2>
          <p className="text-xs text-studio-400">Subtle speed bumps that dilute clarity or executive weight.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Fillers */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <span className="font-semibold text-studio-200 block">Filler Words</span>
            <div className="text-2xl font-bold font-mono text-white">
              {report.frictionSpots.fillerWords.totalCount}{' '}
              <span className="text-xs text-studio-400 font-normal">
                ({report.frictionSpots.fillerWords.densityPer100Words} per 100w)
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {Object.entries(report.frictionSpots.fillerWords.breakdown).map(([w, count]) => (
                <span key={w} className="px-1.5 py-0.5 rounded bg-studio-800 text-studio-300 font-mono text-[10px]">
                  "{w}": {count}
                </span>
              ))}
            </div>
          </div>

          {/* Repeated Phrases */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <span className="font-semibold text-studio-200 block">Repeated Phrases</span>
            {report.frictionSpots.repeatedPhrases.length > 0 ? (
              <ul className="space-y-1 text-studio-300">
                {report.frictionSpots.repeatedPhrases.map((p, i) => (
                  <li key={i} className="italic font-serif">“{p}”</li>
                ))}
              </ul>
            ) : (
              <span className="text-emerald-400 text-xs">Zero repetitive loops detected.</span>
            )}
          </div>

          {/* Jargon & Vague Claims */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <span className="font-semibold text-studio-200 block">Vague Claims & Jargon</span>
            {report.frictionSpots.jargonTerms.length > 0 || report.frictionSpots.vagueClaims.length > 0 ? (
              <div className="space-y-1 text-studio-300">
                {report.frictionSpots.jargonTerms.map((j, i) => (
                  <span key={i} className="inline-block px-1.5 py-0.5 rounded bg-studio-800 text-amber-300 text-[11px] mr-1">
                    {j}
                  </span>
                ))}
                {report.frictionSpots.vagueClaims.map((v, i) => (
                  <p key={i} className="text-[11px] text-studio-400 italic">“{v}”</p>
                ))}
              </div>
            ) : (
              <span className="text-emerald-400 text-xs">Phraphed cleanly without buzzwords.</span>
            )}
          </div>
        </div>
      </div>

      {/* 8. Audience Engagement Analysis (Explicitly labeled as Likely Risks) */}
      <div className="rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-7 space-y-4">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <span>Audience Engagement Analysis</span>
          </h2>
          <p className="text-xs text-studio-400 italic">
            *Likely attention-drop risks inferred from observable speaking patterns, not actual audience data.
          </p>
        </div>

        {report.engagementRisks.length > 0 ? (
          <div className="space-y-3">
            {report.engagementRisks.map((risk, idx) => (
              <div key={idx} className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 capitalize">
                    {risk.riskType.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-800 text-studio-400">
                    Severity: {risk.severity}
                  </span>
                </div>
                <p className="text-studio-300">{risk.observedPattern}</p>
                <div className="rounded bg-studio-900 p-2.5 border border-studio-800 text-studio-200">
                  <span className="font-semibold text-sky-400">Mitigation:</span> {risk.mitigation}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300">
            No attention-drop risks detected. You sustained steady pacing and anchored points with concrete examples.
          </div>
        )}
      </div>

      {/* 9. "Make It Memorable" Rewrite (In User's Own Voice) */}
      <div className="rounded-2xl border border-sky-500/30 bg-studio-900/80 p-6 sm:p-7 space-y-6">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-sky-300 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-sky-400" />
            <span>“Make It Memorable” Rewrites</span>
          </h2>
          <p className="text-xs text-studio-400">Preserves your voice, accent, and style while elevating the impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          
          {/* Stronger Opening */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <span className="font-bold text-white block">Stronger Opening</span>
            <div className="text-studio-400 italic">Original: “{report.memorableRewrite.strongerOpening.original}”</div>
            <div className="rounded bg-studio-900 p-3 border border-sky-500/30 text-sky-200 font-medium">
              Recommended: “{report.memorableRewrite.strongerOpening.recommended}”
            </div>
            <span className="text-[10px] text-studio-500 font-mono">Technique: {report.memorableRewrite.strongerOpening.technique}</span>
          </div>

          {/* Stronger Bridge */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <span className="font-bold text-white block">Stronger Connective Bridge</span>
            <div className="text-studio-400 italic">Original: “{report.memorableRewrite.strongerBridge.original}”</div>
            <div className="rounded bg-studio-900 p-3 border border-sky-500/30 text-sky-200 font-medium">
              Recommended: “{report.memorableRewrite.strongerBridge.recommended}”
            </div>
            <span className="text-[10px] text-studio-500 font-mono">Technique: {report.memorableRewrite.strongerBridge.technique}</span>
          </div>

          {/* Vivid Analogy */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <span className="font-bold text-white block">Vivid Analogy / Mental Model</span>
            <div className="text-studio-400">Targeted Idea: {report.memorableRewrite.vividAnalogy.ideaTargeted}</div>
            <div className="rounded bg-studio-900 p-3 border border-sky-500/30 text-amber-200 font-serif italic text-sm">
              “{report.memorableRewrite.vividAnalogy.analogyText}”
            </div>
            <span className="text-[10px] text-studio-500 font-mono">Why it works: {report.memorableRewrite.vividAnalogy.whyItWorks}</span>
          </div>

          {/* Stronger Closing */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <span className="font-bold text-white block">Authoritative Closing Action</span>
            <div className="text-studio-400 italic">Original: “{report.memorableRewrite.strongerClosing.original}”</div>
            <div className="rounded bg-studio-900 p-3 border border-emerald-500/30 text-emerald-200 font-medium">
              Recommended: “{report.memorableRewrite.strongerClosing.recommended}”
            </div>
            <span className="text-[10px] text-studio-500 font-mono">Technique: {report.memorableRewrite.strongerClosing.technique}</span>
          </div>
        </div>
      </div>

      {/* 10. "Lighter Moment" Option (Teaching the Mechanism) */}
      <div className="rounded-2xl border border-rose-500/30 bg-studio-900/80 p-6 sm:p-7 space-y-4">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-rose-300 flex items-center space-x-2">
            <Smile className="h-5 w-5 text-rose-400" />
            <span>The Lighter Moment (Purposeful Levity)</span>
          </h2>
          <p className="text-xs text-studio-400">
            An understated way to release tension after a dense idea without forcing jokes or sarcasm.
          </p>
        </div>

        <div className="rounded-xl bg-studio-850 p-5 border border-studio-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider font-mono">
              Mechanism: {report.lighterMoment.mechanism.replace('_', ' ')}
            </span>
            <span className="text-[11px] text-studio-400">{report.lighterMoment.suggestedMoment}</span>
          </div>

          <p className="text-studio-300 leading-relaxed">{report.lighterMoment.explanation}</p>

          <div className="rounded-lg bg-studio-900 p-3.5 border border-rose-500/20 text-sm font-serif italic text-rose-200">
            “{report.lighterMoment.suggestedLine}”
          </div>

          <div className="text-[11px] text-studio-400 italic">
            Coach Rule of Thumb: {report.lighterMoment.ruleOfThumb}
          </div>
        </div>
      </div>

      {/* 11. Interactive Line-by-Line Replay Transcript */}
      <div className="rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-7 space-y-4">
        <div className="border-b border-studio-800 pb-3">
          <h2 className="text-lg font-bold text-white">Line-by-Line Replay & Expandable Alternatives</h2>
          <p className="text-xs text-studio-400">Click any passage to view coaching notes and sharper phrasings.</p>
        </div>

        <div className="space-y-2">
          {report.replayTranscript.map((line) => {
            const isExpanded = expandedReplayLine === line.id;
            return (
              <div
                key={line.id}
                className={`rounded-xl border transition-colors ${
                  isExpanded
                    ? 'border-sky-500/50 bg-studio-850'
                    : 'border-studio-800 bg-studio-850/50 hover:border-studio-700'
                }`}
              >
                <button
                  onClick={() => setExpandedReplayLine(isExpanded ? null : line.id)}
                  className="w-full p-3.5 text-left flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-studio-400">
                        {Math.floor(line.timestampMs / 1000)}s
                      </span>
                      {line.highlightType && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-studio-800 text-sky-400">
                          {line.highlightType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-studio-200 leading-relaxed font-sans">{line.text}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-studio-400" /> : <ChevronDown className="h-4 w-4 text-studio-400" />}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-studio-800/80 space-y-2 text-xs">
                    {line.coachingNote && (
                      <p className="text-studio-300"><span className="font-semibold text-sky-400">Note:</span> {line.coachingNote}</p>
                    )}
                    {line.alternativeSuggestion && (
                      <div className="rounded bg-studio-900 p-2.5 border border-studio-800 text-emerald-300 font-medium">
                        <span className="text-[10px] uppercase font-mono block text-emerald-400">Sharper Phrasing:</span>
                        {line.alternativeSuggestion}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 12. Immediate Retry Exercise (Focused on Exactly ONE Skill) */}
      <div className="rounded-2xl border border-sky-500 bg-gradient-to-r from-sky-500/15 via-studio-900 to-studio-900 p-6 sm:p-8 space-y-4 shadow-xl shadow-sky-500/10">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-sky-300">
            Immediate Skill Retry
          </span>
          <span className="text-xs text-studio-400 font-medium">30–60 Second Drill</span>
        </div>

        <h3 className="text-xl font-bold text-white">
          Focus Skill: {report.retryExercise.focusedSkill}
        </h3>

        <p className="text-xs text-studio-300 leading-relaxed">
          {report.retryExercise.goal}
        </p>

        <div className="rounded-xl bg-studio-950 p-4 border border-studio-800 space-y-2">
          <span className="text-[11px] font-semibold text-amber-300 block">Immediate Prompt:</span>
          <p className="text-xs text-white italic font-serif">“{report.retryExercise.prompt}”</p>
          <div className="text-[10px] text-studio-400 pt-1">
            Success Condition: {report.retryExercise.successCondition}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={() => onRetryExercise(report.retryExercise.focusedSkill, report.retryExercise.prompt)}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-xs font-bold text-studio-950 transition-all shadow-md shadow-sky-500/25"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry This Skill Now</span>
          </button>
        </div>
      </div>

      {/* Footer Management Controls */}
      <div className="flex items-center justify-between border-t border-studio-800 pt-6 text-xs text-studio-400">
        <div>
          Session ID: <span className="font-mono text-studio-500">{report.sessionId}</span>
        </div>

        {onDeleteSession && (
          <div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-1.5 text-studio-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Session Record</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-rose-400">Permanently delete?</span>
                <button
                  onClick={onDeleteSession}
                  className="px-2 py-1 bg-rose-500 text-white rounded font-semibold"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 text-studio-400"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
