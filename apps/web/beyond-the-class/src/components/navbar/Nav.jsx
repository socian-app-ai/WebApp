// import { Bell, Search, ChevronDown, MenuIcon } from "lucide-react";
// import ThemeSwitcher, { ThemeSwitcher2 } from "../ThemeSwitcher";
// import { useState } from "react";
// import { useAuthContext } from "../../context/AuthContext";
// import CreatePostButton from "../../pages/society/post/CreatePostButton";
// import useLogout from "../../hooks/useLogout";
// import useWindowDimensions from "../../hooks/useWindowDimensions";
// import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
// import { ChevronUp } from "lucide-react";
// import { Link } from "react-router-dom";
// import routesForLinks from "../../utils/routes/routesForLinks";

// function Navbar() {
//     const { width } = useWindowDimensions();
//     const { toggleSideBar } = useSetSideBarState();
//     const { authUser } = useAuthContext();
//     const { logout } = useLogout();

//     // State for dropdown visibility
//     const [isDropdownOpen, setDropdownOpen] = useState(false);

//     return (
//         <nav className="w-full fixed z-50 bg-white text-black dark:bg-[#101011] dark:text-white flex items-center justify-between px-4 py-2 shadow-md">
//             {/* Left Section */}
//             {/* Mobile Menu Icon */}
//             {width < 768 && (
//                 <MenuIcon className="mx-2" size={22} onClick={toggleSideBar} />
//             )}
//             <div className="flex items-center gap-4">
//                 {/* <ThemeSwitcher /> */}

//                 <div className="flex justify-center items-center">
//                     <div className="flex items-center md:items-end justify-end">
//                         <img
//                             className="h-9 w-9 lg:h-10 lg:w-10 hidden md:block"
//                             src={
//                                 authUser &&
//                                 authUser.university &&
//                                 authUser?.university?.campusId?.picture
//                             }
//                             alt="Campus Logo"
//                         />
//                         <div className="flex flex-col ml-2 -space-y-1">
//                             <h5 className="font-semibold text-md sm:text-lg md:text-xl">
//                                 Beyond The Class
//                             </h5>
//                             <p className="text-xs font-light  hidden md:block ">
//                                 {authUser &&
//                                     authUser.university &&
//                                     authUser?.university?.campusId?.name}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Search Input */}
//             <div className="hidden md:flex flex-1 mx-4 relative max-w-[50%]">
//                 <Search
//                     size={20}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                     type="text"
//                     placeholder="Search"
//                     className="w-full bg-gray-800 text-sm text-white rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
//                 />
//             </div>

//             <div className="h-8 border-l-2 w-0 mx-2 border-[#696969a4]"></div>

//             <div className="hidden md:block">
//                 <ThemeSwitcher />
//             </div>
//             {/* Right Section - User Profile */}
//             <div className="flex w-min md:w-[25%] justify-start items-center relative">
//                 <div className="hidden md:flex">
//                     <CreatePostButton />

//                 </div>
//                 <div
//                     className="flex w-max items-center gap-2 cursor-pointer relative"
//                     onClick={() => setDropdownOpen(!isDropdownOpen)}
//                 >
//                     {/* Profile Picture */}
//                     <img
//                         src={authUser.profile.picture}
//                         alt="User"
//                         className="w-7 h-7 rounded-full object-cover"
//                     />
//                     <span className="text-sm font-medium hidden md:block">
//                         {authUser.name}
//                     </span>
//                     <span className="text-gray-400">
//                         {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
//                     </span>


//                     {/* Dropdown Menu */}
//                     {isDropdownOpen && (
//                         <div className="absolute top-10 right-0 md:left-0
//                         bg-white text-black border-[#4d4d4d]  
//                         dark:bg-[#171718] dark:text-white dark:border-[#696969a4] border
//                          rounded-sm shadow-sm w-40 md:w-full">
//                             <ul className="text-sm">
//                                 <Link to={routesForLinks.user + "/" + authUser._id} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer">
//                                     Profile
//                                 </Link>
//                                 <ThemeSwitcher2 />

//                                 <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer">
//                                     Settings
//                                 </li>
//                                 <li
//                                     className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer text-red-600"
//                                     onClick={logout}
//                                 >
//                                     Logout
//                                 </li>
//                             </ul>
//                         </div>
//                     )}
//                 </div>


//             </div>


//         </nav>
//     );
// }

// export default Navbar;


// LeftSection.js
import { MenuIcon } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";


// SearchBar.js
import { Search } from "lucide-react";


// RightSection.js
import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CreatePostButton from "../../pages/society/post/CreatePostButton";
import useLogout from "../../hooks/useLogout";
import routesForLinks from "../../utils/routes/routesForLinks";


// Navbar.js
import ThemeSwitcher from "../ThemeSwitcher";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import ThemeSwitcherButton from "../ThemeSwitcherButton";

export function LeftSection() {
    const { width } = useWindowDimensions();
    const { authUser } = useAuthContext();
    const { toggleSideBar } = useSetSideBarState();


    return (
        <div className="flex items-center gap-4">
            {width < 768 && (
                <MenuIcon className="mx-2" size={22} onClick={toggleSideBar} />
            )}
            <div className="flex justify-center items-center">
                <div className="flex items-center md:items-end justify-end">
                    <img
                        className="h-9 w-9 lg:h-10 lg:w-10 hidden md:block"
                        src={authUser?.university?.campusId?.picture}
                        alt="Campus Logo"
                    />
                    <div className="flex flex-col ml-2 -space-y-1">
                        <h5 className="font-semibold text-md sm:text-lg md:text-xl">
                            Beyond The Class
                        </h5>
                        <p className="text-xs font-light hidden md:block">
                            {authUser?.university?.campusId?.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SearchBar() {
    return (
        <div className="hidden md:flex flex-1 mx-4 relative max-w-[50%]">
            <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                placeholder="Search"
                className="w-full bg-slate-50 dark:bg-gray-800 text-sm text-white rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
        </div>
    );
}


export function RightSection() {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();
    const [isDropdownOpen, setDropdownOpen] = useState(false);


    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex w-min md:w-[25%] justify-start items-center relative">
            <div className="hidden md:flex">
                <CreatePostButton />
            </div>
            <div
                className="flex w-max items-center gap-2 cursor-pointer relative"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
                <img
                    src={authUser.profile.picture}
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium hidden md:block">
                    {authUser.name}
                </span>
                <span className="text-gray-400">
                    {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
                </span>

                {isDropdownOpen && (
                    <div ref={modalRef}
                        className="absolute top-10 right-0 md:left-0 bg-white text-black border-[#4d4d4d] dark:bg-[#171718] dark:text-white dark:border-[#696969a4] border rounded-sm shadow-sm w-40 md:w-full">
                        <ul className="text-sm">
                            <Link
                                to={routesForLinks.user + "/" + authUser._id}
                                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer"
                            >
                                Profile
                            </Link>
                            <ThemeSwitcherButton />
                            <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer">
                                Settings
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer text-red-600"
                                onClick={logout}
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function Navbar() {
    return (
        <nav className="w-full fixed z-50 bg-white text-black dark:bg-[#101011] dark:text-white flex items-center justify-between px-4 py-2 shadow-md">
            <LeftSection />
            <SearchBar />
            <div className="hidden md:block">
                <ThemeSwitcher />
            </div>
            <RightSection />
        </nav>
    );
}

export default Navbar;



