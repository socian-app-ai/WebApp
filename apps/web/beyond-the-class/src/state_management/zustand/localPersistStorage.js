const localStoragePersist = {
    getItem: async (name) => {
        return localStorage.getItem(name) || null;
    },
    setItem: async (name, value) => {
        localStorage.setItem(name, value);
    },
    removeItem: async (name) => {
        localStorage.removeItem(name);
    },
};

export default localStoragePersist;
