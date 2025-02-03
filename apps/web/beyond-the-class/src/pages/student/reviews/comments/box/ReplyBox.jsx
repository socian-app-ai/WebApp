

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
        const teacherId = id;
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
        <form onSubmit={handleSubmit} className="m-4">
            <div className="bg-gray-100 dark:bg-[#222222] shadow-none">
                <div className="px-4 pb-2 w-full">
                    <textarea
                        onClick={() => setShowFeedbackBox(true)}
                        ref={textAreaRef}
                        placeholder="Add a feedback"
                        rows={1}
                        className="w-full p-3 pl-5 mt-2 dark:bg-transparent border border-[#1e1e1ebb] dark:border-[#fffb] text-gray-900 dark:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#1e1e1ebb] dark:focus:ring-[#fffb]"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                    <div id="feedback-box" className={`${showFeedbackBox ? 'flex' : 'hidden'} justify-end space-x-2 my-2`}>
                        <button
                            disabled={isLoading}
                            onClick={(e) => {
                                e.preventDefault();
                                setShowFeedbackBox(false);
                                setFeedback('');
                            }}
                            className="px-4 py-2 rounded-3xl border border-[#4f4f4f] bg-[#343434d3] brightness-75 text-white hover:bg-[#343434d3] hover:brightness-110"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-3xl border border-[#7a7a7a] bg-[#262626] brightness-75 text-white hover:bg-[#262626] hover:brightness-110"
                        >
                            {isLoading ? 'Sending' : 'Feedback'}
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
