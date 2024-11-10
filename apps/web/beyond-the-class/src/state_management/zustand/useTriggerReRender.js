import { create } from "zustand"




const useTriggerReRender = create((set) => ({
    triggerReRender: false,
    setTriggerReRender: (triggerReRender) => set({ triggerReRender }),
    toggleTriggerReRender: () => set((state) => ({ triggerReRender: !state.triggerReRender })),
    unSetTriggerReRender: () => set({ triggerReRender: false }),
}))

export default useTriggerReRender