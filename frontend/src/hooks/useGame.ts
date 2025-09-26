import * as THREE from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CustomEcctrlRigidBody } from "@/libs/ecctrl/Ecctrl";
import type { RefObject } from "react";
import type { RapierRigidBody } from "@react-three/rapier";
import type { ImpulseJoint } from "@dimforge/rapier3d-compat";

// Helper function to create character state
const createCharacterState = (characterId: 'character1' | 'character2') => {
  return {
    characterRef: null! as RefObject<CustomEcctrlRigidBody>,
    setCharacterRef: (characterRef: RefObject<CustomEcctrlRigidBody>) =>
      useGame.setState((state) => ({
        [characterId]: {
          ...state[characterId],
          characterRef,
        },
      })),
    
    activeJoint: null as ImpulseJoint | null,
    setActiveJoint: (joint: ImpulseJoint | null) =>
      useGame.setState((state) => ({
        [characterId]: {
          ...state[characterId],
          activeJoint: joint,
        },
      })),
    
    moveToPoint: null as THREE.Vector3 | null,
    setMoveToPoint: (point: THREE.Vector3 | null) =>
      useGame.setState((state) => ({
        [characterId]: {
          ...state[characterId],
          moveToPoint: point,
        },
      })),
    
    getMoveToPoint: () => {
      const state = useGame.getState();
      return { moveToPoint: state[characterId].moveToPoint };
    },
    
    curAnimation: null as string | null,
    animationSet: {} as AnimationSet,
    
    initializeAnimationSet: (animationSet: AnimationSet) =>
      useGame.setState((state) => {
        if (Object.keys(state[characterId].animationSet).length === 0) {
          return {
            [characterId]: {
              ...state[characterId],
              animationSet,
            },
          };
        }
        return {};
      }),
    
    reset: () =>
      useGame.setState((state) => ({
        [characterId]: {
          ...state[characterId],
          curAnimation: state[characterId].animationSet.idle || null,
        },
      })),
    
    idle: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation === char.animationSet.jumpIdle) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.jumpLand || null,
            },
          };
        } else if (
          char.curAnimation !== char.animationSet.action1 &&
          char.curAnimation !== char.animationSet.action2 &&
          char.curAnimation !== char.animationSet.action3 &&
          char.curAnimation !== char.animationSet.action4
        ) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.idle || null,
            },
          };
        }
        return {};
      }),
    
    walk: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation !== char.animationSet.action4) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.walk || null,
            },
          };
        }
        return {};
      }),
    
    run: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation !== char.animationSet.action4) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.run || null,
            },
          };
        }
        return {};
      }),
    
    jump: () =>
      useGame.setState((state) => ({
        [characterId]: {
          ...state[characterId],
          curAnimation: state[characterId].animationSet.jump || null,
        },
      })),
    
    jumpIdle: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation === char.animationSet.jump) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.jumpIdle || null,
            },
          };
        }
        return {};
      }),
    
    jumpLand: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation === char.animationSet.jumpIdle) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.jumpLand || null,
            },
          };
        }
        return {};
      }),
    
    fall: () =>
      useGame.setState((state) => ({
        [characterId]: {
          ...state[characterId],
          curAnimation: state[characterId].animationSet.fall || null,
        },
      })),
    
    action1: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation === char.animationSet.idle) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.action1 || null,
            },
          };
        }
        return {};
      }),
    
    action2: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation === char.animationSet.idle) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.action2 || null,
            },
          };
        }
        return {};
      }),
    
    action3: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (char.curAnimation === char.animationSet.idle) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.action3 || null,
            },
          };
        }
        return {};
      }),
    
    action4: () =>
      useGame.setState((state) => {
        const char = state[characterId];
        if (
          char.curAnimation === char.animationSet.idle ||
          char.curAnimation === char.animationSet.walk ||
          char.curAnimation === char.animationSet.run
        ) {
          return {
            [characterId]: {
              ...char,
              curAnimation: char.animationSet.action4 || null,
            },
          };
        }
        return {};
      }),
  };
};

export const useGame = create(
  subscribeWithSelector<State>((set) => {
    return {
      character1: createCharacterState('character1'),
      character2: createCharacterState('character2'),

      hasGoBackWarning: false,
      setHasGoBackWarning: (hasGoBackWarning: boolean) =>
        set({ hasGoBackWarning }),

      shipRef: null!,
      setShipRef: (shipRef: RefObject<RapierRigidBody>) => set({ shipRef }),

      debug: false,
      setDebug: (debug: boolean) => set({ debug }),

      // UI direction arrow angle (deg) to world center computed in Canvas
      centerDirAngleDeg: 0,
      setCenterDirAngleDeg: (deg: number) => set({ centerDirAngleDeg: deg }),
    };
  })
);

export type AnimationSet = {
  idle?: string;
  walk?: string;
  run?: string;
  jump?: string;
  jumpIdle?: string;
  jumpLand?: string;
  fall?: string;
  // Currently support four additional animations
  action1?: string;
  action2?: string;
  action3?: string;
  action4?: string;
};

export type CharacterState = {
  characterRef: RefObject<CustomEcctrlRigidBody>;
  setCharacterRef: (characterRef: RefObject<CustomEcctrlRigidBody>) => void;
  activeJoint: ImpulseJoint | null;
  setActiveJoint: (joint: ImpulseJoint | null) => void;
  moveToPoint: THREE.Vector3 | null;
  setMoveToPoint: (point: THREE.Vector3 | null) => void;
  getMoveToPoint: () => { moveToPoint: THREE.Vector3 | null };
  curAnimation: string | null;
  animationSet: AnimationSet;
  initializeAnimationSet: (animationSet: AnimationSet) => void;
  reset: () => void;
  idle: () => void;
  walk: () => void;
  run: () => void;
  jump: () => void;
  jumpIdle: () => void;
  jumpLand: () => void;
  fall: () => void;
  action1: () => void;
  action2: () => void;
  action3: () => void;
  action4: () => void;
};

type State = {
  character1: CharacterState;
  character2: CharacterState;

  shipRef: RefObject<RapierRigidBody>;
  setShipRef: (shipRef: RefObject<RapierRigidBody>) => void;

  debug: boolean;
  setDebug: (debug: boolean) => void;

  hasGoBackWarning: boolean;
  setHasGoBackWarning: (hasGoBackWarning: boolean) => void;

  centerDirAngleDeg: number;
  setCenterDirAngleDeg: (deg: number) => void;
};
