import {
  AudienceEngagementRisk,
  AudienceType,
  CoachingReport,
  FrictionSpots,
  LighterMomentOption,
  MemorableRewrite,
  PracticeScenario,
  PracticeType,
  ReplayTranscriptLine,
  RetryExercise,
  Scorecard,
  StoryMapElement,
  StrengthPoint,
  LeverageImprovement
} from '../types';

export const COMMON_FILLERS = [
  'um', 'uh', 'like', 'you know', 'basically', 'kind of', 'sort of', 'actually', 'literally', 'i mean'
];

export function calculateWpm(wordCount: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return Math.round((wordCount / durationSeconds) * 60);
}

export function detectFillerWords(text: string): FrictionSpots['fillerWords'] {
  const breakdown: Record<string, number> = {};
  let totalCount = 0;
  const lower = text.toLowerCase();

  // Multi-word fillers first
  const multiWord = ['you know', 'kind of', 'sort of', 'i mean'];
  for (const mw of multiWord) {
    const regex = new RegExp(`\\b${mw}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      breakdown[mw] = matches.length;
      totalCount += matches.length;
    }
  }

  // Single word fillers
  const singleWords = ['um', 'uh', 'like', 'basically', 'actually', 'literally'];
  const tokens = lower.split(/\s+/).map(t => t.replace(/[^a-z]/g, ''));
  for (const token of tokens) {
    if (singleWords.includes(token)) {
      breakdown[token] = (breakdown[token] || 0) + 1;
      totalCount += 1;
    }
  }

  const words = tokens.filter(t => t.length > 0).length;
  const density = words > 0 ? Number(((totalCount / words) * 100).toFixed(1)) : 0;

  return {
    totalCount,
    densityPer100Words: density,
    breakdown
  };
}

export function evaluateStoryMap(text: string): StoryMapElement[] {
  const lower = text.toLowerCase();
  const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);

  // Hook
  const firstSentences = sentences.slice(0, 2).join(' ');
  const hasHookStakes = /\b(\d+|first|never|why|crisis|problem|percent|billion|million|today)\b/i.test(firstSentences);
  
  // Context
  const hasContext = /\b(when|because|historically|in 20\d\d|we were|our team|at the time|initially)\b/i.test(lower);

  // Tension
  const hasTension = /\b(problem|challenge|risk|fail|bottleneck|friction|conflict|delay|slip|disagree|trade-off|cost|latency|surge|ceiling|broken|stuck)\b/i.test(lower);

  // Insight / Turn
  const hasInsight = /\b(realized|decided|instead of|pivoted|solution|strategy|rather than|approach|framework)\b/i.test(lower);

  // Concrete Example
  const hasExample = /\b(for example|specifically|such as|acme|test|metric|dropped from|reduced by|\d+ percent|\d+ minutes|\$\d+)\b/i.test(lower);

  // Takeaway
  const lastSentences = sentences.slice(-2).join(' ');
  const hasTakeaway = /\b(next|today|friday|action|recommend|takeaway|moving forward|call me|ensure|commit|pick|rule|cheapest|undo|remember|priority)\b/i.test(lastSentences);

  return [
    {
      stage: 'hook',
      label: 'Hook',
      present: hasHookStakes,
      quotedText: sentences[0] || undefined,
      feedback: hasHookStakes
        ? 'Compelling opening anchor with stakes or metrics.'
        : 'Opened with conversational warm-up. Start immediately with the core tension or number.'
    },
    {
      stage: 'context',
      label: 'Context',
      present: hasContext,
      quotedText: sentences.find(s => /\b(when|historically|our team|initially)\b/i.test(s)),
      feedback: hasContext
        ? 'Grounds the setting without overwhelming technical backstory.'
        : 'Context is underspecified; briefly frame what conditions existed prior to the event.'
    },
    {
      stage: 'tension',
      label: 'Tension / Problem',
      present: hasTension,
      quotedText: sentences.find(s => /\b(problem|challenge|risk|fail|bottleneck|slip)\b/i.test(s)),
      feedback: hasTension
        ? 'Clearly names the friction point or trade-off.'
        : 'Missing acute tension; listener cannot feel why this was difficult.'
    },
    {
      stage: 'insight',
      label: 'Insight / Turn',
      present: hasInsight,
      quotedText: sentences.find(s => /\b(realized|decided|instead of|pivoted|rather than)\b/i.test(s)),
      feedback: hasInsight
        ? 'Articulates the decision pivot that unlocked progress.'
        : 'Jumped straight from problem to routine action without explaining the underlying insight.'
    },
    {
      stage: 'concrete_example',
      label: 'Concrete Example',
      present: hasExample,
      quotedText: sentences.find(s => /\b(for example|specifically|percent|minutes|\$\d+)\b/i.test(s)),
      feedback: hasExample
        ? 'Strong empirical proof point anchoring the concept.'
        : 'Remains in theoretical abstraction. Include a real customer, incident, or exact percentage.'
    },
    {
      stage: 'takeaway',
      label: 'Takeaway / Action',
      present: hasTakeaway,
      quotedText: sentences.length > 1 ? sentences[sentences.length - 1] : undefined,
      feedback: hasTakeaway
        ? 'Concluded with a clear commitment or memorable maxim.'
        : 'Trailed off without a clear call-to-action or ownership step.'
    }
  ];
}

export function generateDeterministicReport(params: {
  sessionId: string;
  transcript: string;
  scenario: PracticeScenario;
  practiceType: PracticeType;
  audience: AudienceType;
  durationSeconds: number;
}): CoachingReport {
  const { sessionId, transcript, scenario, practiceType, audience, durationSeconds } = params;
  const words = transcript.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wpm = calculateWpm(wordCount, durationSeconds);

  const fillers = detectFillerWords(transcript);
  const storyMap = evaluateStoryMap(transcript);

  // Score calculations based on speech signals
  const presentStoryCount = storyMap.filter(s => s.present).length;
  const structureScore = Math.min(95, Math.max(65, Math.round((presentStoryCount / 6) * 100)));
  
  // Clarity: penalized by filler density and excessive length
  const fillerPenalty = Math.min(25, fillers.densityPer100Words * 4);
  const clarityScore = Math.max(60, Math.round(92 - fillerPenalty));

  // Concision: target 120-150 wpm
  const paceDeviation = Math.abs(wpm - 135);
  const concisionScore = Math.max(65, Math.round(90 - Math.min(20, paceDeviation * 0.4)));

  const storytellingScore = Math.min(95, Math.max(60, Math.round(storyMap[4].present ? 88 : 72)));
  const engagementScore = Math.min(94, Math.max(68, Math.round(storyMap[2].present && storyMap[0].present ? 89 : 76)));
  const deliveryScore = Math.min(92, Math.max(70, Math.round(wpm >= 115 && wpm <= 155 ? 87 : 74)));
  const witScore = Math.min(90, Math.max(68, 80));

  const overall = Math.round(
    (clarityScore * 0.2 +
     concisionScore * 0.15 +
     structureScore * 0.2 +
     storytellingScore * 0.15 +
     engagementScore * 0.15 +
     deliveryScore * 0.15)
  );

  const scorecard: Scorecard = {
    clarity: {
      score: clarityScore,
      evidence: `Filler density was ${fillers.densityPer100Words} per 100 words with straightforward sentence syntax.`,
      benchmark: 'Target is under 2.0 filler density with direct phrasing.'
    },
    concision: {
      score: concisionScore,
      evidence: `Spoke at ${wpm} WPM across ${wordCount} words.`,
      benchmark: 'Target cadence is 125–145 words per minute.'
    },
    structure: {
      score: structureScore,
      evidence: `Hit ${presentStoryCount} of 6 key story architecture markers.`,
      benchmark: 'Complete narratives contain Hook, Tension, Turn, Example, and CTA.'
    },
    storytelling: {
      score: storytellingScore,
      evidence: storyMap[4].present ? 'Included concrete proof numbers/examples.' : 'Relied on high-level statements without a grounding anecdote.',
      benchmark: 'Every strategic claim should carry one real-world anchor.'
    },
    engagement: {
      score: engagementScore,
      evidence: storyMap[2].present ? 'Addressed real stakes that matter to ' + audience + '.' : 'Stakes were implicit rather than stated.',
      benchmark: 'Audience engagement correlates with explicitly named tension.'
    },
    delivery: {
      score: deliveryScore,
      evidence: `Steady pacing at ${wpm} WPM with natural conversational flow.`,
      benchmark: 'High executive presence balances steady speed with deliberate silence.'
    },
    purposefulWit: {
      score: witScore,
      evidence: 'Maintained a grounded, respectful tone suitable for ' + audience + '.',
      benchmark: 'Understated levity releases room tension after dense moments.'
    }
  };

  const sentences = transcript.split(/(?<=[.?!])\s+/).filter(Boolean);

  const strengths: [StrengthPoint, StrengthPoint, StrengthPoint] = [
    {
      title: 'Strong Initial Orientation',
      explanation: 'You immediately set the focus for the session without wasting time on ceremonial introductions.',
      quotedMoment: sentences[0] || 'Your opening statement set immediate direction.',
      timestamp: '0:05'
    },
    {
      title: 'Direct Articulation of the Problem',
      explanation: 'You acknowledged the underlying reality rather than speaking in sanitized corporate generalities.',
      quotedMoment: sentences[Math.min(1, sentences.length - 1)] || 'Clear identification of the roadblock.',
      timestamp: '0:25'
    },
    {
      title: 'Authentic Conversational Cadence',
      explanation: 'You sounded like a thoughtful leader solving a problem in real time, not a script reader.',
      quotedMoment: sentences[Math.floor(sentences.length / 2)] || 'Natural thought progression.',
      timestamp: '0:50'
    }
  ];

  const improvements: [LeverageImprovement, LeverageImprovement, LeverageImprovement] = [
    {
      priority: 1,
      area: 'Eliminate Hedging at Key Decision Points',
      actionableFix: 'Replace tentative fillers like "basically kind of" with declarative verbs.',
      contrastExample: {
        before: '“We are basically kind of trying to fix the latency.”',
        after: '“We are deploying dedicated caching to drop latency by 40%.”'
      }
    },
    {
      priority: 2,
      area: 'Ground the Turn in a Specific Number',
      actionableFix: 'Add one concrete metric or timeframe to anchor the turning point.',
      contrastExample: {
        before: '“It made things a lot faster for our team.”',
        after: '“It cut customer onboarding turnaround from 4 days to 45 minutes.”'
      }
    },
    {
      priority: 3,
      area: 'Stick the Landing with an Unapologetic Action',
      actionableFix: 'End with an unambiguous next step instead of trailing off into conversational hesitation.',
      contrastExample: {
        before: '“So yeah, that is pretty much all I had on this.”',
        after: '“I will circulate the decision doc by 3 PM. Review section 2 before standup tomorrow.”'
      }
    }
  ];

  const engagementRisks: AudienceEngagementRisk[] = [];
  if (!storyMap[4].present) {
    engagementRisks.push({
      riskType: 'abstraction_overload',
      severity: 'medium',
      observedPattern: 'Speaking for over 45 seconds without an empirical example or metric.',
      mitigation: 'Anchor every theoretical point with "Specifically, when Acme ran this..."'
    });
  }
  if (!storyMap[5].present) {
    engagementRisks.push({
      riskType: 'sudden_stop',
      severity: 'low',
      observedPattern: 'Conclusion lacked a firm downward cadence.',
      mitigation: 'End on an active imperative verb.'
    });
  }

  const memorableRewrite: MemorableRewrite = {
    strongerOpening: {
      original: sentences[0] || 'I wanted to share some thoughts on this topic.',
      recommended: `“Here is the central challenge facing us today: ${sentences[0] || 'we need to bridge our current architecture to the future without dropping the ball.'}”`,
      technique: 'Lead with the governing thesis in the first 8 seconds.'
    },
    strongerBridge: {
      original: sentences[Math.floor(sentences.length / 2)] || 'And then we moved to the next phase.',
      recommended: '“Rather than debating opinions, we tested the hypothesis against production telemetry.”',
      technique: 'Bridge with evidence instead of chronology.'
    },
    vividAnalogy: {
      ideaTargeted: 'Explaining systemic technical or operational debt.',
      analogyText: '“Running our old pipeline under this load was like asking a postal bicycle to deliver freight containers.”',
      whyItWorks: 'Physical and instantly creates shared empathy for the problem.'
    },
    strongerClosing: {
      original: sentences[sentences.length - 1] || 'So that is where things stand right now.',
      recommended: '“We have the data, we have the prototype, and the staging test launches Thursday. I need your sign-off by 5 PM.”',
      technique: 'Time-bound ownership and clear authority.'
    }
  };

  const lighterMoment: LighterMomentOption = {
    mechanism: 'understated_contrast',
    explanation: 'A dry, understated contrast breaks tension when discussing complex obstacles without undermining urgency.',
    suggestedMoment: 'Right after describing a frustrating delay or unexpected bug.',
    suggestedLine: '“Our automated tests passed in 4 seconds; our cross-team alignment meetings only took four weeks.”',
    ruleOfThumb: 'Point levity at the universal absurdity of bureaucracy, never at individual colleagues.'
  };

  const replayTranscript: ReplayTranscriptLine[] = sentences.map((s, idx) => ({
    id: `replay-${idx}`,
    speaker: 'user',
    text: s,
    timestampMs: idx * 8000,
    highlightType: idx === 0 ? 'hook' : idx === sentences.length - 1 ? 'closing' : undefined,
    coachingNote: idx === 0 ? 'Clear opening point' : idx === sentences.length - 1 ? 'Firm takeaway' : undefined
  }));

  const retryExercise: RetryExercise = {
    focusedSkill: 'Ending with Decisive Action',
    goal: 'Deliver a 30-second summary that finishes on an explicit, time-bound deliverable.',
    prompt: 'Deliver the final 2 sentences of your message with absolute downward vocal certainty and a specific next step.',
    successCondition: 'Ends without filler words and gives a concrete timestamped deliverable.'
  };

  return {
    id: `report-${sessionId}`,
    sessionId,
    createdAt: new Date().toISOString(),
    scenario,
    practiceType,
    audience,
    durationSeconds,
    wordCount,
    wordsPerMinute: wpm,
    oneSentenceSummary: `Delivered a ${scenario} response for ${audience}, focusing on problem resolution and actionable execution.`,
    whatPeopleWillRemember: `“${sentences[0] || 'Clear, actionable problem ownership and execution.'}”`,
    overallScore: overall,
    scorecard,
    strengths,
    improvements,
    frictionSpots: {
      fillerWords: fillers,
      repeatedPhrases: ['in terms of'],
      runOnSentences: [],
      weakTransitions: ['So yeah...'],
      jargonTerms: ['bandwidth'],
      vagueClaims: ['things improved'],
      missedConclusions: storyMap[5].present ? [] : ['Ended without explicit CTA']
    },
    storyMap,
    engagementRisks,
    memorableRewrite,
    lighterMoment,
    replayTranscript,
    retryExercise
  };
}
