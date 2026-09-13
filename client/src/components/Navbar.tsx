import React from 'react';
import { Mic, ShieldCheck, Flame, BookOpen, Clock, Sparkles, Activity } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'tracks' | 'history';
  onSelectTab: (tab: 'home' | 'tracks' | 'history') => void;
  onStartNewPractice: () => void;
  onOpenPrivacy: () => void;
  streakDays: number;
  apiStatus: {
    apiConfigured: boolean;
    demoMode: boolean;
    liveModel?: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onStartNewPractice,
  onOpenPrivacy,
  streakDays,
  apiStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-studio-800 bg-studio-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center space-x-3 text-left focus:outline-none group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 group-hover:border-sky-400 transition-colors">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-sans">Recall</span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-studio-800 text-studio-400 border border-studio-700">
                  Speaking Gym
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-studio-800 text-white'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('tracks')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'tracks'
                  ? 'bg-studio-800 text-white'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-900'
              }`}
            >
              <BookOpen className="h-4 w-4 text-studio-400" />
              <span>Skill Tracks</span>
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'history'
                  ? 'bg-studio-800 text-white'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-900'
              }`}
            >
              <Clock className="h-4 w-4 text-studio-400" />
              <span>Session History</span>
            </button>
          </nav>
        </div>

        {/* Right Status Badges & Action */}
        <div className="flex items-center space-x-3">
          
          {/* Streak Counter */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
            title={`${streakDays}-day practice streak. Consistency builds natural muscle memory.`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Model Status Indicator */}
          <div
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
              apiStatus.apiConfigured
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-studio-800 border-studio-700 text-studio-300'
            }`}
            title={apiStatus.apiConfigured ? 'Gemini 3.5 Live & 3.6 Flash Active' : 'Offline / Demo Mode Active'}
          >
            <span className={`h-2 w-2 rounded-full ${apiStatus.apiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-studio-500'}`} />
            <span>{apiStatus.apiConfigured ? 'Gemini Live' : 'Demo Mode'}</span>
          </div>

          {/* Privacy & Storage Control Modal Trigger */}
          <button
            onClick={onOpenPrivacy}
            className="p-1.5 text-studio-400 hover:text-studio-200 hover:bg-studio-800 rounded-lg transition-colors"
            title="Privacy & Storage Settings"
          >
            <ShieldCheck className="h-5 w-5 text-studio-300" />
          </button>

          {/* Start Practice Hero Button */}
          <button
            onClick={onStartNewPractice}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-sky-500 text-studio-950 font-semibold text-sm hover:bg-sky-400 active:scale-95 transition-all shadow-sm shadow-sky-500/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start Practice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
