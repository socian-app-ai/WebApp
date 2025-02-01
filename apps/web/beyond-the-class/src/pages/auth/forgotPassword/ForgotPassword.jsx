import React from 'react'
import { useState } from 'react'
import LabelInputCustomizable from '../../../components/TextField/LabelInputCustomizable';
import DarkButton from '../../../components/Buttons/DarkButton';
import { useToast } from '../../../components/toaster/ToastCustom';
import axiosInstance from '../../../config/users/axios.instance';
import { routesForApi } from '../../../utils/routes/routesForLinks';

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
                setConfirmedOTP(true)
                setToken(response.data.token)
            }
        } catch (error) {
            console.error(error);
            addToast(error?.response?.data?.message ?? 'An Error Processing your request');

        }
    }

    const resendOtp = async () => {
        try {
            const response = await axiosInstance.put(routesForApi.auth.registerationResendOTP, {
                email: email
            })
            setResponseState(response.data.message)
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
            }
        } catch (error) {
            console.error(error);
            addToast(error?.response?.data?.message ?? 'An Error Processing your request');

        }
    }
    return (
        <div className="flex flex-col justify-center items-center min-h-svh  w-full auth_page_style" >
            <div className=" flex flex-col justify-center items-center">
                <div>
                    {responseState && <p>Response: {responseState}</p>}
                </div>
                <LabelInputCustomizable
                    type={inputType === "email" ? "email" : "text"}
                    name={inputType === "email" ? "email" : "username"}
                    className="my-2"
                    value={email}
                    label={"Email/Username"}
                    placeholder="fa21-bcs-000@cuilahore.pk"
                    onChange={(e) => handleEmailChange(e)}
                    autoComplete="on"
                />

                <DarkButton className="my-5 w-full" text="Send Email"
                    loading={loading}
                    onClick={setUpOtpScreen}
                />
            </div>


            {!hide &&
                <>
                    <div className=" flex flex-col justify-center items-center">
                        <LabelInputCustomizable
                            type={"text"}
                            name="otp"
                            className="my-2"
                            value={otp}
                            label={"Enter OTP"}
                            placeholder="* * * *"
                            onChange={(e) => handleOtpValue(e)}
                            autoComplete="on"
                        />

                        <DarkButton className="my-5 w-full" text="Submit Otp"
                            loading={loading}
                            onClick={submitOtp}
                        />
                    </div>


                    <button className="my-5 underline"
                        loading={loading}
                        onClick={resendOtp}>Resend OTP</button >

                </>}

            {confirmedOTP && <>
                <LabelInputCustomizable
                    type='text'
                    name='new-password'
                    className="my-2"
                    value={newPassword}
                    label={"New Password"}
                    placeholder="8 characters"
                    onChange={(e) => handlePasswordChange(e)}
                    autoComplete="on"
                />

                <DarkButton className="my-5 w-max" text="Submit Password"
                    loading={loading}
                    onClick={submitNewPassword}
                />
            </>}
        </div>
    )
}
