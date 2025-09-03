import { useEffect, useRef, useState } from "react";

export function useButtonHold(targetKey: string, holdMs: number = 1500) {
  const [isHeld, setIsHeld] = useState(false);
  const holdStart = useRef<number | null>(null);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === targetKey && holdStart.current === null) {
        holdStart.current = performance.now();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        holdStart.current = null;
        setIsHeld(false);
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [targetKey]);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (holdStart.current !== null) {
        const now = performance.now();
        if (now - holdStart.current >= holdMs) {
          setIsHeld(true);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holdMs]);

  return isHeld;
}
