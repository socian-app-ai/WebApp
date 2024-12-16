const routesForLinks = {
    signup: "/signup",
    login: "/login",
    home: "/",
};

export default routesForLinks;





// const baseUrl = '/api'
// const authUrl= baseUrl + '/auth'
// const routesForApi = {
//     auth: {
//         login:  authUrl + '/login'
//     }
// }


/**
 * @tutorial {axios} This code is used to simplify the routes FOR AXIOS
 * @param {routesForApi.auth.login}
 * @returns {'/api/auth/login'} 
 */

const baseUrl = '/api';

const buildRoutes = (base, paths) => {
    const result = { base };
    for (const [key, value] of Object.entries(paths)) {
        if (typeof value === 'object') {
            result[key] = buildRoutes(`${base}/${key}`, value);
        } else {
            result[key] = `${base}/${value}`;
        }
    }
    return result;
};

export const routesForApi = buildRoutes(baseUrl, {
    auth: {
        logout: 'logout',
        login: 'login',
        register: 'register',
        forgotPassword: 'forgot-password',
        registerationVerifyOTP: 'registration-verify-otp'
    },
    google: {
        request: 'request'
    },
    accessible: {
        universityGroupedCampus: "universities-grouped-campus",
        usernames: 'usernames',
    }
});

console.log("ROUTES", routesForApi);



export const bypassRoutes = [
    /^\/otp\/.*$/,

]