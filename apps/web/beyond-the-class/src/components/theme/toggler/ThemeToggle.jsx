import { useState } from "react";
import { Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "../ThemeContext";

const THEME_OPTIONS = {
    SYSTEM: "System",
    TIME_BASED: "Auto (Night Mode)",
    DARK: "Dark",
    LIGHT: "Light",
};

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
                <Settings size={20} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2">
                    {Object.entries(THEME_OPTIONS).map(([key, label]) => (
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThemeToggle;
