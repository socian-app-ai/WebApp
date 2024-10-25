/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import toast from "react-hot-toast";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import useUserData from "../../../../zustand/useUserData";
import axiosInstance from "../../../../config/axios.instance";
import { Avatar, Skeleton } from "@mui/material";

function Comment({ comment, onReply, }) {
    const [reply, setReply] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [upvote, setUpvote] = useState(comment.upvotes.length)
    const [downvote, setDownvote] = useState(comment.downvotes.length)


    const { userData } = useUserData()

    const [hasUpvoted, setHasUpvoted] = useState(comment.upvotes.includes(userData._id));
    const [hasDownvoted, setHasDownvoted] = useState(comment.downvotes.includes(userData._id));

    const handleReplySubmit = (event) => {
        event.preventDefault();
        if (reply.trim()) {
            onReply(comment._id, reply);
            setReply('');
            toast.success('Reply submitted!');
        }
    };



    const textAreaRef = useRef(null);

    useEffect(() => {
        adjustHeight();
    }, [reply]);

    const adjustHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };



    const handleUpVote = async (commentId) => {
        try {
            // console.log("here", commentId)
            const response = await axiosInstance.post('/api/comment/up-vote', {
                userId: userData._id,
                commentId: commentId._id
            });
            const { downVoteCount, upVoteCount, downVoteBool, upVoteBool } = response.data;
            // console.log(downVoteCount)
            setDownvote(downVoteCount)
            setUpvote(upVoteCount)

            setHasUpvoted(upVoteBool);
            setHasDownvoted(downVoteBool);

        } catch (error) {
            toast.error('Failed to upvote comment');
        }
    }


    const handleDownVote = async (commentId) => {
        try {
            // console.log("here", commentId)
            const response = await axiosInstance.post('/api/comment/down-vote', {
                userId: userData._id,
                commentId: commentId._id
            });
            const { downVoteCount, upVoteCount, downVoteBool, upVoteBool } = response.data;
            // console.log(downVoteCount)
            setDownvote(downVoteCount)
            setUpvote(upVoteCount)

            setHasUpvoted(upVoteBool);
            setHasDownvoted(downVoteBool);


        } catch (error) {
            toast.error('Failed to downvote comment');
        }
    }


    // console.log("Comment", comment)

    return (comment.length !== 0 &&
        <div className="w-full mb-4 bg-gray-100 dark:bg-[#151515] rounded-3xl shadow-sm  shadow-[#3f3f3fba] p-4">

            <div className="flex">
                <div className="flex items-start ">
                    {comment.user ?
                        <Avatar className="w-8 h-8 rounded-full"
                            src={comment.user.profilePic}
                            alt={comment.user.name} />
                        :
                        <Skeleton variant="circular" height={35} width={35} />}
                </div>

                <div className="flex flex-col items-start w-full">
                    <div className="ml-2 mt-1 flex space-x-2">
                        <p className=" text-sm font-semibold dark:text-white">{comment.user ? comment.user.name : '[deleted user]'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-md ml-2 mt-3 dark:text-white whitespace-pre-line">{comment.content}</p>

                    <div className="flex justify-end space-x-2 mt-3 -ml-7">
                        {comment.replies.length > 0 && (
                            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowReplies(!showReplies)}>
                                {!showReplies
                                    ? <CiCirclePlus className="dark:text-white text-black" size={22} />
                                    : <CiCircleMinus className="dark:text-white text-black" size={22} />
                                }
                            </button>
                        )}
                        <button className="flex text-gray-500 hover:text-gray-700" onClick={() => { handleUpVote(comment) }}>
                            <ArrowUpward className={`${(hasUpvoted === hasDownvoted) ? '' : (hasUpvoted ? 'text-red-500' : '')}`} /> <p> {upvote}</p>
                        </button>
                        <button className="flex text-gray-500 hover:text-gray-700" onClick={() => { handleDownVote(comment) }}>
                            <ArrowDownward className={`${(hasUpvoted === hasDownvoted) ? '' : (hasDownvoted ? 'text-blue-500' : '')}`} /> <p> {downvote}</p>
                        </button>
                        <button className="text-gray-500 hover:text-gray-700" onClick={() => { setShowReplyBox(!showReplyBox) }} >
                            <div className="flex justify-center items-center space-x-1">
                                <FaRegMessage size={18} />
                                <p className="mb-[0.15rem]">Reply</p>
                            </div>
                        </button>
                    </div>

                    {showReplyBox && <form onSubmit={handleReplySubmit} className="mt-4 w-full">
                        <textarea
                            ref={textAreaRef}
                            onClick={() => { setShowReplyBox(true); setReply('') }}
                            placeholder="Reply..."
                            rows={1}
                            className="w-full p-3 pl-5 mt-2  dark:bg-transparent border border-[#fffb] text-gray-900 dark:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#fffb]"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                        <div className={`${showReplyBox ? 'flex' : 'hidden'} justify-end space-x-2 `}>
                            <button onClick={(e) => {
                                e.preventDefault()
                                setShowReplyBox(false)
                            }} className="px-4 py-2 rounded-3xl bg-[#343434d3] brightness-75 text-white  hover:bg-[#343434d3] hover:brightness-110">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-3xl bg-[#262626] brightness-75 text-white  hover:bg-[#262626] hover:brightness-110">
                                Comment
                            </button>
                        </div>
                    </form>}
                </div>


            </div>


            {showReplies && (
                <div className="mt-3  pt-1">
                    {comment.replies.map((reply, index) => (
                        <div className="pl-1" key={index}>
                            <Comment comment={reply} onReply={onReply} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;
