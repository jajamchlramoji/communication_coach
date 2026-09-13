import { CoachingIntensity, LiveCue, PracticeScenario } from '../types';

export interface CueGovernorState {
  scenario: PracticeScenario;
  intensity: CoachingIntensity;
  elapsedSeconds: number;
  targetDurationSeconds: number;
  totalWordCount: number;
  recentWordsCount: number; // words since last pause
  isSilent: boolean;
  silenceDurationMs: number;
  fullTranscript: string;
}

export class LiveCueEngine {
  private lastCueTimeMs = 0;
  private readonly minIntervalMs = 15000; // Minimum 15 seconds between cues
  private cueHistory: LiveCue[] = [];
  private currentActiveCue: LiveCue | null = null;
  private cueClearTimer: any = null;

  reset() {
    this.lastCueTimeMs = 0;
    this.cueHistory = [];
    this.currentActiveCue = null;
    if (this.cueClearTimer) clearTimeout(this.cueClearTimer);
  }

  evaluateCue(state: CueGovernorState, onCue: (cue: LiveCue | null) => void) {
    // If silent observer, never emit live cues
    if (state.intensity === 'silent_observer') {
      return;
    }

    const now = Date.now();
    // Enforce cooldown
    if (now - this.lastCueTimeMs < this.minIntervalMs) {
      return;
    }

    // Do NOT interrupt mid-sentence!
    // We only evaluate cues at a natural thought boundary or silence > 800ms,
    // OR if the speaker has been talking continuously for 30s without a breath.
    const isAtThoughtBoundary = state.isSilent && state.silenceDurationMs > 800;
    const isRamblingWithoutPause = !state.isSilent && state.recentWordsCount > 65;

    if (!isAtThoughtBoundary && !isRamblingWithoutPause) {
      return;
    }

    let candidateCueText: string | null = null;
    let category: LiveCue['category'] = 'content';
    let reason = '';

    const remainingTime = state.targetDurationSeconds - state.elapsedSeconds;
    const transcriptLower = state.fullTranscript.toLowerCase();

    // 1. Time boundary / Landing the conclusion
    if (remainingTime <= 20 && remainingTime > 3) {
      candidateCueText = 'Land the point.';
      category = 'structure';
      reason = 'Target duration approaching; conclude on a decisive takeaway.';
    }
    // 2. Continuous speaking without breathing room
    else if (isRamblingWithoutPause) {
      candidateCueText = 'Pause — let that idea breathe.';
      category = 'pace';
      reason = '65+ words spoken without a breath or pause.';
    }
    // 3. Early setup stage (first 25-45s) without tension or stakes
    else if (state.elapsedSeconds > 25 && state.elapsedSeconds < 55 && !this.hasIntroducedTension(transcriptLower)) {
      candidateCueText = 'Name the tension.';
      category = 'structure';
      reason = 'Setup is moving forward; anchor what is at stake.';
    }
    // 4. Middle stage (45-90s) without concrete examples
    else if (state.elapsedSeconds > 45 && !this.hasConcreteExample(transcriptLower)) {
      candidateCueText = 'Add one concrete example.';
      category = 'content';
      reason = 'Abstract claims need a tangible metric, customer, or moment.';
    }
    // 5. Dense explanations that need connective rationale
    else if (state.elapsedSeconds > 60 && this.isDenseWithoutWhy(transcriptLower)) {
      candidateCueText = 'Give them the why.';
      category = 'content';
      reason = 'Shift from describing mechanics to explaining the purpose.';
    }
    // 6. Dense technical block that could benefit from levity
    else if (state.elapsedSeconds > 80 && state.scenario !== 'interview' && !this.hasLightMoment(this.cueHistory)) {
      candidateCueText = 'Try a lighter bridge.';
      category = 'wit';
      reason = 'Release tension before the closing segment.';
    }

    // If candidate found and not immediately repeated
    if (candidateCueText && (!this.currentActiveCue || this.currentActiveCue.text !== candidateCueText)) {
      const newCue: LiveCue = {
        id: `cue-${Date.now()}`,
        text: candidateCueText,
        category,
        timestampMs: state.elapsedSeconds * 1000,
        reason
      };

      this.currentActiveCue = newCue;
      this.cueHistory.push(newCue);
      this.lastCueTimeMs = now;

      onCue(newCue);

      // Automatically fade out cue after 8 seconds
      if (this.cueClearTimer) clearTimeout(this.cueClearTimer);
      this.cueClearTimer = setTimeout(() => {
        this.currentActiveCue = null;
        onCue(null);
      }, 8000);
    }
  }

  private hasIntroducedTension(text: string): boolean {
    const tensionKeywords = [
      'problem', 'challenge', 'issue', 'risk', 'fail', 'broken', 'bottleneck',
      'ceiling', 'disagree', 'friction', 'frozen', 'slip', 'missed', 'crisis', 'tension'
    ];
    return tensionKeywords.some(k => text.includes(k));
  }

  private hasConcreteExample(text: string): boolean {
    const exampleClues = [
      'for example', 'for instance', 'specifically', 'such as', 'customer',
      'percent', '%', 'dollar', '$', 'minutes', 'seconds', 'hours', 'acme', 'stripe', 'jenkins'
    ];
    // Also check for numbers like 14, 400, 2024
    const hasNumbers = /\b\d+\b/.test(text);
    return hasNumbers || exampleClues.some(c => text.includes(c));
  }

  private isDenseWithoutWhy(text: string): boolean {
    const whyWords = ['because', 'so that', 'the reason', 'in order to', 'why this matters', 'unlock'];
    return !whyWords.some(w => text.includes(w));
  }

  private hasLightMoment(history: LiveCue[]): boolean {
    return history.some(c => c.category === 'wit');
  }
}
