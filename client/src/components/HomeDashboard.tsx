import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  Flame,
  Shield,
  Layers,
  MessageSquare,
  Smile,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { HabitTrends, PracticeScenario } from '../types';
import { SKILL_TRACKS } from '../data/skillTracks';

interface HomeDashboardProps {
  trends: HabitTrends;
  onStartPractice: (presetScenario?: PracticeScenario, presetPromptId?: string) => void;
  onViewTracks: () => void;
  onViewHistory: () => void;
  onStartExercise: (exerciseId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  trends,
  onStartPractice,
  onViewTracks,
  onViewHistory,
  onStartExercise,
}) => {
  // Scenario icon mapping
  const scenarioLabels: Record<PracticeScenario, { name: string; color: string }> = {
    presentation: { name: 'Presentation', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    meeting: { name: 'Meeting Reply', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    interview: { name: 'Interview', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    impromptu: { name: 'Impromptu', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  };

  // Calculate recent average dimension scores
  const recentPoints = trends.scoresTimeline.slice(-5);
  const avg = (fn: (p: any) => number) => {
    if (recentPoints.length === 0) return 80;
    return Math.round(recentPoints.reduce((acc, p) => acc + fn(p), 0) / recentPoints.length);
  };

  const clarityAvg = avg(p => p.clarity);
  const structureAvg = avg(p => p.structure);
  const engagementAvg = avg(p => p.engagement);
  const deliveryAvg = avg(p => p.delivery);
  const witAvg = avg(p => p.purposefulWit);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Studio Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-studio-800 bg-gradient-to-b from-studio-900 via-studio-900/60 to-studio-950 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Personal Speaking Gym</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Speak with calm authority, memorable structure, and natural wit.
          </h1>

          {/* Principle Quote */}
          <div className="border-l-2 border-sky-400 pl-4 py-1 text-studio-300 text-sm sm:text-base italic font-serif">
            “Be clear enough to follow, structured enough to remember, light enough to stay with.”
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onStartPractice()}
              className="flex items-center space-x-2.5 rounded-xl bg-sky-500 px-6 py-3.5 text-base font-semibold text-studio-950 hover:bg-sky-400 active:scale-98 transition-all shadow-lg shadow-sky-500/25"
            >
              <Play className="h-5 w-5 fill-studio-950" />
              <span>Start Practice Session</span>
            </button>

            <button
              onClick={onViewTracks}
              className="flex items-center space-x-2 rounded-xl border border-studio-700 bg-studio-850 px-5 py-3.5 text-sm font-medium text-studio-200 hover:bg-studio-800 hover:border-studio-600 transition-all"
            >
              <span>Explore 6 Skill Tracks</span>
              <ArrowRight className="h-4 w-4 text-studio-400" />
            </button>
          </div>
        </div>

        {/* Quick Streak & Mode Bar */}
        <div className="mt-8 pt-6 border-t border-studio-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-studio-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-amber-300 font-medium">
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
              <span>{trends.currentStreakDays}-Day Practice Streak</span>
            </div>
            <span className="text-studio-700">•</span>
            <span>{trends.totalSessions} Total Sessions Completed</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-studio-500">Recently Practiced:</span>
            {trends.recentlyPracticedModes.map((mode) => {
              const info = scenarioLabels[mode] || { name: mode, color: 'text-studio-300 bg-studio-800 border-studio-700' };
              return (
                <span
                  key={mode}
                  className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${info.color}`}
                >
                  {info.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Next Recommended 5-10m Practice & Daily Focus Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Recommended Exercise Card */}
        <div className="lg:col-span-2 rounded-xl border border-studio-800 bg-studio-900/70 p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-mono text-sky-400 font-semibold">
                Recommended 5–10 Min Next Practice
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium">
                {trends.nextRecommendedExercise.durationText}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {trends.nextRecommendedExercise.title}
            </h3>
            <p className="text-sm text-studio-300 leading-relaxed">
              {trends.nextRecommendedExercise.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-studio-800/80">
            <div className="text-xs text-studio-400">
              Track: <span className="text-studio-200 font-medium">{trends.nextRecommendedExercise.trackTitle}</span>
            </div>
            <button
              onClick={() => onStartPractice(undefined, trends.nextRecommendedExercise.promptId)}
              className="flex items-center space-x-2 rounded-lg bg-studio-800 border border-studio-700 hover:border-sky-500/50 hover:bg-studio-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              <span>Launch Exercise</span>
              <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
            </button>
          </div>
        </div>

        {/* Recurring Habit to Improve (Candid & Actionable) */}
        <div className="rounded-xl border border-studio-800 bg-studio-900/70 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold tracking-wide uppercase font-mono">
              <AlertCircle className="h-4 w-4" />
              <span>Recurring Habit to Hone</span>
            </div>
            <h4 className="text-base font-semibold text-white">
              {trends.recurringHabitToImprove.habit}
            </h4>
            <p className="text-xs text-studio-300 leading-relaxed">
              {trends.recurringHabitToImprove.description}
            </p>
          </div>

          <div className="rounded-lg bg-studio-850 p-3 border border-studio-800 text-xs text-studio-300 space-y-1">
            <span className="font-semibold text-amber-300 block">Coach Rule of Thumb:</span>
            <p className="text-studio-400 italic">“{trends.recurringHabitToImprove.tip}”</p>
          </div>
        </div>
      </div>

      {/* 3. Progress Trends & Baseline Confidence */}
      <div className="rounded-xl border border-studio-800 bg-studio-900/70 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-studio-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-sky-400" />
              <h2 className="text-lg font-bold text-white">Core Skill Progression Trends</h2>
            </div>
            <p className="text-xs text-studio-400 mt-1">
              Grounded in observable speech markers: filler density, structural stages, pacing, and concrete examples.
            </p>
          </div>

          {/* Baseline Indicator with Sample Size Confidence */}
          <div className="flex items-center space-x-3 bg-studio-850 px-3 py-1.5 rounded-lg border border-studio-800 text-xs">
            <Info className="h-4 w-4 text-studio-400" />
            <div>
              <span className="text-studio-300">
                {trends.baselineCompleted
                  ? 'Baseline Established (Solid Confidence)'
                  : `Establishing Baseline (${trends.totalSessions}/5 sessions)`}
              </span>
              <div className="w-28 h-1.5 bg-studio-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${trends.baselineConfidencePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Dimension Trend Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Clarity', score: clarityAvg, desc: 'Sentence directness & low filler density', color: 'bg-sky-400' },
            { label: 'Structure', score: structureAvg, desc: 'Hook, tension, turn, concrete example, CTA', color: 'bg-amber-400' },
            { label: 'Audience Engagement', score: engagementAvg, desc: 'Naming real stakes & avoiding abstraction', color: 'bg-purple-400' },
            { label: 'Delivery & Pacing', score: deliveryAvg, desc: 'Controlled tempo & deliberate silence', color: 'bg-emerald-400' },
            { label: 'Purposeful Wit', score: witAvg, desc: 'Understated contrast & tension release', color: 'bg-rose-400' },
          ].map((dim) => (
            <div key={dim.label} className="rounded-lg bg-studio-850 p-4 border border-studio-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-studio-300">{dim.label}</span>
                <span className="text-base font-bold font-mono text-white">{dim.score}</span>
              </div>
              <div className="w-full h-2 bg-studio-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dim.color} rounded-full transition-all duration-700`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
              <p className="text-[11px] text-studio-400 leading-snug">{dim.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent Concrete Wins */}
        <div className="pt-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-3 flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Recent Observable Wins</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {trends.recentWins.map((win, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3 rounded-lg bg-studio-850/60 border border-studio-800 text-xs text-studio-200"
              >
                <span className="text-emerald-400 font-bold">•</span>
                <span className="leading-relaxed">{win}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Skill Tracks Overview Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Targeted Skill Tracks</h2>
            <p className="text-xs text-studio-400">Progressive speaking exercises designed for real professional situations.</p>
          </div>
          <button
            onClick={onViewTracks}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1"
          >
            <span>View All Tracks</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILL_TRACKS.map((track) => {
            const pct = Math.round((track.completedCount / track.totalCount) * 100);
            return (
              <div
                key={track.id}
                className="rounded-xl border border-studio-800 bg-studio-900/60 p-5 flex flex-col justify-between space-y-4 hover:border-studio-700 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: `${track.color}18`, color: track.color }}
                    >
                      {track.completedCount}/{track.totalCount} Complete
                    </span>
                    <div className="w-16 h-1.5 bg-studio-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: track.color }}
                      />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">{track.title}</h3>
                  <p className="text-xs text-studio-300 leading-relaxed line-clamp-2">
                    {track.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-studio-800 flex items-center justify-between text-xs">
                  <span className="text-studio-400">{track.exercises.length} Progressive Levels</span>
                  <button
                    onClick={onViewTracks}
                    className="text-studio-300 hover:text-white font-medium flex items-center space-x-1"
                  >
                    <span>Practice</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
