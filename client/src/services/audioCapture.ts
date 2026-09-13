export interface AudioCaptureCallbacks {
  onPcmChunk?: (base64Chunk: string) => void;
  onEnergyLevel?: (energy: number) => void; // 0 to 1
  onSilenceState?: (isSilent: boolean) => void;
  onError?: (err: Error) => void;
}

export class AudioCaptureService {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isCapturing = false;
  private silentFramesCount = 0;
  private isCurrentlySilent = false;

  async startCapture(
    callbacks: AudioCaptureCallbacks,
    recordFullAudio = false
  ): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      // Initialize AudioContext
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 16000 });
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // We use ScriptProcessorNode (bufferSize 2048 or 4096) for streaming raw 16kHz PCM
      const bufferSize = 4096;
      this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

      this.processorNode.onaudioprocess = (e) => {
        if (!this.isCapturing) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Compute RMS energy
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const normalizedEnergy = Math.min(1, rms * 5); // Scale for responsive visualizer
        callbacks.onEnergyLevel?.(normalizedEnergy);

        // Silence / pause detection for thought boundary
        if (normalizedEnergy < 0.05) {
          this.silentFramesCount++;
          if (this.silentFramesCount > 4 && !this.isCurrentlySilent) {
            this.isCurrentlySilent = true;
            callbacks.onSilenceState?.(true);
          }
        } else {
          this.silentFramesCount = 0;
          if (this.isCurrentlySilent) {
            this.isCurrentlySilent = false;
            callbacks.onSilenceState?.(false);
          }
        }

        // Convert Float32Array to 16-bit PCM (little-endian)
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert to Base64
        const uint8Array = new Uint8Array(pcm16.buffer);
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64Chunk = btoa(binary);

        callbacks.onPcmChunk?.(base64Chunk);
      };

      source.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      // Optional full local recording (mode 3)
      if (recordFullAudio) {
        this.recordedChunks = [];
        try {
          const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : 'audio/webm';
          this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: mime });
          this.mediaRecorder.ondataavailable = (evt) => {
            if (evt.data && evt.data.size > 0) {
              this.recordedChunks.push(evt.data);
            }
          };
          this.mediaRecorder.start(500);
        } catch (e) {
          console.warn('MediaRecorder error, continuing without audio persistence:', e);
        }
      }

      this.isCapturing = true;
    } catch (err: any) {
      this.stopCapture();
      callbacks.onError?.(err);
      throw err;
    }
  }

  stopCapture(): Blob | undefined {
    this.isCapturing = false;

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      const recordedBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      this.recordedChunks = [];
      return recordedBlob;
    }

    return undefined;
  }
}
