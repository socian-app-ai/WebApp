import { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import axiosInstance from "../../config/users/axios.instance";
import LabelInputCustomizable, {
    LabelDropDownSearchableInputCustomizable,
} from "../../components/TextField/LabelInputCustomizable";
import GoogleButton from "../../components/Buttons/GoogleButton";
import DarkButton from "../../components/Buttons/DarkButton";
import routesForLinks, { routesForApi } from "../../utils/routes/routesForLinks";
import toast from "react-hot-toast";

export default function SignUpR() {
    const [universityCampus, setUniversityPlusCampus] = useState("");

    const [universityEmail, setUniversityEmail] = useState("");
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [universityEmailPassword, setUniversityEmailPassword] = useState("");
    const [role, setRole] = useState("none");
    const [personalEmail, setPersonalEmail] = useState("")
    const [usernameError, setUsernameError] = useState(false)
    const { loading, signup } = useSignup();

    const fetchUniversities = async () => {
        const response = await axiosInstance.get(routesForApi.accessible.universityGroupedCampus);
        // "/api/university/universities-grouped-campus"
        return response.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setUniversityEmail(universityEmail);

        console.log("DATA", universityCampus)
        if (!usernameError) {
            await signup({
                universityEmail: universityEmail,
                personalEmail: personalEmail,
                password: universityEmailPassword,
                username: userName,
                name: name,
                universityId: universityCampus.split("-")[0],
                campusId: universityCampus.split("-")[1],
                role: role,
            });
        } else {
            toast.error("This username already exists")
        }
        // console.log(universityEmail, universityEmailPassword)
    };
    const handleRoleChange = (roleType) => {
        setRole(roleType);
    };

    function navigate(url) {
        window.location.href = url;
    }

    async function auth() {
        const response = await axiosInstance.post("/api/request");

        const data = response.data;
        // console.log("The data before secure: ", data);
        navigate(data.url);
    }


    const handleUsernameSearch = async (username) => {
        const response = await axiosInstance.get(routesForApi.accessible.usernames,
            {
                params: { username },
            }
        );
        return response.data;
    }


    const handleUsernameFunction = async () => {
        if (userName.length > 6) {
            handleUsernameSearch(userName)
                .then((data) => {
                    console.log("Username exists: ", data)
                    if (data) {
                        setUsernameError(data)
                    } else {
                        setUsernameError(false)

                    }
                })
                .catch(() => {
                    return toast.error("Username error")
                })
        }
        else {
            toast.error('username must be greater than 6 characters', { duration: 1000 })
            return;
        }
    }
    return (
        <div className="min-h-screen w-full flex justify-center items-center ">
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold py-2">Create an Account</h2>
                <p className="text-md py-2">
                    Enter your <span className="font-bold">Univeristy</span> email to sign
                    up for this app
                </p>

                <div className="flex flex-row space-x-3">
                    {roleList.map((_role) => (
                        <RoleSelectionBox
                            key={_role}
                            handleRoleChange={handleRoleChange}
                            roleType={_role}
                            role={role}
                        />
                    ))}
                </div>
                <form className="w-full" onSubmit={handleSubmit}>
                    <LabelDropDownSearchableInputCustomizable
                        fetchOptions={fetchUniversities}
                        type="text"
                        name="University_and_Campus"
                        className="my-3 w-full"
                        value={universityCampus}
                        label="Select your university and campus"
                        placeholder="Comsats - Lahore"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setUniversityPlusCampus(e.target.value)}
                    />

                    <LabelInputCustomizable
                        type="text"
                        name="Name"
                        className="my-3 w-full"
                        value={name}
                        label="Full Name"
                        placeholder="Bill Clinton"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setName(e.target.value)}
                    />


                    <LabelInputCustomizable
                        type="text"
                        name="username"
                        className="my-3 w-full"
                        value={userName}
                        onKeyUp={
                            (e) => {
                                handleUsernameFunction(e.target.value)
                            }
                        }
                        label="Username"
                        placeholder="beyond_the._.class"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        errorMessage={usernameError ? "Username Already Exists" : ""}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <LabelInputCustomizable
                        type="email"
                        name="universityEmail"
                        className="my-3 w-full"
                        value={universityEmail}
                        label="Your University Email"
                        placeholder="FAXX-XXX-XXX@XXX.edu.pk"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setUniversityEmail(e.target.value)}
                    />


                    {(role === 'alumni') && <LabelInputCustomizable
                        type="email"
                        name="personalEmail"
                        className="my-3 w-full"
                        value={personalEmail}
                        label="Your Personal Email"
                        placeholder="user@gmail.com"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setPersonalEmail(e.target.value)}
                    />}

                    <LabelInputCustomizable
                        type="password"
                        name="universityEmailPassword"
                        className="my-4 mb-5 w-full"
                        value={universityEmailPassword}
                        label="Password"
                        autoComplete="on"
                        placeholder="Must be 8 Characters long with any special ch"
                        width="w-[100%]"
                        hideShowPass={true}
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setUniversityEmailPassword(e.target.value)}
                    />
                    <DarkButton
                        //  loading={loading}
                        type="submit"
                        className="flex my-4 justify-center items-center w-full"
                        text="Sign up with email"
                    />
                    {/* <DarkButtonLink to="/auth/registered/create-username" className="flex my-4 justify-center items-center w-full" text="Sign up with email" /> */}
                </form>

                <div>
                    <Link to={routesForLinks.login}>Already Have an Account?</Link>
                </div>

                <div className="flex justify-center items-center m-4 w-full">
                    <hr className="w-full " />
                    <p className="flex flex-nowrap w-full text-[#c4c3c3]  whitespace-nowrap mx-2">
                        or continue with
                    </p>
                    <hr className="w-full " />
                </div>

                <GoogleButton onClick={() => auth()} />

                <div className=" text-center my-3 max-w-[24rem]">
                    <p className="text-[#c4c3c3] ">
                        By clicking continue, you agree to our{" "}
                        <a className="text-black"> Terms of Service</a> and{" "}
                        <a className="text-black">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

const roleList = ["student", "teacher", "alumni"];

// eslint-disable-next-line react/prop-types
function RoleSelectionBox({ handleRoleChange, roleType, role }) {
    return (
        // <button className={`${roleType === role ? 'bg-slate-500' : 'bg-red-300'} btn glass  p-2 max-h-14 max-w-20`} onClick={() => handleRoleChange(roleType)}>
        //     {roleType}
        // </button>
        <button
            onClick={() => handleRoleChange(roleType)}
            className={`${roleType === role ? 'bg-stone-100' : 'bg-transparent'} relative inline-block px-6 py-3 font-medium text-text-primary 
            dark:text-white  border-2 border-white rounded-lg overflow-hidden group hover:bg-opacity-30 
            focus:outline-none`}
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-grey-500 via-blue-500 to-purple-500 opacity-30"></span>
            <span className="absolute inset-0 w-full h-full bg-white opacity-10 backdrop-blur-md"></span>
            <span className="relative z-10">{roleType}</span>
        </button>

    );
}

