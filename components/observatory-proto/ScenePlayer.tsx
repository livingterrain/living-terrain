"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import {
  ENCOUNTER_DWELL_MS,
  HOLD_BEFORE_NAMING_MS,
  SCENE_ORDER,
  bodiesForPattern,
  getBody,
  getPattern,
  getScene,
  nextSceneId,
  type BodyId,
  type SceneId,
  type StageLayout,
} from "@/lib/observatory-proto/data";

/**
 * Three stage compositions — arrangement as the medium.
 *
 * diptych — equal co-presence; eye travels left ↔ right
 * margin  — primary + peripheral; eye discovers the second
 * void    — bodies at extremes; empty stage between them
 *
 * Sequence: curiosity → simultaneous field → silent hold → naming
 */

type Beat = "curiosity" | "simultaneous" | "hold" | "named" | "widen";

type Props = {
  initialSceneId: SceneId;
  layout: StageLayout;
};

export function ScenePlayer({ initialSceneId, layout }: Props) {
  const [sceneId, setSceneId] = useState<SceneId>(initialSceneId);
  const scene = getScene(sceneId);
  const ids = scene.bodyIds;

  const [beat, setBeat] = useState<Beat>("curiosity");
  const [visibleCount, setVisibleCount] = useState(1);
  const [canCut, setCanCut] = useState(false);
  const [widenBodyId, setWidenBodyId] = useState<BodyId | null>(null);

  const visibleIds = ids.slice(0, visibleCount);
  const continueId = nextSceneId(sceneId);

  const widenCandidates = useMemo(
    () => bodiesForPattern(scene.patternId, ids),
    [scene.patternId, ids],
  );

  function resetToScene(id: SceneId) {
    setSceneId(id);
    setBeat("curiosity");
    setVisibleCount(1);
    setCanCut(false);
    setWidenBodyId(null);
  }

  useEffect(() => {
    if (beat !== "curiosity") return;
    setCanCut(false);
    const t = window.setTimeout(() => setCanCut(true), ENCOUNTER_DWELL_MS);
    return () => window.clearTimeout(t);
  }, [beat, sceneId]);

  useEffect(() => {
    if (beat !== "simultaneous") return;
    if (visibleCount < ids.length) return;
    setBeat("hold");
  }, [beat, visibleCount, ids.length]);

  useEffect(() => {
    if (beat !== "hold") return;
    const t = window.setTimeout(() => setBeat("named"), HOLD_BEFORE_NAMING_MS);
    return () => window.clearTimeout(t);
  }, [beat, sceneId]);

  function onCut() {
    if (beat === "curiosity" && canCut) {
      setVisibleCount(Math.min(2, ids.length));
      setBeat("simultaneous");
      return;
    }
    if (beat === "simultaneous" && visibleCount < ids.length) {
      setVisibleCount((n) => n + 1);
    }
  }

  function onWiden() {
    const next = widenCandidates[0];
    if (!next) return;
    setWidenBodyId(next.id);
    setBeat("widen");
  }

  const awaitingMore =
    beat === "simultaneous" && visibleCount < ids.length;
  const showStage = beat !== "widen";

  return (
    <div style={shell}>
      {showStage && (
        <Stage
          layout={layout}
          beat={beat}
          visibleIds={visibleIds}
          visibleCount={visibleCount}
        />
      )}

      {beat === "curiosity" && (
        <div style={controls}>
          {canCut ? (
            <button type="button" onClick={onCut} style={ghostBtn}>
              ·
            </button>
          ) : (
            <span style={{ opacity: 0.15 }}>·</span>
          )}
        </div>
      )}

      {awaitingMore && (
        <div style={controls}>
          <button type="button" onClick={onCut} style={ghostBtn}>
            ·
          </button>
        </div>
      )}

      {beat === "hold" && <div style={{ ...controls, minHeight: 48 }} />}

      {beat === "named" && (
        <div style={naming}>
          <p style={nameLine}>{getPattern(scene.patternId).name}</p>
          <p style={stabilizer}>{getPattern(scene.patternId).stabilizer}</p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            {widenCandidates.length > 0 && (
              <button type="button" onClick={onWiden} style={ghostBtn}>
                ·
              </button>
            )}
            {continueId && (
              <button
                type="button"
                onClick={() => resetToScene(continueId)}
                style={ghostBtn}
              >
                →
              </button>
            )}
          </div>
        </div>
      )}

      {beat === "widen" && widenBodyId && (
        <div style={{ padding: "20vh 1.25rem 0" }}>
          <pre style={bodyText}>{getBody(widenBodyId).text}</pre>
          <div style={{ marginTop: "2.5rem" }}>
            <button
              type="button"
              onClick={() =>
                resetToScene(continueId ?? SCENE_ORDER[0]!)
              }
              style={ghostBtn}
            >
              {continueId ? "→" : "·"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stage({
  layout,
  beat,
  visibleIds,
  visibleCount,
}: {
  layout: StageLayout;
  beat: Beat;
  visibleIds: BodyId[];
  visibleCount: number;
}) {
  if (layout === "diptych") {
    return (
      <div style={diptychStage}>
        {visibleIds.map((id, i) => (
          <article
            key={id}
            style={{
              ...diptychPanel,
              borderLeft:
                i > 0 ? "1px solid rgba(255,255,255,0.14)" : undefined,
              /* Encounter alone occupies the left half — empty right = tension */
              gridColumn: visibleCount === 1 ? "1 / 2" : undefined,
            }}
          >
            <pre style={bodyText}>{getBody(id).text}</pre>
          </article>
        ))}
        {beat === "curiosity" && <div style={diptychEmpty} aria-hidden />}
      </div>
    );
  }

  if (layout === "margin") {
    const primary = visibleIds[0];
    const others = visibleIds.slice(1);
    return (
      <div style={marginStage}>
        {primary && (
          <article style={marginPrimary}>
            <pre style={bodyText}>{getBody(primary).text}</pre>
          </article>
        )}
        {others.map((id) => (
          <article key={id} style={marginPeripheral}>
            <pre style={{ ...bodyText, fontSize: 14, lineHeight: 1.5 }}>
              {getBody(id).text}
            </pre>
          </article>
        ))}
      </div>
    );
  }

  // void — extremes + empty center
  return (
    <div style={voidStage}>
      {visibleIds[0] && (
        <article style={voidA}>
          <pre style={bodyText}>{getBody(visibleIds[0]).text}</pre>
        </article>
      )}
      {visibleIds[1] && (
        <article style={voidB}>
          <pre style={bodyText}>{getBody(visibleIds[1]).text}</pre>
        </article>
      )}
      {visibleIds[2] && (
        <article style={voidC}>
          <pre style={{ ...bodyText, fontSize: 15 }}>
            {getBody(visibleIds[2]).text}
          </pre>
        </article>
      )}
    </div>
  );
}

const shell: CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: "100dvh",
  margin: 0,
  padding: 0,
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "#d8d2c8",
  background: "#080808",
  overflow: "hidden",
};

/* ── 1. Diptych: equal halves; eye crosses the seam ── */
const diptychStage: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  minHeight: "72vh",
  width: "100%",
  paddingTop: "12vh",
};

const diptychPanel: CSSProperties = {
  padding: "0 8vw",
  display: "flex",
  alignItems: "center",
  minHeight: "50vh",
};

const diptychEmpty: CSSProperties = {
  minHeight: "50vh",
};

/* ── 2. Margin: one owned center; others at the edge of vision ── */
const marginStage: CSSProperties = {
  position: "relative",
  minHeight: "85vh",
  width: "100%",
};

const marginPrimary: CSSProperties = {
  position: "absolute",
  left: "12vw",
  top: "22vh",
  maxWidth: "22rem",
};

const marginPeripheral: CSSProperties = {
  position: "absolute",
  right: "4vw",
  bottom: "14vh",
  maxWidth: "13rem",
  opacity: 0.72,
};

/* ── 3. Void: distance is the medium ── */
const voidStage: CSSProperties = {
  position: "relative",
  minHeight: "100dvh",
  width: "100%",
};

const voidA: CSSProperties = {
  position: "absolute",
  top: "10vh",
  left: "6vw",
  maxWidth: "16rem",
};

const voidB: CSSProperties = {
  position: "absolute",
  bottom: "18vh",
  right: "6vw",
  maxWidth: "16rem",
};

const voidC: CSSProperties = {
  position: "absolute",
  top: "42vh",
  left: "42vw",
  maxWidth: "12rem",
  opacity: 0.65,
};

const bodyText: CSSProperties = {
  whiteSpace: "pre-wrap",
  fontFamily: "Georgia, 'Times New Roman', serif",
  margin: 0,
  fontSize: 17,
  lineHeight: 1.6,
};

const controls: CSSProperties = {
  position: "fixed",
  bottom: "2rem",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  zIndex: 5,
};

const naming: CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: "2.5rem",
  transform: "translateX(-50%)",
  width: "min(28rem, 88vw)",
  padding: "1.25rem 0 0",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  background: "linear-gradient(180deg, transparent, #080808 18%)",
  zIndex: 6,
};

const nameLine: CSSProperties = {
  margin: "0 0 0.65rem",
  fontSize: 13,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  opacity: 0.65,
  fontFamily: "system-ui, sans-serif",
};

const stabilizer: CSSProperties = {
  margin: 0,
  fontStyle: "italic",
  fontSize: 15,
  opacity: 0.8,
};

const ghostBtn: CSSProperties = {
  appearance: "none",
  border: "none",
  background: "transparent",
  color: "#d8d2c8",
  fontSize: 22,
  padding: "0.75rem 1rem",
  cursor: "pointer",
  opacity: 0.5,
};
