import { useState } from "react";
import { useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { Moon, Sun } from "lucide-react";

const THEME_OPTIONS = {
    // system: "System",
    time_based: "Auto",
    dark: "Dark",
    light: "Light",
};

const ThemeSwitcherButton = () => {


    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <label className="cursor-pointer   w-full relative flex items-center justify-center  ">

            <div
                onClick={(e) => {
                    e.preventDefault()
                    setOpen(!open)
                }}
                className="px-4 py-2 w-full  z-50 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer">
                Theme
                <ul>
                    {open && (

                        Object.entries(THEME_OPTIONS).map(([key, label]) => (
                            <button
                                key={key}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${theme === key ? "font-bold" : ""
                                    }`}
                                onClick={() => {
                                    setTheme(key);
                                    setOpen(false);
                                }}
                            >
                                {key === "DARK" ? <Moon className="inline mr-2" /> : null}
                                {key === "LIGHT" ? <Sun className="inline mr-2" /> : null}
                                {label}
                            </button>
                        ))

                    )}
                </ul>

            </div>
        </label>
    );
};

export default ThemeSwitcherButton;