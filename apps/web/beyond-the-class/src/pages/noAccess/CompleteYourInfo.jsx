import React from 'react'
import logWithFileLocation from '../../utils/consoleLog'
import { useEffect } from 'react';
import DarkButton from '../../components/Buttons/DarkButton';
import LabelInputCustomizable, { LabelDropDownSearchableInputCustomizable, LabelDropDownSearchableInputCustomizableSecond } from '../../components/TextField/LabelInputCustomizable';
import { useAuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import axiosInstance from '../../config/users/axios.instance';
import { routesForApi } from '../../utils/routes/routesForLinks';
import { useToast } from "../../components/toaster/ToastCustom";
import { redirect } from 'react-router-dom';


export default function CompleteYourInfo() {
    const { addToast } = useToast();


    const { authUser } = useAuthContext();
    const [name, setName] = useState(authUser.name ?? '')
    const [userName, setUserName] = useState('');
    const [universityEmailPassword, setUniversityEmailPassword] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');

    const [usernameError, setUsernameError] = useState(false)
    const [usernameLess, setUsernameLess] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('none')


    const [campusDepartment, setCampusDepartment] = useState([])

    const fetchDepartments = async () => {

        const response = await axiosInstance.get(routesForApi.department.allDepartmentsInCampusAuth)

        console.log(response)

        return response.data.departmentsInFormat;

    }





    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!campusDepartment) {
            addToast("Please select a department.");
            return;
        }
        if (!name) {
            addToast("Please enter your name.");
            return;
        }
        if (!userName) {
            addToast("Please enter a username.");
            return;
        }
        if (userName.length <= 6) {
            addToast("Username must be greater than 6 characters.");
            return;
        }
        if (!universityEmailPassword) {
            addToast("Please enter a password.");
            return;
        }
        if (universityEmailPassword.length < 8) {
            addToast("Password must be at least 8 characters.");
            return;
        }
        if (role === 'alumni' && !personalEmail) {
            addToast("Alumni must provide a personal email.");
            return;
        }

        setLoading(true);

        try {
            console.log("data", routesForApi.auth.completeInfo)
            const response = await axiosInstance.post(routesForApi.auth.completeInfo, {
                departmentId: campusDepartment,
                name,
                username: userName,
                universityEmail: authUser.universityEmail,
                personalEmail: personalEmail,
                role,
                password: universityEmailPassword
            });


            console.log("Profile completed successfully:", response.data);
            addToast("Profile completed successfully!");
            window.location.href = '/'

        } catch (error) {
            console.error("Error completing profile:", error);
            addToast("Error completing profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };





    const fetchRoles = async () => {
        return [
            { name: 'Teacher', _id: 'teacher' },
            { name: 'Student', _id: 'student' },
            { name: 'Alumni', _id: 'alumni' },
        ]
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
            setUsernameLess('')
            handleUsernameSearch(userName)
                .then((data) => {
                    // console.log("Username exists: ", data)
                    if (data) {
                        setUsernameError(data)
                    } else {
                        setUsernameError(false)

                    }
                })
                .catch(() => {
                    // return toast.error("Username error")
                })
        }
        else if (userName.length <= 6) {
            setUsernameLess('username must be greater than 6 characters')

            // toast.error('username must be greater than 6 characters', { duration: 1000 })
            return;
        }

    }

    const debouncedHandleUsername = useDebouncedCallback(handleUsernameFunction, 300);


    return (
        <div className="min-h-screen w-full flex justify-center items-center ">
            <div className="flex flex-col justify-center items-center">
                <h3>You can Complete your Profile Here</h3>
                <p>Select your accurate details. Contact for more information</p>

                <form className="w-full" onSubmit={handleSubmit}>


                    <LabelDropDownSearchableInputCustomizableSecond
                        fetchOptions={fetchDepartments}
                        type="text"
                        autoComplete="off"
                        name="Campus_Departments"
                        className="my-3 w-full"
                        value={campusDepartment}
                        label="Select your department"
                        placeholder="Computer Science"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setCampusDepartment(e.target.value)}
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
                        autoComplete="off"
                        name="username"
                        className="my-3 w-full"
                        value={userName}
                        onKeyUp={(e) => debouncedHandleUsername(e.target.value)}

                        label="Username"
                        placeholder="beyond_the._.class"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        errorMessage={usernameError && "Username Already Exists" || usernameLess !== '' && usernameLess}
                        onChange={(e) => {
                            const sanitizedValue = e.target.value.replace(/[^a-z0-9._]/g, "");
                            setUserName(sanitizedValue.toLowerCase())
                        }}
                    />

                    <LabelDropDownSearchableInputCustomizableSecond
                        fetchOptions={fetchRoles}
                        type="text"
                        autoComplete="off"
                        name="role"
                        className="my-3 w-full"
                        value={role}
                        label="Select your Role"
                        placeholder="Computer Science"
                        width="w-[100%]"
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setRole(e.target.value)}
                    />

                    {(role === 'alumni') && <LabelInputCustomizable
                        type="email"
                        autoComplete="email"
                        name="email"
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
                        autoComplete="new-password"
                        name="password"
                        className="my-4 mb-5 w-full"
                        value={universityEmailPassword}
                        label="Password, Its Better"
                        // autoComplete="on"
                        placeholder="Must be 8 Characters long with any special ch"
                        width="w-[100%]"
                        hideShowPass={true}
                        inputClassName="w-min-[10rem]"
                        onChange={(e) => setUniversityEmailPassword(e.target.value)}
                    />
                    <DarkButton
                        loading={loading}
                        disabled={usernameError}
                        type="submit"
                        className="flex my-4 justify-center items-center w-full"
                        text="Complete Profile"
                    />
                    {/* <DarkButtonLink to="/auth/registered/create-username" className="flex my-4 justify-center items-center w-full" text="Sign up with email" /> */}
                </form>

            </div>
        </div>
    )
}
