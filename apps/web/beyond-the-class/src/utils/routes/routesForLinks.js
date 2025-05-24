/**
 * These are normal links (not used for api)
 * used on button, links etc
 */
const routesForLinks = {
    signup: "/signup",
    login: "/login",
    home: "/",
    user: '/user',
    forgotPassword: '/forgot-password'
};

export default routesForLinks;


export const hrefPathNames = {
    student: {
        teacherPage: '/student/reviews/teachers'
    }
};







// // const baseUrl = '/api'
// // const authUrl= baseUrl + '/auth'
// // const routesForApi = {
// //     auth: {
// //         login:  authUrl + '/login'
// //     }
// // }


// /**
//  * @tutorial {axios} This code is used to simplify the routes FOR AXIOS
//  * @param {routesForApi.auth.login}
//  * @returns {'/api/auth/login'} 
//  */


const baseUrl = '/api';

/**
 * Recursively builds API routes with support for dynamic parameters.
 * @param {string} base - The base URL to append paths to.
 * @param {object} paths - The route structure.
 * @returns {object} - The fully constructed routes.
 */
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

/**
 * Utility function to replace dynamic route parameters.
 * @param {string} route - The route string with placeholders.
 * @param {object} params - An object containing dynamic values.
 * @returns {string} - The route with placeholders replaced.
 */
const buildDynamicRoute = (route, params) => {
    return route.replace(/\$\{(\w+)\}/g, (_, key) => params[key] || `:${key}`);
};

// Define API routes with dynamic params
export const routesForApi = buildRoutes(baseUrl, {
    super: {
        teachersAll: 'teachers-all',
        pastpaper: {
            upload: {
                types: 'types'
            }
        }
    },
    mod: {
        cafe: {
            create: 'create',
            update: {
                '${cafeId}': {
                    name: 'name',
                    contact: 'contact',
                    information: 'information',
                    status: 'status',
                    coordinates: 'coordinates'
                }
            },
            '${cafeId}': {
                category: 'category',
                categories: {
                    '${categoryId}': {
                        name: 'name'
                    }
                }
            },
            admins: 'admins',
            all: 'all',
            deletes: 'deletes'
        }
    },
    auth: {
        logout: 'logout',
        login: 'login',
        register: 'register',
        forgotPassword: 'forgot-password',
        registerationVerifyOTP: 'registration-verify-otp',
        registerationResendOTP: "register-resend-otp",
        resendOTP: "resend-otp",
        completeInfo: 'complete/info',
        verify: {
            otp: {
                password: 'password'
            }
        },
        newPassword: 'newPassword'
    },
    user: {
        profile: "profile",
        connection: { stream: 'stream' }
    },
    oauth: {
        google: { request: 'request' }
    },
    accessible: {
        universityGroupedCampus: "universities/grouped/campus",
        usernames: 'usernames',
    },
    posts: {
        votePost: "vote-post",
        campusAll: "campus/all",
        campusesAll: "campuses/all",
        uniAll: "universities/all",
        singlePost: 'single/post' //+:postId
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

// Example usage:
// ? const apiUrl = buildDynamicRoute(routesForApi.mod.cafe.update['${cafeId}'].name, { cafeId: '123' });
// ? console.log(apiUrl); // Output: /api/mod/cafe/update/123/name

export { buildDynamicRoute };


export const bypassRoutes = [
    /^\/otp\/.*$/,
    /^\/oauth\.*/,
    /^\/notUniversityMail$/,
    /^\/forgot-password$/,
    /^\/privacy$/,
]
















// const baseUrl = '/api';

// const buildRoutes = (base, paths) => {
//     const result = { base };
//     for (const [key, value] of Object.entries(paths)) {
//         if (typeof value === 'object') {
//             result[key] = buildRoutes(`${base}/${key}`, value);
//         } else {
//             result[key] = `${base}/${value}`;
//         }
//     }
//     return result;
// };
// // routesForApi.auth.forgotPassword => /api/auth/forgot-password
// export const routesForApi = buildRoutes(baseUrl, {
//     super: {
//         teachersAll: 'teachers-all',
//         pastpaper: {
//             upload: {
//                 types: 'types'
//             }
//         }
//     },
//     mod: {
//         cafe: {
//             create: 'create',
//             update: {
//                 ${cafeId}: {
//                     name: 'name',
//                     contact:'contact',
//                     information:'information',
//                     status:'status',
//                     coordinates: 'coordinates'
//                 },
//             },
//             ${cafeId}: {
//                 category:'category',
//                 categories: {
//                     ${categryId} : {
//                         categoryId,
//                         name: 'name'
//                     }

//                 }
//             }
//         }
//     },
//     auth: {
//         logout: 'logout',
//         login: 'login',
//         register: 'register',
//         forgotPassword: 'forgot-password',
//         registerationVerifyOTP: 'registration-verify-otp',
//         // VerifyOTP: 'verify-otp',

//         registerationResendOTP: "register-resend-otp",
//         resendOTP: "resend-otp",
//         completeInfo: 'complete/info',
//         verify: {
//             otp: {
//                 password: 'password'
//             }
//         },
//         newPassword: 'newPassword'


//     },
//     user: {
//         profile: "profile",
//         connection: { stream: 'stream' }
//     },
//     oauth: {
//         google: {
//             request: 'request'
//         }
//     },
//     accessible: {
//         universityGroupedCampus: "universities/grouped/campus",
//         usernames: 'usernames',
//     },
//     posts: {
//         votePost: "vote-post",
//         campusAll: "campus/all",
//         campusesAll: "campuses/all",
//         uniAll: "universities/all",
//         singlePost: 'single/post', //+:postId
//     },
//     society: {
//         join: 'join',
//         leave: 'leave',
//         campusesAll: "campuses/all",
//         campusAll: "campus/all",
//         universitiesAll: "universities/all"
//     },
//     department: {
//         campusWithSubjects: "campus/subjects",
//         allDepartmentsInCampus: 'by-campus',
//         allDepartmentsInCampusAuth: 'campus/auth'

//     },
//     teacher: {
//         teacherInCampus: 'campus/teachers'
//     }

// });

// // console.log("ROUTES", routesForApi);