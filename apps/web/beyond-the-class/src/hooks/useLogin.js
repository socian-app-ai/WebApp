import { useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../config/users/axios.instance"
import { useAuthContext } from "../context/AuthContext"
import { redirect } from "react-router-dom"
// import secureLocalStorage from "react-secure-storage"



const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()
    const login = async (
        email,
        password
    ) => {
        // console.log(email, password)
        const success = handleInputErrors(email, password)
        if (!success) return;
        setLoading(true)
        try {

            const res = await axiosInstance.post("/api/auth/login/student", {
                email,
                password
            })

            const data = res.data;

            console.log(data)
            if (res.status >= 400) {
                throw new Error(data.error)
            }

            // secureLocalStorage.setItem("object", JSON.stringify(data))
            setAuthUser(res.data)
            redirect('/')
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Unexpected error occurred";
            toast.error(errorMessage)
            // throw new Error(error)
        } finally {
            setLoading(false)
        }

    }
    return { loading, login }
}

export default useLogin




function handleInputErrors(
    email, password
) {

    if (!email || !password) {
        toast.error("Please fill all fields")
        return false
    }



    return true
}