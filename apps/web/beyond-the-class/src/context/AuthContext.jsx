import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axiosInstance from "../config/users/axios.instance";
import { bypassRoutes, routesForApi } from "../utils/routes/routesForLinks";
import logWithFileLocation from "../utils/consoleLog";
export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {

                const res = await axiosInstance.get('/api/auth/session', { credentials: 'include' });

                if (res.status >= 200 && res.status < 300) {
                    setAuthUser(res.data);
                    // { import.meta.env.VITE_DEVELOPMENT === "developement" && console.log("Authenticated user data:", res.data); }
                    logWithFileLocation("Authenticated user data:", res.data)

                    // Redirect to home if currently on the login page
                    if (window.location.pathname === '/login') {
                        window.location.href = '/';
                    }
                } else {
                    console.warn("Session fetch failed with status:", res.status);
                    handleUnauthenticated();
                }
            } catch (error) {
                console.error("Error fetching session data:", error);
                // console.log(window.location.pathname, "thiss", bypassRoutes.some(route => route.test(window.location.pathname)))
                // handleUnauthenticated();// dont use here otherwise routes wont work, had to solve this issue for hours
                if (window.location.pathname === '/signup' || bypassRoutes.some(route => route.test(window.location.pathname))) {
                    return
                } else if (window.location.pathname !== '/login') {
                    window.location.pathname = '/login'
                }
            } finally {
                setIsLoading(false);
            }
        };

        const handleUnauthenticated = () => {
            setAuthUser(null);


            // if (window.location.pathname !== '/login') {
            //     window.location.pathname = '/login'
            // } else if (window.location.pathname === '/signup') {
            //     window.location.pathname = '/signup'
            // }


            // // Redirect only if not already on the login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        };

        fetchSessionData();
    }, [setAuthUser]);

    const value = useMemo(() => ({ authUser, setAuthUser, isLoading }), [authUser, setAuthUser, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};






// import { createContext, useContext, useEffect, useMemo } from "react";
// import React from "react";
// import axiosInstance from "../config/users/axios.instance";
// import { bypassRoutes } from "../utils/routes/routesForLinks";
// import secureLocalStorage from "react-secure-storage";

// export const AuthContext = createContext();

// export const useAuthContext = () => {
//     return useContext(AuthContext);
// };

// // eslint-disable-next-line react/prop-types
// export const AuthContextProvider = ({ children }) => {
//     const [authUser, setAuthUser] = React.useState(null);
//     const [isLoading, setIsLoading] = React.useState(true);

//     const STORAGE_KEY = "authData";
//     const TIMESTAMP_KEY = "authTimestamp";
//     const SESSION_KEY = 'iidxi';


//     const isWithin24Hours = (timestamp) => {
//         const now = Date.now();
//         const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//         return now - timestamp < oneDay;
//     };





//     useEffect(() => {
//         const storedData = secureLocalStorage.getItem(STORAGE_KEY);
//         const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY);

//         const handleUnauthenticated = () => {
//             setAuthUser(null);
//             secureLocalStorage.removeItem(STORAGE_KEY);
//             localStorage.removeItem(TIMESTAMP_KEY);
//             sessionStorage.removeItem(SESSION_KEY)
//             if (window.location.pathname !== '/login') {
//                 window.location.href = '/login';
//             }
//         };

//         const fetchSessionData = async () => {
//             try {
//                 const res = await axiosInstance.get('/api/auth/session', { credentials: 'include' });
//                 if (res.status >= 200 && res.status < 300) {
//                     const data = res.data;
//                     setAuthUser(data);
//                     secureLocalStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//                     localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());

//                     if (window.location.pathname === '/login') {
//                         window.location.href = '/';
//                     }
//                 } else {
//                     console.warn("Session fetch failed with status:", res.status);
//                     handleUnauthenticated();
//                 }
//             } catch (error) {
//                 console.error("Error fetching session data:", error);
//                 if (window.location.pathname === '/signup' || bypassRoutes.some(route => route.test(window.location.pathname))) {
//                     return
//                 } else if (window.location.pathname !== '/login') {
//                     window.location.pathname = '/login'
//                 }
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (sessionStorage.getItem(SESSION_KEY)) {
//             if (storedData && storedTimestamp && isWithin24Hours(Number(storedTimestamp))) {
//                 setAuthUser(JSON.parse(storedData));
//                 setIsLoading(false);
//             } else {
//                 fetchSessionData();
//             }
//         }


//         // handleUnauthenticated()
//         setIsLoading(false);




//     }, []);

//     const value = useMemo(() => ({ authUser, setAuthUser, isLoading }), [authUser, isLoading]);

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
