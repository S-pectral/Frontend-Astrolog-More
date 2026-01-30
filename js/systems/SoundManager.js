
export class SoundManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.ambienceNodes = [];
        this.isInitialized = false;
        this.isMuted = false;
    }

    init() {
        if (this.isInitialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.4; // Slightly louder master
            this.masterGain.connect(this.context.destination);

            this.startAmbience();
            this.isInitialized = true;
            console.log('🔊 Audio System Initialized (High Quality)');
        } catch (e) {
            console.error('Audio init failed:', e);
        }
    }

    // Helper: Create Noise Buffer
    createNoiseBuffer() {
        if (!this.context) return null;
        const bufferSize = this.context.sampleRate * 2; // 2 seconds
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // Pink noise approximation (1/f)
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }
        return buffer;
    }

    createWhiteNoise() {
        const bufferSize = this.context.sampleRate * 2;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    startAmbience() {
        // Advanced Space Ambience: Rumble + Ethereal Drone

        // 1. Rumble (Brown/Pink Noise through Lowpass)
        const bufferSize = this.context.sampleRate * 4;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }

        const noise = this.context.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 80; // Very deep rumble

        const noiseGain = this.context.createGain();
        noiseGain.gain.value = 0.8;

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start();

        // 2. Ethereal High Drone (Sine waves)
        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 110; // A2

        const oscGain = this.context.createGain();
        oscGain.gain.value = 0.05; // Very subtle

        const lfo = this.context.createOscillator();
        lfo.frequency.value = 0.1; // Slow drift
        const lfoGain = this.context.createGain();
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();

        this.ambienceNodes.push(noise, osc, lfo);
    }

    playWarpSound() {
        if (!this.isInitialized) return;
        const t = this.context.currentTime;

        // Cinematic Whoosh - Cleaner and smoother
        const noiseBuffer = this.createWhiteNoise(); // Re-use white noise
        const noise = this.context.createBufferSource();
        noise.buffer = noiseBuffer;

        // Bandpass Filter Sweep for "Jet" effect
        const noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.Q.value = 1.0; // Wider resonance
        noiseFilter.frequency.setValueAtTime(200, t);
        noiseFilter.frequency.exponentialRampToValueAtTime(3000, t + 1.5); // Sweep up

        const noiseGain = this.context.createGain();
        noiseGain.gain.setValueAtTime(0, t);
        noiseGain.gain.linearRampToValueAtTime(0.6, t + 0.8); // Fade in slower
        noiseGain.gain.linearRampToValueAtTime(0, t + 2.5); // Fade out

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start();

        // Sub-bass Drop (Deep Impact feel)
        const subOsc = this.context.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(80, t);
        subOsc.frequency.exponentialRampToValueAtTime(30, t + 2.0); // Pitch drop

        const subGain = this.context.createGain();
        subGain.gain.setValueAtTime(0.5, t);
        subGain.gain.exponentialRampToValueAtTime(0.01, t + 2.0);

        subOsc.connect(subGain);
        subGain.connect(this.masterGain);
        subOsc.start();
        subOsc.stop(t + 2.5);
    }

    playHoverSound() {
        if (!this.isInitialized) return;
        const t = this.context.currentTime;

        // Subtle tech blip
        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0.05, t); // Very quiet
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(t + 0.05);
    }

    playClickSound() {
        if (!this.isInitialized) return;
        const t = this.context.currentTime;

        // Glassy ping
        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);

        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(t + 0.2);
    }
}
let lastOut = 0; // Global for noise generator state
