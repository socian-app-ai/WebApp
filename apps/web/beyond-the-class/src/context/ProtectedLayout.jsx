// import { Navigate, Outlet } from "react-router-dom";
// import { useAuthContext } from "./AuthContext";


// const ProtectedLayout = () => {
//   const { authUser, isLoading } = useAuthContext();

//   if (isLoading) return <p>Loading...</p>;

//   return authUser ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedLayout;
import {  Outlet } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { redirect } from "react-router-dom";

const ProtectedLayout = () => {
  const { authUser, isLoading } = useAuthContext();
console.log("inprotected layout", authUser, !authUser)

  if (isLoading) return <div>Loading...</div>;

  if (!authUser) {
       redirect('/login');
  }
//   else if (window.location.href === '/'){
//     window.location.href = '/'
//   }else{
//     window.location.reload()
//   }
  console.log("Out inprotected layout", authUser, !authUser)


  return <Outlet />;
};

export default ProtectedLayout;
