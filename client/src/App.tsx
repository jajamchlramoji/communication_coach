import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { SessionSetupModal } from './components/SessionSetupModal';
import { LivePracticeView } from './components/LivePracticeView';
import { PostSessionReport } from './components/PostSessionReport';
import { SkillTracksView } from './components/SkillTracksView';
import { HistoryView } from './components/HistoryView';
import { PrivacyModal } from './components/PrivacyModal';
import { StorageService } from './services/storage';
import { generateDeterministicReport } from './services/analyzerUtils';
import { MOCK_REPORTS } from './data/mockReports';
import {
  CoachingReport,
  ObservableVisualSignals,
  PracticeScenario,
  SessionConfig,
  SkillExercise,
  SkillTrack
} from './types';

export function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'home' | 'tracks' | 'history'>('home');
  const [activeSessionConfig, setActiveSessionConfig] = useState<SessionConfig | null>(null);
  const [activeReport, setActiveReport] = useState<CoachingReport | null>(null);
  const [activeAudioBlob, setActiveAudioBlob] = useState<Blob | undefined>();
  
  // Modals
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [setupInitialScenario, setSetupInitialScenario] = useState<PracticeScenario>('meeting');
  const [setupInitialPromptId, setSetupInitialPromptId] = useState<string | undefined>();

  // In-session or Report active flags
  const [isInLivePractice, setIsInLivePractice] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // App & Storage State
  const [habitTrends, setHabitTrends] = useState(StorageService.getHabitTrends());
  const [allReports, setAllReports] = useState<CoachingReport[]>(StorageService.getAllReports());
  const [completedExercises, setCompletedExercises] = useState<string[]>(StorageService.getCompletedExercises());
  const [apiStatus, setApiStatus] = useState<{
    apiConfigured: boolean;
    demoMode: boolean;
    liveModel?: string;
  }>({
    apiConfigured: false,
    demoMode: true,
  });

  // Fetch backend status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((data) => {
        setApiStatus({
          apiConfigured: Boolean(data.apiConfigured),
          demoMode: Boolean(data.demoMode),
          liveModel: data.liveModel,
        });
      })
      .catch(() => {
        // Local fallback mode if server offline
        setApiStatus({
          apiConfigured: false,
          demoMode: true,
        });
      });
  }, []);

  const refreshStorageData = () => {
    setHabitTrends(StorageService.getHabitTrends());
    setAllReports(StorageService.getAllReports());
    setCompletedExercises(StorageService.getCompletedExercises());
  };

  // Open setup modal
  const handleOpenSetup = (scenario: PracticeScenario = 'meeting', promptId?: string) => {
    setSetupInitialScenario(scenario);
    setSetupInitialPromptId(promptId);
    setIsSetupOpen(true);
  };

  // Start live session from setup modal
  const handleStartSession = (config: SessionConfig) => {
    setActiveSessionConfig(config);
    setIsSetupOpen(false);
    setIsInLivePractice(true);
    setActiveReport(null);
    setActiveAudioBlob(undefined);
  };

  // Complete session & trigger report analysis
  const handleFinishLiveSession = async (
    finalTranscript: string,
    durationSeconds: number,
    visualSignals?: ObservableVisualSignals,
    audioBlob?: Blob
  ) => {
    setIsInLivePractice(false);
    setIsAnalyzing(true);
    setActiveAudioBlob(audioBlob);

    const sessionId = `session-${Date.now()}`;
    const transcriptToAnalyze = finalTranscript || 'I delivered our project roadmap and addressed the timeline constraints.';
    const config = activeSessionConfig || {
      scenario: 'meeting',
      practiceType: 'answer_prompt',
      targetDuration: 120,
      audience: 'leadership',
      coachingIntensity: 'gentle_live',
      cameraMode: 'mic_only',
      storageMode: 'ephemeral',
    };

    let generatedReport: CoachingReport | null = null;

    // Try server-side analysis via Gemini 3.6 Flash if API configured
    if (apiStatus.apiConfigured && !config.isDemo) {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            transcript: transcriptToAnalyze,
            scenario: config.scenario,
            practiceType: config.practiceType,
            audience: config.audience,
            durationSeconds,
            visualDeliverySignals: visualSignals,
          }),
        });
        const result = await response.json();
        if (result.report) {
          generatedReport = result.report;
        }
      } catch (err) {
        console.warn('API report generation failed, using local deterministic engine:', err);
      }
    }

    // Fallback: Use deterministic heuristic engine
    if (!generatedReport) {
      // If matching demo preset, we can blend with rich mock report
      const presetMock = MOCK_REPORTS[config.scenario];
      if (presetMock && config.isDemo) {
        generatedReport = {
          ...presetMock,
          id: `report-${sessionId}`,
          sessionId,
          createdAt: new Date().toISOString(),
          durationSeconds,
          visualDeliverySignals: visualSignals || presetMock.visualDeliverySignals,
        };
      } else {
        generatedReport = generateDeterministicReport({
          sessionId,
          transcript: transcriptToAnalyze,
          scenario: config.scenario,
          practiceType: config.practiceType,
          audience: config.audience,
          durationSeconds: Math.max(15, durationSeconds),
        });
        if (visualSignals) {
          generatedReport.visualDeliverySignals = visualSignals;
        }
      }
    }

    // Save report according to user's storage authorization
    await StorageService.saveSessionReport(generatedReport, config, audioBlob);
    refreshStorageData();

    setActiveReport(generatedReport);
    setIsAnalyzing(false);

    // Subtle celebration confetti
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#38bdf8', '#f59e0b', '#10b981'],
      });
    } catch {}
  };

  // Immediate retry flow for a specific skill
  const handleRetryExercise = (focusedSkill: string, prompt: string) => {
    setActiveReport(null);
    handleOpenSetup('impromptu');
  };

  // Start exercise from Curriculum track
  const handleStartExercise = (track: SkillTrack, exercise: SkillExercise) => {
    StorageService.markExerciseCompleted(exercise.id);
    refreshStorageData();
    handleOpenSetup(exercise.scenario);
  };

  // Delete individual session
  const handleDeleteSession = async (sessionId: string) => {
    await StorageService.deleteSession(sessionId);
    refreshStorageData();
    if (activeReport?.sessionId === sessionId) {
      setActiveReport(null);
    }
  };

  // Clear all data
  const handleClearAllData = async () => {
    await StorageService.clearAllData();
    refreshStorageData();
    setActiveReport(null);
  };

  return (
    <div className="min-h-screen bg-studio-950 text-studio-100 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveReport(null);
          setIsInLivePractice(false);
          setCurrentTab(tab);
        }}
        onStartNewPractice={() => handleOpenSetup()}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        streakDays={habitTrends.currentStreakDays}
        apiStatus={apiStatus}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* State 1: Live Speaking Studio */}
        {isInLivePractice && activeSessionConfig ? (
          <LivePracticeView
            config={activeSessionConfig}
            onFinishSession={handleFinishLiveSession}
            onCancelSession={() => setIsInLivePractice(false)}
            isApiConfigured={apiStatus.apiConfigured}
          />
        ) : isAnalyzing ? (
          /* State 2: Generating Deep Debrief Loading State */
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-sky-400">
                AI
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Analyzing Communication Patterns...</h2>
              <p className="text-xs text-studio-400 max-w-sm">
                Evaluating story map progression, filler density, audience drop risks, and crafting concrete memorable rewrites.
              </p>
            </div>
          </div>
        ) : activeReport && activeSessionConfig ? (
          /* State 3: Post-Session Coaching Debrief Report */
          <PostSessionReport
            report={activeReport}
            config={activeSessionConfig}
            audioBlob={activeAudioBlob}
            onRetryExercise={handleRetryExercise}
            onDone={() => setActiveReport(null)}
            onDeleteSession={() => handleDeleteSession(activeReport.sessionId)}
          />
        ) : currentTab === 'tracks' ? (
          /* State 4: 6 Skill Tracks Curriculum Browser */
          <SkillTracksView
            completedExerciseIds={completedExercises}
            onStartExercise={handleStartExercise}
          />
        ) : currentTab === 'history' ? (
          /* State 5: Session History Archives */
          <HistoryView
            sessions={allReports}
            onSelectSession={(report) => {
              setActiveReport(report);
              setActiveSessionConfig({
                scenario: report.scenario,
                practiceType: report.practiceType,
                targetDuration: report.durationSeconds as any,
                audience: report.audience,
                coachingIntensity: 'gentle_live',
                cameraMode: 'mic_only',
                storageMode: 'metrics_only',
              });
            }}
            onDeleteSession={handleDeleteSession}
            onClearAll={handleClearAllData}
            onStartNewPractice={() => handleOpenSetup()}
          />
        ) : (
          /* State 6: Home Studio Dashboard */
          <HomeDashboard
            trends={habitTrends}
            onStartPractice={handleOpenSetup}
            onViewTracks={() => setCurrentTab('tracks')}
            onViewHistory={() => setCurrentTab('history')}
            onStartExercise={(id) => handleOpenSetup('meeting', id)}
          />
        )}

      </main>

      {/* Session Setup Modal */}
      <SessionSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartSession={handleStartSession}
        initialScenario={setupInitialScenario}
        initialPromptId={setupInitialPromptId}
        isApiConfigured={apiStatus.apiConfigured}
      />

      {/* Privacy & Ephemeral Storage Explanation Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onClearAllData={handleClearAllData}
      />

    </div>
  );
}
export default App;
