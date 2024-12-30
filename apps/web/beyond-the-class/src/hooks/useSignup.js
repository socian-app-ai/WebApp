import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import axiosInstance from "../config/users/axios.instance";
import { routesForApi } from "../utils/routes/routesForLinks";

const useSignup = () => {
    const [loading, setLoading] = useState(false);

    const { setAuthUser } = useAuthContext();

    const signup = async ({ universityEmail, personalEmail, password, name, username, universityId, campusId, role,
    }) => {
        // console.log("\nuniversityEmail", universityEmail, "\npersonalEmail", personalEmail, "\npassword", password, "\nusername", username, "\nname", name, "\nuniversityId", universityId, "\ncampusId", campusId, "\nrole", role,)
        const success = handleInputErrors({
            universityEmail, personalEmail, password, username, name, universityId, campusId, role,
        });

        // console.log("secuess? ", success)
        if (!success) return;

        // var  universityEmail = email;
        // var universityEmailPassword= password

        setLoading(true);
        const requestBody = {
            universityEmail,
            name,
            password,
            username,
            universityId,
            campusId,
            role,
        }
        if (role === 'alumni') requestBody.personalEmail = personalEmail
        try {

            const res = await axiosInstance.post(
                routesForApi.auth.register,
                requestBody
            );
            // "/api/auth/signup"
            const data = res.data;

            if (res.status === 200) {
                toast.success(data.message, { duration: 20000 });
                toast.success(
                    "Verification Link Has Been Sent To Your University Email",
                    { duration: 20000 }
                );
                window.location.href = res.data.redirectUrl
            }
            if (data.error) {
                throw new Error(data.error);
            }
            // console.log(data)
            // localStorage.setItem("user", JSON.stringify(data))
            // secureLocalStorage.setItem("object", JSON.stringify(data))

            setAuthUser(null);



            // if (isUniversityRequired && res.ok) {
            //     window.location.href = data.redirectUrl
            // }
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || "Unexpected error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;


const roleList = [
    'student',
    'teacher',
    'alumni'
]
function handleInputErrors({ universityEmail, personalEmail, password, role }) {
    if (!universityEmail || !password) {
        toast.error("Please fill all fields");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    if (role === 'alumni' && !personalEmail) return toast.error("Alumni needs a personal Email");

    if (!roleList.includes(role)) return false;
    // const allowedDomains = ["cuilahore", "cuiislamabad", "cuiabbottabad"];
    // const domainPattern = allowedDomains.join("|");

    // const universityEmailRegex = new RegExp(
    //     `^(fa|sp)\\d{2}-(bcs|bse|baf|bai|bar|bba|bce|bch|bde|bec|bee|ben|bid|bmc|bph|bpy|bsm|bst|che|mel|pch|pcs|pec|pee|phm|pms|pmt|ppc|pph|pst|r06|rba|rch|rcp|rcs|rec|ree|rel|rms|rmt|rne|rph|rpm|rpy|rst)-\\d{3}@(${domainPattern})\\.edu\\.pk$`
    // );

    // if (isUniversityRequired) {
    //     if (!universityEmailRegex.test(email)) {
    //         toast.error(
    //             "Invalid email format or domain. Allowed domains are cuilahore, cuiislamabad, cuiabbottabad with .edu.pk"
    //         );
    //         return false;
    //     }
    // }

    return true;
}

// function handleInputErrors({
//     email, password, isUniversityRequired
// }) {
//     if (!email || !password) {
//         toast.error("Please fill all fields")
//         return false
//     }

//     if (password.length < 6) {
//         toast.error("Password must be atlest 6 characters")
//         return false
//     }

//     const allowedDomains = ["cuilahore", "cuiislamabad", "cuiabbottabad"];
//     const domainPattern = allowedDomains.join('|');

//     const emailRegex = new RegExp(`^[A-Za-z0-9._%+-]+@(${domainPattern})\\.edu\\.pk$`);

//     if (isUniversityRequired) {
//         if (!emailRegex.test(email)) {
//             toast.error("Invalid email domain. Allowed domains are cuilahore, cuiislamabad, cuiabbottabad with .edu.pk")
//             return false;
//         } else {
//             return true;
//         }

//     }
//     return true
// }
