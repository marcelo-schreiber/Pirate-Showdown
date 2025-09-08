import { EcctrlJoystick } from "@/libs/ecctrl/EcctrlJoystick";
import { useEffect, useState } from "react";

export const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    const isUsingTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchScreen(isUsingTouchScreen);
  }, []);

  return <>{isTouchScreen && <EcctrlJoystick buttonNumber={3} />}</>;
};
