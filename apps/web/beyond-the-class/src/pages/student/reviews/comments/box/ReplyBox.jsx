import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../../../context/AuthContext";
import axiosInstance from "../../../../../config/users/axios.instance";
import { useParams } from "react-router-dom";
import { useToast } from "../../../../../components/toaster/ToastCustom";

export default function FeedbackReplyBox({ feedbackReviewId, isRootReply, teacherId }) {
    const { id } = useParams();
    const { authUser } = useAuthContext();
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const [showFeedbackBox, setShowFeedbackBox] = useState('');
    const textAreaRef = useRef(null);

    const handleSubmit = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        try {
            if (feedback === '') return;
            await axiosInstance.post('/api/teacher/reply/feedback', {
                teacherId: id,
                feedbackReviewId: feedbackReviewId,
                feedbackComment: feedback,
            });

            addToast('Review submitted successfully!');
            setFeedback('');
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [feedback]);

    const adjustHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="bg-background rounded-lg">
                <div className="space-y-4">
                    <textarea
                        onClick={() => setShowFeedbackBox(true)}
                        ref={textAreaRef}
                        placeholder="Add a feedback..."
                        rows={1}
                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    <div className={`${showFeedbackBox ? 'flex' : 'hidden'} justify-end space-x-2`}>
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => {
                                setShowFeedbackBox(false);
                                setFeedback('');
                            }}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center space-x-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Sending...</span>
                                </span>
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}


// /* eslint-disable no-unused-vars */
// import { Avatar, Card, CardHeader, CardMedia, IconButton, Rating, Skeleton } from "@mui/material";
// import { useEffect, useRef, useState } from "react";
// import { Star } from "@mui/icons-material";
// import { useAuthContext } from "../../../../../context/AuthContext";
// import useTriggerReRender from "../../../../../state_management/zustand/useTriggerReRender";
// import axiosInstance from "../../../../../config/users/axios.instance";
// import BpCheckbox from '../../../../../components/MaterialUI/BpCheckbox'
// import { useParams } from "react-router-dom";
// import { useToast } from "../../../../../components/toaster/ToastCustom";


// export default function FeedbackReplyBox({ feedbackReviewId, isRootReply, teacherId }) {
//     const { id } = useParams()

//     const { authUser } = useAuthContext()
//     const [feedback, setFeedback] = useState('');
//     const [isLoading, setIsLoading] = useState(false)

//     const { addToast } = useToast();

//     const handleSubmit = async (event) => {
//         setIsLoading(true)
//         event.preventDefault();
//         const teacherId = id
//         try {
//             if (feedback === '') return;
//             await axiosInstance.post('/api/teacher/reply/feedback', {

//                 teacherId: id,
//                 feedbackReviewId: feedbackReviewId,
//                 feedbackComment: feedback
//                 // gifUrl
//                 // mentions
//             });

//             addToast('Review submitted successfully!')
//             setFeedback('');
//         } catch (error) {
//             console.error('Error submitting review:', error);
//         } finally {
//             setIsLoading(false)
//         }
//     };
//     const [showFeedbackBox, setShowFeedbackBox] = useState('')
//     const textAreaRef = useRef(null);

//     useEffect(() => {
//         adjustHeight();
//     }, [feedback]);

//     const adjustHeight = () => {
//         if (textAreaRef.current) {
//             textAreaRef.current.style.height = 'auto';
//             textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="m-4 ">
//             <div className="bg-gray-100 dark:bg-[#222222] shadow-none" >

//                 <div className="px-4 pb-2  w-[100%]">
//                     <textarea
//                         onClick={() => { setShowFeedbackBox(true) }}
//                         ref={textAreaRef}
//                         placeholder="Add a feedback"
//                         rows={1}
//                         className="w-full p-3 pl-5 mt-2  dark:bg-transparent border border-[#1e1e1ebb] dark:border-[#fffb] text-gray-900 dark:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#1e1e1ebb] dark:focus:ring-[#fffb]"
//                         value={feedback}
//                         onChange={(e) => setFeedback(e.target.value)}
//                     />
//                     <div id="feedback-box" className={`${showFeedbackBox ? 'flex' : 'hidden'} justify-end space-x-2 my-2 `}>
//                         <button
//                             disabled={isLoading}
//                             onClick={(e) => {
//                                 e.preventDefault()
//                                 setShowFeedbackBox(false)
//                                 setFeedback('')

//                             }} className="px-4 py-2 rounded-3xl border border-[#4f4f4f]  bg-[#343434d3] brightness-75 text-white  hover:bg-[#343434d3] hover:brightness-110">
//                             Cancel
//                         </button>
//                         <button type="submit" className="px-4 py-2 rounded-3xl border border-[#7a7a7a] bg-[#262626] brightness-75 text-white  hover:bg-[#262626] hover:brightness-110">
//                             {isLoading ? 'Sending' : 'Feedback'}
//                         </button>

//                     </div>
//                 </div>


//             </div>
//         </form>
//     );
// }
