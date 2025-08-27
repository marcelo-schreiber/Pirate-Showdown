import { create } from "zustand";

type Store = {
  debug: boolean;
  setDebug: (debug: boolean) => void;
};

export const useDebug = create<Store>((set) => ({
  debug: false,
  setDebug: (debug: boolean) => set({ debug }),
}));
