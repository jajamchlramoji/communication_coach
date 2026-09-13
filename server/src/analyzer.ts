import { GoogleGenAI } from '@google/genai';

export interface AnalyzeRequestPayload {
  sessionId: string;
  transcript: string;
  scenario: string;
  practiceType: string;
  audience: string;
  durationSeconds: number;
  visualDeliverySignals?: any;
}

const COACHING_SYSTEM_INSTRUCTION = `
You are the elite AI communication coach for communication_coach — a private speaking gym.
Your mission is to help the user become:
1. Clearer and more correct in everyday communication
2. Exceptionally memorable at storytelling
3. Engaging in presentations, meetings, interviews, and impromptu replies
4. Naturally witty, using lightness and timing without forced comedy or sarcasm.

Coaching persona and rules:
- Perceptive, warm, and quietly witty. High standard, candid, and constructive.
- Never sound like a generic grammar textbook. Preserve the user's authentic voice, culture, and natural speaking style.
- Prefer concrete rewrites in the user's voice to abstract advice.
- Reward a clear point, meaningful stakes, imagery, contrast, pacing, and a clean ending.
- Under "What people will remember": isolate the single most memorable line, image, contrast, or idea.
- Scorecard (0-100 scale) for: clarity, concision, structure, storytelling, engagement, delivery, purposeful wit, each with concrete evidence.
- Three strengths (quoting precise moments) and three highest-leverage improvements (with before/after contrast).
- Story map breakdown: hook, context, tension, insight, concrete_example, takeaway (indicate present: boolean, quote, feedback).
- Audience engagement analysis: highlight likely attention-drop risks from observable speaking patterns (labeled as "likely risks", not facts).
- Make it memorable rewrite: better opening, stronger bridge, vivid analogy, stronger closing.
- Lighter moment: 1-2 understated ways to release tension after a dense idea (teach the mechanism: contrast, self-aware understatement, surprising comparison, callback). Never force jokes or sarcasm.
- Replay transcript: line-by-line breakdown with alternative suggestions where applicable.
- Immediate retry exercise focused on exactly one skill.

Output MUST be strictly valid JSON matching the requested CoachingReport schema.
`;

export async function generateCoachingReport(
  payload: AnalyzeRequestPayload,
  apiKey?: string
): Promise<any> {
  const { sessionId, transcript, scenario, practiceType, audience, durationSeconds, visualDeliverySignals } = payload;

  if (!apiKey) {
    throw new Error('No API key provided');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Analyze this speaking session:
Scenario: ${scenario}
Practice Type: ${practiceType}
Target Audience: ${audience}
Duration: ${durationSeconds} seconds
Observable Visual Signals: ${JSON.stringify(visualDeliverySignals || {})}

Transcript:
"""
${transcript}
"""

Return a JSON object with this exact structure:
{
  "id": "report-${sessionId}",
  "sessionId": "${sessionId}",
  "createdAt": "${new Date().toISOString()}",
  "scenario": "${scenario}",
  "practiceType": "${practiceType}",
  "audience": "${audience}",
  "durationSeconds": ${durationSeconds},
  "wordCount": ${transcript.split(/\s+/).filter(Boolean).length},
  "wordsPerMinute": ${Math.round((transcript.split(/\s+/).filter(Boolean).length / Math.max(1, durationSeconds)) * 60)},
  "oneSentenceSummary": "...",
  "whatPeopleWillRemember": "...",
  "overallScore": 85,
  "scorecard": {
    "clarity": { "score": 88, "evidence": "...", "benchmark": "..." },
    "concision": { "score": 82, "evidence": "...", "benchmark": "..." },
    "structure": { "score": 90, "evidence": "...", "benchmark": "..." },
    "storytelling": { "score": 84, "evidence": "...", "benchmark": "..." },
    "engagement": { "score": 86, "evidence": "...", "benchmark": "..." },
    "delivery": { "score": 85, "evidence": "...", "benchmark": "..." },
    "purposefulWit": { "score": 82, "evidence": "...", "benchmark": "..." }
  },
  "strengths": [
    { "title": "...", "explanation": "...", "quotedMoment": "...", "timestamp": "0:15" },
    { "title": "...", "explanation": "...", "quotedMoment": "...", "timestamp": "0:45" },
    { "title": "...", "explanation": "...", "quotedMoment": "...", "timestamp": "1:10" }
  ],
  "improvements": [
    {
      "priority": 1,
      "area": "...",
      "actionableFix": "...",
      "contrastExample": { "before": "...", "after": "..." }
    },
    {
      "priority": 2,
      "area": "...",
      "actionableFix": "...",
      "contrastExample": { "before": "...", "after": "..." }
    },
    {
      "priority": 3,
      "area": "...",
      "actionableFix": "...",
      "contrastExample": { "before": "...", "after": "..." }
    }
  ],
  "frictionSpots": {
    "fillerWords": {
      "totalCount": 4,
      "densityPer100Words": 1.5,
      "breakdown": { "basically": 2, "um": 2 }
    },
    "repeatedPhrases": ["..."],
    "runOnSentences": ["..."],
    "weakTransitions": ["..."],
    "jargonTerms": ["..."],
    "vagueClaims": ["..."],
    "missedConclusions": ["..."]
  },
  "storyMap": [
    { "stage": "hook", "label": "Hook", "present": true, "quotedText": "...", "feedback": "..." },
    { "stage": "context", "label": "Context", "present": true, "quotedText": "...", "feedback": "..." },
    { "stage": "tension", "label": "Tension / Problem", "present": true, "quotedText": "...", "feedback": "..." },
    { "stage": "insight", "label": "Insight / Turn", "present": true, "quotedText": "...", "feedback": "..." },
    { "stage": "concrete_example", "label": "Concrete Example", "present": true, "quotedText": "...", "feedback": "..." },
    { "stage": "takeaway", "label": "Takeaway / Action", "present": true, "quotedText": "...", "feedback": "..." }
  ],
  "engagementRisks": [
    {
      "riskType": "abstraction_overload",
      "severity": "medium",
      "observedPattern": "...",
      "timestampEstimate": "0:40",
      "mitigation": "..."
    }
  ],
  "memorableRewrite": {
    "strongerOpening": { "original": "...", "recommended": "...", "technique": "..." },
    "strongerBridge": { "original": "...", "recommended": "...", "technique": "..." },
    "vividAnalogy": { "ideaTargeted": "...", "analogyText": "...", "whyItWorks": "..." },
    "strongerClosing": { "original": "...", "recommended": "...", "technique": "..." }
  },
  "lighterMoment": {
    "mechanism": "understated_contrast",
    "explanation": "...",
    "suggestedMoment": "...",
    "suggestedLine": "...",
    "ruleOfThumb": "..."
  },
  "replayTranscript": [
    {
      "id": "t-1",
      "speaker": "user",
      "text": "...",
      "timestampMs": 0,
      "highlightType": "hook",
      "coachingNote": "...",
      "alternativeSuggestion": "..."
    }
  ],
  "retryExercise": {
    "focusedSkill": "...",
    "goal": "...",
    "prompt": "...",
    "successCondition": "..."
  },
  "visualDeliverySignals": ${JSON.stringify(visualDeliverySignals || null)}
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: COACHING_SYSTEM_INSTRUCTION },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json'
    }
  });

  const responseText = response.text?.trim();
  if (!responseText) {
    throw new Error('Empty response received from Gemini model');
  }

  return JSON.parse(responseText);
}
