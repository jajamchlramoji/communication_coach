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
    const { lineText, scenario = 'meeting', audience = 'leadership' } = JSON.parse(event.body || '{}');
    if (!lineText || typeof lineText !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing lineText parameter' }),
      };
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    const FORCE_DEMO = process.env.DEMO_MODE === 'true';
    const isKeyConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');

    if (isKeyConfigured && !FORCE_DEMO) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const prompt = `
You are the speaking coach for Recall. Analyze this single spoken sentence from a ${scenario} presentation for a ${audience} audience:
"""
${lineText}
"""
Provide an immediate executive polish rewrite in the speaker's own authentic voice. Remove filler words and tentative hedging.
Output JSON only with this structure:
{
  "score": 88,
  "status": "Crisp & Direct" | "Strong Point" | "Hedging" | "Wordy / Run-on" | "Needs Punch",
  "formattedBetter": "Sharper, more impactful rewrite here",
  "coachingTip": "One concise sentence tip"
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { responseMimeType: 'application/json' },
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ source: 'gemini-3.6-flash', ...parsed }),
          };
        }
      } catch (geminiErr) {
        console.warn('Gemini line analysis fallback:', geminiErr?.message);
      }
    }

    // Fallback: indicate client to use fast local heuristic
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ source: 'local' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};
