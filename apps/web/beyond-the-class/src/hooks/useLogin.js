import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../config/users/axios.instance";
import { useAuthContext } from "../context/AuthContext";
import { redirect } from "react-router-dom";
import { routesForApi } from "../utils/routes/routesForLinks";
import { useToast } from "../components/toaster/ToastCustom";
import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage"

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const { addToast } = useToast();

  const navigate = useNavigate()
  function handleInputErrors(email, password) {
    if (!email || !password) {
      addToast("Please fill all fields");
      return false;
    }

    return true;
  }


  const login = async (email, password) => {
    // console.log(email, password)
    const success = handleInputErrors(email, password);
    if (!success) return;
    setLoading(true);
    try {
      // "/api/auth/login"
      const res = await axiosInstance.post(routesForApi.auth.login, {
        email,
        password,
      });

      const data = res.data;
      console.log("DE", data)

      if (res.data?.redirectUrl) {
        console.log(res.data.redirectUrl)
        return window.location.href = `${res.data.redirectUrl}`
      }
      // console.log(data);
      if (res.status >= 400) {
        throw new Error(data.error);
      }


      // secureLocalStorage.setItem("object", JSON.stringify(data))
      setAuthUser(res.data);

       // Check if redirect to delete account
    const params = new URLSearchParams(window.location.search);
    if (params.get("deleteAccount") === "true") {
      return navigate("/delete-account");
    }
      redirect("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Unexpected error occurred";
      addToast(errorMessage);
      // throw new Error(error)
    } finally {
      setLoading(false);
    }
  };
  return { loading, login };
};

export default useLogin;


