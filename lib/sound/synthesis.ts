/** Procedural synthesis helpers — no audio files */

export function createPinkNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
    b6 = white * 0.115926;
  }
  return buf;
}

export function hashToPitch(seed: string, base = 880, spread = 360): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return base + (Math.abs(h) % spread);
}

export function playGlassChime(
  ctx: AudioContext,
  dest: GainNode,
  seed = "chime",
  vol = 0.028,
): void {
  const t = ctx.currentTime;
  const base = hashToPitch(seed, 1040, 480);

  [1, 1.5, 2.01].forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = base * ratio;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol / (i + 1), t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4 + i * 0.15);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.8);
  });
}

export function playSingingBowl(
  ctx: AudioContext,
  dest: GainNode,
  vol = 0.022,
): void {
  const t = ctx.currentTime;
  const freqs = [196, 294, 392];

  for (const freq of freqs) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 4.8);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 5.2);
  }
}

export function playSoftResonance(
  ctx: AudioContext,
  dest: GainNode,
  vol = 0.016,
): void {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.linearRampToValueAtTime(185, t + 3.5);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + 4.5);
}

export function playPianoHarmonic(
  ctx: AudioContext,
  dest: GainNode,
  seed = "piano",
  vol = 0.012,
): void {
  const t = ctx.currentTime;
  const base = hashToPitch(seed, 440, 280);
  const partials = [
    { ratio: 1, decay: 5.2 },
    { ratio: 2, decay: 3.8 },
    { ratio: 3.01, decay: 2.4 },
  ];

  for (const p of partials) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = base * p.ratio;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol / p.ratio, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + p.decay + 0.2);
  }
}

export function playCrystallineTone(
  ctx: AudioContext,
  dest: GainNode,
  seed = "node",
  masterVol = 0.022,
): void {
  const t = ctx.currentTime;
  const freq = hashToPitch(seed, 920, 360);

  const partials = [
    { ratio: 1, vol: 1, decay: 0.55 },
    { ratio: 2.01, vol: 0.35, decay: 0.35 },
    { ratio: 3.02, vol: 0.12, decay: 0.22 },
  ];

  for (const p of partials) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * p.ratio;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(masterVol * p.vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + p.decay + 0.05);
  }
}

export function playPaperRustle(ctx: AudioContext, dest: GainNode, vol = 0.018): void {
  const len = ctx.sampleRate * 0.28;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.35;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = vol;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 2400;
  f.Q.value = 0.6;
  src.connect(f);
  f.connect(g);
  g.connect(dest);
  src.start();
}

export function playWoodTap(ctx: AudioContext, dest: GainNode, vol = 0.012): void {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + 0.25);
}

export function playBirdChirp(ctx: AudioContext, dest: GainNode, vol = 0.014): void {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2800 + Math.random() * 600, t);
  osc.frequency.exponentialRampToValueAtTime(3200 + Math.random() * 400, t + 0.06);
  osc.frequency.exponentialRampToValueAtTime(2100, t + 0.14);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + 0.2);
}

export function playRealmEntry(ctx: AudioContext, dest: GainNode): void {
  const t = ctx.currentTime;
  [220, 330].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.02 / (i + 1), t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 2.5);
  });
}
