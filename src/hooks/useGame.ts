import * as THREE from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CustomEcctrlRigidBody } from "@/libs/ecctrl/Ecctrl";
import type { RefObject } from "react";
import type { RapierRigidBody } from "@react-three/rapier";
import type { ImpulseJoint } from "@dimforge/rapier3d-compat";

export const useGame = create(
  subscribeWithSelector<State>((set, get) => {
    return {
      characterRef: null!,
      setCharacterRef: (characterRef: RefObject<CustomEcctrlRigidBody>) =>
        set({ characterRef }),

      hasGoBackWarning: false,
      setHasGoBackWarning: (hasGoBackWarning: boolean) =>
        set({ hasGoBackWarning }),

      shipRef: null!,
      setShipRef: (shipRef: RefObject<RapierRigidBody>) => set({ shipRef }),

      debug: false,
      setDebug: (debug: boolean) => set({ debug }),

      activeJoint: null as ImpulseJoint | null,
      setActiveJoint: (joint: ImpulseJoint | null) =>
        set({ activeJoint: joint }),

      // UI direction arrow angle (deg) to world center computed in Canvas
      centerDirAngleDeg: 0,
      setCenterDirAngleDeg: (deg: number) => set({ centerDirAngleDeg: deg }),

      /**
       * Point to move point
       */
      moveToPoint: null as THREE.Vector3 | null,

      /**
       * Character animations state manegement
       */
      // Initial animation
      curAnimation: null as string | null,
      animationSet: {} as AnimationSet,

      initializeAnimationSet: (animationSet: AnimationSet) => {
        set((state) => {
          if (Object.keys(state.animationSet).length === 0) {
            return { animationSet };
          }
          return {};
        });
      },

      reset: () => {
        set((state) => {
          return { curAnimation: state.animationSet.idle };
        });
      },

      idle: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.jumpIdle) {
            return { curAnimation: state.animationSet.jumpLand };
          } else if (
            state.curAnimation !== state.animationSet.action1 &&
            state.curAnimation !== state.animationSet.action2 &&
            state.curAnimation !== state.animationSet.action3 &&
            state.curAnimation !== state.animationSet.action4
          ) {
            return { curAnimation: state.animationSet.idle };
          }
          return {};
        });
      },

      walk: () => {
        set((state) => {
          if (state.curAnimation !== state.animationSet.action4) {
            return { curAnimation: state.animationSet.walk };
          }
          return {};
        });
      },

      run: () => {
        set((state) => {
          if (state.curAnimation !== state.animationSet.action4) {
            return { curAnimation: state.animationSet.run };
          }
          return {};
        });
      },

      jump: () => {
        set((state) => {
          return { curAnimation: state.animationSet.jump };
        });
      },

      jumpIdle: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.jump) {
            return { curAnimation: state.animationSet.jumpIdle };
          }
          return {};
        });
      },

      jumpLand: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.jumpIdle) {
            return { curAnimation: state.animationSet.jumpLand };
          }
          return {};
        });
      },

      fall: () => {
        set((state) => {
          return { curAnimation: state.animationSet.fall };
        });
      },

      action1: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.idle) {
            return { curAnimation: state.animationSet.action1 };
          }
          return {};
        });
      },

      action2: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.idle) {
            return { curAnimation: state.animationSet.action2 };
          }
          return {};
        });
      },

      action3: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.idle) {
            return { curAnimation: state.animationSet.action3 };
          }
          return {};
        });
      },

      action4: () => {
        set((state) => {
          if (
            state.curAnimation === state.animationSet.idle ||
            state.curAnimation === state.animationSet.walk ||
            state.curAnimation === state.animationSet.run
          ) {
            return { curAnimation: state.animationSet.action4 };
          }
          return {};
        });
      },

      /**
       * Additional animations
       */
      // triggerFunction: ()=>{
      //    set((state) => {
      //        return { curAnimation: state.animationSet.additionalAnimation };
      //    });
      // }

      /**
       * Set/get point to move point
       */
      setMoveToPoint: (point: THREE.Vector3 | null) => {
        set(() => {
          return { moveToPoint: point };
        });
      },

      getMoveToPoint: () => {
        return {
          moveToPoint: get().moveToPoint,
        };
      },
    };
  }),
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

type State = {
  characterRef: RefObject<CustomEcctrlRigidBody>;
  setCharacterRef: (characterRef: RefObject<CustomEcctrlRigidBody>) => void;

  shipRef: RefObject<RapierRigidBody>;
  setShipRef: (shipRef: RefObject<RapierRigidBody>) => void;

  activeJoint: ImpulseJoint | null;
  setActiveJoint: (joint: ImpulseJoint | null) => void;

  debug: boolean;
  setDebug: (debug: boolean) => void;

  hasGoBackWarning: boolean;
  setHasGoBackWarning: (hasGoBackWarning: boolean) => void;

  centerDirAngleDeg: number;
  setCenterDirAngleDeg: (deg: number) => void;

  moveToPoint: THREE.Vector3 | null;
  curAnimation: string | null;
  animationSet: AnimationSet;
  initializeAnimationSet: (animationSet: AnimationSet) => void;
  reset: () => void;
  setMoveToPoint: (point: THREE.Vector3 | null) => void;
  getMoveToPoint: () => {
    moveToPoint: THREE.Vector3 | null;
  };
} & {
  [key in keyof AnimationSet]: () => void;
};
