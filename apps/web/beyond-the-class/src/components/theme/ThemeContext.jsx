/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const THEME_OPTIONS = {
    SYSTEM: "system",
    TIME_BASED: "time_based",
    DARK: "dark",
    LIGHT: "light",
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || THEME_OPTIONS.TIME_BASED);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const applyTheme = (selectedTheme) => {
        let finalTheme = selectedTheme;

        if (selectedTheme === THEME_OPTIONS.SYSTEM) {
            finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } else if (selectedTheme === THEME_OPTIONS.TIME_BASED) {
            const hour = new Date().getHours();
            console.log("THE HOUR IS", hour)
            finalTheme = (hour >= 18 || hour < 6) ? "dark" : "light"; // Night 6pm to 6 AM -> dark
        }

        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(finalTheme);
        localStorage.setItem("theme", selectedTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);



// import { useState, useEffect } from "react";

// const THEME_OPTIONS = {
//     SYSTEM: "system",
//     TIME_BASED: "time_based",
//     DARK: "dark",
//     LIGHT: "light",
// };

// const ThemeContext = () => {
//     const [theme, setTheme] = useState(localStorage.getItem("theme") || THEME_OPTIONS.TIME_BASED);

//     useEffect(() => {
//         applyTheme(theme);
//     }, [theme]);

//     const applyTheme = (selectedTheme) => {
//         let finalTheme = selectedTheme;

//         if (selectedTheme === THEME_OPTIONS.SYSTEM) {
//             finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
//         } else if (selectedTheme === THEME_OPTIONS.TIME_BASED) {
//             const hour = new Date().getHours();
//             finalTheme = hour >= 0 && hour < 6 ? "dark" : "light"; // Midnight to 6 AM -> dark
//         }

//         document.documentElement.classList.remove("light", "dark");
//         document.documentElement.classList.add(finalTheme);
//         localStorage.setItem("theme", selectedTheme);
//     };

//     return (
//         <div className="p-4">
//             <label className="block text-lg font-medium mb-2">Select Theme:</label>
//             <select
//                 value={theme}
//                 onChange={(e) => setTheme(e.target.value)}
//                 className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800"
//             >
//                 <option value={THEME_OPTIONS.SYSTEM}>System Preferences</option>
//                 <option value={THEME_OPTIONS.TIME_BASED}>Change by Time</option>
//                 <option value={THEME_OPTIONS.DARK}>Custom Dark Mode</option>
//                 <option value={THEME_OPTIONS.LIGHT}>Custom Light Mode</option>
//             </select>
//         </div>
//     );
// };

// export default ThemeContext;
