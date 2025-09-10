import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGame } from "@/hooks/useGame";
import { useShallow } from "zustand/shallow";

// Simple HUD that shows a directional arrow to world center with a 20s countdown
export const GoBackWarning = () => {
  const { hasGoBackWarning, shipRef, setHasGoBackWarning, centerDirAngleDeg } = useGame(
    useShallow((s) => ({
      hasGoBackWarning: s.hasGoBackWarning,
      shipRef: s.shipRef,
      setHasGoBackWarning: s.setHasGoBackWarning,
      centerDirAngleDeg: s.centerDirAngleDeg,
    })),
  );

  const [timeLeft, setTimeLeft] = useState(20);
  const intervalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Reset/start countdown when warning toggles
  useEffect(() => {
    // Clear any existing timer
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (hasGoBackWarning) {
      setTimeLeft(20);
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    } else {
      setTimeLeft(20);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasGoBackWarning]);

  // Teleport ship to center when time runs out (and warning still active)
  useEffect(() => {
    if (!hasGoBackWarning) return;
    if (timeLeft > 0) return;

    const body = shipRef?.current;
    if (body) {
      const pos = body.translation();
      // Stop velocities
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      // Teleport to world center, keep current Y to avoid sinking
      body.setTranslation({ x: 0, y: pos.y, z: 0 }, true);
    }

    // Hide warning after teleport
    setHasGoBackWarning(false);
  }, [timeLeft, hasGoBackWarning, setHasGoBackWarning, shipRef]);

  // Smoothly update arrow direction while warning is active
  useEffect(() => {
    if (!hasGoBackWarning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    const tick = () => {
      // keep RAF loop alive while warning is active; angle now handled by 3D HUD
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [hasGoBackWarning, shipRef]);

  // Smooth angle (shortest path) and keep it in state so UI updates reliably
  const [displayAngle, setDisplayAngle] = useState(centerDirAngleDeg);
  const rafAngleRef = useRef<number | null>(null);
  const currentQuat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());
  const zAxisRef = useRef(new THREE.Vector3(0, 0, 1));
  // keep target quaternion updated from incoming angle
  useEffect(() => {
  targetQuat.current.setFromAxisAngle(zAxisRef.current, THREE.MathUtils.degToRad(centerDirAngleDeg));
  }, [centerDirAngleDeg]);
  // initialize current quat when showing UI, to avoid jump
  useEffect(() => {
    if (hasGoBackWarning) {
  currentQuat.current.setFromAxisAngle(zAxisRef.current, THREE.MathUtils.degToRad(centerDirAngleDeg));
      setDisplayAngle(centerDirAngleDeg);
    }
  }, [hasGoBackWarning, centerDirAngleDeg]);
  // drive slerp each frame while warning is active
  useEffect(() => {
    if (!hasGoBackWarning) {
      if (rafAngleRef.current) cancelAnimationFrame(rafAngleRef.current);
      rafAngleRef.current = null;
      return;
    }
    const tick = () => {
      // slerp a bit toward target
      currentQuat.current.slerp(targetQuat.current, 0.18);
      // extract z rotation
      const e = new THREE.Euler().setFromQuaternion(currentQuat.current, "ZYX");
      setDisplayAngle(THREE.MathUtils.radToDeg(e.z));
      rafAngleRef.current = requestAnimationFrame(tick);
    };
    rafAngleRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafAngleRef.current) cancelAnimationFrame(rafAngleRef.current);
      rafAngleRef.current = null;
    };
  }, [hasGoBackWarning]);

  if (!hasGoBackWarning) return null;

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <div style={titleStyle}>Off the map, matey!</div>
        <div style={contentRowStyle}>
          <div style={{ ...arrowWrapperStyle, transform: `rotate(${displayAngle}deg)` }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0c97a" />
                  <stop offset="100%" stopColor="#b9873b" />
                </linearGradient>
              </defs>
              <path d="M8 32h34" stroke="url(#g)" strokeWidth="8" strokeLinecap="round" />
              <path d="M34 16l18 16-18 16V16z" fill="url(#g)" />
            </svg>
          </div>
          <div style={timerBadgeStyle}>{timeLeft}s</div>
        </div>
        <div style={hintStyle}>Steer back to the center or be reeled in by the depths.</div>
      </div>
    </div>
  );
};

// Inline styles to avoid editing global css
const containerStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  top: 0,
  pointerEvents: "none",
  display: "flex",
  justifyContent: "center",
  marginTop: 16,
  zIndex: 50,
};

const panelStyle: React.CSSProperties = {
  pointerEvents: "auto",
  background: "linear-gradient(180deg, rgba(22,12,2,0.85), rgba(8,4,1,0.85))",
  border: "1px solid rgba(190,148,83,0.5)",
  borderRadius: 12,
  padding: "10px 14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  color: "#f4e3c2",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  backdropFilter: "blur(4px)",
  minWidth: 260,
};

const titleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  opacity: 1,
  textAlign: "center",
  marginBottom: 8,
  letterSpacing: 0.3,
};

const contentRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  justifyContent: "center",
};

const arrowWrapperStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  // animation is controlled via RAF smoothing above
};

const timerBadgeStyle: React.CSSProperties = {
  minWidth: 56,
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
  fontSize: 22,
  fontWeight: 800,
  background: "rgba(190,148,83,0.2)",
  color: "#f4e3c2",
  border: "1px solid rgba(190,148,83,0.6)",
  borderRadius: 10,
  padding: "6px 10px",
  boxShadow: "inset 0 0 12px rgba(190,148,83,0.25)",
};

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.8,
  textAlign: "center",
  marginTop: 6,
};

export default GoBackWarning;
