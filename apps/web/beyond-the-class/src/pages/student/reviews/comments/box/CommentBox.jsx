import { Avatar, Card, CardHeader, CardMedia, IconButton, Rating, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Star } from "@mui/icons-material";
import { useAuthContext } from "../../../../../context/AuthContext";
import useTriggerReRender from "../../../../../state_management/zustand/useTriggerReRender";
import axiosInstance from "../../../../../config/users/axios.instance";
import BpCheckbox from '../../../../../components/MaterialUI/BpCheckbox'
import { useParams } from "react-router-dom";
import { useToast } from "../../../../../components/toaster/ToastCustom";


export default function FeedbackBox() {
    const { id } = useParams()

    const { authUser } = useAuthContext()
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const { setTriggerReRender } = useTriggerReRender();
    const [anonymous, setAnonymous] = useState(false)

    const { addToast } = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const teacherId = id
        try {
            if (feedback === '') return;
            await axiosInstance.post('/api/teacher/rate', {
                teacherId,
                userId: authUser._id,
                rating,
                feedback,
                hideUser: anonymous
            });

            addToast('Review submitted successfully!')
            setTriggerReRender(true)
            setFeedback('');
            setRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };
    const [showFeedbackBox, setShowFeedbackBox] = useState('')
    const textAreaRef = useRef(null);

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
        <form onSubmit={handleSubmit} className="m-4 ">
            <Card className="bg-gray-100 dark:bg-[#222222] " sx={{ borderRadius: '0.5rem' }}>

                {!authUser ? (
                    <div className="p-4 flex justify-between">
                        <div className="flex items-center ">
                            <Skeleton variant="circular" width={43} height={43} />
                            <div className="ml-3 flex flex-col justify-between">
                                <Skeleton variant="text" width={150} height={20} />
                                <Skeleton variant="text" width={200} height={15} />
                            </div>

                        </div>
                        <Skeleton variant="text" width={200} height={25} />

                    </div>
                ) : (

                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe">
                                <CardMedia
                                    component="img"
                                    image={authUser.profile.picture}
                                />
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="ratings">
                                <div className="text-[1.2rem] sm:text-md">
                                    <Rating
                                        value={rating}
                                        onChange={(event, newValue) => setRating(newValue)}
                                        precision={0.5}
                                        style={{ fontSize: 'inherit' }}
                                        emptyIcon={<Star className="opacity-90 text-[#BABBBD]" style={{ fontSize: 'inherit' }} />}
                                    />
                                </div>
                            </IconButton>
                        }
                        title={<p className="mt-2 text-xs md:text-md  font-semibold dark:text-white">{authUser.name ? authUser.name : authUser.email}</p>}
                        subheader={
                            <div className="flex -mt-[0.4rem] items-center">
                                <p className="text-xs md:text-md  text-gray-600 dark:text-gray-400">Submit anonymously?</p>
                                <BpCheckbox
                                    value={anonymous}
                                    onClick={() => setAnonymous(!anonymous)}
                                />


                            </div>
                        }
                    />
                )}


                <div className="px-4 pb-2 -mt-3 w-[100%]">
                    <textarea
                        onClick={() => { setShowFeedbackBox(true) }}
                        ref={textAreaRef}
                        placeholder="Add a feedback"
                        rows={1}
                        className="w-full p-3 pl-5 mt-2  dark:bg-transparent border border-[#1e1e1ebb] dark:border-[#fffb] text-gray-900 dark:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#1e1e1ebb] dark:focus:ring-[#fffb]"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                    <div id="feedback-box" className={`${showFeedbackBox ? 'flex' : 'hidden'} justify-end space-x-2 my-2 `}>
                        <button onClick={(e) => {
                            e.preventDefault()
                            setShowFeedbackBox(false)
                            setFeedback('')
                        }} className="px-4 py-2 rounded-3xl border border-[#4f4f4f]  bg-[#343434d3] brightness-75 text-white  hover:bg-[#343434d3] hover:brightness-110">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-3xl border border-[#7a7a7a] bg-[#262626] brightness-75 text-white  hover:bg-[#262626] hover:brightness-110">
                            Feedback
                        </button>

                    </div>
                </div>


            </Card>
        </form>
    );
}

