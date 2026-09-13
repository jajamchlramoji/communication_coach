import React, { useState } from 'react';
import {
  X,
  Mic,
  Video,
  Shield,
  Clock,
  Users,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  AudienceType,
  CameraMode,
  CoachingIntensity,
  PracticeScenario,
  PracticeType,
  SeededPrompt,
  SessionConfig,
  StorageMode,
  TargetDuration
} from '../types';
import { SEEDED_PROMPTS, getPromptsByScenario } from '../data/prompts';

interface SessionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (config: SessionConfig) => void;
  initialScenario?: PracticeScenario;
  initialPromptId?: string;
  isApiConfigured: boolean;
}

export const SessionSetupModal: React.FC<SessionSetupModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
  initialScenario = 'meeting',
  initialPromptId,
  isApiConfigured,
}) => {
  const [scenario, setScenario] = useState<PracticeScenario>(initialScenario);
  const [practiceType, setPracticeType] = useState<PracticeType>('answer_prompt');
  const [targetDuration, setTargetDuration] = useState<TargetDuration>(120);
  const [audience, setAudience] = useState<AudienceType>('leadership');
  const [coachingIntensity, setCoachingIntensity] = useState<CoachingIntensity>('gentle_live');
  const [cameraMode, setCameraMode] = useState<CameraMode>('mic_only');
  const [storageMode, setStorageMode] = useState<StorageMode>('ephemeral'); // ephemeral by default!
  const [customTopic, setCustomTopic] = useState('');
  
  // Seeded prompt selection
  const availablePrompts = getPromptsByScenario(scenario);
  const [selectedPrompt, setSelectedPrompt] = useState<SeededPrompt>(
    availablePrompts.find(p => p.id === initialPromptId) || availablePrompts[0]
  );

  if (!isOpen) return null;

  const handleScenarioChange = (newScenario: PracticeScenario) => {
    setScenario(newScenario);
    const prompts = getPromptsByScenario(newScenario);
    if (prompts.length > 0) {
      setSelectedPrompt(prompts[0]);
      setTargetDuration(prompts[0].recommendedDuration);
      setAudience(prompts[0].targetAudience);
    }
  };

  const handleStart = () => {
    onStartSession({
      scenario,
      practiceType,
      prompt: practiceType === 'answer_prompt' ? selectedPrompt : undefined,
      customTopic: practiceType !== 'answer_prompt' ? customTopic : undefined,
      targetDuration,
      audience,
      coachingIntensity,
      cameraMode,
      storageMode,
      isDemo: !isApiConfigured
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-studio-800 bg-studio-900 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-studio-800 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
              Speaking Studio Setup
            </span>
            <h2 className="text-xl font-bold text-white">Configure Your Practice Session</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-studio-400 hover:text-white rounded-lg hover:bg-studio-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* 1. Scenario Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-studio-300">
              1. Primary Speaking Scenario
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'presentation', label: 'Public Speech', desc: 'Presentations & keynotes' },
                { id: 'meeting', label: 'Meeting Reply', desc: 'Executive Q&A & syncs' },
                { id: 'interview', label: 'Interview', desc: 'Behavioral & leadership' },
                { id: 'impromptu', label: 'Impromptu', desc: 'Sudden curveballs' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleScenarioChange(s.id as PracticeScenario)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    scenario === s.id
                      ? 'border-sky-500 bg-sky-500/10 text-white shadow-sm'
                      : 'border-studio-800 bg-studio-850 text-studio-300 hover:border-studio-700'
                  }`}
                >
                  <div className="font-semibold text-xs">{s.label}</div>
                  <div className="text-[10px] text-studio-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Practice Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-studio-300">
              2. Practice Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'answer_prompt', label: 'Seeded Prompt' },
                { id: 'free_speaking', label: 'Free Speaking' },
                { id: 'rehearse_talk', label: 'Rehearse Talk' },
                { id: 'replay_improve', label: 'Replay & Improve' },
              ].map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setPracticeType(pt.id as PracticeType)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                    practiceType === pt.id
                      ? 'border-sky-500 bg-sky-500/15 text-sky-200'
                      : 'border-studio-800 bg-studio-850 text-studio-400 hover:text-studio-200'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Seeded Prompt Card */}
          {practiceType === 'answer_prompt' && (
            <div className="rounded-xl border border-studio-700 bg-studio-850/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-studio-300">Select Realistic Challenge Prompt:</span>
                <select
                  value={selectedPrompt?.id}
                  onChange={(e) => {
                    const found = availablePrompts.find(p => p.id === e.target.value);
                    if (found) {
                      setSelectedPrompt(found);
                      setTargetDuration(found.recommendedDuration);
                      setAudience(found.targetAudience);
                    }
                  }}
                  className="bg-studio-900 border border-studio-700 text-xs text-studio-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
                >
                  {availablePrompts.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {selectedPrompt && (
                <div className="space-y-2 text-xs">
                  <p className="text-studio-200 font-medium leading-relaxed">
                    {selectedPrompt.context}
                  </p>
                  <div className="rounded bg-studio-900/90 p-2.5 border border-studio-800 space-y-1">
                    <span className="text-[11px] font-semibold text-amber-300 block">Stakes:</span>
                    <p className="text-studio-400 italic text-[11px]">{selectedPrompt.stakes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {practiceType !== 'answer_prompt' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-studio-300">
                Custom Topic / Focus Objective
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Announcing new engineering career ladder to department"
                className="w-full rounded-lg bg-studio-850 border border-studio-700 px-3.5 py-2.5 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          {/* 3. Duration & Target Audience Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-studio-300 flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-studio-400" />
                <span>Target Duration</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { sec: 60, label: '1m' },
                  { sec: 120, label: '2m' },
                  { sec: 180, label: '3m' },
                  { sec: 300, label: '5m' },
                  { sec: 600, label: '10m' },
                ].map((d) => (
                  <button
                    key={d.sec}
                    onClick={() => setTargetDuration(d.sec as TargetDuration)}
                    className={`py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                      targetDuration === d.sec
                        ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                        : 'border-studio-800 bg-studio-850 text-studio-400 hover:text-studio-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-studio-300 flex items-center space-x-1.5">
                <Users className="h-3.5 w-3.5 text-studio-400" />
                <span>Intended Audience</span>
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as AudienceType)}
                className="w-full bg-studio-850 border border-studio-700 text-xs text-studio-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
              >
                <option value="leadership">Senior Leadership & Executives</option>
                <option value="colleagues">Engineering & Product Colleagues</option>
                <option value="clients">Enterprise Clients & Prospects</option>
                <option value="interview_panel">Interview Hiring Panel</option>
                <option value="general_public">General Public Audience</option>
              </select>
            </div>
          </div>

          {/* 4. Coaching Intensity & Camera Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Coaching Intensity */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-studio-300 flex items-center space-x-1.5">
                <Sliders className="h-3.5 w-3.5 text-studio-400" />
                <span>Coaching Intensity</span>
              </label>
              <select
                value={coachingIntensity}
                onChange={(e) => setCoachingIntensity(e.target.value as CoachingIntensity)}
                className="w-full bg-studio-850 border border-studio-700 text-xs text-studio-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
              >
                <option value="gentle_live">Gentle live, direct afterward (Default)</option>
                <option value="silent_observer">Silent observer, full report only</option>
                <option value="rhythm_coach">Active cadence & rhythm cues</option>
              </select>
            </div>

            {/* Camera Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-studio-300 flex items-center space-x-1.5">
                <Video className="h-3.5 w-3.5 text-studio-400" />
                <span>Sensors</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCameraMode('mic_only')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    cameraMode === 'mic_only'
                      ? 'border-sky-500 bg-sky-500/15 text-sky-200'
                      : 'border-studio-800 bg-studio-850 text-studio-400'
                  }`}
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Mic Only</span>
                </button>
                <button
                  onClick={() => setCameraMode('mic_and_visual')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    cameraMode === 'mic_and_visual'
                      ? 'border-sky-500 bg-sky-500/15 text-sky-200'
                      : 'border-studio-800 bg-studio-850 text-studio-400'
                  }`}
                  title="Camera analysis is 100% on-device canvas heuristics (framing, eye alignment). Zero video uploaded."
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Mic + Camera</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Ephemeral & Storage Consent Choice (Strict Requirement) */}
          <div className="rounded-xl border border-studio-800 bg-studio-850/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Storage Choice for This Session
                </span>
              </div>
              <span className="text-[10px] text-studio-400">Chosen before every session</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
              {[
                {
                  mode: 'ephemeral',
                  title: '1. Ephemeral',
                  subtitle: 'Process live, save nothing.',
                  desc: 'Erased from memory immediately on session close.'
                },
                {
                  mode: 'metrics_only',
                  title: '2. Metrics Only',
                  subtitle: 'Save transcript & scores.',
                  desc: 'Stored locally. Audio discarded immediately.'
                },
                {
                  mode: 'full',
                  title: '3. Full Recording',
                  subtitle: 'Save local recording.',
                  desc: 'Persisted only in your browser IndexedDB.'
                }
              ].map((tier) => (
                <button
                  key={tier.mode}
                  type="button"
                  onClick={() => setStorageMode(tier.mode as StorageMode)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    storageMode === tier.mode
                      ? 'border-emerald-500/80 bg-emerald-500/10 text-white'
                      : 'border-studio-800 bg-studio-900 text-studio-400 hover:border-studio-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{tier.title}</div>
                  <div className="text-[11px] font-medium text-emerald-300 mt-0.5">{tier.subtitle}</div>
                  <div className="text-[10px] text-studio-400 mt-1">{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-studio-800 flex items-center justify-between">
          <div className="text-xs text-studio-400 flex items-center space-x-1.5">
            <span className={`h-2 w-2 rounded-full ${isApiConfigured ? 'bg-emerald-400' : 'bg-studio-500'}`} />
            <span>{isApiConfigured ? 'Gemini 3.5 Live & 3.6 Flash Ready' : 'Demo Simulation Mode'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-studio-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-500 text-studio-950 font-semibold text-xs hover:bg-sky-400 active:scale-95 transition-all shadow-md shadow-sky-500/20"
            >
              <span>Enter Speaking Studio</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
