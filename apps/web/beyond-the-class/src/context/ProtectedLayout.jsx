import { Outlet } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { bypassRoutes } from "../utils/routes/routesForLinks";


const ProtectedLayout = () => {
  const { authUser, isLoading } = useAuthContext();
  const navigate = useNavigate()

  if (isLoading) return <p>Loading...</p>;

  if (authUser) {
    if (window.location.pathname === '/login') {
      return navigate('/')
    } else if (window.location.pathname === '/signup') {
      return navigate('/')
    }
  }

  if (!authUser) {

    if (window.location.pathname === '/signup' || bypassRoutes.some(route => route.test(window.location.pathname))) {
      return <Outlet />
    } else if (window.location.pathname === '/login') {
      return <Outlet />
    }
  }

  if (authUser) return <Outlet />


  // console.log("THIS IS SIGNUP IN PROTECTED LAYOUT", authUser, "asnf", window.location.pathname)

  return authUser && <Outlet />;
};


export default ProtectedLayout;
