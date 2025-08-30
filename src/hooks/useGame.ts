import type { CustomEcctrlRigidBody } from "@/libs/ecctrl/Ecctrl";
import { create } from "zustand";

type Store = {
  characterRef: CustomEcctrlRigidBody | null;
  setCharacterRef: (characterRef: CustomEcctrlRigidBody | null) => void;
  debug: boolean;
  setDebug: (debug: boolean) => void;
};

export const useGame = create<Store>((set) => ({
  characterRef: null,
  setCharacterRef: (characterRef: CustomEcctrlRigidBody | null) =>
    set({ characterRef }),
  debug: false,
  setDebug: (debug: boolean) => set({ debug }),
}));
