import { useState } from "react";
import PropTypes from 'prop-types';
import useSignup from "../../hooks/useSignup";
import axiosInstance from "../../config/users/axios.instance";
import LabelInputCustomizable, {
    LabelDropDownSearchableInputCustomizable,
} from "../../components/TextField/LabelInputCustomizable";
import GoogleButton from "../../components/Buttons/GoogleButton";
import { routesForApi } from "../../utils/routes/routesForLinks";
import { useDebouncedCallback } from 'use-debounce';
import { useToast } from "../../components/toaster/ToastCustom";
import { ShinyButtonParam } from "../../components/Shinny/ShinnyButton";
import { IoArrowBack } from "react-icons/io5";

// Step 1: Role and Institution Selection
function Step1({ formData, setFormData, onNext }) {
    const [roleError, setRoleError] = useState(false);
    const { addToast } = useToast();

    const fetchUniversities = async () => {
        const response = await axiosInstance.get(routesForApi.accessible.universityGroupedCampus);
        return response.data;
    };

    const handleRoleChange = (roleType) => {
        setFormData(prev => ({ ...prev, role: roleType }));
        setRoleError(false);
    };

    const handleNext = () => {
        if (formData.role === 'none') {
            addToast("Select a role");
            setRoleError(true);
            return;
        }
        if (!formData.universityCampus || !formData.campusDepartment) {
            addToast("Please select your university and department");
            return;
        }
        onNext();
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold py-2">Create an Account</h2>
            <p className="text-md py-2">
                Select your role and institution
            </p>

            <div className="flex flex-row space-x-3 mb-6">
                {roleList.map((_role) => (
                    <RoleSelectionBox
                        key={_role}
                        handleRoleChange={handleRoleChange}
                        roleType={_role}
                        role={formData.role}
                        roleError={roleError}
                        setRoleError={setRoleError}
                    />
                ))}
            </div>

            <form className="w-full">
                <LabelDropDownSearchableInputCustomizable
                    fetchOptions={fetchUniversities}
                    type="text"
                    autoComplete="off"
                    name="University_and_Campus"
                    className="my-3 w-full"
                    value={formData.universityCampus}
                    label="Select your university and campus"
                    placeholder="Comsats - Lahore"
                    width="w-[100%]"
                    inputClassName="dark:bg-gray-900 w-min-[10rem]"
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        universityCampus: e.target.value
                    }))}
                    setUniversityPlusCampusDomain={(domain) => setFormData(prev => ({
                        ...prev,
                        universityCampusDomain: domain
                    }))}
                    setUniversityPlusCampusDepartments={(departments) => setFormData(prev => ({
                        ...prev,
                        universityCampusDepartments: departments
                    }))}
                />

                <LabelDropDownSearchableInputCustomizable
                    filteredOptionsProp={formData.universityCampusDepartments}
                    type="text"
                    autoComplete="off"
                    name="Campus_Departments"
                    className="my-3 w-full"
                    value={formData.campusDepartment}
                    label="Select your department"
                    placeholder="Computer Science"
                    width="w-[100%]"
                    inputClassName="dark:bg-gray-900 w-min-[10rem]"
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        campusDepartment: e.target.value
                    }))}
                />

                <div className="flex justify-center items-center m-4 w-full">
                    <hr className="w-full " />
                    <p className="flex flex-nowrap w-full text-[#c4c3c3] whitespace-nowrap mx-2">
                        or continue with
                    </p>
                    <hr className="w-full " />
                </div>

                
                <ShinyButtonParam
                    onClick={handleNext}
                    className="flex my-4 mb-6 justify-center items-center w-full"
                    text="Next"
                />

                <GoogleButton onClick={() => auth()} />


                <div className="text-center my-3 max-w-[24rem]">
                    <p className="text-[#c4c3c3]">
                        By clicking continue, you agree to our{" "}
                        <a href="/privacy" target="_blank" className="dark:text-[#f7f7f7] text-black underline">Terms of Service & Privacy Policy</a>
                    </p>
                </div>
            </form>
        </div>
    );
}

// Step 2: Personal Information
function Step2({ formData, setFormData, onSubmit }) {
    const [usernameError, setUsernameError] = useState(false);
    const [usernameLess, setUsernameLess] = useState('');
    const { addToast } = useToast();

    const handleUsernameSearch = async (username) => {
        const response = await axiosInstance.get(routesForApi.accessible.usernames,
            {
                params: { username },
            }
        );
        return response.data;
    };

    const handleUsernameFunction = async () => {
        if (formData.userName.length > 6) {
            setUsernameLess('');
            handleUsernameSearch(formData.userName)
                .then((data) => {
                    if (data) {
                        setUsernameError(data);
                    } else {
                        setUsernameError(false);
                    }
                })
                .catch(() => {
                    // Handle error
                });
        } else if (formData.userName.length <= 6) {
            setUsernameLess('username must be greater than 6 characters');
        }
    };

    const debouncedHandleUsername = useDebouncedCallback(handleUsernameFunction, 300);

    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold py-2">Personal Information</h2>
            <p className="text-md py-2">
                Enter your personal details
            </p>

            <form className="w-full" onSubmit={onSubmit}>
                <LabelInputCustomizable
                    type="text"
                    name="Name"
                    className="my-3 w-full"
                    value={formData.name}
                    label="Full Name"
                    placeholder="Bill Clinton"
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        name: e.target.value
                    }))}
                />

                <LabelInputCustomizable
                    type="text"
                    autoComplete="off"
                    name="username"
                    className="my-3 w-full"
                    value={formData.userName}
                    onKeyUp={(e) => debouncedHandleUsername(e.target.value)}
                    label="Username"
                    placeholder="beyond_the._.class"
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    errorMessage={usernameError && "Username Already Exists" || usernameLess !== '' && usernameLess}
                    onChange={(e) => {
                        const sanitizedValue = e.target.value.replace(/[^a-z0-9._]/g, "");
                        setFormData(prev => ({
                            ...prev,
                            userName: sanitizedValue.toLowerCase()
                        }));
                    }}
                />

                <LabelInputCustomizable
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="my-3 w-full"
                    value={formData.universityEmail}
                    label="Your University Email"
                    placeholder={formData.universityCampusDomain ? formData.universityCampusDomain : "FAXX-XXX-XXX@XXX.edu.pk"}
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        universityEmail: e.target.value
                    }))}
                />

                {(formData.role === 'alumni') && (
                    <LabelInputCustomizable
                        type="email"
                        autoComplete="email"
                        name="email"
                        className="my-3 w-full"
                        value={formData.personalEmail}
                        label="Your Personal Email"
                        placeholder="user@gmail.com"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            personalEmail: e.target.value
                        }))}
                    />
                )}

                <LabelInputCustomizable
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    className="my-4 mb-5 w-full"
                    value={formData.universityEmailPassword}
                    label="Password"
                    placeholder="Must be 8 Characters long with any special ch"
                    width="w-[100%]"
                    hideShowPass={true}
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        universityEmailPassword: e.target.value
                    }))}
                />

                <ShinyButtonParam
                    type="submit"
                    className="flex my-4 justify-center items-center w-full"
                    text="Sign Up"
                />
            </form>
        </div>
    );
}

export default function MultiStepSignUp() {
    const [currentStep, setCurrentStep] = useState(1);
    const { signup } = useSignup();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        role: "none",
        universityCampus: "",
        universityCampusDepartments: [],
        campusDepartment: "",
        universityCampusDomain: "",
        universityEmail: "",
        name: "",
        userName: "",
        universityEmailPassword: "",
        personalEmail: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.userName || !formData.name || !formData.universityEmail || !formData.universityEmailPassword) {
            addToast("Please fill in all required fields");
            return;
        }

        await signup({
            universityEmail: formData.universityEmail.toLowerCase(),
            personalEmail: formData.personalEmail.toLowerCase(),
            password: formData.universityEmailPassword,
            username: formData.userName,
            name: formData.name,
            universityId: formData.universityCampus.split("-")[0],
            campusId: formData.universityCampus.split("-")[1],
            departmentId: formData.campusDepartment,
            role: formData.role,
        });
    };

    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="auth_page_style-gradient dark:text-white min-h-screen w-full flex justify-center items-center">
            <div className="flex flex-col justify-center items-center w-full max-w-md p-6 relative">
                {currentStep > 1 && (
                    <button
                        onClick={handleBack}
                        className="absolute left-6 top-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <IoArrowBack size={24} />
                    </button>
                )}
                <div className="w-full">
                    {currentStep === 1 && (
                        <Step1
                            formData={formData}
                            setFormData={setFormData}
                            onNext={handleNext}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

const roleList = ["student", "teacher", "alumni"];

function RoleSelectionBox({ handleRoleChange, roleType, role, roleError, setRoleError }) {
    return (
        <button
            onClick={() => {
                handleRoleChange(roleType);
                setRoleError(false);
            }}
            className={`${roleType === role ? 'bg-[#e2e2e2] border-[#2f2f2f] dark:text-[#3c3c3c]' : roleError ? 'border-red-500 border' : 'bg-transparent border-[#b4b4b4] dark:text-white dark:text-text-primary-dark text-text-primary'} relative inline-block px-6 py-3 font-medium border-2 rounded-lg overflow-hidden group focus:outline-none`}
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-grey-500 via-blue-500 to-purple-500 opacity-30"></span>
            <span className="absolute inset-0 w-full h-full bg-white opacity-10 backdrop-blur-md"></span>
            <span className="relative z-10">{roleType}</span>
        </button>
    );
}

async function auth() {
    const response = await axiosInstance.post("/api/request");
    const data = response.data;
    window.location.href = data.url;
}

Step1.propTypes = {
    formData: PropTypes.shape({
        role: PropTypes.string.isRequired,
        universityCampus: PropTypes.string.isRequired,
        universityCampusDepartments: PropTypes.array.isRequired,
        campusDepartment: PropTypes.string.isRequired,
        universityCampusDomain: PropTypes.string.isRequired,
        universityEmail: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        universityEmailPassword: PropTypes.string.isRequired,
        personalEmail: PropTypes.string.isRequired
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired
};

Step2.propTypes = {
    formData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        universityEmail: PropTypes.string.isRequired,
        universityEmailPassword: PropTypes.string.isRequired,
        personalEmail: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        universityCampusDomain: PropTypes.string.isRequired,
        universityCampus: PropTypes.string.isRequired,
        universityCampusDepartments: PropTypes.array.isRequired,
        campusDepartment: PropTypes.string.isRequired
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

RoleSelectionBox.propTypes = {
    handleRoleChange: PropTypes.func.isRequired,
    roleType: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    roleError: PropTypes.bool.isRequired,
    setRoleError: PropTypes.func.isRequired
}; 