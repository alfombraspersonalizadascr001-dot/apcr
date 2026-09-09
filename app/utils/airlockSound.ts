// Web Audio API procedural synthesis & music controller with proximity ducking & button stop
// Zero latency, works offline and across devices

class AirlockSoundController {
  private ctx: AudioContext | null = null;
  private musicAudio: HTMLAudioElement | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;
  private isMusicPlaying = false;
  private baseVolume = 0.7;
  private currentVolume = 0.7;
  private targetVolume = 0.7;
  private isMuted = false;
  private animFrameId: number | null = null;
  private startPlaybackListener: (() => void) | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Initialize background music (the user's uploaded track)
  initMusic(audioUrl = '/music.mp3') {
    if (typeof window === 'undefined') return;

    if (!this.musicAudio) {
      this.musicAudio = new Audio(audioUrl);
      this.musicAudio.loop = true;
      this.musicAudio.volume = this.baseVolume;
    }

    if (!this.startPlaybackListener && !this.isMusicPlaying) {
      this.startPlaybackListener = () => {
        if (!this.musicAudio || this.isMusicPlaying) return;
        this.musicAudio.play().then(() => {
          this.isMusicPlaying = true;
        }).catch(() => {
          this.startSyntheticAmbient();
        });
        if (this.startPlaybackListener) {
          window.removeEventListener('click', this.startPlaybackListener);
          window.removeEventListener('touchstart', this.startPlaybackListener);
          this.startPlaybackListener = null;
        }
      };

      window.addEventListener('click', this.startPlaybackListener, { once: true });
      window.addEventListener('touchstart', this.startPlaybackListener, { once: true });
    }

    this.startVolumeLoop();
  }

  // Start / Resume music playback
  playMusic() {
    if (this.musicAudio) {
      this.targetVolume = this.baseVolume;
      this.musicAudio.play().then(() => {
        this.isMusicPlaying = true;
      }).catch(() => {});
    }
  }

  // STOP MUSIC IMMEDIATELY WHEN ENTERING OTHER PAGES OR PRESSING BUTTONS
  stopMusic() {
    this.targetVolume = 0;
    this.currentVolume = 0;
    if (this.startPlaybackListener) {
      window.removeEventListener('click', this.startPlaybackListener);
      window.removeEventListener('touchstart', this.startPlaybackListener);
      this.startPlaybackListener = null;
    }
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    this.isMusicPlaying = false;
  }

  // Procedural sci-fi ambient drone fallback
  private startSyntheticAmbient() {
    try {
      const ctx = this.initCtx();
      if (!ctx || this.ambientGain) return;

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.baseVolume * 0.15, ctx.currentTime);
      this.ambientGain.connect(ctx.destination);

      const freqs = [65.41, 98.00, 130.81, 155.56, 196.00];
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(this.ambientGain!);
        osc.start();
        this.ambientOscs.push(osc);
      });

      this.isMusicPlaying = true;
    } catch {
      // AudioContext fallback
    }
  }

  // Smooth lerp loop for proximity ducking
  private startVolumeLoop() {
    if (this.animFrameId) return;

    const step = () => {
      this.currentVolume += (this.targetVolume - this.currentVolume) * 0.18;
      const effectiveVol = this.isMuted ? 0 : Math.max(0, Math.min(1, this.currentVolume));

      if (this.musicAudio && !this.musicAudio.paused) {
        this.musicAudio.volume = effectiveVol;
      }
      if (this.ambientGain && this.ctx && this.isMusicPlaying) {
        this.ambientGain.gain.setValueAtTime(effectiveVol * 0.15, this.ctx.currentTime);
      }

      this.animFrameId = requestAnimationFrame(step);
    };

    step();
  }

  // Update proximity to button: distance in pixels (50px ~ 1.2 cm)
  // When cursor/finger is within ~1cm of either arcade button, duck volume smoothly
  updateProximity(distancePx: number) {
    if (!this.isMusicPlaying) return;

    const DUCK_THRESHOLD_PX = 50; // ~ 1.2 cm

    if (distancePx >= DUCK_THRESHOLD_PX) {
      this.targetVolume = this.baseVolume;
    } else {
      const factor = Math.max(0, distancePx / DUCK_THRESHOLD_PX);
      this.targetVolume = this.baseVolume * (0.08 + 0.92 * factor);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  // Tactile arcade joystick click / microswitch snap
  playJoystickClick() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext fallback
    }
  }

  // CRT Screen Power-on high-voltage whine and phosphor bloom sweep
  playCrtPowerOn() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. High-frequency flyback transformer resonance
      const flyback = ctx.createOscillator();
      const flybackGain = ctx.createGain();
      flyback.type = 'sine';
      flyback.frequency.setValueAtTime(11000, now);
      flyback.frequency.linearRampToValueAtTime(15500, now + 0.25);

      flybackGain.gain.setValueAtTime(0.05, now);
      flybackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      flyback.connect(flybackGain);
      flybackGain.connect(ctx.destination);
      flyback.start(now);
      flyback.stop(now + 0.5);

      // 2. Phosphor cathode charging sweep
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = 'sine';
      sweep.frequency.setValueAtTime(120, now);
      sweep.frequency.exponentialRampToValueAtTime(580, now + 0.2);

      sweepGain.gain.setValueAtTime(0.2, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      sweep.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweep.start(now);
      sweep.stop(now + 0.3);
    } catch {
      // AudioContext fallback
    }
  }

  // Tactile arcade push button microswitch click
  playArcadeButtonPress() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.07);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // AudioContext fallback
    }
  }

  // Pneumatic decompression hiss + hydraulic mechanical blast door slide
  playAirlockOpen(isSoftware: boolean) {
    try {
      // Stop music immediately when button is clicked!
      this.stopMusic();

      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Noise buffer for pneumatic air release (psshhh-t)
      const bufferSize = Math.floor(ctx.sampleRate * 0.75);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.28));
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.7);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now);

      // Low mechanical motorized drone
      const motor = ctx.createOscillator();
      const motorGain = ctx.createGain();
      motor.type = 'sawtooth';
      motor.frequency.setValueAtTime(105, now);
      motor.frequency.linearRampToValueAtTime(70, now + 1.1);

      const motorFilter = ctx.createBiquadFilter();
      motorFilter.type = 'lowpass';
      motorFilter.frequency.setValueAtTime(220, now);

      motorGain.gain.setValueAtTime(0.14, now);
      motorGain.gain.linearRampToValueAtTime(0.09, now + 0.8);
      motorGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      motor.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(ctx.destination);

      motor.start(now);
      motor.stop(now + 1.1);

      // Digital energy harmonic if Software world
      if (isSoftware) {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(440, now);
        chime.frequency.exponentialRampToValueAtTime(880, now + 0.4);

        chimeGain.gain.setValueAtTime(0.18, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);

        chime.start(now);
        chime.stop(now + 0.8);
      }
    } catch {
      // AudioContext fallback
    }
  }

  // Hydraulic airlock close sound (restarts music when returning to portal)
  playAirlockClose() {
    try {
      const ctx = this.initCtx();
      if (ctx) {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      }

      this.playMusic();
    } catch {
      // AudioContext fallback
    }
  }
}

export const airlockAudio = new AirlockSoundController();
