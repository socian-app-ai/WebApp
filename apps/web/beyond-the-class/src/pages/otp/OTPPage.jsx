
// export default function OTPPage() {
//     const [otp, setOtp] = useState(Array(6).fill(''));
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const { id } = useParams();  // Capture the :id parameter
//     const { setAuthUser } = useAuthContext()

//     console.log('OTP ID:', id);

//     // Handle changes in OTP inputs
//     const handleChange = (e, index) => {
//         const value = e.target.value;
//         const newOtp = [...otp];
//         newOtp[index] = value;

//         // Automatically move to the next input if the user enters a value
//         if (value && index < 5) {
//             document.getElementById(`otp-input-${index + 1}`).focus();
//         }

//         setOtp(newOtp);
//     };

//     // Handle OTP submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const enteredOtp = otp.join('');

//         // Validate the OTP
//         if (enteredOtp.length === 6 && !/\D/.test(enteredOtp)) {
//             setLoading(true);
//             setError('');

//             try {
//                 // Call the API for OTP validation
//                 const response = await axiosInstance.post(routesForApi.auth.registerationVerifyOTP, {
//                     otp: enteredOtp,
//                     userId: id
//                 });
//                 console.log('OTP veri!', response);

//                 if (response.status === 200) {
//                     // Handle success (redirect or show success message)
//                     console.log('OTP verified successfully!', response);
//                     // setAuthUser(response.data)
//                     window.location.href = '/'
//                 }
//             } catch (err) {
//                 setError(err?.response?.data ? err.response.data.message : 'Invalid OTP or OTP expired. Please try again.');
//                 console.error('Error verifying OTP:', err);
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setError('Please enter a valid 6-digit OTP.');
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-lg w-80">
//                 <h2 className="text-xl font-semibold text-center mb-4">Enter OTP</h2>
//                 {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
//                 <form onSubmit={handleSubmit} className="flex justify-between mb-4">
//                     {otp.map((digit, index) => (
//                         <input
//                             key={index}
//                             id={`otp-input-${index}`}
//                             type="text"
//                             maxLength="1"
//                             autoComplete='off'
//                             value={digit}
//                             onChange={(e) => handleChange(e, index)}
//                             className="w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     ))}
//                 </form>
//                 <button
//                     onClick={handleSubmit}
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
//                     disabled={loading}
//                 >
//                     {loading ? 'Verifying...' : 'Submit'}
//                 </button>
//             </div>
//         </div>
//     );
// }







import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/users/axios.instance';
import { routesForApi } from '../../utils/routes/routesForLinks';
import { Lock, Mail, Clock, RefreshCw } from 'lucide-react';

export default function OTPPage() {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const otpInputRefs = useRef([]);
    const timerRef = useRef(null);

    const { id } = useParams();
    // console.log('OTP ID:', id);

    // Start countdown timer for OTP resend
    useEffect(() => {
        if (resendTimer > 0 && !canResend) {
            timerRef.current = setTimeout(() => {
                setResendTimer(prev => prev - 1);
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

    // Handle OTP input changes
    const handleChange = (e, index) => {
        const value = e.target.value;

        // Only allow numeric input
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Automatically move to next input or previous input
            if (value && index < 5) {
                otpInputRefs.current[index + 1].focus();
            } else if (!value && index > 0) {
                otpInputRefs.current[index - 1].focus();
            }
        }
    };

    // Handle key events for better input navigation
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    // Resend OTP functionality
    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        setError('');

        try {


            setCanResend(false);
            setResendTimer(60);
            setError('');
        } catch (err) {
            setError(err?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Submit OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');

        // Validate the OTP
        if (enteredOtp.length === 6 && !/\D/.test(enteredOtp)) {
            setLoading(true);
            setError('');

            try {

                const response = await axiosInstance.post(routesForApi.auth.registerationVerifyOTP, {
                    otp: enteredOtp,
                    userId: id
                });
                if (response.status === 200) {
                    // Handle success (redirect or show success message)
                    // console.log('OTP verified successfully!', response);
                    // setAuthUser(response.data)
                    window.location.href = '/'
                }

            } catch (err) {
                setError(err?.message || 'Invalid OTP or OTP expired. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please enter a valid 6-digit OTP.');
        }
    };

    return (
        // bg-gradient-to-br from-blue-50 to-blue-100
        <div className="flex justify-center items-center min-h-screen  p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-blue-400 text-white p-6 text-center">
                    <Lock className="mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold">Verify Your Account</h2>
                    <p className="text-sm text-blue-100 mt-2">
                        Enter the 6-digit verification code sent to your email
                    </p>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 flex items-center">
                            <Mail className="mr-2" size={20} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => otpInputRefs.current[index] = el}
                                    type="text"
                                    maxLength="1"
                                    autoComplete='off'
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-14 text-center text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                                <Clock className="mr-2" size={16} />
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        <RefreshCw className="mr-1" size={14} />
                                        Resend OTP
                                    </button>
                                ) : (
                                    <span>Resend OTP in {resendTimer} seconds</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || otp.some(digit => digit === '')}
                            className="w-full bg-gradient-to-br from-blue-500 to-blue-200 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
