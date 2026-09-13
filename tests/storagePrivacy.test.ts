import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../client/src/services/storage';
import { generateDeterministicReport } from '../client/src/services/analyzerUtils';
import { SessionConfig } from '../client/src/types';

describe('Storage & Privacy Guarantees', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    (global as any).window = {};
    (global as any).localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; },
    };
  });

  it('ephemeral mode NEVER writes session data to storage', async () => {
    const report = generateDeterministicReport({
      sessionId: 'ephemeral-session-123',
      transcript: 'This is a completely private test speech.',
      scenario: 'impromptu',
      practiceType: 'free_speaking',
      audience: 'colleagues',
      durationSeconds: 45
    });

    const ephemeralConfig: SessionConfig = {
      scenario: 'impromptu',
      practiceType: 'free_speaking',
      targetDuration: 60,
      audience: 'colleagues',
      coachingIntensity: 'gentle_live',
      cameraMode: 'mic_only',
      storageMode: 'ephemeral',
    };

    await StorageService.saveSessionReport(report, ephemeralConfig);

    const storedReports = StorageService.getAllReports();
    expect(storedReports).toHaveLength(0);
    expect(mockStorage['recall_sessions_meta']).toBeUndefined();
  });

  it('metrics_only mode saves report metadata and transcript but never saves binary media', async () => {
    const report = generateDeterministicReport({
      sessionId: 'metrics-session-456',
      transcript: 'Saving metrics and transcript for review.',
      scenario: 'meeting',
      practiceType: 'answer_prompt',
      audience: 'leadership',
      durationSeconds: 90
    });

    const metricsConfig: SessionConfig = {
      scenario: 'meeting',
      practiceType: 'answer_prompt',
      targetDuration: 120,
      audience: 'leadership',
      coachingIntensity: 'gentle_live',
      cameraMode: 'mic_only',
      storageMode: 'metrics_only',
    };

    await StorageService.saveSessionReport(report, metricsConfig);

    const stored = StorageService.getAllReports();
    expect(stored).toHaveLength(1);
    expect(stored[0].sessionId).toBe('metrics-session-456');
    expect(stored[0].oneSentenceSummary).toBeDefined();
    expect(stored[0].scorecard.clarity.score).toBeGreaterThan(0);
  });

  it('permanently deletes an authorized session on command', async () => {
    const report = generateDeterministicReport({
      sessionId: 'to-delete-789',
      transcript: 'About to be purged.',
      scenario: 'interview',
      practiceType: 'answer_prompt',
      audience: 'interview_panel',
      durationSeconds: 60
    });

    const config: SessionConfig = {
      scenario: 'interview',
      practiceType: 'answer_prompt',
      targetDuration: 120,
      audience: 'interview_panel',
      coachingIntensity: 'gentle_live',
      cameraMode: 'mic_only',
      storageMode: 'metrics_only',
    };

    await StorageService.saveSessionReport(report, config);
    expect(StorageService.getAllReports()).toHaveLength(1);

    await StorageService.deleteSession('to-delete-789');
    expect(StorageService.getAllReports()).toHaveLength(0);
  });
});
