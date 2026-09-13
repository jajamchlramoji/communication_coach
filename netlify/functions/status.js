export const handler = async () => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
  const FORCE_DEMO = process.env.DEMO_MODE === 'true';
  const isKeyConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({
      status: 'ok',
      apiConfigured: isKeyConfigured && !FORCE_DEMO,
      demoMode: FORCE_DEMO || !isKeyConfigured,
      liveModel: 'gemini-3.5-transcribe-live',
      analysisModel: 'gemini-3.6-flash',
      version: '1.0.0',
      hosting: 'netlify',
    }),
  };
};
