import { useEffect } from "react";

import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from "../../components/navbar/Nav";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import useUserData from '../../state_management/zustand/useUserData';
import StudentDashboard from '../home/student/StudentDashboard'
import AlumniDashboard from '../home/alumni/AlumniDashboard'
import TeacherDashboard from '../home/teacher/TeacherDashboard'
import ExternalOrgDashboard from '../home/externalOrgranization/ExternalOrgDashboard'
import { useAuthContext } from "../../context/AuthContext";


const Layout = ({ children }) => {
    const { width } = useWindowDimensions();
    const { sideBarState, setSideBarState } = useSetSideBarState();
    // const { userData } = useUserData();
    const { authUser } = useAuthContext();


    // const renderContent = () => {
    //     if (authUser) {
    //         if (authUser.role === 'student') {
    //             return <StudentDashboard />;
    //         } else if (authUser.role === 'alumni') {
    //             return <AlumniDashboard />;
    //         } else if (authUser.role === 'teacher') {
    //             return <TeacherDashboard />;
    //         } else if (authUser.role === 'external_org') {
    //             return <ExternalOrgDashboard />;
    //         }
    //     }
    // };

    return (
        <div className="text-black placeholder-black dark:placeholder-white dark:text-white">
            <Sidebar />
            {sideBarState && <div onClick={() => setSideBarState(false)} className="absolute md:hidden bg-[#121212] w-full z-[3] h-svh"></div>}
            <Navbar />
            <div className={`flex-1 pt-20 p-4 ${sideBarState && width > 768 ? "ml-64" : ""}`}>
                {/* {renderContent()} */}
                {children}
            </div>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
// const Layout = ({ children }) => {

//     const { width } = useWindowDimensions();
//     const { sideBarState, setSideBarState } = useSetSideBarState();

//     useEffect(() => {
//         if (width > 768) {
//             setSideBarState(true);
//         } else {
//             setSideBarState(false);
//         }
//     }, [width]);

//     return (
//         <div className=" text-black dark:placeholder-white dark:text-white  ">

//             <Sidebar />
//             {sideBarState && <div onClick={() => setSideBarState(false)} className="absolute md:hidden bg-[#121212] w-full z-[3] h-svh">
//             </div>}
//             <Navbar />
//             <div className={`flex-1 pt-20 p-4 ${sideBarState && width > 768 ? "ml-64" : ""}`}>
//                 {children}
//             </div>
//         </div>
//     );
// };

export default Layout;
