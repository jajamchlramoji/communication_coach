import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GeminiLiveSession } from './geminiProxy.js';
import { generateCoachingReport } from './analyzer.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to server root .env

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/live' });

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const FORCE_DEMO = process.env.DEMO_MODE === 'true';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health and configuration status
app.get('/api/status', (req, res) => {
  const isKeyConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({
    status: 'ok',
    apiConfigured: isKeyConfigured && !FORCE_DEMO,
    demoMode: FORCE_DEMO || !isKeyConfigured,
    liveModel: 'gemini-3.5-transcribe-live',
    analysisModel: 'gemini-3.6-flash',
    version: '1.0.0'
  });
});

// Post-session structured report generation
app.post('/api/analyze', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.transcript || !payload.scenario) {
      return res.status(400).json({ error: 'Missing required session parameters' });
    }

    const isKeyConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');
    
    if (isKeyConfigured && !FORCE_DEMO && !payload.isDemo) {
      try {
        const report = await generateCoachingReport(payload, GEMINI_API_KEY);
        return res.json({ source: 'gemini-3.6-flash', report });
      } catch (geminiError: any) {
        console.warn('Gemini report generation error, falling back to local engine:', geminiError.message);
        // Fall back gracefully below
      }
    }

    // Local deterministic fallback / demo mode
    return res.json({
      source: 'local-engine',
      fallbackReason: FORCE_DEMO ? 'demo_mode_active' : 'offline_or_simulation',
      report: null // frontend will synthesize with analyzerUtils or client already has fallback
    });
  } catch (err: any) {
    console.error('API /api/analyze error:', err);
    res.status(500).json({ error: err.message || 'Analysis failure' });
  }
});

// Rapid live line-by-line rewrite and scoring endpoint
app.post('/api/analyze-line', async (req, res) => {
  try {
    const { lineText, scenario = 'meeting', audience = 'leadership' } = req.body;
    if (!lineText || typeof lineText !== 'string') {
      return res.status(400).json({ error: 'Missing lineText parameter' });
    }

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
          config: { responseMimeType: 'application/json' }
        });
        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ source: 'gemini-3.6-flash', ...parsed });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini line analysis fallback:', geminiErr.message);
      }
    }

    // Fallback: indicate client to use fast local heuristic
    return res.json({ source: 'local' });
  } catch (err: any) {
    console.error('API /api/analyze-line error:', err);
    res.status(500).json({ error: err.message });
  }
});

// WebSocket Server for live audio streaming
wss.on('connection', (ws: WebSocket, req) => {
  const isKeyConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');

  if (!isKeyConfigured || FORCE_DEMO) {
    // Send demo notice over WS
    ws.send(JSON.stringify({
      type: 'live_status',
      status: 'demo_mode',
      message: 'Running in private demo mode with local transcription simulation.'
    }));

    ws.on('message', (messageData) => {
      try {
        const parsed = JSON.parse(messageData.toString());
        if (parsed.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch {}
    });
    return;
  }

  // Create live upstream session
  const liveSession = new GeminiLiveSession(ws, GEMINI_API_KEY);
  liveSession.start();

  ws.on('message', (messageData) => {
    try {
      const parsed = JSON.parse(messageData.toString());
      if (parsed.type === 'audio' && parsed.data) {
        liveSession.handleClientAudio(parsed.data);
      } else if (parsed.type === 'audio_stream_end') {
        liveSession.handleAudioStreamEnd();
      }
    } catch (err) {
      console.warn('Malformed client WS message:', err);
    }
  });

  ws.on('close', () => {
    liveSession.close();
  });

  ws.on('error', (err) => {
    console.error('Client WS socket error:', err);
    liveSession.close();
  });
});

server.listen(PORT, () => {
  console.log(`Recall server listening on http://localhost:${PORT}`);
  console.log(`WebSocket proxy available at ws://localhost:${PORT}/ws/live`);
  console.log(`Gemini status: ${GEMINI_API_KEY ? 'API key loaded (proxy active)' : 'Demo mode (no key provided)'}`);
});
