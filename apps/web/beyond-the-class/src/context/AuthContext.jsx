import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axiosInstance from "../config/users/axios.instance";
import { bypassRoutes } from "../utils/routes/routesForLinks";
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
                    // console.log("Authenticated user data:", res.data);

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


