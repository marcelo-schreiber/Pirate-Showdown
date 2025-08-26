import { create } from "zustand";

type Store = {
  debug: boolean;
  setDebug: (debug: boolean) => void;
};

const useGame = create<Store>((set) => ({
  debug: false,
  setDebug: (debug: boolean) => set({ debug }),
}));

export default useGame;
