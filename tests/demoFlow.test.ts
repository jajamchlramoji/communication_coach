import { describe, it, expect } from 'vitest';
import { MOCK_REPORTS } from '../client/src/data/mockReports';
import { SEEDED_PROMPTS } from '../client/src/data/prompts';
import { SKILL_TRACKS } from '../client/src/data/skillTracks';
import { generateDeterministicReport } from '../client/src/services/analyzerUtils';

describe('Demo Mode & End-to-End Session Simulation Flow', () => {
  it('loads realistic seeded prompts for all four scenarios', () => {
    const scenarios = ['presentation', 'meeting', 'interview', 'impromptu'];
    for (const s of scenarios) {
      const matching = SEEDED_PROMPTS.filter(p => p.scenario === s);
      expect(matching.length).toBeGreaterThanOrEqual(2);
      expect(matching[0].stakes.length).toBeGreaterThan(10);
      expect(matching[0].context.length).toBeGreaterThan(20);
    }
  });

  it('loads 6 skill tracks with progressive exercises', () => {
    expect(SKILL_TRACKS).toHaveLength(6);
    for (const track of SKILL_TRACKS) {
      expect(track.exercises.length).toBe(4);
      expect(track.exercises[0].level).toBe(1);
      expect(track.exercises[3].level).toBe(4);
    }
  });

  it('contains full mock reports with all 12 required sections for review without API key', () => {
    const scenarios = ['presentation', 'meeting', 'interview', 'impromptu'];
    for (const s of scenarios) {
      const report = MOCK_REPORTS[s];
      expect(report).toBeDefined();
      expect(report.oneSentenceSummary).toBeDefined();
      expect(report.whatPeopleWillRemember).toBeDefined();
      expect(report.scorecard.clarity.score).toBeGreaterThan(0);
      expect(report.strengths).toHaveLength(3);
      expect(report.improvements).toHaveLength(3);
      expect(report.storyMap.length).toBe(6);
      expect(report.memorableRewrite.strongerOpening).toBeDefined();
      expect(report.memorableRewrite.strongerClosing).toBeDefined();
      expect(report.lighterMoment.suggestedLine).toBeDefined();
      expect(report.replayTranscript.length).toBeGreaterThan(3);
      expect(report.retryExercise.focusedSkill).toBeDefined();
    }
  });

  it('simulates completing a demo session and generating debrief report', () => {
    const spokenTranscript = 'We faced an unexpected 400% surge in latency right as the team prepared for product launch. Our legacy architecture was designed when traffic was a fraction of today. Patching it was like putting race tires on a lawnmower. Instead of adding temporary band-aids, we decoupled the real-time event pipeline completely. Acme Corp saw query resolution drop from 4 minutes down to 850 milliseconds. When information is incomplete, pick the architecture that is cheapest to undo.';

    const report = generateDeterministicReport({
      sessionId: 'demo-run-999',
      transcript: spokenTranscript,
      scenario: 'presentation',
      practiceType: 'answer_prompt',
      audience: 'clients',
      durationSeconds: 120
    });

    expect(report.oneSentenceSummary).toBeDefined();
    expect(report.scorecard.clarity.score).toBeGreaterThan(70);
    expect(report.scorecard.structure.score).toBeGreaterThan(70);
    expect(report.storyMap.find(s => s.stage === 'hook')?.present).toBe(true);
    expect(report.storyMap.find(s => s.stage === 'concrete_example')?.present).toBe(true);
    expect(report.retryExercise.focusedSkill).toBeDefined();
  });
});
