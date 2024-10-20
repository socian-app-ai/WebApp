import { useEffect } from "react";

import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from "../../components/navbar/Nav";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";


// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

    const { width } = useWindowDimensions();
    const { sideBarState, setSideBarState } = useSetSideBarState();

    useEffect(() => {
        if (width > 768) {
            setSideBarState(true);
        } else {
            setSideBarState(false);
        }
    }, [width]);

    return (
        <div className=" text-black dark:placeholder-white dark:text-white  bg-white dark:bg-black">

            <Sidebar />
            {sideBarState && <div onClick={() => setSideBarState(false)} className="absolute md:hidden bg-[#12121214] w-full z-[3] h-svh">
            </div>}
            <Navbar />
            <div className={`flex-1 pt-20 p-1 ${sideBarState && width > 768 ? "ml-64" : ""}`}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
