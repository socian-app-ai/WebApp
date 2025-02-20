// import React from 'react'
// import { useState } from 'react'
// import LabelInputCustomizable from '../../../components/TextField/LabelInputCustomizable';
// import DarkButton from '../../../components/Buttons/DarkButton';
// import { useToast } from '../../../components/toaster/ToastCustom';
// import axiosInstance from '../../../config/users/axios.instance';
// import { routesForApi } from '../../../utils/routes/routesForLinks';

// export default function ForgotPassword() {
//     const [inputType, setInputType] = useState('email');
//     const [email, setEmail] = useState("");
//     const [loading, setLoading] = useState(false)
//     const { addToast } = useToast();

//     const [otp, setOtp] = useState(null);
//     const [hide, setHide] = useState(true);
//     const [responseState, setResponseState] = useState('');

//     const [confirmedOTP, setConfirmedOTP] = useState(false)
//     const [newPassword, setNewPassword] = useState('');


//     const [token, setToken] = useState(null);

//     const setUpOtpScreen = async () => {
//         try {

//             if (email === '') {
//                 addToast("Email cannot be empty")
//                 return
//             }
//             const response = await axiosInstance.put(routesForApi.auth.forgotPassword, {
//                 email: email
//             });

//             if (response.status === 200) {
//                 setHide(false);
//                 setResponseState(response.message)
//             } else if (response.status === 304) {
//                 setHide(true);
//                 setResponseState(response.message)
//             } else if (response.status === 500) {
//                 setHide(true);
//                 setResponseState(response.message)
//             }

//         } catch (error) {
//             console.error(error);
//             addToast(error?.response?.data?.message ?? 'An Error Processing your request');

//         }
//     }

//     const handleEmailChange = (e) => {
//         setEmail(e.target.value);
//         // If email does not contain '@', consider it as a username
//         setInputType(e.target.value.includes("@") ? "email" : "username");
//     };


//     const handleOtpValue = (e) => {
//         setOtp(e.target.value);
//     }

//     const submitOtp = async () => {
//         try {
//             if (!otp) {
//                 addToast("OTP required")
//                 return
//             }
//             const response = await axiosInstance.post(routesForApi.auth.verify.otp.password, {
//                 email: email,
//                 otp: otp
//             })
//             setResponseState(response.data.message)
//             if (response.status == 200) {
//                 setConfirmedOTP(true)
//                 setToken(response.data.token)
//             }
//         } catch (error) {
//             console.error(error);
//             addToast(error?.response?.data?.message ?? 'An Error Processing your request');

//         }
//     }

//     const resendOtp = async () => {
//         try {
//             const response = await axiosInstance.put(routesForApi.auth.registerationResendOTP, {
//                 email: email
//             })
//             setResponseState(response.data.message)
//         } catch (error) {
//             console.error(error);
//             addToast(error?.response?.data?.message ?? 'An Error Processing your request');

//         }
//     }

//     const handlePasswordChange = (e) => {
//         setNewPassword(e.target.value)
//     }
//     const submitNewPassword = async () => {
//         try {
//             const response = await axiosInstance.post(routesForApi.auth.newPassword, {
//                 newPassword: newPassword,
//                 token: token
//             })
//             setResponseState(response.data.message)

//             if (response.status === 200) {
//                 setToken(null)
//             }
//         } catch (error) {
//             console.error(error);
//             addToast(error?.response?.data?.message ?? 'An Error Processing your request');

//         }
//     }
//     return (
//         <div className="flex flex-col justify-center items-center min-h-svh  w-full auth_page_style" >
//             <div className=" flex flex-col justify-center items-center">
//                 <div>
//                     {responseState && <p>Response: {responseState}</p>}
//                 </div>
//                 <LabelInputCustomizable
//                     type={inputType === "email" ? "email" : "text"}
//                     name={inputType === "email" ? "email" : "username"}
//                     className="my-2"
//                     value={email}
//                     label={"Email/Username"}
//                     placeholder="fa21-bcs-000@cuilahore.pk"
//                     onChange={(e) => handleEmailChange(e)}
//                     autoComplete="on"
//                 />

//                 <DarkButton className="my-5 w-full" text="Send Email"
//                     loading={loading}
//                     onClick={setUpOtpScreen}
//                 />
//             </div>


//             {!hide &&
//                 <>
//                     <div className=" flex flex-col justify-center items-center">
//                         <LabelInputCustomizable
//                             type={"text"}
//                             name="otp"
//                             className="my-2"
//                             value={otp}
//                             label={"Enter OTP"}
//                             placeholder="* * * *"
//                             onChange={(e) => handleOtpValue(e)}
//                             autoComplete="on"
//                         />

//                         <DarkButton className="my-5 w-full" text="Submit Otp"
//                             loading={loading}
//                             onClick={submitOtp}
//                         />
//                     </div>


//                     <button className="my-5 underline"
//                         loading={loading}
//                         onClick={resendOtp}>Resend OTP</button >

//                 </>}

//             {confirmedOTP && <>
//                 <LabelInputCustomizable
//                     type='text'
//                     name='new-password'
//                     className="my-2"
//                     value={newPassword}
//                     label={"New Password"}
//                     placeholder="8 characters"
//                     onChange={(e) => handlePasswordChange(e)}
//                     autoComplete="on"
//                 />

//                 <DarkButton className="my-5 w-max" text="Submit Password"
//                     loading={loading}
//                     onClick={submitNewPassword}
//                 />
//             </>}
//         </div>
//     )
// }

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, KeyRound, RefreshCw } from 'lucide-react';
import LabelInputCustomizable from '../../../components/TextField/LabelInputCustomizable';
import DarkButton, { DarkButtonElement } from '../../../components/Buttons/DarkButton';
import { useToast } from '../../../components/toaster/ToastCustom';
import axiosInstance from '../../../config/users/axios.instance';
import routesForLinks, { routesForApi } from '../../../utils/routes/routesForLinks';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [inputType, setInputType] = useState('email');
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false)
    const { addToast } = useToast();

    const [otp, setOtp] = useState(null);
    const [hide, setHide] = useState(true);
    const [responseState, setResponseState] = useState('');

    const [confirmedOTP, setConfirmedOTP] = useState(false)
    const [newPassword, setNewPassword] = useState('');


    const [token, setToken] = useState(null);
    const [disableOTP, setDisableOTP] = useState(false);

    const [passwordUpdated, setPasswordUpdated] = useState(false);
    const [confirmedPassword, setConfirmedPassword] = useState(false)

    const setUpOtpScreen = async () => {
        try {

            if (email === '') {
                addToast("Email cannot be empty")
                return
            }
            const response = await axiosInstance.put(routesForApi.auth.forgotPassword, {
                email: email
            });

            if (response.status === 200) {
                setHide(false);
                setResponseState(response.message)
            } else if (response.status === 304) {
                setHide(true);
                setResponseState(response.message)
            } else if (response.status === 500) {
                setHide(true);
                setResponseState(response.message)
            }

        } catch (error) {
            console.error(error);
            addToast(error?.response?.data?.message ?? 'An Error Processing your request');

        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // If email does not contain '@', consider it as a username
        setInputType(e.target.value.includes("@") ? "email" : "username");
    };


    const handleOtpValue = (e) => {
        setOtp(e.target.value);
    }

    const submitOtp = async () => {
        try {
            if (!otp) {
                addToast("OTP required")
                return
            }
            const response = await axiosInstance.post(routesForApi.auth.verify.otp.password, {
                email: email,
                otp: otp
            })
            setResponseState(response.data.message)
            if (response.status == 200) {
                setDisableOTP(true)
                setConfirmedOTP(true)
                setToken(response.data.token);
            }
        } catch (error) {
            console.error(error);
            addToast(error?.response?.data?.message ?? 'An Error Processing your request');

        }
    }

    const resendOtp = async () => {
        try {
            const response = await axiosInstance.post(routesForApi.auth.resendOTP, {
                email: email
            })
            setResponseState(response.data.message)
            addToast(response.data.message)

        } catch (error) {
            console.error(error);
            addToast(error?.response?.data?.message ?? 'An Error Processing your request');

        }
    }

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value)
    }
    const submitNewPassword = async () => {
        try {
            const response = await axiosInstance.post(routesForApi.auth.newPassword, {
                newPassword: newPassword,
                token: token
            })
            setResponseState(response.data.message)

            if (response.status === 200) {
                setToken(null)

                setPasswordUpdated(true)
                setConfirmedPassword(true)
                addToast("Password Updated");
            }
        } catch (error) {
            console.error(error);
            addToast(error?.response?.data?.message ?? 'An Error Processing your request');

        }
    }



    return (
        <div className="auth_page_style-gradient  min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold dark:text-white text-gray-900">
                    Reset your password
                </h2>
                <p className="dark:text-[#fbfbfbc7] mt-2 text-center text-sm text-gray-600">
                    We&apos;ll help you get back into your account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="dark:bg-[#181818] dark:border-[#ffffff33] border-[0.01rem]  border-[#b4b4b4] bg-[#e6e6e6]  py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {responseState && (
                        <div className={`mb-4 p-4 rounded-md ${passwordUpdated ? 'text-green-700 bg-green-400' : 'text-blue-700 bg-blue-50'}`}>
                            {responseState}
                            {passwordUpdated && (<Link className='ml-2 underline' to={routesForLinks.login}>Login</Link>)}
                        </div>
                    )}

                    {/* Email Input Section */}
                    <div className={`w-full space-y-6  ${!hide || confirmedOTP ? 'opacity-50' : ''}`}>
                        <div className="w-full relative shadow-none">
                            <Mail className="hidden md:block absolute left-3 top-10 h-5 w-5 dark:text-[#fbfbfbc7] text-gray-800" />
                            <LabelInputCustomizable
                                type={inputType === "email" ? "email" : "text"}
                                name={inputType === "email" ? "email" : "username"}
                                className="dark:text-[#fbfbfbc7] md:pl-10 w-full rounded-md border-gray-300 shadow-sm"
                                inputClassName="dark:text-[#fbfbfbc7]"
                                value={email}
                                label="Email/Username"
                                placeholder="fa21-bcs-000@cuilahore.pk"
                                onChange={handleEmailChange}
                                autoComplete="on"
                                disabled={!hide || confirmedOTP}
                            />
                        </div>

                        <DarkButtonElement
                            className="w-full flex justify-center items-center gap-2"
                            text={
                                <>
                                    Send Email
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            }
                            loading={loading}
                            onClick={setUpOtpScreen}
                            disabled={!hide || confirmedOTP}
                        />
                    </div>

                    {/* OTP Section */}
                    {!hide && (
                        <div className={`mt-8 space-y-6 ${disableOTP ? 'opacity-50' : ''}`}>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                                <LabelInputCustomizable
                                    type="text"
                                    name="otp"
                                    disabled={disableOTP}
                                    className="dark:text-[#fbfbfbc7] pl-10 w-full rounded-md border-gray-300 shadow-sm"
                                    inputClassName="dark:text-[#fbfbfbc7]"
                                    value={otp}
                                    label="Enter OTP"
                                    placeholder="* * * *"
                                    onChange={handleOtpValue}
                                    autoComplete="on"
                                />
                            </div>

                            <DarkButtonElement
                                className="w-full flex justify-center items-center gap-2"
                                disabled={disableOTP}
                                text={
                                    <>
                                        Verify OTP
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                }
                                loading={loading}
                                onClick={submitOtp}
                            />

                            <button
                                className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                                onClick={resendOtp}
                                disabled={disableOTP}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Resend OTP
                            </button>
                        </div>
                    )}

                    {/* New Password Section */}
                    {confirmedOTP && (
                        <div className={`mt-8 space-y-6 ${confirmedPassword ? 'opacity-50' : ''}`}>
                            <div className="relative">
                                <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                                <LabelInputCustomizable
                                    type="password"
                                    name="new-password"
                                    disabled={confirmedPassword}
                                    className="dark:text-[#fbfbfbc7] pl-10 w-full rounded-md border-gray-300 shadow-sm"
                                    inputClassName="dark:text-[#fbfbfbc7]"
                                    value={newPassword}
                                    label="New Password"
                                    placeholder="Minimum 8 characters"
                                    onChange={handlePasswordChange}
                                    autoComplete="new-password"
                                />
                            </div>

                            <DarkButtonElement
                                className="w-full flex justify-center items-center gap-2"
                                text={
                                    <>
                                        Set New Password
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                }
                                loading={loading}
                                disabled={confirmedPassword}
                                onClick={submitNewPassword}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}