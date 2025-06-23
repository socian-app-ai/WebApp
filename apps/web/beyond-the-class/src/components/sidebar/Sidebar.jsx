
import { FaBuilding, FaChalkboardTeacher, FaMedapps } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { MdWorkOutline } from "react-icons/md";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { UserPlus } from "lucide-react";

// import { AllOut, Explore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import CreateSocietyButton from "../../pages/society/CreateSocietyButton";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../config/users/axios.instance";
import SocitiesDropDown from "./sidebarComponents/SocitiesDropDown";
import { ChevronDown } from "lucide-react";
import { SettingsIcon } from "lucide-react";
import { HomeIcon } from "lucide-react";
import { HandCoins } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { UsersRound } from "lucide-react";
import { User } from "lucide-react";
import { Handshake } from "lucide-react";
import { Coffee } from "lucide-react";
import { Trash } from "lucide-react";

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
    // console.log("useEffect");
  }, [width, setSideBarState]);

  // Define different menus for different roles

  // !==========Student
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
    {
      name: "Rules Log",
      path: `/student/rules`,
      icon: <FaMedapps className="w-5" />,
    },
  ];

  // !===========Alumni
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

  // !==========Teacher
  const teacherMenu = [
    { name: "Home", path: `/`, icon: <IoMdHome className="w-5" /> },
    {
      name: "All Uni",
      path: `/teacher/all`,
      icon: <FaMedapps className="w-5" />,
    },
    {
      name: "Inter Campus",
      path: `/teacher/inter`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Alumni",
      path: `/teacher/alumni`,
      icon: <MdWorkOutline className="w-5" />,
    },
    // {
    //   name: "Past Papers",
    //   path: `/teacher/search-courses`,
    //   icon: <FaMedapps className="w-5" />,
    // },
    {
      name: "Teachers Review",
      path: `/teacher/feedbacks`,
      icon: <FaChalkboardTeacher className="w-5" />,
    },


    {
      name: "Cafe Info",
      path: `/teacher/cafe`,
      icon: <FaMedapps className="w-5" />,
    },
    {
      name: "Societies",
      path: `/teacher/societies`,
      icon: <FaMedapps className="w-5" />,
    },
  ];

  // !=========EXT_ORG
  const externalOrgMenu = [
    {
      name: "Organizations",
      path: "/ext-org",
      icon: <FaBuilding className="w-5" />,
    },
    // Add more external organization links
  ];



  // !========= SUPER
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
      submenu: [
        { name: "Create", path: "/super/university/create" },
      ],
    },
    
    {
      name: "Campuses",
      path: "/super/campuses",
      icon: <FaBuilding className="w-5" />,
      submenu: [
        { name: "Create", path: "/super/campus/create" },
        { name: "Subject & Departments", path: "/super/campus/edit/0" },
        { name: "Papers", path: `campus/pastpapers/${authUser.university.campusId._id}` },
      ],
    },
    {
      name: "Teachers",
      path: "/super/teachers/view",
      icon: <SettingsIcon className="w-5" />,
      submenu: [
        { name: "Create", path: "/super/teacher/create" },
        { name: "Bulk Store", path: "/super/teacher/bulk-store" },
      ]
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
    {
      name: "Reports",
      path: `/super/reports`,
      icon: <FaMedapps className="w-5" />,
      submenu: [
        { name: "Teacher Reviews", path: "/super/reports/teacher-reviews" },
        { name: "Posts", path: "/super/reports/posts" },
        { name: "Comments", path: "/super/reports/comments" },
        { name: "Profiles", path: "/super/reports/profiles" },
        { name: "Societies", path: "/super/reports/societies" },
      ]
    },
    {
      name: "Post",
      path: `/super/post`,
      icon: <FaMedapps className="w-5" />,
      submenu: [
        { name: "Create", path: "/super/post/create" },
        { name: "Manage", path: "/super/post/manage" },
      ]
    },
    {
      name: "Teachers",
      path: `/super/teachers`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Team",
      path: `/super/team`,
      icon: <FaMedapps className="w-5" />,
      submenu: [
        {
          name: "Manage",
          path: "/super/team/manage",
          submenu: [
            { name: "New", path: "/super/team/manage/new" },
            { name: 'Assign', path: '/super/team/manage/assign' },
            { name: 'Overview', path: '/super/team/manage/overview' },
            { name: 'Requests', path: '/super/team/manage/requests' },
            { name: 'Ranked', path: '/super/team/manage/ranked' },

          ]
        },
        { name: "Admins", path: "/super/team/" },
        { name: "Campus Mods", path: "/super/team/" },
        { name: "Society Mods", path: "/super/team/" },
        { name: "Ext. Managers", path: "/super/team/" },

      ],
    },

    // ? Rs.100 discount for users gained/subscribed by cafe admin -> must add
    {
      name: "Jobs",
      path: `/super/teachers`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Ads",
      path: `/super/teachers`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Offers/Promotions",
      path: `/super/teachers`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "UnAuthorized Users",//those who tried to signup but were not from any uni (not uni mail)
      path: `/super/teachers`,
      icon: <FaMedapps className="w-5" />,
    },


  ];


  // !========= SUPER
  // ? A current campus dropdown like fleetly
  const adminMenu = [
    {
      name: "Organizations Msg",
      path: "/admin/ext-org",
      icon: <FaBuilding className="w-5" />,
    },

    // {
    //   name: "Campuses",
    //   path: "/admin/campuses",
    //   icon: <FaBuilding className="w-5" />,
    //   submenu: [
    //     { name: "Create", path: "/admin/campus/create" },
    //     { name: "Subject & Departments", path: "/admin/campus/edit/0" },
    //     { name: "Papers", path: `campus/pastpapers/${authUser.university.campusId._id}` },
    //   ],
    // },
    {
      name: "Campuses",
      path: "/admin/campuses",
      icon: <FaBuilding className="w-5" />,
      submenu: [
        // All campus in that University
      ],
    },
    {
      name: "Teachers",
      path: "/admin/teachers",
      icon: <SettingsIcon className="w-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaBuilding className="w-5" />,
    },
    {
      name: "Societies",
      path: `/admin/societies`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Teachers",
      path: `/admin/teachers`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Team",
      path: `/admin/team`,
      icon: <FaMedapps className="w-5" />,
      submenu: [
        {
          name: "Manage",
          path: "/admin/team/manage",
          submenu: [
            { name: "New", path: "/admin/team/manage/new" },
            { name: 'Assign', path: '/admin/team/manage/assign' },
            { name: 'Overview', path: '/admin/team/manage/overview' },
            { name: 'Requests', path: '/admin/team/manage/requests' },
            { name: 'Ranked', path: '/admin/team/manage/ranked' },

          ]
        },
        { name: "Campus Mods", path: "/admin/team/" },
        { name: "Society Mods", path: "/admin/team/" },
        { name: "Ext. Managers", path: "/admin/team/" },

      ],
    },

    {
      name: "Jobs",
      path: `/admin/teachers`,
      icon: <FaMedapps className="w-5" />,
    },

    {
      name: "Offers/Promotions",
      path: `/admin/teachers`,
      icon: <FaMedapps className="w-5" />,
    },

  ];



  const modMenu = [

    {
      name: "Home",
      path: "/mod",
      icon: <HomeIcon className="w-5" />,
    },

    {
      name: "Organizations Msg",
      path: "/mod/ext-org",
      icon: <FaBuilding className="w-5" />,
    },

    // {
    //   name: "Campuses",
    //   path: "/mod/campuses",
    //   icon: <FaBuilding className="w-5" />,
    //   submenu: [
    //     { name: "Create", path: "/mod/campus/create" },
    //     { name: "Subject & Departments", path: "/mod/campus/edit/0" },
    //     { name: "Papers", path: `campus/pastpapers/${authUser.university.campusId._id}` },
    //   ],
    // },
    {
      name: "Campus",
      path: "/mod/campus",
      icon: <FaBuilding className="w-5" />,
      submenu: [
        // All campus in that University
      ],
    },
    {
      name: "Teachers",
      path: "/mod/teachers",
      icon: <SettingsIcon className="w-5" />,
    },
    {
      name: "Users",
      path: "/mod/users",
      icon: <User className="w-5" />,
    },
    {
      name: "Societies",
      path: `/mod/societies`,
      icon: <Handshake className="w-5" />,
    },
    {
      name: "Cafe",
      path: `/mod/cafe`,
      icon: <Coffee className="w-5" />,
      submenu: [
        {
          name: 'Manage',
          path: '/mod/cafe/manage',
          icon: <Coffee className="w-5" />,
        },
        {
          name: 'New Cafe',
          path: '/mod/cafe/new',
          icon: <Coffee className="w-5" />,
        },
        {
          name: 'Cafe FeedBacks',
          path: '/mod/cafe/feedbacks',
          icon: <Coffee className="w-5" />,
        },
        {
          name: 'Cafe User',
          path: '/mod/cafe/users',
          icon: <Coffee className="w-5" />,
        },
        {
          name: 'Cafe Discounts',
          path: '/mod/cafe/discounts',
          icon: <Coffee className="w-5" />,
        },
        {
          name: 'Cafe History/Deletes',
          path: '/mod/cafe/deletes',
          icon: <Trash className="w-5" />,
        }
      ]
    },



    {
      name: "Team",
      path: `/mod/team`,
      icon: <UsersRound className="w-5" />,
      submenu: [
        {
          name: "Manage",
          path: "/mod/team/manage",
          submenu: [
            { name: "New", path: "/mod/team/manage/new" },
            { name: 'Assign', path: '/mod/team/manage/assign' },
            { name: 'Overview', path: '/mod/team/manage/overview' },
            { name: 'Requests', path: '/mod/team/manage/requests' },
            { name: 'Ranked', path: '/mod/team/manage/ranked' },

          ]
        },
        { name: "Campus Mods", path: "/mod/team/" },
        { name: "Society Mods", path: "/mod/team/" },
        { name: "Ext. Managers", path: "/mod/team/" },

      ],
    },

    {
      name: "Jobs",
      path: `/mod/jobs`,
      icon: <NotebookPen className="w-5" />,
    },

    {
      name: "Offers/Promotions",
      path: `/mod/offers`,
      icon: <HandCoins className="w-5" />,
    },


  ];





  const processMenu = [];
  // Select menu based on user role
  let menuItems = processMenu;



  menuItems = authUser
    ?
    (
      //  || localStorage.getItem('preferedView') === 'student'
      authUser.super_role === "super" ? superMenu
        : ((authUser.role === "student" && (authUser.super_role === 'none' || localStorage.getItem('preferedView') === 'student')))
          ? studentMenu
          : authUser.role === "alumni" ? alumniMenu
            : (authUser.role === "teacher" && (authUser.super_role === 'none' || localStorage.getItem('preferedView') === 'teacher'))
              ? teacherMenu
              : (authUser.super_role === 'mod' && localStorage.getItem('preferedView') === 'mod')
                ? modMenu
                : authUser.role === "ext_org" ? externalOrgMenu
                  : processMenu
    ) : processMenu

  const [dropdownStates, setDropdownStates] = useState({});


  const toggleDropdown = (menuName) => {
    setDropdownStates((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };


  return (
    <div
      className={`${sideBarState ? "left-0" : "-left-[100rem]"}  z-20 w-60
         bg-[#ffffff] text-black
           dark:bg-[#171718] dark:text-white 
           h-screen py-4 px-3 fixed
           overflow-y-auto
           overflow-x-hidden
           border-r dark:border-[#696969a4]
           
           `}
    >
      {/* bg-sidebar-pattern bg-bg-var-sidebar dark:bg-bg-var-sidebar-dark */}
      <nav className="mt-12">
        <ul className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <li key={item.name} className="relative">
              <Link
                to={item.path}
                className="flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => width < 768 && setSideBarState(false)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
                {item.submenu && (
                  <button
                    className="ml-auto focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(item.name);
                    }}
                  >
                    {dropdownStates[item.name] ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
              </Link>
              {item.submenu && dropdownStates[item.name] && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className="flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => width < 768 && setSideBarState(false)}
                      >
                        {subItem.name}

                        {subItem.submenu && (
                          <button
                            className="ml-auto focus:outline-none"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDropdown(subItem.name);
                            }}
                          >
                            {dropdownStates[subItem.name] ? (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        )}


                      </Link>


                      {subItem.submenu && dropdownStates[subItem.name] && (
                        <ul className="ml-2 mt-1 space-y-1">
                          {subItem.submenu.map((subItemChild) => (
                            <li key={subItemChild.name}>
                              <Link
                                to={subItemChild.path}
                                className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                onClick={() => width < 768 && setSideBarState(false)}
                              >
                                {subItemChild.name}
                              </Link>
                              {subItemChild.submenu && (
                                <button
                                  className="ml-auto focus:outline-none"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown(subItemChild.name);
                                  }}
                                >
                                  {dropdownStates[subItemChild.name] ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* <ul className="border-b border-[#787878] flex flex-col">
          {menuItems.map((item, idx) => (
            <div key={item.name} className="relative">
              <Link
                to={item.path}
                className={`text-sm text-[#787878] flex justify-start items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#2B3236]`}
                onClick={() => width < 768 && setSideBarState(false)}
              >
                {item.icon}
                <p className="ml-2">{item.name}</p>
                {item.submenu && (
                  <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
                )}
              </Link>
              {item.submenu && (
                <ul className="ml-6 mt-1 border-l pl-4 border-gray-200 dark:border-gray-600">
                  {item.submenu.map((subItem) => (
                    <Link
                      to={subItem.path}
                      key={subItem.name}
                      className="text-sm text-[#787878] flex justify-start items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#2B3236]"
                      onClick={() => width < 768 && setSideBarState(false)}
                    >
                      <p>{subItem.name}</p>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul> */}

        {/* <ul className="border-b border-[#787878] flex flex-col">
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
        </ul> */}

        <CreateSocietyButton />

        {/* <SocitiesDropDown title="Top Socities" /> */}
        <SocitiesDropDown
          title="My Socities"
          isOpenParam={true}
        />

        <UpcomingEvents />

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

      <div className="flex flex-row justify-center w-full">
        <button className="rounded-md px-2 py-1 bg-[#2C2C2C] text-[#9F9F9F] font-bold ">
          <p className="text-md flex flex-row justify-center items-center">
            {" "}
            <UserPlus size={15} /> Invite Friends
          </p>
        </button>
      </div>
    </div>
  );
}
export default Sidebar;


const eventsData = [
  {
    date: "20",
    month: "Dec",
    title: "Product Designer...",
    interested: "78K interested",
    going: "7.7K going",
  },
  {
    date: "28",
    month: "Jan",
    title: "Product Designer...",
    interested: "31K interested",
    going: "7.7K going",
  },
  {
    date: "12",
    month: "Feb",
    title: "Indonesian Frontend...",
    interested: "12K interested",
    going: "3.2K going",
  },
];

const UpcomingEvents = () => {
  return (
    <div className="px-2  font-sans">
      {/* Header */}
      <div className="flex text-[#787878] justify-between items-center mb-4">
        <h2 className="text-sm  font-semibold">Upcoming event</h2>
        <span className=" text-xs rounded-full">12</span>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {eventsData.map((event, index) => (
          <div key={index} className="flex items-center space-x-3">
            {/* Date */}
            <div className="bg-gray-700 w-8 h-10 flex flex-col items-center justify-center rounded-md">
              <p className="text-sm font-bold">{event.date}</p>
              <p className="text-xs text-gray-300 uppercase">{event.month}</p>
            </div>
            {/* Event Details */}
            <div>
              <p className="text-sm font-medium truncate w-[200px]">
                {event.title}
              </p>
              <p className="text-xs text-gray-400">
                {event.interested} · {event.going}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
