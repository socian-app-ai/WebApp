import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { bypassRoutes } from '../utils/routes/routesForLinks';
import logWithFileLocation from '../utils/consoleLog';

// A function to restrict access based on user role
const RoleBasedRoute = ({ allowedRoles }) => {
    const { authUser, isLoading } = useAuthContext();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    logWithFileLocation("Auth User in RoleBasedRoute:", authUser.role);

    // If hits / and is 'super' then redirect to /super
    if (authUser && authUser.super_role === 'super') {
        return <Navigate to="/super" replace />;
    }
    // if (authUser && authUser.role === 'no_access') {
    //     logWithFileLocation("IN If role is no_access", authUser.role === 'no_access')
    //     return <Navigate to="/define" />;
    // }

    return (
        // eslint-disable-next-line react/prop-types
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

    // if (!authUser) {

    //     if (window.location.pathname === '/signup' || bypassRoutes.some(route => route.test(window.location.pathname))) {
    //         return <Outlet />
    //     } else if (window.location.pathname === '/login') {
    //         return <Outlet />
    //     }
    // }


    logWithFileLocation("Auth User in SuperRoleBasedRoute:", authUser);
    return (
        authUser && allowedRoles.includes(authUser.super_role)
            ? <Outlet />
            : <Navigate to="/" />
    );
};

