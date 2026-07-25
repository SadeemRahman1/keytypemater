import { AudioTheme } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playKeySound(theme: AudioTheme, volume: number = 0.5, isSpace: boolean = false, isError: boolean = false) {
    if (theme === 'silent' || volume <= 0) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (isError) {
        // Error sound: short low muted buzz
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

        gain.gain.setValueAtTime(0.3 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
        return;
      }

      switch (theme) {
        case 'thock': {
          // Creamy mechanical thock pop sound
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const baseFreq = isSpace ? 180 : 260 + (Math.random() * 20 - 10);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

          gain.gain.setValueAtTime(0.7 * volume, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);

          // Plastic keycap housing snap
          try {
            const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.025), this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseBuffer.length; i++) {
              output[i] = Math.random() * 2 - 1;
            }
            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(isSpace ? 700 : 1200, now);
            filter.Q.setValueAtTime(2.5, now);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.3 * volume, now);
            noiseGain.gain.linearRampToValueAtTime(0.001, now + 0.025);

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);

            whiteNoise.start(now);
            whiteNoise.stop(now + 0.025);
          } catch (e) {
            // Noise fallback
          }
          break;
        }

        case 'clack': {
          // Sharp high click: high sine drop + noise snap
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const freq = isSpace ? 800 : 1200 + (Math.random() * 200 - 100);

          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

          gain.gain.setValueAtTime(0.25 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.035);
          break;
        }

        case 'typewriter': {
          // Metallic mechanical typewriter sound
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(isSpace ? 400 : 900, now);
          osc1.frequency.exponentialRampToValueAtTime(100, now + 0.05);

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(isSpace ? 1200 : 2200, now);

          gain.gain.setValueAtTime(0.3 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.05);
          osc2.stop(now + 0.05);
          break;
        }

        case 'bubble': {
          // Soft bubble pop sound
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startFreq = isSpace ? 350 : 600 + (Math.random() * 100 - 50);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(startFreq, now);
          osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, now + 0.03);
          osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, now + 0.06);

          gain.gain.setValueAtTime(0.5 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        case 'mechanical':
        default: {
          // Classic Mechanical Switch (tactile bump click)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          const pitch = isSpace ? 320 : 650 + (Math.random() * 80 - 40);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(pitch, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

          gain.gain.setValueAtTime(0.4 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }
      }
    } catch (e) {
      // Audio playback fails gracefully if blocked by browser autoplay policy
    }
  }

  public playCompletionChime(volume: number = 0.5) {
    if (volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const noteTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.25 * volume, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.4);
      });
    } catch (e) {
      // Fallback
    }
  }
}

export const soundEngine = new SoundEngine();
