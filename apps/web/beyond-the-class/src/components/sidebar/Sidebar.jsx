import { FaBuilding, FaChalkboardTeacher, FaMedapps } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { MdWorkOutline } from "react-icons/md";

// import { AllOut, Explore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";

function Sidebar() {
  const { sideBarState, setSideBarState } = useSetSideBarState();
  const { width } = useWindowDimensions();
  // const { userData } = useUserData();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (width < 768) {
      setSideBarState(false);
    }
    if (width > 768) {
      setSideBarState(true);
    }
    console.log("useEffect");
  }, [width, setSideBarState]);

  // Define different menus for different roles
  const studentMenu = [
    { name: "Home", path: `/`, icon: <IoMdHome className="w-5" /> },
    {
      name: "All Uni",
      path: `/student/all`,
      icon: <FaMedapps className="w-5" />,
    },
    {
      name: "Inter Campus",
      path: `/student/inter`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Alumni",
      path: `/student/alumni`,
      icon: <MdWorkOutline className="w-5" />,
    },
    {
      name: "Past Papers",
      path: `/student/search-courses`,
      icon: <FaMedapps className="w-5" />,
    },
    {
      name: "Teachers Review",
      path: `/student/reviews/teachers`,
      icon: <FaChalkboardTeacher className="w-5" />,
    },

    {
      name: "Navigation Tracker",
      path: `/student/navigation`,
      icon: <FaMedapps className="w-5" />,
    },
    {
      name: "Cafe Info",
      path: `/student/cafe`,
      icon: <FaMedapps className="w-5" />,
    },
    {
      name: "Societies",
      path: `/student/societies`,
      icon: <FaMedapps className="w-5" />,
    },
  ];

  const alumniMenu = [
    {
      name: "Alumni Home",
      path: `/alumni`,
      icon: <IoMdHome className="w-5" />,
    },
    {
      name: "Societies",
      path: `/student/societies`,
      icon: <FaMedapps className="w-5" />,
    },
    // Add more alumni-specific links
  ];

  const externalOrgMenu = [
    {
      name: "Organizations",
      path: "/ext-org",
      icon: <FaBuilding className="w-5" />,
    },
    // Add more external organization links
  ];

  const superMenu = [
    {
      name: "Organizations",
      path: "/super/ext-org",
      icon: <FaBuilding className="w-5" />,
    },
    {
      name: "Universities",
      path: "/super/universities",
      icon: <FaBuilding className="w-5" />,
    },
    {
      name: "Campuses",
      path: "/super/campuses",
      icon: <FaBuilding className="w-5" />,
    },
    {
      name: "Users",
      path: "/super/users",
      icon: <FaBuilding className="w-5" />,
    },
    {
      name: "Societies",
      path: `/super/societies`,
      icon: <FaMedapps className="w-5" />,
    },
  ]

  const processMenu = [];
  // Select menu based on user role
  const menuItems = authUser
    ?
    authUser.super_role === 'super'
      ? superMenu
      :
      (authUser.role === "student"
        ? studentMenu
        : authUser.role === "alumni"
          ? alumniMenu
          : externalOrgMenu)
    : processMenu;

  return (
    <div
      className={`${sideBarState ? "left-0" : "-left-[100rem]"
        }  z-20 w-64 bg-sidebar-pattern bg-bg-var-sidebar dark:bg-bg-var-sidebar-dark  dark:text-white h-screen p-4 fixed`}
    >
      <nav className="mt-12">
        <ul className="border-b flex flex-col">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className="flex justify-start items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#2B3236]"
              onClick={() => width < 768 && setSideBarState(false)}
            >
              {item.icon}
              <p className="ml-2">{item.name}</p>
            </Link>
          ))}
        </ul>

        <div>
          <h5>Subscribed Socieites</h5>
          <ul className="border-b flex flex-col">
            {authUser &&
              authUser?.subscribedSocities?.map((society) => (
                <Link
                  to={`${authUser.role === "student"
                    ? "/student"
                    : authUser.role === "alumni"
                      ? "/alumni"
                      : "/ext-org"
                    }/${society._id}`}
                  key={society._id}
                  className="flex justify-start items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#2B3236]"
                  onClick={() => width < 768 && setSideBarState(false)}
                >
                  {society.icon}
                  <p className="ml-2">{society.name}</p>
                </Link>
              ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
export default Sidebar;

// function Sidebar() {
//     const { sideBarState, setSideBarState } = useSetSideBarState();
//     const { width } = useWindowDimensions();

//     const { userData, setUserData } = useUserData()
//     const menuItems = [
//         { name: "Home", path: "/", icon: <IoMdHome className="w-5" /> },
//         { name: "Teachers", path: "/teachers/reviews", icon: <FaChalkboardTeacher className="w-5" /> },
//         { name: "Past Papers", path: "/pastpapers/program-name", icon: <FaMedapps className="w-5" /> },
//         { name: "Explore", path: "/", icon: <Explore className="w-5" /> },
//         { name: "All", path: "/", icon: <AllOut className="w-5" /> }
//     ];

//     if (userData) {
//         if (userData.role === ' student') {
//             menuItems.push(
//                 { name: "Student", path: "/", icon: <IoMdHome className="w-5" /> },
//             )
//         }
//     }

//     return (
//         <div className={`${sideBarState ? 'left-0' : '-left-[100rem]'} sidebar-custom-css  z-20 w-64 bg-white dark:bg-[#191919] dark:text-white h-screen p-4 fixed border-right-half`}>

//             <nav className="mt-12 ">
//                 <ul className="border-b flex flex-col">
//                     {menuItems.map((item) => (
//                         <Link
//                             to={item.path}
//                             key={item.name}
//                             className={`flex justify-start items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#2B3236] cursor-pointer `}
//                             onClick={() => {

//                                 if (width < 768) {
//                                     setSideBarState(false)
//                                 }
//                             }}
//                         >
//                             {item.icon}
//                             <p className="ml-2">{item.name}</p>
//                         </Link>
//                     ))}
//                 </ul>
//             </nav>

//         </div>
//     );
// }
