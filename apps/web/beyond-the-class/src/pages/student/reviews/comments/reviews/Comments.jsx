/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import { Card, CardMedia, Typography, CardHeader, IconButton, Rating, Avatar, Skeleton, Menu, MenuItem } from '@mui/material';
import { MoreVertOutlined, Star } from '@mui/icons-material';
import useTriggerReRender from '../../../../../state_management/zustand/useTriggerReRender';
import { useAuthContext } from '../../../../../context/AuthContext';
import axiosInstance from '../../../../../config/users/axios.instance';
import { useParams } from 'react-router-dom';
import VoteReview from '../vote/VoteReview';
import BpCheckbox from '../../../../../components/MaterialUI/BpCheckbox';
import logWithFileLocation from '../../../../../utils/consoleLog';
import { Plus } from 'lucide-react';
import FeedbackReplyBox from '../box/ReplyBox';
import { useToast } from '../../../../../components/toaster/ToastCustom';
import { MessageSquareMore } from 'lucide-react';

export default function Reviews() {

    const { id } = useParams()
    const teacherId = id


    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const { triggerReRender, setTriggerReRender } = useTriggerReRender();
    const [selectedRating, setSelectedRating] = useState(-1);
    const { authUser } = useAuthContext();
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [editFeedbackText, setEditFeedbackText] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editAnonymous, setEditAnonymous] = useState(false);

    const [showFeedBackReplies, setShowFeedBackReplies] = useState(false)
    const [replyState, setReplyState] = useState(false)


    useEffect(() => {

        const fetchFeedbacks = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/teacher/reviews/feedbacks?id=${teacherId}`);
                const sortedFeedbacks = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setFeedbacks(sortedFeedbacks);
                setFilteredFeedbacks(sortedFeedbacks);
                logWithFileLocation("hide ", data)
                setTriggerReRender(false);
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            } finally {
                setLoading(false)
            }
        };
        fetchFeedbacks();
    }, [triggerReRender, location.search]);

    useEffect(() => {
        if (selectedRating === -1) {
            setFilteredFeedbacks(feedbacks);
        } else {
            setFilteredFeedbacks(feedbacks.filter(feedback => feedback.rating === selectedRating));
        }
    }, [selectedRating, feedbacks]);

    const handleEditFeedback = (feedback) => {
        setEditingFeedback(feedback);
        setEditFeedbackText(feedback.feedback);
        setEditRating(feedback.rating);
        setEditAnonymous(feedback.hideUser);
        // console.log("hide ", feedback)
        setIsDialogOpen(true);
    };

    const handleUpdateFeedback = async () => {
        try {
            // console.log("Hidemmmm", editingFeedback)
            await axiosInstance.post('/api/teacher/rate', {
                teacherId,
                userId: editingFeedback.userId._id,
                rating: editRating,
                feedback: editFeedbackText,
                hideUser: editingFeedback.hideUser
            });

            const updatedFeedbacks = feedbacks.map(c =>
                c._id === editingFeedback._id
                    ? { ...c, rating: editRating, feedback: editFeedbackText }
                    : c
            );
            const sortedFeedbacks = updatedFeedbacks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setFeedbacks(sortedFeedbacks);
            setFilteredFeedbacks(sortedFeedbacks);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteFeedback = async () => {
        try {

            await axiosInstance.delete(`/api/teacher/reviews/feedbacks/delete`, {
                data: { teacherId: teacherId, userId: authUser._id }
            });

            const updatedFeedbacks = feedbacks.filter(c => c._id !== selectedFeedback._id);
            const sortedFeedbacks = updatedFeedbacks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setFeedbacks(sortedFeedbacks);
            setFilteredFeedbacks(sortedFeedbacks);
            setAnchorEl(null); // Colse menu
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        return `${localPart.charAt(0)}****@${domain}`;
    };


    const renderFeedbackCard = (t) => {
        const maskName = (name) => {
            if (!name) return '[deleted]';
            return name.charAt(0) + "****";
        };

        // setShorFeedBackReplies

        const displayEmail = t.hideUser
            ? maskEmail(t.userId?.personalEmail || t.userId?.universityEmail)
            : (t.userId?.personalEmail || t.userId?.universityEmail || t.userId?.email || '[deleted]');

        // console.log("user id", t.userId)

        return <Card key={t._id} className="bg-gray-100 dark:bg-[#222222] md:mx-2 mb-2">
            <CardHeader
                avatar={
                    <Avatar aria-label="student">
                        <CardMedia
                            className='w-8 md:w-10'
                            component="img"
                            image={t.hideUser ? `https://avatar.iran.liara.run/username?username=${t.userId?.name.toString().charAt(0)}` : (t.userId?.profile || `https://avatar.iran.liara.run/username?username=${t.userId?.name.toString().charAt(0)}`)}
                            alt={t.userId?.name ? (t.hideUser ? maskName(t.userId?.name) : t.userId?.name) : '[deleted]'}
                        />
                    </Avatar>
                }
                action={
                    <div className='flex items-center space-x-1'>
                        <IconButton aria-label="ratings">
                            <div className='text-[1.2rem] md:text-[1.5rem]'>
                                <Rating
                                    style={{ fontSize: 'inherit' }}
                                    value={t.rating}
                                    readOnly
                                    precision={0.5}
                                    emptyIcon={<Star className="opacity-90 text-[#BABBBD]" style={{ fontSize: 'inherit' }} />}
                                />
                            </div>
                        </IconButton>
                        <IconButton aria-label="settings" onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedFeedback(t);
                        }}>
                            <MoreVertOutlined />
                        </IconButton>
                    </div>
                }
                title={<p className="mt-2 text-xs md:text-md lg:text-md-lg font-semibold dark:text-white">
                    {t.userId?.name ? (t.hideUser ? maskName(t.userId?.name) : t.userId?.name) : '[deleted]'} <span className='font-thin'>{t.__v > 0 ? '(Edited)' : ''}</span>
                </p>}
                subheader={<p className="text-xs md:text-md lg:text-md-lg text-gray-600 dark:text-gray-400">
                    {displayEmail}
                    {/*   {t.userId?.personalEmail || t.userId?.universityEmail || '[deleted]'} */}
                </p>}
            />
            <p className="px-8 text-sm md:text-md  font-semibold dark:text-white whitespace-pre-line">
                {t.feedback}
            </p>

            <div>
                <div >
                    <VoteReview review={t} userData={t.userId} />
                    {replyState && <FeedbackReplyBox feedbackReviewId={t._id} isRootReply={true} teacherId={id} />}
                </div>
                <Plus onClick={() => setShowFeedBackReplies(true)} />
                <MessageSquareMore onClick={() => setReplyState(!replyState)} />
            </div>

            {showFeedBackReplies && <FeedbackComment comment={t.replies} />}

            <div className='mr-20 bg-black dark:bg-white text-black dark:text-white '>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        className: ``
                    }}
                    className='text-sm'
                >
                    {selectedFeedback?.userId._id === authUser._id ?
                        <>
                            <MenuItem key={selectedFeedback._id} onClick={() => handleEditFeedback(selectedFeedback)}>edit</MenuItem>
                            <MenuItem key={selectedFeedback._id + "d"} onClick={handleDeleteFeedback}>delete</MenuItem>
                        </>
                        : <MenuItem >report</MenuItem>
                    }

                </Menu>
            </div>
        </Card>
    }


    // if (filteredFeedbacks.length === 0) {
    //     return (<Card className='mx-4 mb-2 flex justify-center bg-gray-100 dark:bg-[#222222]'>
    //         <CardHeader subheader={<p className='text-gray-600 dark:text-white'>No Feedbacks</p>} />
    //     </Card>)
    // }
    return (
        <div className="p-4">
            <div className="flex w-full items-center justify-end mb-3 pr-4">
                <label htmlFor="rating-filter" className="mr-1 text-sm">Filter by:</label>
                <select
                    id="rating-filter"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(Number(e.target.value))}
                    className="text-sm py-1 px-2 border dark:bg-[#151515] rounded-3xl shadow-sm shadow-[#3f3f3fba]"
                >
                    <option value={-1}>All Ratings</option>
                    {[0, 1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} {rating === 1 ? 'Star' : 'Stars'}</option>
                    ))}
                </select>
            </div>
            {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="bg-gray-100 dark:bg-[#222222] mx-4 mb-2">
                        <div className="p-4 flex justify-between">
                            <div className="flex items-center">
                                <Skeleton variant="circular" width={43} height={43} />
                                <div className="ml-3 flex flex-col justify-between">
                                    <Skeleton variant="text" width={150} height={20} />
                                    <Skeleton variant="text" width={200} height={15} />
                                </div>
                            </div>
                            <Skeleton variant="text" width={200} height={25} />
                        </div>
                        <div className="p-4">
                            <Skeleton variant="text" width="100%" height={40} />
                        </div>
                    </Card>
                ))
                : (feedbacks.length === 0 ? (<Card className='mx-4 mb-2 flex justify-center bg-gray-100 dark:bg-[#222222]'>
                    <CardHeader subheader={<p className='text-gray-600 dark:text-white'>No Feedbacks</p>} />
                </Card>) :
                    filteredFeedbacks.map(renderFeedbackCard)
                )
            }
            {isDialogOpen && (
                <div className="fixed inset-0 flex w-full items-center justify-center bg-black bg-opacity-50 z-40" onClick={() => setIsDialogOpen(false)}>
                    <div className="bg-white w-full dark:bg-[#333333] p-6 rounded-lg max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4 dark:text-white">Edit Feedback</h2>
                        <textarea
                            className="w-full p-2 mb-4 border rounded dark:bg-[#444444] dark:text-white"
                            rows="4"
                            value={editFeedbackText}
                            onChange={(e) => setEditFeedbackText(e.target.value)}
                        />
                        <div className="flex -mt-[0.4rem] items-center">
                            <p className="text-xs md:text-md  text-gray-600 dark:text-gray-400">Submit anonymously?</p>
                            <BpCheckbox
                                value={editAnonymous}
                                onClick={() => setEditAnonymous(prev => !prev)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm dark:text-white">Rating</label>
                            <div className="flex items-center">
                                {[...Array(5).keys()].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setEditRating(value + 1)}
                                        className={`p-1 ${value < editRating ? 'text-yellow-500' : 'text-gray-400'}`}
                                    >
                                        <Star />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="px-4 py-2 rounded-3xl bg-[#343434d3] brightness-75 text-white hover:bg-[#343434d3] hover:brightness-110"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateFeedback}
                                className="px-4 py-2 rounded-3xl bg-[#262626] brightness-75 text-white hover:bg-[#262626] hover:brightness-110"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



const FeedbackComment = ({ comment }) => {
    // console.log("FeedbackComment", comment)
    return (
        comment && comment.length > 0 &&
        comment.map((cmt) => (
            <SeperateComment key={cmt._id} comment={cmt} />
        ))
    );
};

const SeperateComment = ({ comment }) => {
    const { id } = useParams()


    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { addToast } = useToast();

    const handleReply = async (event, feedbackId) => {
        setIsLoading(true)

        event.preventDefault();
        try {
            if (replyText === '') return;
            await axiosInstance.post('/api/teacher/reply/reply/feedback', {

                teacherId: id,
                feedbackCommentId: feedbackId,
                feedbackComment: replyText,
                // gifUrl
                // mentions 
            });

            addToast('Review submitted successfully!')
            setReplyText('');

        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsLoading(false)
            setShowReplyBox(false);

        }
    };

    const getChildReplies = async (feedbackCommentId) => {
        console.log("Is it null", feedbackCommentId)
        try {
            const response = await axiosInstance.get('/api/teacher/reply/reply/feedback', {
                params: {
                    feedbackCommentId: feedbackCommentId
                }
            });

            if (response.data) {
                setReplies(response.data.replies)
                console.log("yoyo", response.data)
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }



    return (
        <div key={comment._id} className="ml-4 border-l-2 pl-2 mt-2">
            <p className="text-sm font-bold">@{comment.user.username}</p>
            <p className="text-gray-700">{comment.comment}</p>

            <div className='flex'>
                <button
                    className="dark:text-white text-black text-xs mt-1"
                    onClick={() => setShowReplyBox(!showReplyBox)}
                >
                    Reply
                </button>
                <button className='dark:text-white text-black text-xs mt-1 mx-2' onClick={() => getChildReplies(comment._id)} >view reply</button>
            </div>


            {showReplyBox && (
                <div className="mt-2">
                    <input
                        type="text"
                        className="border p-1 text-sm w-full"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to @${comment.user.username}...`}
                    />
                    <button
                        className="bg-[#333] text-white text-xs p-1 mt-1"
                        onClick={(e) => handleReply(e, comment._id)}
                    >
                        Submit
                    </button>
                </div>
            )}
            {/* {console.log("lenght", replies)} */}

            {
                replies && replies.replies.map((reply) => {
                    return (
                        <FeedBackReply
                            commentId={comment._id}
                            key={reply._id}
                            reply={reply}
                        />
                    )
                })
            }


        </div>
    );
}



const FeedBackReply = ({ key, reply, commentId }) => {
    console.log("KEY", key, reply)
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState(null)


    // console.log("FeedBackReply", reply)

    const { id } = useParams()

    const [isLoading, setIsLoading] = useState(false)

    const { addToast } = useToast();

    const handleReply = async (event) => {
        setIsLoading(true)

        event.preventDefault();
        try {
            if (replyText === '') return;
            await axiosInstance.post('/api/teacher/reply/reply/feedback', {

                teacherId: id,
                feedbackCommentId: commentId,
                feedbackComment: replyText,
                // gifUrl
                // mentions 
            });

            addToast('Review submitted successfully!')
            setReplyText('');

        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsLoading(false)
            setShowReplyBox(false);

        }
    };

    return (<div key={reply._id} className="ml-4 border-l-2 pl-2 mt-2">
        <p className="text-sm font-bold">@{reply.user.username}</p>
        <p className="text-gray-700">{reply.comment}</p>
        <button
            className="text-blue-500 text-xs mt-1"
            onClick={() => setShowReplyBox(!showReplyBox)}
        >
            Reply
        </button>
        {showReplyBox && (
            <div className="mt-2">
                <input
                    type="text"
                    className="border p-1 text-sm w-full"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to @${reply.user.username}...`}
                />
                <button
                    className="bg-blue-500 text-white text-xs p-1 mt-1"
                    onClick={(e) => handleReply(e)}
                >
                    Submit
                </button>
            </div>
        )}
    </div>)
}