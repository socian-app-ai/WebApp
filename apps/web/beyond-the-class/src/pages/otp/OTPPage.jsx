
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/users/axios.instance";
import { routesForApi } from "../../utils/routes/routesForLinks";
import toast from "react-hot-toast";

const EmailVerification = () => {
    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const timerRef = useRef(null);

    const { id } = useParams();

    // Extract email from URL query params
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const emailParam = queryParams.get("email");
        setEmail(emailParam || "dummy@byc.com"); // Default email if none found
    }, []);

    // Handle OTP input change
    const handleInputChange = async (e) => {
        const input = e.target.value;
        if (/^\d*$/.test(input) && input.length <= 6) {
            setCode(input);
            if (input.length === 6) {
                await handleSubmit(input);
            }
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        if (!canResend) return;

        setLoading(true);
        setError("");

        try {
            const response = await axiosInstance.post(
                routesForApi.auth.registerationResendOTP,
                { userId: id }
            );

            if (response.status === 200) {
                setResendTimer(30);
                setCanResend(false);
                // alert("OTP resent successfully!");
                toast.success("OTP resent successfully!")
            }
            else if (response.status === 203) {
                setError(response.data.error)
            }
        } catch (err) {
            setError(err?.message || "Failed to resend OTP. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Submit OTP
    const handleSubmit = async (otp) => {
        if (otp.length === 6 && /^\d+$/.test(otp)) {
            setLoading(true);
            setError("");

            try {
                const response = await axiosInstance.post(
                    routesForApi.auth.registerationVerifyOTP,
                    {
                        otp,
                        userId: id,
                    }
                );

                if (response.status === 200) {
                    window.location.href = "/"; // Redirect on success
                }
            } catch (err) {
                setError(err?.response?.data?.message || "Invalid OTP or OTP expired.");
            } finally {
                setLoading(false);
            }
        } else {
            setError("Please enter a valid 6-digit OTP.");
        }
    };

    // Countdown timer for OTP resend
    useEffect(() => {
        if (resendTimer > 0 && !canResend) {
            timerRef.current = setTimeout(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [resendTimer, canResend]);

    return (
        <div className="auth_page_style-gradient flex items-center justify-center min-h-screen bg-gray-100">
            <div className=" dark:bg-[#181818] dark:border-[#ffffff33] border-[0.01rem]  border-[#cccccc] bg-[#f9f9f9]  p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="dark:text-white text-2xl font-semibold mb-4">Verify your email</h2>
                <p className="dark:text-white text-gray-700 mb-6">
                    We sent you a six digit confirmation code to
                    <br />
                    <span className="font-medium">{email}</span>. Please enter it below to
                    confirm your email address.
                </p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code"
                    className="
                    text-gray-900 dark:text-white text-sm 
                        bg-gray-100 dark:bg-gray-900  border-gray-300 dark:border-gray-600 

                    dark:text-[#fbfbfbc7] shadow-sm w-full p-3 
                    border rounded-md mb-4 focus:outline-none focus:ring-2
                     focus:ring-blue-500"
                    disabled={loading}
                />

                <p className="text-sm dark:text-[#ffffffb4] text-gray-500 mt-4">
                    Didn&apos;t receive a code?{" "}
                    <button
                        onClick={handleResendCode}
                        className={`${canResend
                            ? "dark:text-white text-black hover:underline focus:outline-none"
                            : "text-gray-400 cursor-not-allowed"
                            }`}
                        disabled={!canResend}
                    >
                        Send code again
                    </button>{" "}
                    {resendTimer > 0 && (
                        <span className="text-gray-400 ml-2">
                            ({resendTimer}s)
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default EmailVerification;

