import { useState, useEffect } from "react";

// Hook to detect if user is on mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/Mobi|Android/i.test(ua));
  }, []);

  return isMobile;
}
