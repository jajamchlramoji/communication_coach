import { describe, it, expect, beforeEach } from 'vitest';
import { LiveCueEngine } from '../client/src/services/cueEngine';
import { LiveCue } from '../client/src/types';

describe('Live Cue Engine & Subtle Governor', () => {
  let engine: LiveCueEngine;

  beforeEach(() => {
    engine = new LiveCueEngine();
    engine.reset();
  });

  it('never emits live cues when intensity is silent_observer', () => {
    let emittedCue: LiveCue | null = null;

    engine.evaluateCue(
      {
        scenario: 'meeting',
        intensity: 'silent_observer',
        elapsedSeconds: 50,
        targetDurationSeconds: 120,
        totalWordCount: 120,
        recentWordsCount: 10,
        isSilent: true,
        silenceDurationMs: 1200,
        fullTranscript: 'We had a problem with the latency.'
      },
      (cue) => { emittedCue = cue; }
    );

    expect(emittedCue).toBeNull();
  });

  it('emits "Pause — let that idea breathe" when speaker rambles continuously without pause', () => {
    let emittedCue: LiveCue | null = null;

    engine.evaluateCue(
      {
        scenario: 'presentation',
        intensity: 'gentle_live',
        elapsedSeconds: 40,
        targetDurationSeconds: 180,
        totalWordCount: 75,
        recentWordsCount: 70, // over 65 continuous words without pause!
        isSilent: false,
        silenceDurationMs: 0,
        fullTranscript: 'We kept going and going and explaining every single thing without stopping.'
      },
      (cue) => { emittedCue = cue; }
    );

    expect(emittedCue).not.toBeNull();
    expect(emittedCue?.text).toBe('Pause — let that idea breathe.');
    expect(emittedCue?.category).toBe('pace');
  });

  it('emits "Land the point." when approaching target duration end boundary', () => {
    let emittedCue: LiveCue | null = null;

    engine.evaluateCue(
      {
        scenario: 'meeting',
        intensity: 'gentle_live',
        elapsedSeconds: 105,
        targetDurationSeconds: 120, // 15 seconds remaining
        totalWordCount: 180,
        recentWordsCount: 10,
        isSilent: true,
        silenceDurationMs: 900,
        fullTranscript: 'And so we are looking into what to do next.'
      },
      (cue) => { emittedCue = cue; }
    );

    expect(emittedCue).not.toBeNull();
    expect(emittedCue?.text).toBe('Land the point.');
    expect(emittedCue?.category).toBe('structure');
  });

  it('enforces cooldown interval so cues never flood the user', () => {
    let cueCount = 0;

    const callEvaluate = () => {
      engine.evaluateCue(
        {
          scenario: 'presentation',
          intensity: 'gentle_live',
          elapsedSeconds: 50,
          targetDurationSeconds: 180,
          totalWordCount: 90,
          recentWordsCount: 70,
          isSilent: false,
          silenceDurationMs: 0,
          fullTranscript: 'Rambling continuously.'
        },
        (cue) => { if (cue) cueCount++; }
      );
    };

    callEvaluate();
    expect(cueCount).toBe(1);

    // Call immediately again — cooldown should suppress second cue
    callEvaluate();
    expect(cueCount).toBe(1);
  });
});
