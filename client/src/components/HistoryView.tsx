import React, { useState } from 'react';
import {
  Clock,
  Shield,
  Trash2,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';
import { CoachingReport } from '../types';

interface HistoryViewProps {
  sessions: CoachingReport[];
  onSelectSession: (report: CoachingReport) => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
  onStartNewPractice: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  onStartNewPractice,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-studio-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-semibold mb-1">
            <Clock className="h-4 w-4" />
            <span>Authorized Session History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Your Local Practice Archives
          </h1>
          <p className="text-xs text-studio-400 mt-1">
            Only sessions you authorized to be saved are stored here in your local browser storage.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={() => setShowClearAllModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-studio-400 hover:text-rose-400 hover:bg-studio-900 border border-studio-800 rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All Data</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-studio-800 bg-studio-900/60 p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="h-12 w-12 rounded-full bg-studio-800 flex items-center justify-center mx-auto text-studio-400">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Persisted Sessions</h3>
          <p className="text-xs text-studio-400 leading-relaxed">
            communication_coach is ephemeral by default. If you practice in "Process live, save nothing" mode, sessions vanish from memory immediately upon exit.
          </p>
          <button
            onClick={onStartNewPractice}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-studio-950 transition-colors"
          >
            Start a Practice Session
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {sessions.map((report) => (
            <div
              key={report.sessionId}
              className="rounded-xl border border-studio-800 bg-studio-900/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-studio-700 transition-colors"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="text-studio-400">
                    {new Date(report.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-studio-700">•</span>
                  <span className="capitalize text-sky-400 font-semibold">{report.scenario}</span>
                  <span className="text-studio-700">•</span>
                  <span className="text-studio-400">{report.durationSeconds}s</span>
                  <span className="text-studio-700">•</span>
                  <span className="text-studio-400">{report.wordsPerMinute} WPM</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {report.oneSentenceSummary}
                </h3>

                <p className="text-xs text-studio-400 italic font-serif line-clamp-1">
                  {report.whatPeopleWillRemember}
                </p>
              </div>

              {/* Right Controls & Score */}
              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right">
                  <div className="text-lg font-mono font-black text-white">{report.overallScore}</div>
                  <div className="text-[10px] text-studio-400">Overall Score</div>
                </div>

                <button
                  onClick={() => onSelectSession(report)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-studio-800 hover:bg-studio-700 text-xs font-semibold text-white border border-studio-700 transition-colors"
                >
                  <span>Review Debrief</span>
                  <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
                </button>

                {/* Delete Individual Session */}
                {deleteConfirmId === report.sessionId ? (
                  <div className="flex items-center space-x-1 text-xs">
                    <button
                      onClick={() => onDeleteSession(report.sessionId)}
                      className="px-2 py-1 bg-rose-500 text-white rounded font-medium text-[11px]"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 text-studio-400 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(report.sessionId)}
                    className="p-1.5 text-studio-500 hover:text-rose-400 transition-colors"
                    title="Delete session record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/40 bg-studio-900 p-6 space-y-4 text-center">
            <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Permanently Clear All Data?</h3>
            <p className="text-xs text-studio-300 leading-relaxed">
              This will permanently delete all saved session transcripts, scores, habit streak metrics, and recordings from your browser's local storage and IndexedDB.
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl border border-studio-700 text-xs text-studio-300 hover:bg-studio-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearAllModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-xs font-bold text-white"
              >
                Yes, Wipe Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
