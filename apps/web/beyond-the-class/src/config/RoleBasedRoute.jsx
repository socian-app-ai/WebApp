import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// A function to restrict access based on user role
const RoleBasedRoute = ({ allowedRoles }) => {
    const { authUser, isLoading } = useAuthContext();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log("Auth User in RoleBasedRoute:", authUser);

    // If hits / and is 'super' then redirect to /super
    if (authUser && authUser.super_role === 'super') {
        return <Navigate to="/super" replace />;
    }
    return (
        authUser && allowedRoles.includes(authUser.role)
            ? <Outlet />
            : <Navigate to="/" />
    );
};

export default RoleBasedRoute;



export const SuperRoleBasedRoute = ({ allowedRoles }) => {
    const { authUser, isLoading } = useAuthContext();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log("Auth User in SuperRoleBasedRoute:", authUser);
    return (
        authUser && allowedRoles.includes(authUser.super_role)
            ? <Outlet />
            : <Navigate to="/" />
    );
};

