import { useState } from "react";
import { useEffect } from "react";

const ThemeSwitcherButton = () => {

    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || "light"
    );


    // useEffect(() => {

    // }, [theme, setTheme]);

    const toggleTheme = () => {
        // console.log("togle", theme, theme === 'light', theme === 'light' ? 'dark' : 'light')
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        if (newTheme === 'dark') {
            // console.log(document.documentElement.classList)
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
        } else if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }

        localStorage.setItem('theme', newTheme);

        // console.log("NEW", theme)
    };

    // console.log("TESTING")

    return (
        <label className="cursor-pointer   w-full relative flex items-center justify-center  ">
            {/* <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="hidden"
        /> */}
            {/* {theme === 'dark' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />} */}

            <li onClick={toggleTheme} className="px-4 py-2 w-full  z-50 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer">
                Theme

            </li>
        </label>
    );
};

export default ThemeSwitcherButton;