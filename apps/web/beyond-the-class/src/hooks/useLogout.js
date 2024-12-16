import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import axiosInstance from "../config/users/axios.instance";
import { routesForApi } from "../utils/routes/routesForLinks";

const useLogout = () => {
    const [loading, setLoading] = useState(false);

    const { isLoading, setAuthUser } = useAuthContext()
    const logout = async () => {
        setLoading(true)


        try {
            const res = await axiosInstance.post(routesForApi.auth.logout)
            // "/api/auth/logout"

            // console.log(res)
            const data = res.data;

            if (data.error) {
                // toast.error(data.error)
                throw new Error(data.error)
            }

        } catch (error) {

            const errorMessage = error.response?.data?.error || "Unexpected error occurred";
            toast.error(errorMessage)
        }
        finally {
            setLoading(false)
            // sessionStorage.clear('iidxi')
            setAuthUser(null)
            window.location.href = '/login'
        }
    }

    return { loading, logout }
}

export default useLogout