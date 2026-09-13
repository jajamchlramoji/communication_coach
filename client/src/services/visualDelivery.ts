import { ObservableVisualSignals } from '../types';

export class VisualDeliveryAnalyzer {
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private lastImageData: ImageData | null = null;
  private stream: MediaStream | null = null;

  // Running tracking metrics
  private totalFramesAnalyzed = 0;
  private alignedGazeFrames = 0;
  private movementDeltas: number[] = [];
  private currentFraming: 'centered' | 'too_low' | 'too_high' | 'off_center' = 'centered';
  private currentEnergy: 'calm' | 'dynamic' | 'low' = 'calm';

  async start(videoElement: HTMLVideoElement): Promise<MediaStream> {
    this.videoElement = videoElement;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 160; // Lightweight resolution for fast local canvas analysis
    this.canvas.height = 120;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });

    this.videoElement.srcObject = this.stream;
    await this.videoElement.play();

    this.startLoop();
    return this.stream;
  }

  private startLoop() {
    let lastTime = performance.now();

    const loop = (now: number) => {
      // Analyze roughly 5 times per second to keep CPU usage negligible
      if (now - lastTime > 200) {
        lastTime = now;
        this.analyzeFrame();
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private analyzeFrame() {
    if (!this.videoElement || !this.canvas || !this.ctx) return;
    if (this.videoElement.readyState < 2) return;

    this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
    const frame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = frame.data;

    // 1. Observable Motion Delta (Head / Gesture Movement)
    if (this.lastImageData) {
      let diff = 0;
      const last = this.lastImageData.data;
      const step = 4; // Sample every 4th pixel for speed
      for (let i = 0; i < data.length; i += step * 4) {
        const delta = Math.abs(data[i] - last[i]) + Math.abs(data[i + 1] - last[i + 1]);
        diff += delta;
      }
      const avgMotion = diff / (data.length / (step * 4));
      this.movementDeltas.push(avgMotion);
      if (this.movementDeltas.length > 50) this.movementDeltas.shift();

      if (avgMotion > 18) {
        this.currentEnergy = 'dynamic';
      } else if (avgMotion < 3) {
        this.currentEnergy = 'low';
      } else {
        this.currentEnergy = 'calm';
      }
    }
    this.lastImageData = frame;

    // 2. Observable Framing & Center of Gravity
    // Calculate brightness center of mass (user's head/face is typically brighter/different from background)
    let totalMass = 0;
    let sumX = 0;
    let sumY = 0;

    for (let y = 0; y < this.canvas.height; y += 4) {
      for (let x = 0; x < this.canvas.width; x += 4) {
        const idx = (y * this.canvas.width + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        totalMass += brightness;
        sumX += x * brightness;
        sumY += y * brightness;
      }
    }

    if (totalMass > 0) {
      const centerX = sumX / totalMass;
      const centerY = sumY / totalMass;
      const targetX = this.canvas.width / 2;
      const targetY = this.canvas.height * 0.45; // slightly above vertical center

      const devX = Math.abs(centerX - targetX) / targetX;
      const devY = (centerY - targetY) / targetY;

      if (devX > 0.28) {
        this.currentFraming = 'off_center';
      } else if (devY > 0.35) {
        this.currentFraming = 'too_low';
      } else if (devY < -0.35) {
        this.currentFraming = 'too_high';
      } else {
        this.currentFraming = 'centered';
      }

      // 3. Gaze direction alignment approximation (centered head facing lens)
      this.totalFramesAnalyzed++;
      if (devX < 0.2 && Math.abs(devY) < 0.25) {
        this.alignedGazeFrames++;
      }
    }
  }

  getSignals(): ObservableVisualSignals {
    const gazeScore = this.totalFramesAnalyzed > 0
      ? Math.round((this.alignedGazeFrames / this.totalFramesAnalyzed) * 100)
      : 85;

    const avgMotion = this.movementDeltas.length > 0
      ? this.movementDeltas.reduce((a, b) => a + b, 0) / this.movementDeltas.length
      : 8;

    let headMovement: 'static' | 'balanced' | 'excessive' = 'balanced';
    if (avgMotion < 3) headMovement = 'static';
    else if (avgMotion > 20) headMovement = 'excessive';

    let lastCue = 'Framing is balanced and centered.';
    if (this.currentFraming === 'too_low') lastCue = 'Subject is framed low in screen. Adjust camera angle up.';
    else if (this.currentFraming === 'off_center') lastCue = 'Subject is shifted to the side of the frame.';
    else if (headMovement === 'static') lastCue = 'Posture is static. Allow natural breathing gestures.';
    else if (headMovement === 'excessive') lastCue = 'Rapid head movement detected. Settle your base.';
    else if (gazeScore > 80) lastCue = 'Strong camera eye contact maintained.';

    return {
      gazeAlignmentScore: gazeScore,
      headMovementLevel: headMovement,
      framingStatus: this.currentFraming,
      visibleEnergy: this.currentEnergy,
      lastCue
    };
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }
}
