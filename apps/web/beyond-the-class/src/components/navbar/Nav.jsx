// import { Bell, Search, Square, Users } from "lucide-react";
// import ThemeSwitcher from '../ThemeSwitcher';



// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import useLogout from '../../hooks/useLogout';
// import useWindowDimensions from '../../hooks/useWindowDimensions';
// import { useSetSideBarState } from '../../state_management/zustand/useSideBar';
// import { useAuthContext } from '../../context/AuthContext';
// import CreatePostButton from '../../pages/society/post/CreatePostButton';
// import { MenuIcon } from "lucide-react";
// import { ChevronDown } from "lucide-react";



// function Navbar() {

//     const { width } = useWindowDimensions();
//     const { toggleSideBar } = useSetSideBarState()

//     const { logout } = useLogout()
//     const { authUser } = useAuthContext();

//     // const [campusData, setCampusData] = useState(null);

//     // useEffect(() => {
//     //     if (authUser.role === 'student'  ) {

//     //         getCampusData(authUser.university.campusId.name)
//     //             .then(data => setCampusData(data))
//     //             .catch(error => console.error(error));
//     //     }
//     // }, [authUser.campus]);



//     return (
//         <nav className="w-full fixed z-40  bg-[#101011] text-white flex items-center justify-between px-4 py-2 shadow-md">
//             {/* Left Section */}
//             <div className="flex items-center gap-4">
//                 <ThemeSwitcher />



//                 <div className="flex justify-center items-center ">
//                     <div className='flex items-center md:items-end justify-end '>
//                         <img className='h-9 w-9 lg:h-10 lg:w-10 ' src={authUser && authUser.university && authUser?.university?.campusId?.picture} />
//                         {/* <img className='h-9 w-9 lg:h-10 lg:w-10 ' src="/comsats_logo_only_circle.png" /> */}
//                         {/* {authUser && authUser.university && authUser.university.campusId.name} */}
//                         <div className='flex flex-col ml-2 -space-y-1'>
//                             <h5 className='font-semibold hidden md:block text-lg md:text-xl '>Beyond The Class.co  </h5>
//                             <p className="text-xs font-light">{authUser && authUser.university && authUser?.university?.campusId?.name}</p>
//                         </div>
//                     </div>

//                 </div>
//             </div>


//             {/* Search Input */}
//             <div className="flex-1 mx-4 relative max-w-[50%] ">
//                 <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                     type="text"
//                     placeholder="Search"
//                     className="w-full bg-gray-800 text-sm text-white rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
//                 />
//             </div>


//             <div className="h-8 border-l-2 w-0 mx-2 border-[#696969a4]"></div>
//             {/* Right Section - User Profile */}
//             <div className="flex w-[25%]  justify-start items-center">
//                 <CreatePostButton />
//                 <Bell className="mr-2" size={20} />
//                 <div className="flex w-max items-center gap-2 cursor-pointer">
//                     {/* Profile Picture */}
//                     <img
//                         src={authUser.profile.picture}
//                         alt="User"
//                         className="w-7 h-7 rounded-full object-cover"
//                     />
//                     <span className="text-sm font-medium hidden md:block">{authUser.name}</span>
//                     <span className="text-gray-400"><ChevronDown /></span>
//                 </div>
//             </div>


//             {(width < 768) && <MenuIcon className='mx-2' size={22} onClick={toggleSideBar} />}




//         </nav>
//     );
// }


// export default Navbar;





import { Bell, Search, ChevronDown, MenuIcon } from "lucide-react";
import ThemeSwitcher, { ThemeSwitcher2 } from "../ThemeSwitcher";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import CreatePostButton from "../../pages/society/post/CreatePostButton";
import useLogout from "../../hooks/useLogout";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import { ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import routesForLinks from "../../utils/routes/routesForLinks";

function Navbar() {
    const { width } = useWindowDimensions();
    const { toggleSideBar } = useSetSideBarState();
    const { authUser } = useAuthContext();
    const { logout } = useLogout();

    // State for dropdown visibility
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="w-full fixed z-50 bg-white text-black dark:bg-[#101011] dark:text-white flex items-center justify-between px-4 py-2 shadow-md">
            {/* Left Section */}
            {/* Mobile Menu Icon */}
            {width < 768 && (
                <MenuIcon className="mx-2" size={22} onClick={toggleSideBar} />
            )}
            <div className="flex items-center gap-4">
                {/* <ThemeSwitcher /> */}

                <div className="flex justify-center items-center">
                    <div className="flex items-center md:items-end justify-end">
                        <img
                            className="h-9 w-9 lg:h-10 lg:w-10 hidden md:block"
                            src={
                                authUser &&
                                authUser.university &&
                                authUser?.university?.campusId?.picture
                            }
                            alt="Campus Logo"
                        />
                        <div className="flex flex-col ml-2 -space-y-1">
                            <h5 className="font-semibold text-md sm:text-lg md:text-xl">
                                Beyond The Class.co
                            </h5>
                            <p className="text-xs font-light  hidden md:block ">
                                {authUser &&
                                    authUser.university &&
                                    authUser?.university?.campusId?.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="hidden md:flex flex-1 mx-4 relative max-w-[50%]">
                <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-gray-800 text-sm text-white rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
            </div>

            <div className="h-8 border-l-2 w-0 mx-2 border-[#696969a4]"></div>

            <div className="hidden md:block">
                <ThemeSwitcher />
            </div>
            {/* Right Section - User Profile */}
            <div className="flex w-min md:w-[25%] justify-start items-center relative">
                <div className="hidden md:flex">
                    <CreatePostButton />

                </div>
                <div
                    className="flex w-max items-center gap-2 cursor-pointer relative"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                    {/* Profile Picture */}
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


                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-10 right-0 md:left-0
                        bg-white text-black border-[#4d4d4d]  
                        dark:bg-[#171718] dark:text-white dark:border-[#696969a4] border
                         rounded-sm shadow-sm w-40 md:w-full">
                            <ul className="text-sm">
                                <Link to={routesForLinks.user + "/" + authUser._id} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#2B3236] cursor-pointer">
                                    Profile
                                </Link>
                                <ThemeSwitcher2 />

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


        </nav>
    );
}

export default Navbar;




































































































// {/* Logo or Icon */}
// <div className="bg-gray-800 p-2 rounded-lg">
// <Users size={20} />
// </div>

// {/* Square Icon */}
// <Square size={20} className="text-gray-400 hover:text-white cursor-pointer" />

// {/* Notification Bell */}
// <div className="relative">
// <Bell size={20} className="text-gray-400 hover:text-white cursor-pointer" />
// <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
// </div>



// {/* Search Input */ }
// <div className="flex-1 mx-4 relative">
//     <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//     <input
//         type="text"
//         placeholder="Search"
//         className="w-full bg-gray-800 text-sm text-white rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
//     />
// </div>


// {/* Right Section - User Profile */ }
// <div className="flex items-center gap-2 cursor-pointer">
//     {/* Profile Picture */}
//     <img
//         src="https://via.placeholder.com/32" // Replace with actual image URL
//         alt="User"
//         className="w-8 h-8 rounded-full object-cover"
//     />
//     <span className="text-sm font-medium">Sofia Johnson</span>
//     <span className="text-gray-400">▼</span>
// </div>
















// import { Avatar, Badge, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
// import { Logout, PersonAdd, Search, Settings } from '@mui/icons-material';


// import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
// import { FiBell } from 'react-icons/fi';
// import { HiPlus } from 'react-icons/hi2';
// import { RxHamburgerMenu } from 'react-icons/rx';
// import { MdLogout } from "react-icons/md";

// import ThemeSwitcher from '../ThemeSwitcher';



// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import useLogout from '../../hooks/useLogout';
// import useWindowDimensions from '../../hooks/useWindowDimensions';
// import { useSetSideBarState } from '../../state_management/zustand/useSideBar';
// import { useAuthContext } from '../../context/AuthContext';
// import CreatePostButton from '../../pages/society/post/CreatePostButton';



// const Navbar = () => {
//     const { width } = useWindowDimensions();
//     const { toggleSideBar } = useSetSideBarState()

//     const { logout } = useLogout()
//     const { authUser } = useAuthContext();

//     // const [campusData, setCampusData] = useState(null);

//     // useEffect(() => {
//     //     if (authUser.role === 'student'  ) {

//     //         getCampusData(authUser.university.campusId.name)
//     //             .then(data => setCampusData(data))
//     //             .catch(error => console.error(error));
//     //     }
//     // }, [authUser.campus]);



//     return (
//         <Box className="navbar-custom-css border-bottom-half  fixed w-full z-20 h-12   bg-white dark:bg-[#191919]  dark:text-white px-4 py-2 flex justify-between items-center">
//             <div className="flex justify-center items-center ">
//                 <div className='flex items-center md:items-end justify-end '>
//                     {(width < 768) && <RxHamburgerMenu className='mx-2' size={22} onClick={toggleSideBar} />}
//                     <img className='h-9 w-9 lg:h-10 lg:w-10 ' src={authUser && authUser.university && authUser?.university?.campusId?.picture} />
//                     {/* <img className='h-9 w-9 lg:h-10 lg:w-10 ' src="/comsats_logo_only_circle.png" /> */}
//                     {/* {authUser && authUser.university && authUser.university.campusId.name} */}
//                     <div className='flex flex-col ml-2 -space-y-1'>
//                         <h5 className='font-semibold hidden md:block text-lg md:text-xl '>Beyond The Class.co  </h5>
//                         <p className="text-xs font-light">{authUser && authUser.university && authUser?.university?.campusId?.name}</p>
//                     </div>
//                 </div>

//             </div>


//             {/* <div className='hidden md:flex w-[40%] relative ml-10'>
//                 <Search className='absolute top-[0.6rem] bottom-0 left-3' />
//                 <input
//                     type="text"
//                     placeholder="Search Your Network"
//                     style={{
//                         minWidth: '5rem',
//                         width: 'calc(100% - 2rem)',
//                         maxWidth: '30rem'
//                     }}
//                     className="border-2 dark:border-none dark:bg-gray-700 rounded-full text-sm pl-10 text-black dark:text-white py-[0.6rem]  px-10   focus:outline-none"
//                 />
//             </div> */}





//         </Box>

//     );
// };

// export default Navbar;




// // <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6">
// // {/* <Link to={"/create-post"} className='flex justify-center items-center p-1  rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'>
// //     <HiPlus className="h-5 w-5 cursor-pointer mx-1" />
// // </Link> */}
// // <p className='p-1 pr-1 hidden md:block '><CreatePostButton /></p>

// // {/* <div className='hidden lg:block'>
// //     <ThemeSwitcher />
// // </div> */}

// // {/* <MdLogout size={23} onClick={logout} /> */}
// // {/* <IoChatbubbleEllipsesOutline className="h-6 w-6 cursor-pointer" /> */}



// // {/* <Badge badgeContent={1} color="primary">
// //     <FiBell className="h-6 w-6 cursor-pointer" />
// // </Badge> */}

// // {/* {console.log(authUser)} */}
// // {/* <Avatar src={authUser ? authUser.picture : ''} /> */}




// // {/* <IconButton
// //     onClick={handleClick}
// //     size="small"
// //     sx={{ ml: 2 }}
// //     aria-controls={open ? 'account-menu' : undefined}
// //     aria-haspopup="true"
// //     aria-expanded={open ? 'true' : undefined}
// // >
// //     <Avatar src={authUser ? authUser.profile.picture : ''} />
// // </IconButton>
// // <Menu
// //     anchorEl={anchorEl}
// //     id="account-menu"
// //     open={open}
// //     onClose={handleClose}
// //     onClick={handleClose}
// //     PaperProps={{//going to deprecate. change this later.
// //         elevation: 0,
// //         sx: {
// //             overflow: 'visible',
// //             filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
// //             mt: 1.5,
// //             '& .MuiAvatar-root': {
// //                 width: 32,
// //                 height: 32,
// //                 ml: -0.5,
// //                 mr: 1,
// //             },
// //             '&::before': {
// //                 content: '""',
// //                 display: 'block',
// //                 position: 'absolute',
// //                 top: 0,
// //                 right: 14,
// //                 width: 10,
// //                 height: 10,
// //                 bgcolor: 'background.paper',
// //                 transform: 'translateY(-50%) rotate(45deg)',
// //                 zIndex: 0,
// //             },
// //         },
// //     }}
// //     transformOrigin={{ horizontal: 'right', vertical: 'top' }}
// //     anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
// // >
// //     <MenuItem onClick={handleClose}>
// //         <Avatar /> Profile
// //     </MenuItem>
// //     <MenuItem onClick={handleClose}>
// //         <Avatar /> My account
// //     </MenuItem>
// //     <Divider />
// //     <MenuItem >
// //         <ListItemIcon>
// //             <div className='ml-3'>
// //                 <ThemeSwitcher />
// //             </div>
// //         </ListItemIcon>
// //         Change Theme
// //     </MenuItem>
// //     <MenuItem onClick={handleClose}>
// //         <ListItemIcon>
// //             <PersonAdd fontSize="small" />
// //         </ListItemIcon>
// //         Add another account
// //     </MenuItem>
// //     <MenuItem onClick={handleClose}>
// //         <ListItemIcon>
// //             <Settings fontSize="small" />
// //         </ListItemIcon>
// //         Settings
// //     </MenuItem>
// //     <MenuItem onClick={logout}>
// //         <ListItemIcon>
// //             <Logout fontSize="small" />
// //         </ListItemIcon>
// //         Logout
// //     </MenuItem>
// // </Menu> */}
// // </div>
