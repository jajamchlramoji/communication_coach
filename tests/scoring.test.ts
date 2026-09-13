import { describe, it, expect } from 'vitest';
import { calculateWpm, detectFillerWords, generateDeterministicReport } from '../client/src/services/analyzerUtils';

describe('Scoring & Normalization Utilities', () => {
  it('calculates Words Per Minute correctly', () => {
    expect(calculateWpm(140, 60)).toBe(140);
    expect(calculateWpm(210, 90)).toBe(140);
    expect(calculateWpm(70, 30)).toBe(140);
    expect(calculateWpm(0, 60)).toBe(0);
    expect(calculateWpm(100, 0)).toBe(0);
  });

  it('detects single and multi-word filler words with accurate density', () => {
    const text = 'Um, basically what happened is, you know, we kind of had like a small outage.';
    const fillers = detectFillerWords(text);

    expect(fillers.totalCount).toBeGreaterThanOrEqual(4);
    expect(fillers.breakdown['um']).toBe(1);
    expect(fillers.breakdown['basically']).toBe(1);
    expect(fillers.breakdown['you know']).toBe(1);
    expect(fillers.breakdown['kind of']).toBe(1);
    expect(fillers.densityPer100Words).toBeGreaterThan(0);
  });

  it('reports zero fillers on clean crisp speech', () => {
    const text = 'Starting November 15th, our production telemetry will run exclusively on the v2 architecture. Query latency drops to 850 milliseconds.';
    const fillers = detectFillerWords(text);

    expect(fillers.totalCount).toBe(0);
    expect(fillers.densityPer100Words).toBe(0);
  });

  it('produces a normalized CoachingReport with all dimensions strictly bounded [0, 100]', () => {
    const transcript = 'Last year on Cyber Monday, our dashboards froze for 14 minutes. We hit the physical ceiling of that design. Instead of patching it, we decoupled the ingestion pipeline. Acme Corp saw their batch times drop from 42 minutes to 3.8 minutes. Open the sandbox today and test one canary query.';
    
    const report = generateDeterministicReport({
      sessionId: 'test-session-01',
      transcript,
      scenario: 'presentation',
      practiceType: 'answer_prompt',
      audience: 'clients',
      durationSeconds: 90
    });

    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);

    const dims = ['clarity', 'concision', 'structure', 'storytelling', 'engagement', 'delivery', 'purposefulWit'] as const;
    for (const d of dims) {
      const dimScore = report.scorecard[d];
      expect(dimScore.score).toBeGreaterThanOrEqual(0);
      expect(dimScore.score).toBeLessThanOrEqual(100);
      expect(dimScore.evidence.length).toBeGreaterThan(0);
      expect(dimScore.benchmark.length).toBeGreaterThan(0);
    }

    expect(report.strengths).toHaveLength(3);
    expect(report.improvements).toHaveLength(3);
    expect(report.memorableRewrite.strongerOpening).toBeDefined();
    expect(report.lighterMoment.suggestedLine).toBeDefined();
    expect(report.retryExercise.focusedSkill).toBeDefined();
  });
});
