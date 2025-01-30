/**
 * These are normal links (not used for api)
 * used on button, links etc
 */
const routesForLinks = {
    signup: "/signup",
    login: "/login",
    home: "/",
    user: '/user'
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
// routesForApi.auth.forgotPassword => /api/auth/forgot-password
export const routesForApi = buildRoutes(baseUrl, {
    super: {
        teachersAll: 'teachers-all',
        pastpaper: {
            upload: {
                types: 'types'
            }
        }
    },
    auth: {
        logout: 'logout',
        login: 'login',
        register: 'register',
        forgotPassword: 'forgot-password',
        registerationVerifyOTP: 'registration-verify-otp',
        registerationResendOTP: "register-resend-otp",
        completeInfo: 'complete/info'
    },
    user: {
        profile: "profile",
        connection: { stream: 'stream' }
    },
    oauth: {
        google: {
            request: 'request'
        }
    },
    accessible: {
        universityGroupedCampus: "universities/grouped/campus",
        usernames: 'usernames',
    },
    posts: {
        votePost: "vote-post",
        campusAll: "campus/all",
        campusesAll: "campuses/all",
        uniAll: "universities/all"
    },
    society: {
        join: 'join',
        leave: 'leave',
        campusesAll: "campuses/all",
        campusAll: "campus/all",
        universitiesAll: "universities/all"
    },
    department: {
        campusWithSubjects: "campus/subjects",
        allDepartmentsInCampus: 'by-campus',
        allDepartmentsInCampusAuth: 'campus/auth'

    },
    teacher: {
        teacherInCampus: 'campus/teachers'
    }

});

// console.log("ROUTES", routesForApi);



export const bypassRoutes = [
    /^\/otp\/.*$/,
    /^\/oauth\.*/,

]