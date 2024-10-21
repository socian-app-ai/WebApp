import { FaChalkboardTeacher, FaMedapps } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { AllOut, Explore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";


function Sidebar() {
    const { sideBarState, setSideBarState } = useSetSideBarState();
    const { width } = useWindowDimensions();
    const menuItems = [
        { name: "Home", path: "/", icon: <IoMdHome className="w-5" /> },
        { name: "Teachers", path: "/teachers/reviews", icon: <FaChalkboardTeacher className="w-5" /> },
        { name: "Past Papers", path: "/pastpapers/program-name", icon: <FaMedapps className="w-5" /> },
        { name: "Explore", path: "/", icon: <Explore className="w-5" /> },
        { name: "All", path: "/", icon: <AllOut className="w-5" /> }
    ];



    return (
        <div className={`${sideBarState ? 'left-0' : '-left-[100rem]'} sidebar-custom-css  z-20 w-64 bg-white dark:bg-[#191919] dark:text-white h-screen p-4 fixed border-right-half`}>

            <nav className="mt-12 ">
                <ul className="border-b flex flex-col">
                    {menuItems.map((item) => (
                        <Link
                            to={item.path}
                            key={item.name}
                            className={`flex justify-start items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#2B3236] cursor-pointer `}
                            onClick={() => {

                                if (width < 768) {
                                    setSideBarState(false)
                                }
                            }}
                        >
                            {item.icon}
                            <p className="ml-2">{item.name}</p>
                        </Link>
                    ))}
                </ul>
            </nav>




        </div>
    );
}

export default Sidebar;
