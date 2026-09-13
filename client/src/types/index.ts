export type PracticeScenario = 'presentation' | 'meeting' | 'interview' | 'impromptu';

export type PracticeType = 'free_speaking' | 'answer_prompt' | 'rehearse_talk' | 'replay_improve';

export type TargetDuration = 60 | 120 | 180 | 300 | 600; // seconds

export type AudienceType = 'colleagues' | 'leadership' | 'clients' | 'general_public' | 'interview_panel';

export type CoachingIntensity = 'gentle_live' | 'silent_observer' | 'rhythm_coach';

export type CameraMode = 'mic_only' | 'mic_and_visual';

export type StorageMode = 'ephemeral' | 'metrics_only' | 'full';

export interface SeededPrompt {
  id: string;
  scenario: PracticeScenario;
  title: string;
  context: string;
  targetAudience: AudienceType;
  recommendedDuration: TargetDuration;
  suggestedFocus: string;
  stakes: string;
}

export interface LiveCue {
  id: string;
  text: string;
  category: 'pace' | 'content' | 'structure' | 'delivery' | 'wit';
  timestampMs: number;
  reason?: string;
}

export interface ObservableVisualSignals {
  gazeAlignmentScore: number; // 0-100 (% of time eyes aligned with lens/audience)
  headMovementLevel: 'static' | 'balanced' | 'excessive';
  framingStatus: 'centered' | 'too_low' | 'too_high' | 'off_center';
  visibleEnergy: 'calm' | 'dynamic' | 'low';
  lastCue?: string;
}

export interface DimensionScore {
  score: number; // 0-100
  evidence: string;
  benchmark: string;
}

export interface Scorecard {
  clarity: DimensionScore;
  concision: DimensionScore;
  structure: DimensionScore;
  storytelling: DimensionScore;
  engagement: DimensionScore;
  delivery: DimensionScore;
  purposefulWit: DimensionScore;
}

export interface StrengthPoint {
  title: string;
  explanation: string;
  quotedMoment: string;
  timestamp?: string;
}

export interface LeverageImprovement {
  priority: number;
  area: string;
  actionableFix: string;
  contrastExample: {
    before: string;
    after: string;
  };
}

export interface FrictionSpots {
  fillerWords: {
    totalCount: number;
    densityPer100Words: number;
    breakdown: Record<string, number>;
  };
  repeatedPhrases: string[];
  runOnSentences: string[];
  weakTransitions: string[];
  jargonTerms: string[];
  vagueClaims: string[];
  missedConclusions: string[];
}

export interface StoryMapElement {
  stage: 'hook' | 'context' | 'tension' | 'insight' | 'concrete_example' | 'takeaway';
  label: string;
  present: boolean;
  quotedText?: string;
  feedback: string;
}

export interface AudienceEngagementRisk {
  riskType: 'abstraction_overload' | 'long_setup' | 'unclear_stakes' | 'monotone_cadence' | 'sudden_stop';
  severity: 'low' | 'medium' | 'high';
  observedPattern: string;
  timestampEstimate?: string;
  mitigation: string;
}

export interface MemorableRewrite {
  strongerOpening: {
    original: string;
    recommended: string;
    technique: string;
  };
  strongerBridge: {
    original: string;
    recommended: string;
    technique: string;
  };
  vividAnalogy: {
    ideaTargeted: string;
    analogyText: string;
    whyItWorks: string;
  };
  strongerClosing: {
    original: string;
    recommended: string;
    technique: string;
  };
}

export interface LighterMomentOption {
  mechanism: 'understated_contrast' | 'self_aware_understatement' | 'surprising_comparison' | 'callback';
  explanation: string;
  suggestedMoment: string;
  suggestedLine: string;
  ruleOfThumb: string;
}

export interface ReplayTranscriptLine {
  id: string;
  speaker: 'user';
  text: string;
  timestampMs: number;
  highlightType?: 'strength' | 'filler' | 'vague' | 'run_on' | 'hook' | 'tension' | 'example' | 'closing';
  coachingNote?: string;
  alternativeSuggestion?: string;
}

export interface RetryExercise {
  focusedSkill: string;
  goal: string;
  prompt: string;
  successCondition: string;
}

export interface CoachingReport {
  id: string;
  sessionId: string;
  createdAt: string;
  scenario: PracticeScenario;
  practiceType: PracticeType;
  audience: AudienceType;
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  oneSentenceSummary: string;
  whatPeopleWillRemember: string;
  scorecard: Scorecard;
  overallScore: number;
  strengths: [StrengthPoint, StrengthPoint, StrengthPoint];
  improvements: [LeverageImprovement, LeverageImprovement, LeverageImprovement];
  frictionSpots: FrictionSpots;
  storyMap: StoryMapElement[];
  engagementRisks: AudienceEngagementRisk[];
  memorableRewrite: MemorableRewrite;
  lighterMoment: LighterMomentOption;
  replayTranscript: ReplayTranscriptLine[];
  retryExercise: RetryExercise;
  visualDeliverySignals?: ObservableVisualSignals;
}

export interface SessionConfig {
  scenario: PracticeScenario;
  practiceType: PracticeType;
  prompt?: SeededPrompt;
  customTopic?: string;
  targetDuration: TargetDuration;
  audience: AudienceType;
  coachingIntensity: CoachingIntensity;
  cameraMode: CameraMode;
  storageMode: StorageMode;
  isDemo?: boolean;
}

export interface HistoricalMetricPoint {
  date: string;
  clarity: number;
  structure: number;
  engagement: number;
  delivery: number;
  purposefulWit: number;
  overall: number;
  fillerDensity: number;
  scenario: PracticeScenario;
}

export interface HabitTrends {
  totalSessions: number;
  currentStreakDays: number;
  baselineCompleted: boolean;
  baselineConfidencePercentage: number;
  recentWins: string[];
  recurringHabitToImprove: {
    habit: string;
    description: string;
    tip: string;
  };
  nextRecommendedExercise: {
    trackTitle: string;
    durationText: string;
    title: string;
    description: string;
    promptId?: string;
  };
  scoresTimeline: HistoricalMetricPoint[];
  recentlyPracticedModes: PracticeScenario[];
}

export interface SkillExercise {
  id: string;
  level: number;
  title: string;
  durationMinutes: number;
  scenario: PracticeScenario;
  brief: string;
  challenge: string;
  completed: boolean;
}

export interface SkillTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
  completedCount: number;
  totalCount: number;
  exercises: SkillExercise[];
}
