"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getTerrainSoundEngine,
  SOUND_MUTE_KEY,
  type SoundScene,
} from "@/lib/sound";

interface TerrainSoundContextValue {
  activated: boolean;
  muted: boolean;
  scene: SoundScene;
  activate: () => void;
  setScene: (scene: SoundScene) => void;
  playHover: (seed?: string) => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
}

const TerrainSoundContext = createContext<TerrainSoundContextValue | null>(null);

export function TerrainSoundProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(() => getTerrainSoundEngine(), []);
  const [activated, setActivated] = useState(false);
  const [muted, setMutedState] = useState(true);
  const [scene, setSceneState] = useState<SoundScene>("silence");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SOUND_MUTE_KEY);
      if (stored === "1") setMutedState(true);
      else if (stored === "0") setMutedState(false);
    } catch {
      /* private browsing */
    }
  }, []);

  useEffect(() => {
    engine.setMuted(muted);
  }, [engine, muted]);

  useEffect(() => () => engine.dispose(), [engine]);

  const activate = useCallback(() => {
    void engine.activate().then(() => {
      setActivated(true);
      try {
        const stored = localStorage.getItem(SOUND_MUTE_KEY);
        if (stored !== "1") {
          setMutedState(false);
          engine.setMuted(false);
        }
      } catch {
        setMutedState(false);
        engine.setMuted(false);
      }
      void engine.setScene(scene === "silence" ? "constellation" : scene);
    });
  }, [engine, scene]);

  const setScene = useCallback(
    (next: SoundScene) => {
      setSceneState(next);
      void engine.setScene(next);
    },
    [engine],
  );

  const playHover = useCallback(
    (seed?: string) => {
      void engine.playHover(seed);
    },
    [engine],
  );

  const setMuted = useCallback(
    (value: boolean) => {
      setMutedState(value);
      engine.setMuted(value);
      try {
        localStorage.setItem(SOUND_MUTE_KEY, value ? "1" : "0");
      } catch {
        /* ignore */
      }
    },
    [engine],
  );

  const toggleMuted = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  const value = useMemo(
    () => ({
      activated,
      muted,
      scene,
      activate,
      setScene,
      playHover,
      setMuted,
      toggleMuted,
    }),
    [activated, muted, scene, activate, setScene, playHover, setMuted, toggleMuted],
  );

  return (
    <TerrainSoundContext.Provider value={value}>
      {children}
    </TerrainSoundContext.Provider>
  );
}

export function useTerrainSound(): TerrainSoundContextValue {
  const ctx = useContext(TerrainSoundContext);
  if (!ctx) {
    throw new Error("useTerrainSound must be used within TerrainSoundProvider");
  }
  return ctx;
}

export function useTerrainSoundOptional(): TerrainSoundContextValue | null {
  return useContext(TerrainSoundContext);
}
