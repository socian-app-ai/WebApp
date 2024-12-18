import { FaBuilding, FaChalkboardTeacher, FaMedapps } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { MdWorkOutline } from "react-icons/md";

// import { AllOut, Explore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import CreateSocietyButton from "../../pages/society/CreateSocietyButton";

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
  ];

  const processMenu = [];
  // Select menu based on user role
  const menuItems = authUser
    ? authUser.super_role === "super"
      ? superMenu
      : authUser.role === "student"
        ? studentMenu
        : authUser.role === "alumni"
          ? alumniMenu
          : externalOrgMenu
    : processMenu;

  return (
    <div
      className={`${sideBarState ? "left-0" : "-left-[100rem]"}  z-20 w-60
         bg-[#171718] text-white
           dark:bg-[#171718] dark:text-white 
           h-screen py-4 px-3 fixed

           border-r dark:border-[#696969a4]
           
           `}
    >
      {/* bg-sidebar-pattern bg-bg-var-sidebar dark:bg-bg-var-sidebar-dark */}
      <nav className="mt-16">
        <ul className="border-b border-[#787878] flex flex-col">
          <CreateSocietyButton />

          {menuItems.map((item, idx) => (
            <Link
              to={item.path}
              key={item.name}
              // ${idx === 5 && ' border-b-2'}
              className={`text-sm text-[#787878] flex justify-start items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#2B3236]`}
              onClick={() => width < 768 && setSideBarState(false)}
            >
              {item.icon}
              <p className="ml-2">{item.name}</p>
            </Link>
          ))}
        </ul>

        <TopCommunitiesDropdown />
        <TopCommunitiesDropdown isOpenParam={true} />

        <div className=" absolute bottom-0 w-full">
          <button className="rounded-md px-2 py-1 bg-[#2C2C2C] text-[#9F9F9F] font-bold ">
            <p className="text-md flex flex-row justify-center items-center">
              {" "}
              <UserPlus size={15} /> Invite Friends
            </p>
          </button>
        </div>

        {/* <div>
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
        </div> */}
      </nav>
    </div>
  );
}
export default Sidebar;

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { UserPlus } from "lucide-react";

function TopCommunitiesDropdown({ isOpenParam }) {
  const [isOpen, setIsOpen] = useState(isOpenParam ?? false);

  const communities = [
    { name: "DevHelp", icon: "📂", notification: true },
    { name: "Learn Javascript", icon: "🟨", notification: false },
    { name: "Aviyel", icon: "🟣", notification: false },
  ];

  return (
    <div className="text-[#787878] px-2">
      {/* Dropdown Header */}
      <div
        className="flex items-center  py-1  cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`transform  transition-transform ${isOpen ? "rotate-90" : "rotate-0"
            }`}
        >
          <ChevronRight size={18} />
        </span>
        <p className="text-sm">Top Societies</p>
      </div>

      {/* Dropdown Items */}
      {isOpen && (
        <ul className="px-1">
          {communities.map((community, index) => (
            <li key={index} className="flex items-center p-2 cursor-pointer">
              <span className="mr-1">{community.icon}</span>
              <span className="text-sm">{community.name}</span>
              {/* {community.notification && (
                <span className="w-2 h-2 bg-red-500 rounded-full ml-auto"></span>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
