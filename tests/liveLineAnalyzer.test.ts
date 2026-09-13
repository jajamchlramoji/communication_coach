import { describe, it, expect } from 'vitest';
import { analyzeSpokenLine, cleanAndSharpenLine } from '../client/src/services/liveLineAnalyzer';

describe('Real-Time Live Line Analyzer & Formatted Better Service', () => {
  it('analyzes a crisp spoken sentence with high score and direct status', () => {
    const spoken = 'We decoupled event ingestion from real-time aggregation to protect query latency.';
    const result = analyzeSpokenLine(spoken, 15);

    expect(result.score).toBeGreaterThanOrEqual(88);
    expect(result.statusTag).toBe('Crisp & Direct');
    expect(result.fillersFound).toHaveLength(0);
    expect(result.formattedBetter).toContain('We decoupled event ingestion');
  });

  it('detects filler words and hedging, lowering score and tagging as Hedging', () => {
    const spoken = 'Um, basically we kind of had to delay the launch by two weeks because of Stripe.';
    const result = analyzeSpokenLine(spoken, 30);

    expect(result.score).toBeLessThan(80);
    expect(result.statusTag).toBe('Hedging');
    expect(result.fillersFound).toContain('um');
    expect(result.fillersFound).toContain('basically');
    expect(result.fillersFound).toContain('kind of');
  });

  it('cleans and sharpens a line removing fillers and softeners in formattedBetter', () => {
    const original = 'So basically we kind of had to move the date because of vendor compliance';
    const cleaned = cleanAndSharpenLine(original, ['basically', 'kind of'], true, false);

    expect(cleaned).not.toContain('basically');
    expect(cleaned).not.toContain('kind of');
    expect(cleaned).toMatch(/[.?!]$/);
  });

  it('handles run-on sentences and splits them for breathing room', () => {
    const runOn = 'The pipeline handles twelve thousand streaming events per second without dropping packets and our engineers rewrote it in Rust and it is completely reliable now';
    const result = analyzeSpokenLine(runOn, 45);

    expect(result.statusTag).toBe('Wordy / Run-on');
    expect(result.formattedBetter).toContain('.');
  });
});
