import { Outlet } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { bypassRoutes } from "../utils/routes/routesForLinks";
import AestheticLoadingScreen from "../components/loading/LoadingScreen";
import logWithFileLocation from "../utils/consoleLog";
import { Navigate } from "react-router-dom";


const ProtectedLayout = () => {
  const { authUser, isLoading } = useAuthContext();
  const navigate = useNavigate()
  // logWithFileLocation("THIS IS SIGNUP IN PROTECTED LAYOUT  1", authUser, "asnf", window.location.pathname)


  if (isLoading) return <AestheticLoadingScreen />;

  if (authUser) {
    if (window.location.pathname === '/login') {
      return navigate('/')
    } else if (window.location.pathname === '/signup') {
      return navigate('/')
    }
  }
  // logWithFileLocation("THIS IS SIGNUP IN PROTECTED LAYOUT2", authUser, "asnf", window.location.pathname)


  if (!authUser) {

    if (window.location.pathname === '/signup' || bypassRoutes.some(route => route.test(window.location.pathname))) {
      return <Outlet />
    } else if (window.location.pathname === '/login') {
      return <Outlet />
    }
  }
  // logWithFileLocation("THIS IS SIGNUP IN PROTECTED LAYOUT3", authUser, "asnf", window.location.pathname)



  if (authUser) return <Outlet />


  // logWithFileLocation("THIS IS SIGNUP IN PROTECTED LAYOUT", authUser, "asnf", window.location.pathname)

  return authUser && <Outlet />;
};


export default ProtectedLayout;




// import { Outlet } from "react-router-dom";
// import { useAuthContext } from "./AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { bypassRoutes } from "../utils/routes/routesForLinks";
// import AestheticLoadingScreen from "../components/loading/LoadingScreen";

// const ProtectedLayout = () => {
//   const { authUser, isLoading } = useAuthContext();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading) {
//       if (authUser) {
//         if (window.location.pathname === "/login" || window.location.pathname === "/signup") {
//           navigate("/");
//         }
//       } else {
//         if (
//           !(window.location.pathname === "/login" ||
//             window.location.pathname === "/signup" ||
//             bypassRoutes.some((route) => route.test(window.location.pathname)))
//         ) {
//           navigate("/login");
//         }
//       }
//     }
//   }, [authUser, isLoading, navigate]);

//   if (isLoading) {
//     return <AestheticLoadingScreen />;
//   }

//   return <Outlet />;
// };

// export default ProtectedLayout;
