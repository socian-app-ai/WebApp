import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../config/users/axios.instance";
// import useUserData from "../state_management/zustand/useUserData";

// import Cookies from 'js-cookie'


export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {


    const [authUser, setAuthUser] = useState(null);
    // const { setUserData } = useUserData()
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {

        const fetchSessionData = async () => {
            try {
                const res = await axiosInstance.get('/api/auth/session', { credentials: 'include' });
                if (res.status === 200) {
                    // setUserData(res.data);
                    // const data = res.data
                    // Cookies.set('name', JSON.stringify(res.data))
                    setAuthUser(res.data)
                    console.log("data:", res.data)
                    // console.log("HMM", Cookies.get())
                } else {
                    setAuthUser(null);
                    if (window.location.pathname !== '/login' && res.status === 401) {
                        window.location.href = '/login'
                    }
                    // console.log(window.location.pathname)
                }
            } catch (error) {
                setAuthUser(null)
                console.error("Failed to fetch session data", error);
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
                // console.log(window.location.pathname)

            } finally {
                setIsLoading(false);
            }
        };

        fetchSessionData();

    }, [authUser]);




    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
