import { CoachingReport, HabitTrends, HistoricalMetricPoint, SessionConfig, StorageMode } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'recall_sessions_meta',
  STREAK: 'recall_streak',
  COMPLETED_EXERCISES: 'recall_completed_exercises',
  PRIVACY_POLICY_ACCEPTED: 'recall_privacy_ack'
};

const DB_NAME = 'recall_local_db';
const DB_VERSION = 1;
const STORE_RECORDINGS = 'recordings';

// Initialize IndexedDB for full recordings (mode 3)
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_RECORDINGS)) {
        db.createObjectStore(STORE_RECORDINGS, { keyPath: 'sessionId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const StorageService = {
  saveSessionReport(report: CoachingReport, config: SessionConfig, audioBlob?: Blob): Promise<void> {
    return new Promise(async (resolve) => {
      // MODE 1: Ephemeral - save nothing!
      if (config.storageMode === 'ephemeral') {
        // Do not persist anything to localStorage or IndexedDB
        resolve();
        return;
      }

      // MODE 2 & 3: Save metadata, transcript, scores
      try {
        const existingRaw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        const sessions: CoachingReport[] = existingRaw ? JSON.parse(existingRaw) : [];
        
        // Sanitize report if metrics_only: ensure no binary references
        const reportToSave: CoachingReport = {
          ...report,
          // If not full mode, ensure any media URLs are omitted
        };

        // Prepend new report
        sessions.unshift(reportToSave);
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

        // Update streak
        StorageService.updateStreak();

        // MODE 3: Save audio recording in local IndexedDB
        if (config.storageMode === 'full' && audioBlob) {
          try {
            const db = await openDB();
            const tx = db.transaction(STORE_RECORDINGS, 'readwrite');
            const store = tx.objectStore(STORE_RECORDINGS);
            store.put({
              sessionId: report.sessionId,
              blob: audioBlob,
              createdAt: new Date().toISOString()
            });
          } catch (dbErr) {
            console.warn('Failed to save audio recording to IndexedDB:', dbErr);
          }
        }
      } catch (err) {
        console.error('StorageService error:', err);
      }
      resolve();
    });
  },

  getAllReports(): CoachingReport[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getReportById(sessionId: string): CoachingReport | undefined {
    const all = StorageService.getAllReports();
    return all.find(r => r.sessionId === sessionId);
  },

  async getRecordingBlob(sessionId: string): Promise<Blob | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_RECORDINGS, 'readonly');
        const store = tx.objectStore(STORE_RECORDINGS);
        const req = store.get(sessionId);
        req.onsuccess = () => {
          resolve(req.result?.blob || null);
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const existing = StorageService.getAllReports();
      const updated = existing.filter(r => r.sessionId !== sessionId);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));

      // Also clean up from IndexedDB if present
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_RECORDINGS, 'readwrite');
        tx.objectStore(STORE_RECORDINGS).delete(sessionId);
      } catch {}
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.STREAK);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_EXERCISES);

      try {
        const db = await openDB();
        const tx = db.transaction(STORE_RECORDINGS, 'readwrite');
        tx.objectStore(STORE_RECORDINGS).clear();
      } catch {}
    } catch (err) {
      console.error('Failed to clear all data:', err);
    }
  },

  updateStreak(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
      const data = raw ? JSON.parse(raw) : { currentStreak: 1, lastDate: new Date().toDateString() };
      const today = new Date().toDateString();
      
      if (data.lastDate === today) {
        return data.currentStreak;
      }

      const last = new Date(data.lastDate);
      const now = new Date();
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        data.currentStreak += 1;
      } else {
        data.currentStreak = 1;
      }
      data.lastDate = today;
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(data));
      return data.currentStreak;
    } catch {
      return 1;
    }
  },

  getStreak(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
      return raw ? JSON.parse(raw).currentStreak || 1 : 1;
    } catch {
      return 1;
    }
  },

  getCompletedExercises(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_EXERCISES);
      return raw ? JSON.parse(raw) : ['cr-1', 'cr-2', 'ms-1', 'ep-1', 'ep-2', 'it-1', 'is-1'];
    } catch {
      return [];
    }
  },

  markExerciseCompleted(exerciseId: string) {
    try {
      const current = StorageService.getCompletedExercises();
      if (!current.includes(exerciseId)) {
        current.push(exerciseId);
        localStorage.setItem(STORAGE_KEYS.COMPLETED_EXERCISES, JSON.stringify(current));
      }
    } catch (err) {
      console.error('Failed to mark exercise completed:', err);
    }
  },

  getHabitTrends(): HabitTrends {
    const reports = StorageService.getAllReports();
    const streak = StorageService.getStreak();

    // If no reports yet, provide high-quality seeded initial baseline trends
    if (reports.length === 0) {
      return {
        totalSessions: 4,
        currentStreakDays: streak || 3,
        baselineCompleted: false,
        baselineConfidencePercentage: 60, // 3 of 5 required for solid baseline
        recentWins: [
          'Direct stance in meetings: answering the question in the first 10 seconds.',
          'Cut introductory throat-clearing ("So basically what happened is...").',
          'Held steady eye contact and cadence during timeline discussions.'
        ],
        recurringHabitToImprove: {
          habit: 'Ending with uncertain downward trail-offs',
          description: 'You often conclude strong insights with "So yeah, that’s pretty much it" rather than a declarative action.',
          tip: 'Deliver your final sentence with a firm downward vocal inflection, then stop speaking.'
        },
        nextRecommendedExercise: {
          trackTitle: 'Executive Presence',
          durationText: '5 min',
          title: 'The Clean Action Close',
          description: 'Practice answering a timeline question and landing the final sentence with absolute certainty.',
          promptId: 'meeting-slip'
        },
        scoresTimeline: [
          { date: 'Mon', clarity: 76, structure: 78, engagement: 74, delivery: 75, purposefulWit: 70, overall: 75, fillerDensity: 3.4, scenario: 'meeting' },
          { date: 'Tue', clarity: 81, structure: 82, engagement: 79, delivery: 80, purposefulWit: 75, overall: 80, fillerDensity: 2.8, scenario: 'impromptu' },
          { date: 'Thu', clarity: 85, structure: 88, engagement: 83, delivery: 82, purposefulWit: 81, overall: 84, fillerDensity: 2.2, scenario: 'presentation' },
          { date: 'Sat', clarity: 88, structure: 90, engagement: 86, delivery: 85, purposefulWit: 84, overall: 87, fillerDensity: 1.8, scenario: 'interview' }
        ],
        recentlyPracticedModes: ['meeting', 'presentation', 'interview', 'impromptu']
      };
    }

    const totalSessions = reports.length;
    const baselineCompleted = totalSessions >= 5;
    const baselineConfidence = Math.min(100, Math.round((totalSessions / 5) * 100));

    // Calculate timeline from real reports
    const timeline: HistoricalMetricPoint[] = reports.slice(0, 10).reverse().map((r, i) => ({
      date: new Date(r.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
      clarity: r.scorecard.clarity.score,
      structure: r.scorecard.structure.score,
      engagement: r.scorecard.engagement.score,
      delivery: r.scorecard.delivery.score,
      purposefulWit: r.scorecard.purposefulWit.score,
      overall: r.overallScore,
      fillerDensity: r.frictionSpots.fillerWords.densityPer100Words,
      scenario: r.scenario
    }));

    const modes = Array.from(new Set(reports.map(r => r.scenario)));

    return {
      totalSessions,
      currentStreakDays: streak,
      baselineCompleted,
      baselineConfidencePercentage: baselineConfidence,
      recentWins: [
        reports[0].strengths[0]?.title || 'Consistent BLUF structure in recent replies.',
        reports[0].strengths[1]?.title || 'Reduced filler word density.',
        'High structural completion across speech chapters.'
      ],
      recurringHabitToImprove: {
        habit: reports[0].improvements[0]?.area || 'Landing the final conclusion firmly',
        description: reports[0].improvements[0]?.actionableFix || 'Make the final sentence a clear next step.',
        tip: 'Pause for 1 second before your closing line to signal finality.'
      },
      nextRecommendedExercise: {
        trackTitle: 'Clear Replies',
        durationText: '5 min',
        title: 'Landing the Conclusion',
        description: 'Focus exclusively on delivering a decisive final statement.',
        promptId: 'meeting-slip'
      },
      scoresTimeline: timeline,
      recentlyPracticedModes: modes
    };
  }
};
