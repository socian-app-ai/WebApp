import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSetInfoBarState = create((set) => ({
  infoBarState: false,
  setInfoBarState: (infoBarState) => set({ infoBarState }),
  toggleInfoBar: () => set((state) => ({ infoBarState: !state.infoBarState })),
  unSetInfoBar: () => set({ infoBarState: true }),
}));

export const useInfobarSelected = create(
  persist(
    (set) => ({
      selected: null,
      setSelected: (newSelected) => set({ selected: newSelected }),
    }),
    {
      name: "selection",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
