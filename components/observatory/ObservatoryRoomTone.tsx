"use client";

/**
 * PHASE 3 — Observatory room tone (isolated).
 *
 * Never autoplays. Default silent. Explicit Listen / Quiet only.
 * Uses existing Web Audio engine (no external asset in repo).
 * Revert: unmount this component and delete this file.
 */

import { useCallback, useEffect, useId, useState } from "react";
import { useTerrainSoundOptional } from "@/components/sound";

const OBS_LISTEN_KEY = "lt-observatory-listen";

export function ObservatoryRoomTone() {
  const sound = useTerrainSoundOptional();
  const hintId = useId();
  const [listening, setListening] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!sound) return;
    /* Reflect live mute state after an explicit Listen in this session */
    if (sound.activated && !sound.muted && sound.scene === "observatory") {
      setListening(true);
    }
    if (sound.muted) setListening(false);
  }, [sound, sound?.activated, sound?.muted, sound?.scene]);

  const listen = useCallback(() => {
    if (!sound || prefersReduced) return;
    try {
      localStorage.setItem(OBS_LISTEN_KEY, "1");
    } catch {
      /* private browsing */
    }
    void sound.activate("observatory").then(() => {
      sound.setMuted(false);
      setListening(true);
    });
  }, [sound, prefersReduced]);

  const quiet = useCallback(() => {
    if (!sound) return;
    try {
      localStorage.setItem(OBS_LISTEN_KEY, "0");
    } catch {
      /* private browsing */
    }
    sound.setMuted(true);
    setListening(false);
  }, [sound]);

  if (!sound) return null;
  if (prefersReduced) return null;

  const active = listening && !sound.muted;

  return (
    <div className="obs-room-tone">
      <button
        type="button"
        className="obs-room-tone__btn"
        onClick={active ? quiet : listen}
        aria-pressed={active}
        aria-describedby={hintId}
        aria-label={
          active
            ? "Quiet — stop ambient room tone"
            : "Listen — start ambient room tone"
        }
        title="Ambient room tone. Optional."
      >
        {active ? "Quiet" : "Listen"}
      </button>
      <span id={hintId} className="sr-only">
        Ambient room tone. Optional. Does not play until you choose Listen.
      </span>
    </div>
  );
}
