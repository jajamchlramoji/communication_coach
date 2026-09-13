export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    if (!payload.transcript || !payload.scenario) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required session parameters' }),
      };
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    const FORCE_DEMO = process.env.DEMO_MODE === 'true';
    const isKeyConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');

    if (isKeyConfigured && !FORCE_DEMO && !payload.isDemo) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const prompt = `
You are the elite, empathetic, and rigorous speech coach for "communication_coach", an AI communication gym.
Analyze the following presentation transcript and delivery parameters:
Session Scenario: ${payload.scenario}
Practice Type: ${payload.practiceType}
Target Audience: ${payload.audience}
Duration: ${payload.durationSeconds} seconds
Transcript:
"""
${payload.transcript}
"""

Deliver a structured post-session debrief JSON with:
{
  "summary": "2 sentence executive debrief",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "scores": {
    "clarity": 85,
    "memorability": 80,
    "witAndLightness": 75,
    "executivePresence": 82,
    "conciseness": 88
  },
  "fillerWordCount": 3,
  "hedgingPhrases": ["I think", "kind of"],
  "storyMap": [
    { "phase": "Hook", "text": "Opening statement", "score": 85, "recommendation": "Great energy" }
  ],
  "rewrites": [
    { "original": "Original sentence", "improved": "Polished memorable version", "rationale": "More authoritative" }
  ],
  "microDrill": {
    "title": "30-Second Punchy Hook Drill",
    "prompt": "Deliver your opening statement again without hedging.",
    "targetSkill": "Directness"
  }
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { responseMimeType: 'application/json' },
        });

        const text = response.text?.trim();
        if (text) {
          const report = JSON.parse(text);
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ source: 'gemini-3.6-flash', report }),
          };
        }
      } catch (geminiError) {
        console.warn('Gemini report generation error:', geminiError?.message);
      }
    }

    // Local fallback mode
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        source: 'local-engine',
        fallbackReason: FORCE_DEMO ? 'demo_mode_active' : 'offline_or_simulation',
        report: null,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message || 'Analysis failure' }),
    };
  }
};
