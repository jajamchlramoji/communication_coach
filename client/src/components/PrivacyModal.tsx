import React from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Eye,
  Server,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAllData: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onClearAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-studio-800 bg-studio-900 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-studio-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Privacy Architecture & Data Guarantees</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-studio-400 hover:text-white rounded-lg hover:bg-studio-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-studio-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          
          {/* 1. Server-Side Key Isolation */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Server className="h-4 w-4" />
              <span>1. Zero Frontend API Key Exposure</span>
            </div>
            <p>
              Your Gemini API key never touches the browser client, network inspection panels, client-side bundles, or logs. All communication with Gemini Live API (<code className="text-studio-200">gemini-3.5-transcribe-live</code>) and Gemini Flash (<code className="text-studio-200">gemini-3.6-flash</code>) is mediated strictly through an authenticated local Node.js proxy.
            </p>
          </div>

          {/* 2. Three Ephemeral Storage Tiers */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Lock className="h-4 w-4" />
              <span>2. You Choose Storage at Every Session</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-studio-300">
              <li>
                <strong className="text-white">Ephemeral (Default):</strong> Audio, transcript, and scores exist in volatile RAM only. Once the session tab is closed or you return to the dashboard, everything is completely purged.
              </li>
              <li>
                <strong className="text-white">Metrics Only:</strong> Transcripts and scorecards are saved in your local browser <code className="text-studio-200">localStorage</code>. Zero audio or video files are written.
              </li>
              <li>
                <strong className="text-white">Full Recording:</strong> Audio recordings are saved strictly in your browser's private <code className="text-studio-200">IndexedDB</code> database. No audio files are ever uploaded or hosted on cloud servers.
              </li>
            </ul>
          </div>

          {/* 3. Explainable Observable Visual Cues Only */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Eye className="h-4 w-4" />
              <span>3. Observable Delivery Signals Only</span>
            </div>
            <p>
              Camera analysis is completely optional and runs 100% locally on your device via HTML5 canvas image processing. Recall measures only physical observable dynamics (centering within frame, head motion stability, and optical camera gaze).
            </p>
            <p className="text-studio-400 italic pt-1">
              Recall strictly prohibits and never attempts to guess emotions, personality, psychological confidence, intelligence, or audience sentiment.
            </p>
          </div>

          {/* 4. Complete Data Sovereignty */}
          <div className="rounded-xl bg-studio-850 p-4 border border-studio-800 space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Trash2 className="h-4 w-4 text-rose-400" />
              <span>4. Data Sovereignty & Nuclear Deletion</span>
            </div>
            <p>
              You can delete individual sessions from your history at any time with a single click, or permanently wipe all local databases with the button below.
            </p>
            <button
              onClick={() => {
                onClearAllData();
                onClose();
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Permanently Delete All Saved Local Data</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-studio-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-xs font-semibold text-white transition-colors"
          >
            Close Privacy Guide
          </button>
        </div>

      </div>
    </div>
  );
};
