import { useState, useEffect, useRef } from 'react';

export type AmbientSoundType =
  | 'rain'
  | 'synth'
  | 'cockpit'
  | 'keyboard'
  | 'computer'
  | 'city'
  | 'spinner'
  | 'vangelis'
  | 'tracker'
  | 'nostromo';

export function useAmbientAudio() {
  const [activeSounds, setActiveSounds] = useState<Record<AmbientSoundType, boolean>>({
    rain: false,
    synth: false,
    cockpit: false,
    keyboard: false,
    computer: false,
    city: false,
    spinner: false,
    vangelis: false,
    tracker: false,
    nostromo: false
  });
  const [volume, setVolumeState] = useState<number>(60);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const gainNodesRef = useRef<Record<AmbientSoundType, GainNode | null>>({
    rain: null,
    synth: null,
    cockpit: null,
    keyboard: null,
    computer: null,
    city: null,
    spinner: null,
    vangelis: null,
    tracker: null,
    nostromo: null
  });

  const intervalTimersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    return () => {
      Object.values(intervalTimersRef.current).forEach((t) => clearInterval(t));
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.value = volume / 100;
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;

      // Build Generator Nodes
      gainNodesRef.current.rain = createRainGenerator(ctx, masterGain);
      gainNodesRef.current.synth = createSynthHumGenerator(ctx, masterGain);
      gainNodesRef.current.cockpit = createCockpitNoiseGenerator(ctx, masterGain);
      gainNodesRef.current.keyboard = createMechKeyboardGenerator(ctx, masterGain, intervalTimersRef);
      gainNodesRef.current.computer = createComputerDataGenerator(ctx, masterGain, intervalTimersRef);
      gainNodesRef.current.city = createCyberCityGenerator(ctx, masterGain);
      gainNodesRef.current.spinner = createSpinnerHoverGenerator(ctx, masterGain);
      gainNodesRef.current.vangelis = createVangelisPadGenerator(ctx, masterGain);
      gainNodesRef.current.tracker = createMotionTrackerPingGenerator(ctx, masterGain, intervalTimersRef);
      gainNodesRef.current.nostromo = createNostromoDeckHumGenerator(ctx, masterGain);
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const toggleSound = (type: AmbientSoundType) => {
    initAudioCtx();

    setActiveSounds((prev) => {
      const nextState = !prev[type];
      const targetGainNode = gainNodesRef.current[type];

      if (targetGainNode && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        targetGainNode.gain.cancelScheduledValues(now);
        targetGainNode.gain.setValueAtTime(targetGainNode.gain.value, now);
        targetGainNode.gain.linearRampToValueAtTime(
          nextState ? (type === 'synth' || type === 'vangelis' ? 0.22 : 0.35) : 0,
          now + 0.5
        );
      }

      return { ...prev, [type]: nextState };
    });
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
      masterGainRef.current.gain.linearRampToValueAtTime(val / 100, now + 0.1);
    }
  };

  return {
    activeSounds,
    toggleSound,
    volume,
    setVolume
  };
}

// 1. Procedural Pink Noise Rain Generator
function createRainGenerator(ctx: AudioContext, destination: GainNode): GainNode {
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.08;
    b6 = white * 0.115926;
  }

  const whiteNoiseSource = ctx.createBufferSource();
  whiteNoiseSource.buffer = noiseBuffer;
  whiteNoiseSource.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1000;
  bandpass.Q.value = 0.8;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;

  whiteNoiseSource.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(destination);

  whiteNoiseSource.start();
  return gainNode;
}

// 2. Procedural Synth Hum Generator
function createSynthHumGenerator(ctx: AudioContext, destination: GainNode): GainNode {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = 55;
  osc2.type = 'sine';
  osc2.frequency.value = 110.5;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 240;
  filter.Q.value = 3.0;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(destination);

  osc1.start();
  osc2.start();
  return gainNode;
}

// 3. Procedural Cockpit White Noise Generator
function createCockpitNoiseGenerator(ctx: AudioContext, destination: GainNode): GainNode {
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * 0.05;
  }

  const whiteNoiseSource = ctx.createBufferSource();
  whiteNoiseSource.buffer = noiseBuffer;
  whiteNoiseSource.loop = true;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 400;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;

  whiteNoiseSource.connect(highpass);
  highpass.connect(gainNode);
  gainNode.connect(destination);

  whiteNoiseSource.start();
  return gainNode;
}

// 4. Procedural Mechanical Keyboard Typing Generator
function createMechKeyboardGenerator(
  ctx: AudioContext,
  destination: GainNode,
  timers: { current: Record<string, any> }
): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(destination);

  const triggerKeyClick = () => {
    if (gainNode.gain.value <= 0.01) return;
    const now = ctx.currentTime;

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2200 + Math.random() * 800;
    filter.Q.value = 2.5;

    const keyGain = ctx.createGain();
    keyGain.gain.setValueAtTime(0.15 + Math.random() * 0.1, now);
    keyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noiseSrc.connect(filter);
    filter.connect(keyGain);
    keyGain.connect(gainNode);
    noiseSrc.start(now);
  };

  timers.current.keyboard = setInterval(() => {
    if (Math.random() > 0.3) {
      triggerKeyClick();
    }
  }, 180);

  return gainNode;
}

// 5. Procedural Computer Data Bleeps
function createComputerDataGenerator(
  ctx: AudioContext,
  destination: GainNode,
  timers: { current: Record<string, any> }
): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(destination);

  const triggerDataBleep = () => {
    if (gainNode.gain.value <= 0.01) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + Math.floor(Math.random() * 6) * 400, now);

    const bleepGain = ctx.createGain();
    bleepGain.gain.setValueAtTime(0.06, now);
    bleepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(bleepGain);
    bleepGain.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.045);
  };

  timers.current.computer = setInterval(() => {
    if (Math.random() > 0.4) triggerDataBleep();
  }, 320);

  return gainNode;
}

// 6. Cyberpunk City Ambience
function createCyberCityGenerator(ctx: AudioContext, destination: GainNode): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(destination);

  const subOsc1 = ctx.createOscillator();
  subOsc1.type = 'sawtooth';
  subOsc1.frequency.value = 38;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 160;

  subOsc1.connect(lowpass);
  lowpass.connect(gainNode);
  subOsc1.start();
  return gainNode;
}

// 7. Spinner Hover
function createSpinnerHoverGenerator(ctx: AudioContext, destination: GainNode): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(destination);

  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = 62;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 220;

  osc1.connect(lowpass);
  lowpass.connect(gainNode);
  osc1.start();
  return gainNode;
}

// 8. Vangelis Brass
function createVangelisPadGenerator(ctx: AudioContext, destination: GainNode): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(destination);

  [130.81, 195.99, 261.63].forEach((f) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 480;

    osc.connect(filter);
    filter.connect(gainNode);
    osc.start();
  });

  return gainNode;
}

// 9. Alien Motion Tracker Acoustic Beep Generator
function createMotionTrackerPingGenerator(
  ctx: AudioContext,
  destination: GainNode,
  timers: { current: Record<string, any> }
): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(destination);

  const triggerPing = () => {
    if (gainNode.gain.value <= 0.01) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1850, now);

    const pingGain = ctx.createGain();
    pingGain.gain.setValueAtTime(0.12, now);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(pingGain);
    pingGain.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.085);
  };

  timers.current.tracker = setInterval(triggerPing, 1500);
  return gainNode;
}

// 10. USCSS Nostromo Reactor Sub-bass Deck Hum Generator
function createNostromoDeckHumGenerator(ctx: AudioContext, destination: GainNode): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(destination);

  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.value = 28;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 80;

  subOsc.connect(lowpass);
  lowpass.connect(gainNode);
  subOsc.start();

  return gainNode;
}
