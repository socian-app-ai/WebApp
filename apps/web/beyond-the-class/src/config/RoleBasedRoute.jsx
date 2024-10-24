import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// A function to restrict access based on user role
const RoleBasedRoute = ({ allowedRoles }) => {
    const { authUser } = useAuthContext();

    console.log("Auth User in RoleBasedRoute:", authUser);
    return (
        authUser && allowedRoles.includes(authUser.role)
            ? <Outlet />
            : <Navigate to="/unauthorized" />
    );
};

export default RoleBasedRoute;



export const SuperRoleBasedRoute = ({ allowedRoles }) => {
    const { authUser } = useAuthContext();

    console.log("Auth User in SuperRoleBasedRoute:", authUser);
    return (
        authUser && allowedRoles.includes(authUser.super_role)
            ? <Outlet />
            : <Navigate to="/unauthorized" />
    );
};

