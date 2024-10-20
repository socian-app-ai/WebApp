import { useState } from "react"
// import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const useLogout = () => {
    const [loading, setLoading] = useState(false);

    // const { isLoading, setAuthUser } = useAuthContext()
    const logout = async () => {
        setLoading(true)


        try {
            const res = await axios.post("/api/auth/logout")

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
            localStorage.removeItem("useUta")

            // setAuthUser(false)
            window.location.href = '/login'
        }
    }

    return { loading, logout }
}

export default useLogout