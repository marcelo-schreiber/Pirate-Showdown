import { useEffect, useRef } from "react";

/**
 * Detects when a key (from useKeyboardControls) has been held for a duration.
 * Fires only once per hold.
 */
export function useKeyHold(
  isPressed: boolean,
  duration: number,
  onTrigger: () => void,
) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPressed && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        onTrigger();
        timerRef.current = null;
      }, duration * 1000);
    } else if (!isPressed && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [isPressed, duration, onTrigger]);
}
