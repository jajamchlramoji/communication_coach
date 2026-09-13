import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { SKILL_TRACKS } from '../data/skillTracks';
import { SkillExercise, SkillTrack } from '../types';

interface SkillTracksViewProps {
  completedExerciseIds: string[];
  onStartExercise: (track: SkillTrack, exercise: SkillExercise) => void;
}

export const SkillTracksView: React.FC<SkillTracksViewProps> = ({
  completedExerciseIds,
  onStartExercise,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(SKILL_TRACKS[0].id);
  const selectedTrack = SKILL_TRACKS.find(t => t.id === selectedTrackId) || SKILL_TRACKS[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-studio-800 pb-5">
        <div className="inline-flex items-center space-x-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-semibold mb-1">
          <BookOpen className="h-4 w-4" />
          <span>Curriculum & Practice Tracks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          The 6 Core Communication Tracks
        </h1>
        <p className="text-sm text-studio-400 mt-1 max-w-2xl">
          Progressive, high-impact speaking exercises designed for senior professionals, executives, and team leads.
        </p>
      </div>

      {/* Grid: Left Column Tracks List, Right Column Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Track Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          {SKILL_TRACKS.map((track) => {
            const isSelected = track.id === selectedTrackId;
            const completedCount = track.exercises.filter(e => completedExerciseIds.includes(e.id)).length;
            const pct = Math.round((completedCount / track.totalCount) * 100);

            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-studio-850 text-white shadow-md'
                    : 'border-studio-800 bg-studio-900/60 text-studio-300 hover:border-studio-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold font-sans text-white">{track.title}</span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold"
                    style={{ backgroundColor: `${track.color}15`, color: track.color }}
                  >
                    {completedCount}/{track.totalCount} Done
                  </span>
                </div>
                <p className="text-xs text-studio-400 line-clamp-2 leading-relaxed">{track.subtitle}</p>
                
                {/* Progress bar */}
                <div className="w-full h-1 bg-studio-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: track.color }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Exercises Detail */}
        <div className="lg:col-span-8 rounded-2xl border border-studio-800 bg-studio-900/70 p-6 sm:p-8 space-y-6">
          <div className="border-b border-studio-800 pb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedTrack.color }} />
              <h2 className="text-xl font-bold text-white">{selectedTrack.title}</h2>
            </div>
            <p className="text-sm text-studio-300 leading-relaxed">
              {selectedTrack.description}
            </p>
          </div>

          {/* Exercise Levels */}
          <div className="space-y-4">
            {selectedTrack.exercises.map((exercise) => {
              const isDone = completedExerciseIds.includes(exercise.id);

              return (
                <div
                  key={exercise.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-studio-800 bg-studio-850/80 hover:border-studio-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2.5">
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-studio-600" />
                      )}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-studio-400">
                          Level {exercise.level} • {exercise.durationMinutes} min
                        </span>
                        <h3 className="text-base font-bold text-white">{exercise.title}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => onStartExercise(selectedTrack, exercise)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 text-xs font-bold text-studio-950 transition-all shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-studio-950" />
                      <span>{isDone ? 'Practice Again' : 'Start Exercise'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-studio-300 pl-7">
                    <p className="leading-relaxed">{exercise.brief}</p>
                    <div className="rounded bg-studio-900/80 p-2.5 border border-studio-800 space-y-0.5">
                      <span className="text-[11px] font-semibold text-amber-300 block">Strict Challenge:</span>
                      <p className="text-studio-400 italic">{exercise.challenge}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
