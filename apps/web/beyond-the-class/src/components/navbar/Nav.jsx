
// LeftSection.js
import { MenuIcon } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";


// RightSection.js
import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CreatePostButton from "../../pages/society/post/CreatePostButton";
import useLogout from "../../hooks/useLogout";
import routesForLinks from "../../utils/routes/routesForLinks";


// Navbar.js
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import SearchBar from "./search/SearchBar";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { MonitorCog } from "lucide-react";
import ThemeSwitcherButton from "../theme/ThemeSwitcherButton";
// import ThemeSwitcher from "../theme/ThemeSwitcher";
import { memo } from "react";

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




export function RightSection() {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate()

    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && !event.target.closest(".theme-switcher-container")) {
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
                            <Link to='#' className="theme-switcher-container"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDropdownOpen(true);
                                }}
                            >
                                <ThemeSwitcherButton />
                            </Link>


                            <Link className="px-4 block py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer">
                                Settings
                            </Link>
                            <Link
                                className="px-4 block py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer text-red-600"
                                onClick={logout}
                            >
                                Logout
                            </Link>
                        </ul>
                    </div>
                )}
            </div>
            {authUser && !(!authUser.role) && authUser.super_role !== 'none' && <div>
                {console.log("AUTH ROLES", authUser.role, authUser.super_role)}
                <button className="flex">
                    {(localStorage.getItem('preferedView') === authUser.super_role)
                        ?
                        <MonitorCog onClick={() => changeRole(authUser)} />
                        :
                        <GraduationCap onClick={() => changeRole(authUser)} />
                    }

                    {
                        localStorage.getItem('preferedView') === authUser.super_role
                            ?
                            authUser.super_role
                            :
                            localStorage.getItem('preferedView') === authUser.role
                                ?
                                authUser.role
                                :
                                localStorage.setItem('preferedView', authUser.super_role)
                                    ?
                                    authUser.super_role
                                    :
                                    'loading'
                    }
                </button>
            </div>}
        </div>
    );
}

const changeRole = (authUser) => {
    if (localStorage.getItem('preferedView') === authUser.super_role) {

        localStorage.setItem('preferedView', authUser.role)
        // navigate(`/${authUser.role}`)
        // window.location.href = `/${authUser.role}`
        window.location.href = `/`
    } else {
        localStorage.setItem('preferedView', authUser.super_role)
        // navigate(`/${authUser.super_role}`)
        window.location.href = `/${authUser.super_role}`
        // window.location.href = `/`
    }
}

function Navbar() {
    return (
        <nav className="w-full fixed z-50 bg-white text-black dark:bg-[#101011] dark:text-white flex items-center justify-between px-4 py-2 shadow-md">
            <LeftSection />
            <SearchBar />
            {/* <div className="hidden md:block">
                <ThemeSwitcher />
            </div> */}
            <RightSection />
        </nav>
    );
}

export default memo(Navbar);



