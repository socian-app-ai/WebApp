import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useSetSideBarState = create((set) => ({
    sideBarState: true,
    setSideBarState: (sideBarState) => set({ sideBarState }),
    toggleSideBar: () => set((state) => ({ sideBarState: !state.sideBarState })),
    unSetSideBar: () => set({ sideBarState: true }),
}))

export const useSidebarSelected = create(persist(
    (set) => ({
        selected: 'Home',
        setSelected: (newSelected) => set({ selected: newSelected }),
    }),
    {
        name: 'selection',
        storage: createJSONStorage(() => localStorage),
    }
));


