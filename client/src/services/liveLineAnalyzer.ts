export interface AnalyzedLine {
  id: string;
  originalText: string;
  score: number; // 0-100
  statusTag: 'Crisp & Direct' | 'Strong Point' | 'Hedging' | 'Wordy / Run-on' | 'Needs Punch';
  statusColor: string; // Tailwind color class
  formattedBetter: string;
  fillersFound: string[];
  coachingTip: string;
  timestampSeconds: number;
}

export const HEDGING_PATTERNS = [
  /\b(i feel like maybe|i think that maybe|we kind of|we sort of|we were sort of|it seems like maybe|in my personal opinion|to be completely honest|what i really wanted to say is)\b/gi,
  /\b(kind of|sort of|basically|more or less|somewhat)\b/gi
];

export const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'kind of', 'sort of', 'actually', 'literally', 'i mean'
];

/**
 * Rapid client-side sentence analyzer and sharper line formatter
 * Runs with sub-20ms latency to provide immediate live feedback while speaking.
 */
export function analyzeSpokenLine(text: string, elapsedSeconds: number): AnalyzedLine {
  const trimmed = text.trim();
  const id = `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  if (!trimmed) {
    return {
      id,
      originalText: trimmed,
      score: 80,
      statusTag: 'Strong Point',
      statusColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      formattedBetter: trimmed,
      fillersFound: [],
      coachingTip: 'Keep going.',
      timestampSeconds: elapsedSeconds
    };
  }

  // 1. Detect fillers in this line
  const fillersFound: string[] = [];
  const lower = trimmed.toLowerCase();
  for (const f of FILLER_WORDS) {
    const regex = new RegExp(`\\b${f}\\b`, 'gi');
    if (regex.test(lower)) {
      fillersFound.push(f);
    }
  }

  // 2. Check hedging phrases
  let hasHedging = false;
  for (const h of HEDGING_PATTERNS) {
    if (h.test(trimmed)) {
      hasHedging = true;
      break;
    }
  }

  // 3. Check run-on structure
  const words = trimmed.split(/\s+/).filter(Boolean);
  const isRunOn = words.length >= 20 && (lower.includes(' and ') || lower.includes(' so '));
  const isTooShort = words.length < 3;

  // 4. Calculate score
  let score = 92;
  score -= fillersFound.length * 8;
  if (hasHedging) score -= 14;
  if (isRunOn) score -= 15;
  if (isTooShort) score -= 5;
  score = Math.max(50, Math.min(98, score));

  // 5. Determine status tag
  let statusTag: AnalyzedLine['statusTag'] = 'Strong Point';
  let statusColor = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
  let coachingTip = 'Clear and steady delivery.';

  if (isRunOn) {
    statusTag = 'Wordy / Run-on';
    statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    coachingTip = 'Split into two distinct sentences to let the key idea land.';
  } else if (hasHedging) {
    statusTag = 'Hedging';
    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    coachingTip = 'Drop tentative softeners; declare the fact directly.';
  } else if (score >= 88) {
    statusTag = 'Crisp & Direct';
    statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    coachingTip = 'Superb clarity and high authority.';
  } else if (score < 70) {
    statusTag = 'Needs Punch';
    statusColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    coachingTip = 'Tighten phrasing and lead with the primary result.';
  }

  // 6. Generate "Formatted Better" cleaner line
  const formattedBetter = cleanAndSharpenLine(trimmed, fillersFound, hasHedging, isRunOn);

  return {
    id,
    originalText: trimmed,
    score,
    statusTag,
    statusColor,
    formattedBetter,
    fillersFound,
    coachingTip,
    timestampSeconds: elapsedSeconds
  };
}

/**
 * Rewrites a spoken sentence into a sharper, higher-impact version
 * without altering user meaning or voice.
 */
export function cleanAndSharpenLine(
  original: string,
  fillers: string[],
  hasHedging: boolean,
  isRunOn: boolean
): string {
  let cleaned = original;

  // Strip obvious filler words cleanly
  for (const f of fillers) {
    const regex = new RegExp(`\\b${f}\\b[ ,]*`, 'gi');
    cleaned = cleaned.replace(regex, '');
  }

  // Replace common softeners with active declarations
  cleaned = cleaned
    .replace(/\b(i think that maybe we should|i feel like maybe we should)\b/gi, 'We should')
    .replace(/\b(we kind of had to|we sort of had to)\b/gi, 'We decided to')
    .replace(/\b(what i really wanted to say is that)\b/gi, 'Specifically,')
    .replace(/\b(to be completely honest,)\b/gi, '')
    .replace(/\b(in my opinion, i think)\b/gi, 'In my view,')
    .replace(/\b(is basically doing)\b/gi, 'executes')
    .replace(/\b(was kind of like)\b/gi, 'was like')
    .replace(/\b(we are hoping that)\b/gi, 'We expect')
    .replace(/\b(so yeah that is pretty much)\b/gi, 'In summary,');

  // Clean double spaces or leading commas
  cleaned = cleaned.replace(/\s{2,}/g, ' ').replace(/^[ ,]+/, '').trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    // Ensure terminal punctuation
    if (!/[.?!]$/.test(cleaned)) {
      cleaned += '.';
    }
  }

  // If run on, split on common junction points
  if (isRunOn && cleaned.includes(' and ')) {
    const parts = cleaned.split(/\b and \b/i);
    if (parts.length >= 2) {
      cleaned = `${parts[0].trim()}. ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1).trim()}`;
    }
  }

  // If no change occurred, apply an executive polish rule
  if (cleaned.toLowerCase() === original.toLowerCase().replace(/[.?!]+$/, '') + '.') {
    return `“${cleaned}”`;
  }

  return cleaned;
}
