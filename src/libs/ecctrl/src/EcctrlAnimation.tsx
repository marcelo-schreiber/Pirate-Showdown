import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef, Suspense } from "react";
import * as THREE from "three";
import { useGame, type AnimationSet } from "./hooks/useGame";
import React from "react";

type ActionWithPrivateVars = THREE.AnimationAction & {
  _mixer: THREE.AnimationMixer & {
    _listeners: Array<THREE.EventListener<unknown, string, unknown>>;
  };
};

export function EcctrlAnimation(props: EcctrlAnimationProps) {
  // Change the character src to yours
  const group = useRef<THREE.Group | null>(null);
  const { animations } = useGLTF(props.characterURL);
  const { actions } = useAnimations(animations, group);

  /**
   * Character animations setup
   */
  const curAnimation = useGame((state) => state.curAnimation);
  const resetAnimation = useGame((state) => state.reset);
  const initializeAnimationSet = useGame(
    (state) => state.initializeAnimationSet,
  );

  useEffect(() => {
    // Initialize animation set
    initializeAnimationSet(props.animationSet);
  }, [initializeAnimationSet, props.animationSet]);

  useEffect(() => {
    // Play animation
    // const action = actions[curAnimation ? curAnimation : props.animationSet.jumpIdle];
    const key = curAnimation ?? props.animationSet.jumpIdle;
    const action = key ? actions[key] : null;

    // For jump and jump land animation, only play once and clamp when finish
    if (action === null) return;

    if (
      curAnimation === props.animationSet.jump ||
      curAnimation === props.animationSet.jumpLand ||
      curAnimation === props.animationSet.action1 ||
      curAnimation === props.animationSet.action2 ||
      curAnimation === props.animationSet.action3 ||
      curAnimation === props.animationSet.action4
    ) {
      action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();
      action.clampWhenFinished = true;
    } else {
      action.reset().fadeIn(0.2).play();
    }

    // When any action is clamp and finished reset animation
    (action as ActionWithPrivateVars)._mixer.addEventListener("finished", () =>
      resetAnimation(),
    );

    return () => {
      // Fade out previous action
      action.fadeOut(0.2);

      // Clean up mixer listener, and empty the _listeners array
      (action as ActionWithPrivateVars)._mixer.removeEventListener(
        "finished",
        () => resetAnimation(),
      );
      (action as ActionWithPrivateVars)._mixer._listeners = [];
    };
  }, [
    actions,
    curAnimation,
    props.animationSet.action1,
    props.animationSet.action2,
    props.animationSet.action3,
    props.animationSet.action4,
    props.animationSet.jump,
    props.animationSet.jumpIdle,
    props.animationSet.jumpLand,
    resetAnimation,
  ]);

  return (
    <Suspense fallback={null}>
      <group
        ref={group}
        dispose={null}
        userData={{ camExcludeCollision: true }}
      >
        {props.children}
      </group>
    </Suspense>
  );
}

export type EcctrlAnimationProps = {
  characterURL: string;
  animationSet: AnimationSet;
  children: React.ReactNode;
};
