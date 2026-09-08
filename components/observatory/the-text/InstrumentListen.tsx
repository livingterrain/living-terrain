"use client";

/**
 * Instrument 01 — LISTEN control.
 * Single entry point for READ (English passage speech) and AMBIENCE (room tone).
 * When inside PassageSpeechProvider, full-passage READ uses the shared controller.
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useTerrainSoundOptional } from "@/components/sound";
import {
  normalizePassageSpeechText,
  pickEnglishVoice,
  speechSynthesisSupported,
  type PassageReadingSource,
  type PassageSpeechStatus,
} from "@/lib/observatory/the-text/passage-speech";
import { usePassageSpeechOptional } from "./PassageSpeechProvider";

const OBS_LISTEN_KEY = "lt-observatory-listen";

export function InstrumentListen({
  reading,
}: {
  /** When omitted, only ambience is offered (landing), unless provider supplies plan. */
  reading?: PassageReadingSource;
}) {
  const sound = useTerrainSoundOptional();
  const shared = usePassageSpeechOptional();
  const panelId = useId();
  const hintId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [ambienceOn, setAmbienceOn] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [localStatus, setLocalStatus] =
    useState<PassageSpeechStatus>("idle");
  const [localReady, setLocalReady] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const readingIdRef = useRef(reading?.id);

  const useShared = Boolean(shared);
  const speechStatus = useShared ? shared!.status : localStatus;
  const speechReady = useShared ? shared!.speechReady : localReady;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (useShared) return;
    if (!speechSynthesisSupported()) {
      setLocalReady(false);
      setLocalStatus("unsupported");
      return;
    }
    setLocalReady(true);
    const load = () => {
      void window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, [useShared]);

  const cancelLocal = useCallback(() => {
    if (!speechSynthesisSupported()) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setLocalStatus((s) => (s === "unsupported" ? s : "idle"));
  }, []);

  useEffect(() => {
    if (useShared) return;
    if (readingIdRef.current !== reading?.id) {
      cancelLocal();
      readingIdRef.current = reading?.id;
    }
  }, [reading?.id, cancelLocal, useShared]);

  useEffect(() => {
    if (useShared) return;
    return () => cancelLocal();
  }, [cancelLocal, useShared]);

  useEffect(() => {
    if (!sound) return;
    if (sound.activated && !sound.muted && sound.scene === "observatory") {
      setAmbienceOn(true);
    }
    if (sound.muted) setAmbienceOn(false);
  }, [sound, sound?.activated, sound?.muted, sound?.scene]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    }
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  const startAmbience = useCallback(() => {
    if (!sound || prefersReduced) return;
    try {
      localStorage.setItem(OBS_LISTEN_KEY, "1");
    } catch {
      /* private browsing */
    }
    void sound.activate("observatory").then(() => {
      sound.setMuted(false);
      setAmbienceOn(true);
    });
  }, [sound, prefersReduced]);

  const stopAmbience = useCallback(() => {
    if (!sound) return;
    try {
      localStorage.setItem(OBS_LISTEN_KEY, "0");
    } catch {
      /* private browsing */
    }
    sound.setMuted(true);
    setAmbienceOn(false);
  }, [sound]);

  const silenceAll = useCallback(() => {
    if (shared) shared.cancel();
    else cancelLocal();
    stopAmbience();
    setOpen(false);
  }, [shared, cancelLocal, stopAmbience]);

  const speakEnglishLocal = useCallback(() => {
    if (!reading || !speechSynthesisSupported()) {
      setLocalStatus("unsupported");
      return;
    }
    const text = normalizePassageSpeechText(reading.englishText);
    if (!text) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1;
    utter.volume = 1;
    const voice = pickEnglishVoice(window.speechSynthesis.getVoices());
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang ?? "en-US";

    utter.onstart = () => setLocalStatus("speaking");
    utter.onend = () => {
      utteranceRef.current = null;
      setLocalStatus("idle");
    };
    utter.onerror = () => {
      utteranceRef.current = null;
      setLocalStatus("idle");
    };
    utter.onpause = () => setLocalStatus("paused");
    utter.onresume = () => setLocalStatus("speaking");

    utteranceRef.current = utter;
    setLocalStatus("speaking");
    window.speechSynthesis.speak(utter);
  }, [reading]);

  const playRead = useCallback(() => {
    if (!speechReady || speechStatus === "unsupported") return;
    if (speechStatus === "paused") {
      if (shared) {
        shared.resume();
        return;
      }
      try {
        window.speechSynthesis.resume();
        setLocalStatus("speaking");
        return;
      } catch {
        /* fall through */
      }
    }
    if (shared) shared.speakFullPassage();
    else speakEnglishLocal();
  }, [speechReady, speechStatus, shared, speakEnglishLocal]);

  const pauseRead = useCallback(() => {
    if (speechStatus !== "speaking") return;
    if (shared) {
      shared.pause();
      return;
    }
    if (!speechSynthesisSupported()) return;
    try {
      window.speechSynthesis.pause();
      window.setTimeout(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          cancelLocal();
        } else {
          setLocalStatus("paused");
        }
      }, 40);
    } catch {
      cancelLocal();
    }
  }, [speechStatus, shared, cancelLocal]);

  const restartRead = useCallback(() => {
    if (shared) shared.speakFullPassage();
    else speakEnglishLocal();
  }, [shared, speakEnglishLocal]);

  const hasReading = Boolean(reading || shared);
  if (!sound && !hasReading) return null;

  const ambienceActive = ambienceOn && sound && !sound.muted;
  const readingActive =
    speechStatus === "speaking" || speechStatus === "paused";
  const anythingActive = Boolean(ambienceActive || readingActive);

  const reference =
    shared?.plan.reference ?? reading?.reference ?? "Passage";
  const englishLabel =
    shared?.plan.fullPassage.label ?? reading?.englishLabel ?? "English";

  const triggerLabel = open
    ? "Listen — close listening controls"
    : anythingActive
      ? "Listening — open listening controls"
      : "Listen — open reading and ambience controls";

  return (
    <div
      ref={rootRef}
      className={
        open ? "obs-room-tone obs-room-tone--open" : "obs-room-tone"
      }
    >
      <button
        type="button"
        className="obs-room-tone__btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-pressed={anythingActive}
        aria-describedby={hintId}
        aria-label={triggerLabel}
        title="Listen — reading and ambience"
        onClick={() => setOpen((v) => !v)}
      >
        {anythingActive && !open ? "Listening" : "Listen"}
      </button>
      <span id={hintId} className="sr-only">
        Optional listening controls for spoken English reading and faint
        Observatory ambience. Nothing plays until you choose it.
      </span>

      {open && (
        <div
          id={panelId}
          className="obs-room-tone__panel"
          role="region"
          aria-label="Listening controls"
        >
          {hasReading && (
            <div className="obs-room-tone__block">
              <p className="obs-room-tone__folio">Read</p>
              <p className="obs-room-tone__meta">
                {reference}
                <span className="obs-studio__status-sep" aria-hidden>
                  ·
                </span>
                {englishLabel}
              </p>
              {speechStatus === "unsupported" || !speechReady ? (
                <p className="obs-room-tone__note">
                  Spoken reading is unavailable in this browser. The control
                  remains ready for a future labeled recording.
                </p>
              ) : (
                <div className="obs-room-tone__row" role="group" aria-label="Reading">
                  <button
                    type="button"
                    className="obs-room-tone__action"
                    onClick={playRead}
                    aria-label={
                      speechStatus === "paused"
                        ? "Resume reading"
                        : "Play English reading"
                    }
                    disabled={speechStatus === "speaking"}
                  >
                    {speechStatus === "paused" ? "Resume" : "Play"}
                  </button>
                  <button
                    type="button"
                    className="obs-room-tone__action"
                    onClick={pauseRead}
                    aria-label="Pause reading"
                    disabled={speechStatus !== "speaking"}
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    className="obs-room-tone__action"
                    onClick={restartRead}
                    aria-label="Restart reading from the beginning"
                  >
                    Restart
                  </button>
                </div>
              )}
              <p className="obs-room-tone__note">
                Original-language reading awaits a labeled recording
                tradition — not browser Hebrew speech.
              </p>
            </div>
          )}

          <div className="obs-room-tone__block">
            <p className="obs-room-tone__folio">Ambience</p>
            <p className="obs-room-tone__meta">Faint Observatory room tone</p>
            {prefersReduced ? (
              <p className="obs-room-tone__note">
                Ambience stays off while reduced motion is preferred.
              </p>
            ) : !sound ? (
              <p className="obs-room-tone__note">
                Ambience engine unavailable in this session.
              </p>
            ) : (
              <div
                className="obs-room-tone__row"
                role="group"
                aria-label="Ambience"
              >
                <button
                  type="button"
                  className="obs-room-tone__action"
                  aria-pressed={Boolean(ambienceActive)}
                  onClick={() =>
                    ambienceActive ? stopAmbience() : startAmbience()
                  }
                  aria-label={
                    ambienceActive
                      ? "Turn ambience off"
                      : "Turn ambience on"
                  }
                >
                  {ambienceActive ? "On" : "Off"}
                </button>
              </div>
            )}
          </div>

          {anythingActive && (
            <button
              type="button"
              className="obs-room-tone__silence"
              onClick={silenceAll}
              aria-label="Silence reading and ambience"
            >
              Silence all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
