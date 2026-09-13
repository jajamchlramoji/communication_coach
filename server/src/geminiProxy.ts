import { WebSocket } from 'ws';

export class GeminiLiveSession {
  private clientWs: WebSocket;
  private upstreamWs: WebSocket | null = null;
  private apiKey: string;
  private isConnected = false;
  private isClosed = false;

  constructor(clientWs: WebSocket, apiKey: string) {
    this.clientWs = clientWs;
    this.apiKey = apiKey;
  }

  async start() {
    try {
      const upstreamUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
      
      this.upstreamWs = new WebSocket(upstreamUrl);

      this.upstreamWs.on('open', () => {
        this.isConnected = true;
        // Send initial setup message for gemini-3.5-transcribe-live
        const setupMessage = {
          setup: {
            model: 'models/gemini-3.5-transcribe-live',
            generationConfig: {
              responseModalities: ['TEXT'],
            },
            inputAudioTranscription: {
              languageCodes: ['en-US'],
            },
          },
        };
        this.upstreamWs?.send(JSON.stringify(setupMessage));
        
        this.clientWs.send(JSON.stringify({
          type: 'live_status',
          status: 'connected',
          model: 'gemini-3.5-transcribe-live'
        }));
      });

      this.upstreamWs.on('message', async (data) => {
        try {
          let text = '';
          if (typeof data === 'string') {
            text = data;
          } else if (Buffer.isBuffer(data)) {
            text = data.toString('utf8');
          } else if ((data as any).text) {
            text = await (data as any).text();
          }

          const parsed = JSON.parse(text);

          if (parsed.serverContent) {
            const sc = parsed.serverContent;
            const interim = sc.interimInputTranscription?.text;
            const finalTranscript = sc.inputTranscription?.text;

            if (interim || finalTranscript) {
              this.clientWs.send(JSON.stringify({
                type: 'transcription',
                interim: interim || null,
                final: finalTranscript || null,
                timestampMs: Date.now()
              }));
            }
          }
        } catch (err) {
          console.warn('Error parsing upstream Live API message:', err);
        }
      });

      this.upstreamWs.on('error', (err) => {
        console.error('Upstream Gemini Live WebSocket error:', err.message);
        this.clientWs.send(JSON.stringify({
          type: 'live_status',
          status: 'error',
          message: err.message
        }));
      });

      this.upstreamWs.on('close', (code, reason) => {
        this.isConnected = false;
        if (!this.isClosed) {
          this.clientWs.send(JSON.stringify({
            type: 'live_status',
            status: 'closed',
            code,
            reason: reason?.toString()
          }));
        }
      });
    } catch (err: any) {
      console.error('Failed to initialize upstream session:', err);
      this.clientWs.send(JSON.stringify({
        type: 'live_status',
        status: 'error',
        message: err.message
      }));
    }
  }

  handleClientAudio(base64PcmChunk: string) {
    if (!this.upstreamWs || this.upstreamWs.readyState !== WebSocket.OPEN) {
      return;
    }

    const payload = {
      realtimeInput: {
        audio: {
          data: base64PcmChunk,
          mimeType: 'audio/pcm;rate=16000'
        }
      }
    };
    this.upstreamWs.send(JSON.stringify(payload));
  }

  handleAudioStreamEnd() {
    if (!this.upstreamWs || this.upstreamWs.readyState !== WebSocket.OPEN) {
      return;
    }
    const payload = {
      realtimeInput: {
        audioStreamEnd: true
      }
    };
    this.upstreamWs.send(JSON.stringify(payload));
  }

  close() {
    this.isClosed = true;
    if (this.upstreamWs) {
      try {
        if (this.upstreamWs.readyState === WebSocket.OPEN) {
          this.upstreamWs.close();
        }
      } catch {}
      this.upstreamWs = null;
    }
  }
}
