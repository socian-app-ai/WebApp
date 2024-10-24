import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware";
import localStoragePersist from "./localPersistStorage";


let store = (set) => ({
    userData: null,
    setUserData: (userData) => set({ userData }),
    removeUser: () => set({ userData: null }),
}
)

store = persist(store, {
    name: "useUta",
    storage: createJSONStorage(() => localStoragePersist),
})
const useUserData = create(store)
export default useUserData;



