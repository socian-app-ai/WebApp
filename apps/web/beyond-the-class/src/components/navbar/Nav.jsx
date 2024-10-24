
import { Avatar, Badge, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Logout, PersonAdd, Search, Settings } from '@mui/icons-material';


import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { FiBell } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi2';
import { RxHamburgerMenu } from 'react-icons/rx';

import ThemeSwitcher from '../ThemeSwitcher';



import { useState } from 'react';
import { Link } from 'react-router-dom';

import useLogout from '../../hooks/useLogout';

import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useSetSideBarState } from '../../state_management/zustand/useSideBar';
import useUserData from '../../state_management/zustand/useUserData';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
// import useUserData from '../../zustand/useUserData';



const Navbar = () => {
    const { userData } = useUserData()
    const { width } = useWindowDimensions();
    const { toggleSideBar } = useSetSideBarState()

    const { logout } = useLogout()
    const { authUser } = useAuthContext();

    // const [campusData, setCampusData] = useState(null);

    // useEffect(() => {
    //     if (userData.role === 'student'  ) {

    //         getCampusData(userData.university.campusLocation.name)
    //             .then(data => setCampusData(data))
    //             .catch(error => console.error(error));
    //     }
    // }, [userData.campus]);



    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };





    return (
        <Box className="navbar-custom-css border-bottom-half  fixed w-full z-20 h-15   bg-white dark:bg-[#191919]  dark:text-white px-4 py-2 flex justify-between items-center">
            <div className="flex justify-center items-center ">
                <div className='flex items-center md:items-end justify-end '>
                    {(width < 768) && <RxHamburgerMenu className='mx-2' size={22} onClick={toggleSideBar} />}
                    <img className='h-9 w-9 lg:h-10 lg:w-10 ' src={authUser && authUser.university && authUser.university.campusLocation.picture} />
                    {/* <img className='h-9 w-9 lg:h-10 lg:w-10 ' src="/comsats_logo_only_circle.png" /> */}
                    {/* {authUser && authUser.university && authUser.university.campusLocation.name} */}
                    <div className='flex flex-col ml-2 -space-y-1'>
                        <h5 className='font-semibold hidden md:block text-lg md:text-2xl '> {authUser && authUser.university && authUser.university.campusLocation.name}</h5>
                        <p className="text-xs font-light">Beyond The Class</p>
                    </div>
                </div>

            </div>


            {/* <div className='hidden md:flex w-[40%] relative ml-10'>
                <Search className='absolute top-[0.6rem] bottom-0 left-3' />
                <input
                    type="text"
                    placeholder="Search Your Network"
                    style={{
                        minWidth: '5rem',
                        width: 'calc(100% - 2rem)',
                        maxWidth: '30rem'
                    }}
                    className="border-2 dark:border-none dark:bg-gray-700 rounded-full text-sm pl-10 text-black dark:text-white py-[0.6rem]  px-10   focus:outline-none"
                />
            </div> */}


            <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6">
                <Link to={"/create-post"} className='flex justify-center items-center p-1  rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'>
                    <HiPlus className="h-5 w-5 cursor-pointer mx-1" />
                    <p className='p-1 pr-1 hidden md:block '>Create</p>
                </Link>
                <div className='hidden lg:block'>
                    <ThemeSwitcher />
                </div>

                <IoChatbubbleEllipsesOutline className="h-6 w-6 cursor-pointer" />



                <Badge badgeContent={1} color="primary">
                    <FiBell className="h-6 w-6 cursor-pointer" />
                </Badge>

                {/* {console.log(userData)} */}
                {/* <Avatar src={userData ? userData.picture : ''} /> */}




                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar src={userData ? userData.picture : ''} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{//going to deprecate. change this later.
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>
                        <Avatar /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Avatar /> My account
                    </MenuItem>
                    <Divider />
                    <MenuItem >
                        <ListItemIcon>
                            <div className='ml-3'>
                                <ThemeSwitcher />
                            </div>
                        </ListItemIcon>
                        Change Theme
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Add another account
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </div>



        </Box>

    );
};

export default Navbar;




