import { EcctrlJoystick } from "@/libs/ecctrl/EcctrlJoystick";
import { useEffect, useState } from "react";

export const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    // Show the joystick only on coarse touch pointers.
    // Source - https://stackoverflow.com/a/63666289
    // Posted by Vladyslav Marchenko, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-05-15, License - CC BY-SA 4.0

    const isUsingTouchScreen = matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    setIsTouchScreen(isUsingTouchScreen);
  }, []);

  return <>{isTouchScreen && <EcctrlJoystick buttonNumber={3} />}</>;
};
