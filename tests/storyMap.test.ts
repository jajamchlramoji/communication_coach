import { describe, it, expect } from 'vitest';
import { evaluateStoryMap } from '../client/src/services/analyzerUtils';

describe('Story Map Evaluator', () => {
  it('correctly detects present story stages in a complete structured narrative', () => {
    const speech = `
      Last year on Cyber Monday, our dashboards froze for 14 minutes.
      In 2021, we were handling only 100k requests per minute.
      Our physical challenge was hitting database locks that caused severe delays.
      Instead of patching it, we realized we had to decouple the entire ingestion engine.
      For example, in our early test, Acme Corp saw their export times drop from 42 minutes to 3.8 minutes.
      Next Friday we deploy the canary, so please review the rollout doc today.
    `;

    const storyMap = evaluateStoryMap(speech);

    expect(storyMap).toHaveLength(6);
    const stages = storyMap.map(s => s.stage);
    expect(stages).toEqual(['hook', 'context', 'tension', 'insight', 'concrete_example', 'takeaway']);

    // Hook, tension, insight, example, takeaway should all be marked present
    const presentStages = storyMap.filter(s => s.present).map(s => s.stage);
    expect(presentStages).toContain('hook');
    expect(presentStages).toContain('tension');
    expect(presentStages).toContain('insight');
    expect(presentStages).toContain('concrete_example');
    expect(presentStages).toContain('takeaway');
  });

  it('accurately identifies missing stages in unstructured speech', () => {
    const ramblingSpeech = `
      Um, so I just wanted to talk about some stuff we worked on recently.
      We had a few meetings and we looked at the code and discussed different things.
      So yeah, that is basically what we did.
    `;

    const storyMap = evaluateStoryMap(ramblingSpeech);

    const hook = storyMap.find(s => s.stage === 'hook');
    const tension = storyMap.find(s => s.stage === 'tension');
    const example = storyMap.find(s => s.stage === 'concrete_example');
    const takeaway = storyMap.find(s => s.stage === 'takeaway');

    expect(hook?.present).toBe(false);
    expect(tension?.present).toBe(false);
    expect(example?.present).toBe(false);
    expect(hook?.feedback).toContain('Start immediately');
  });
});
