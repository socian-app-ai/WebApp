/* eslint-disable react/prop-types */
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
    // logWithFileLocation("Auth User in RoleBasedRoute:", authUser.role);

    // If hits / and is 'super' then redirect to /super
    console.log("DO", rolesList.superRoles.superRoles.includes(authUser.super_role))
    if (authUser && rolesList.superRoles.superRoles.includes(authUser.super_role) && allowedRoles.includes(authUser.role)) { // ? is also any regular role
        if (!localStorage.getItem('preferedView')) {
            console.log("is here", localStorage.getItem('preferedView'))
            localStorage.setItem('preferedView', authUser.role);
            return <Navigate to={`/${authUser.super_role}`} replace />;
        }
        console.log("is better", localStorage.getItem('preferedView'))

        const preferredView = localStorage.getItem('preferedView')

        console.log(allowedRoles.includes(preferredView))
        if (allowedRoles.includes(preferredView)) return <Outlet />
        console.log("should be here ", `/${authUser.super_role}`)

        return <Navigate to={`/${authUser.super_role}`} replace />;
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

    console.log("was in super role")
    if (authUser && rolesList.roles.roles.includes(authUser.role) && allowedRoles.includes(authUser.super_role)) { // ? is also any regular role
        if (!localStorage.getItem('preferedView')) {
            console.log("is here", localStorage.getItem('preferedView'))
            localStorage.setItem('preferedView', authUser.role);
            return <Navigate to={`/`} replace />;
        }
        console.log("is better", localStorage.getItem('preferedView'))

        const preferredView = localStorage.getItem('preferedView')

        console.log(allowedRoles.includes(preferredView))
        if (allowedRoles.includes(preferredView)) return <Outlet />

        console.log("should be here ", `/${authUser.super_role}`)
        return <Navigate to={`/${authUser.super_role}`} replace />;
    }

    // if (!authUser) {

    //     if (window.location.pathname === '/signup' || bypassRoutes.some(route => route.test(window.location.pathname))) {
    //         return <Outlet />
    //     } else if (window.location.pathname === '/login') {
    //         return <Outlet />
    //     }
    // }


    // logWithFileLocation("Auth User in SuperRoleBasedRoute:", authUser);
    return (
        authUser && allowedRoles.includes(authUser.super_role)
            ? <Outlet />
            : <Navigate to="/" />
    );
};


const rolesList =
{
    superRoles: {
        superRoles: [
            'super',
            'admin',
            'mod'
        ]
    },
    roles: {
        roles: [
            'student',
            'teacher',
            'alumni',
            'ext_org'
        ]
    }
}
