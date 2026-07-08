import type { SoundLayerId, SoundScene } from "./types";
import { REALM_SOUND_LFO } from "@/lib/realms/ambience";
import { SCENE_CROSSFADE_SEC, SCENE_LAYER_GAINS } from "./scenes";
import {
  createBrownNoiseBuffer,
  createPinkNoiseBuffer,
  playBirdChirp,
  playGlassChime,
  playHoverWhisper,
  playPaperRustle,
  playSingingBowl,
  playSoftResonance,
  playWoodTap,
} from "./synthesis";

interface Layer {
  gain: GainNode;
  stop: () => void;
}

const ALL_LAYERS: SoundLayerId[] = [
  "roomTone",
  "harmonic",
  "wind",
  "realmReality",
  "realmRelationship",
  "realmMeaning",
  "realmIdentity",
  "realmLanguage",
  "realmTime",
  "chamberDrone",
  "archiveRoom",
  "fieldWind",
  "observatoryAir",
];

export class TerrainSoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private hoverBus: GainNode | null = null;
  private layers = new Map<SoundLayerId, Layer>();
  private scene: SoundScene = "silence";
  private activated = false;
  private muted = false;
  private lastHoverAt = 0;
  private eventTimers: number[] = [];
  private lastRealmScene: SoundScene | null = null;

  isActivated(): boolean {
    return this.activated;
  }

  isMuted(): boolean {
    return this.muted;
  }

  getScene(): SoundScene {
    return this.scene;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyMasterGain();
  }

  /** Called when visitor crosses the threshold */
  async activate(): Promise<void> {
    this.activated = true;
    await this.ensureReady();
    this.applyMasterGain();
  }

  async setScene(scene: SoundScene): Promise<void> {
    if (!this.activated) {
      this.scene = scene;
      return;
    }

    const prev = this.scene;
    this.scene = scene;
    await this.ensureReady();

    if (scene.startsWith("realm-") && prev !== scene) {
      this.lastRealmScene = scene;
    }

    this.crossfadeToScene(scene);
    this.scheduleSceneEvents(scene);
  }

  async playHover(seed?: string): Promise<void> {
    if (!this.activated || this.muted) return;
    const now = performance.now();
    if (now - this.lastHoverAt < 480) return;
    this.lastHoverAt = now;

    await this.ensureReady();
    if (!this.ctx || !this.hoverBus) return;
    playHoverWhisper(this.ctx, this.hoverBus, seed ?? "node");
  }

  dispose(): void {
    this.clearEventTimers();
    for (const layer of this.layers.values()) layer.stop();
    this.layers.clear();
    if (this.ctx && this.ctx.state !== "closed") void this.ctx.close();
    this.ctx = null;
    this.master = null;
    this.hoverBus = null;
  }

  private async ensureReady(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = new AudioContext();
    this.ctx = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    const hoverBus = ctx.createGain();
    hoverBus.gain.value = 0.38;
    hoverBus.connect(master);
    this.hoverBus = hoverBus;

    for (const id of ALL_LAYERS) {
      this.layers.set(id, this.buildLayer(ctx, id, master));
    }

    this.crossfadeToScene(this.scene);
    this.applyMasterGain();
  }

  private applyMasterGain(): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const target = this.activated && !this.muted ? 0.1 : 0;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(target, t + 2.4);
  }

  private crossfadeToScene(scene: SoundScene): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const targets = SCENE_LAYER_GAINS[scene] ?? {};

    for (const id of ALL_LAYERS) {
      const layer = this.layers.get(id);
      if (!layer) continue;
      const target = targets[id] ?? 0;
      layer.gain.gain.cancelScheduledValues(t);
      layer.gain.gain.setValueAtTime(layer.gain.gain.value, t);
      layer.gain.gain.linearRampToValueAtTime(target, t + SCENE_CROSSFADE_SEC);
    }
  }

  private scheduleSceneEvents(scene: SoundScene): void {
    this.clearEventTimers();

    if (!this.activated || this.muted) return;

    if (scene === "constellation") {
      const scheduleConstellation = () => {
        this.eventTimers.push(
          window.setTimeout(() => {
            if (this.scene !== "constellation" || !this.ctx || !this.hoverBus || this.muted) {
              return;
            }
            if (Math.random() < 0.55) playSoftResonance(this.ctx, this.hoverBus);
            else playSingingBowl(this.ctx, this.hoverBus);
            scheduleConstellation();
          }, 140000 + Math.random() * 100000),
        );
      };
      scheduleConstellation();
    }

    if (scene === "atlas") {
      const scheduleAtlas = () => {
        this.eventTimers.push(
          window.setTimeout(() => {
            if (this.scene !== "atlas" || !this.ctx || !this.hoverBus || this.muted) return;
            if (Math.random() < 0.7) playSingingBowl(this.ctx, this.hoverBus, 0.007);
            else playGlassChime(this.ctx, this.hoverBus, `atlas-${Date.now()}`, 0.008);
            scheduleAtlas();
          }, 180000 + Math.random() * 120000),
        );
      };
      scheduleAtlas();
    }

    if (scene === "archive") {
      const scheduleArchive = () => {
        this.eventTimers.push(
          window.setTimeout(() => {
            if (this.scene !== "archive" || !this.ctx || !this.hoverBus || this.muted) return;
            if (Math.random() > 0.6) playPaperRustle(this.ctx, this.hoverBus, 0.01);
            else playWoodTap(this.ctx, this.hoverBus, 0.007);
            scheduleArchive();
          }, 45000 + Math.random() * 55000),
        );
      };
      scheduleArchive();
    }

    if (scene === "field-notes") {
      const scheduleField = () => {
        this.eventTimers.push(
          window.setTimeout(() => {
            if (this.scene !== "field-notes" || !this.ctx || !this.hoverBus || this.muted) return;
            if (Math.random() > 0.55) playBirdChirp(this.ctx, this.hoverBus, 0.008);
            scheduleField();
          }, 55000 + Math.random() * 75000),
        );
      };
      scheduleField();
    }
  }

  private clearEventTimers(): void {
    this.eventTimers.forEach(clearTimeout);
    this.eventTimers = [];
  }

  private buildLayer(
    ctx: AudioContext,
    id: SoundLayerId,
    master: GainNode,
  ): Layer {
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(master);

    const stops: Array<() => void> = [];

    switch (id) {
      case "roomTone": {
        const internal = ctx.createGain();
        internal.gain.value = 0.65;
        const buf = createBrownNoiseBuffer(ctx, 28);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 118;
        lowpass.Q.value = 0.4;
        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 28;
        const breathLfo = ctx.createOscillator();
        breathLfo.frequency.value = 0.004;
        const breathGain = ctx.createGain();
        breathGain.gain.value = 0.025;
        breathLfo.connect(breathGain);
        breathGain.connect(internal.gain);
        src.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(internal);
        internal.connect(gain);
        src.start();
        breathLfo.start();
        stops.push(() => {
          src.stop();
          breathLfo.stop();
        });
        break;
      }
      case "harmonic": {
        const internal = ctx.createGain();
        internal.gain.value = 0.18;
        const root = ctx.createOscillator();
        root.type = "sine";
        root.frequency.value = 55;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.003;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.018;
        lfo.connect(lfoGain);
        lfoGain.connect(internal.gain);
        root.connect(internal);
        internal.connect(gain);
        root.start();
        lfo.start();
        stops.push(() => {
          root.stop();
          lfo.stop();
        });
        break;
      }
      case "wind": {
        const internal = ctx.createGain();
        internal.gain.value = 0.42;
        const buf = createPinkNoiseBuffer(ctx, 24);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 280;
        filter.Q.value = 0.22;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.005;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.035;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        const breathLfo = ctx.createOscillator();
        breathLfo.frequency.value = 0.011;
        const breathGain = ctx.createGain();
        breathGain.gain.value = 0.022;
        breathLfo.connect(breathGain);
        breathGain.connect(internal.gain);
        src.connect(filter);
        filter.connect(internal);
        internal.connect(gain);
        src.start();
        lfo.start();
        breathLfo.start();
        stops.push(() => {
          src.stop();
          lfo.stop();
          breathLfo.stop();
        });
        break;
      }
      case "realmReality": {
        this.attachDrone(ctx, gain, [196, 294], "sine", stops, 1, REALM_SOUND_LFO.reality);
        break;
      }
      case "realmRelationship": {
        this.attachDrone(ctx, gain, [220, 330], "triangle", stops, 1, REALM_SOUND_LFO.relationship);
        break;
      }
      case "realmMeaning": {
        this.attachDrone(ctx, gain, [130, 196], "sine", stops, 1, REALM_SOUND_LFO.meaning);
        break;
      }
      case "realmIdentity": {
        this.attachDrone(ctx, gain, [165, 247], "sine", stops, 1, REALM_SOUND_LFO.identity);
        break;
      }
      case "realmLanguage": {
        this.attachDrone(ctx, gain, [330, 440], "triangle", stops, 0.85, REALM_SOUND_LFO.language);
        break;
      }
      case "realmTime": {
        this.attachDrone(ctx, gain, [82, 123], "sine", stops, 1, REALM_SOUND_LFO.time);
        break;
      }
      case "chamberDrone": {
        this.attachDrone(ctx, gain, [36, 54, 72], "sine", stops);
        break;
      }
      case "archiveRoom": {
        this.attachDrone(ctx, gain, [92, 138], "sine", stops, 0.28);
        break;
      }
      case "fieldWind": {
        const buf = createPinkNoiseBuffer(ctx, 6);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 600;
        src.connect(filter);
        filter.connect(gain);
        src.start();
        stops.push(() => src.stop());
        break;
      }
      case "observatoryAir": {
        this.attachDrone(ctx, gain, [72, 108], "sine", stops, 0.2);
        break;
      }
    }

    return {
      gain,
      stop: () => stops.forEach((fn) => {
        try {
          fn();
        } catch {
          /* stopped */
        }
      }),
    };
  }

  private attachDrone(
    ctx: AudioContext,
    dest: GainNode,
    freqs: number[],
    type: OscillatorType,
    stops: Array<() => void>,
    mix = 1,
    lfoRate = 0.007,
  ): void {
    const bus = ctx.createGain();
    bus.gain.value = mix * 0.38;
    bus.connect(dest);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = lfoRate;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.022;
    lfo.connect(lfoGain);
    lfoGain.connect(bus.gain);
    lfo.start();
    stops.push(() => lfo.stop());
    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.38 / freqs.length;
      osc.connect(g);
      g.connect(bus);
      osc.start();
      stops.push(() => osc.stop());
    }
  }
}

let singleton: TerrainSoundEngine | null = null;

export function getTerrainSoundEngine(): TerrainSoundEngine {
  if (!singleton) singleton = new TerrainSoundEngine();
  return singleton;
}
