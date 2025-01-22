/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import toast from "react-hot-toast";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import { Avatar, Skeleton } from "@mui/material";
import { useAuthContext } from "../../../../../context/AuthContext";
import axiosInstance from "../../../../../config/users/axios.instance";
import { ThumbsUp } from "lucide-react";
import { ThumbsDown } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";
import formatTimeDifference from "../../../../../utils/formatDate";
import { ReplyIcon } from "lucide-react";
import { useToast } from "../../../../../components/toaster/ToastCustom";

function Comment({ comment, onReply, }) {
    const [reply, setReply] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    // const [upvote, setUpvote] = useState(comment.upvotes.length)
    // const [downvote, setDownvote] = useState(comment.downvotes.length)

    const { addToast } = useToast();

    // const { authUser } = useAuthContext()

    // const [hasUpvoted, setHasUpvoted] = useState(comment.upvotes.includes(authUser._id));
    // const [hasDownvoted, setHasDownvoted] = useState(comment.downvotes.includes(authUser._id));

    const handleReplySubmit = (event) => {
        event.preventDefault();
        if (reply.trim()) {
            onReply(comment._id, reply);
            setReply('');
            addToast('Reply submitted!');
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



    // const handleVote = async (commentId) => {
    //     try {
    //         // console.log("here", commentId)
    //         const response = await axiosInstance.post('/api/discussion/comment/vote-comment', {
    //             userId: authUser._id,
    //             commentId: commentId._id
    //         });
    //         const { downVoteCount, upVoteCount, downVoteBool, upVoteBool } = response.data;
    //         // console.log(downVoteCount)
    //         setDownvote(downVoteCount)
    //         setUpvote(upVoteCount)

    //         setHasUpvoted(upVoteBool);
    //         setHasDownvoted(downVoteBool);

    //     } catch (error) {
    //         toast.error('Failed to upvote comment');
    //     }
    // }





































    // const handleUpVote = async (commentId) => {
    //     try {
    //         // console.log("here", commentId)
    //         const response = await axiosInstance.post('/api/discussion/comment/up-vote', {
    //             userId: authUser._id,
    //             commentId: commentId._id
    //         });
    //         const { downVoteCount, upVoteCount, downVoteBool, upVoteBool } = response.data;
    //         // console.log(downVoteCount)
    //         setDownvote(downVoteCount)
    //         setUpvote(upVoteCount)

    //         setHasUpvoted(upVoteBool);
    //         setHasDownvoted(downVoteBool);

    //     } catch (error) {
    //         toast.error('Failed to upvote comment');
    //     }
    // }


    // const handleDownVote = async (commentId) => {
    //     try {
    //         // console.log("here", commentId, authUser._id)
    //         const response = await axiosInstance.post('/api/discussion/comment/down-vote', {
    //             userId: authUser._id,
    //             commentId: commentId._id
    //         });
    //         const { downVoteCount, upVoteCount, downVoteBool, upVoteBool } = response.data;
    //         // console.log(downVoteCount)
    //         setDownvote(downVoteCount)
    //         setUpvote(upVoteCount)

    //         setHasUpvoted(upVoteBool);
    //         setHasDownvoted(downVoteBool);


    //     } catch (error) {
    //         toast.error('Failed to downvote comment');
    //     }
    // }


    // console.log("Comment", comment)

    return (comment.length !== 0 &&
        <div className="w-full mb-1 border-l dark:border-t bg-white dark:bg-[#151515] rounded-lg dark:rounded-sm border-[#0303031c]  dark:border-[#ffffff5a]   shadow-[#3f3f3fba] p-3 ">

            <div className="flex">
                <div className="flex items-start ">
                    {comment.user ?
                        <Avatar className="w-8 h-8 rounded-full"
                            src={comment?.user ? comment?.user?.profile?.picture ?? "" : "D"}
                            alt={comment?.user?.name} />
                        :
                        <Skeleton variant="circular" height={35} width={35} />}
                </div>

                <div className="flex flex-col items-start w-full">
                    <div className="ml-2 mt-1 flex space-x-2">
                        <p className=" text-sm font-semibold dark:text-white">{comment.user ? comment.user.username : '[deleted user]'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatTimeDifference(comment.createdAt)}</p>
                    </div>
                    <p className="text-md ml-2 mt-1 dark:text-white whitespace-pre-line">{comment.content}</p>

                    <div className="flex justify-end space-x-2 mt-3 -ml-7">
                        {comment.replies.length > 0 && (
                            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowReplies(!showReplies)}>
                                {!showReplies
                                    ? <CiCirclePlus className="dark:text-white text-black" size={22} />
                                    : <CiCircleMinus className="dark:text-white text-black" size={22} />
                                }
                            </button>
                        )}
                        {/* <button className="flex text-gray-500 hover:text-gray-700" onClick={() => { handleVote(comment) }}>
                            <ArrowUpward className={`${(hasUpvoted === hasDownvoted) ? '' : (hasUpvoted ? 'text-red-500' : '')}`} /> <p> {upvote}</p>
                        </button>
                        <button className="flex text-gray-500 hover:text-gray-700" onClick={() => { handleVote(comment) }}>
                            <ArrowDownward className={`${(hasUpvoted === hasDownvoted) ? '' : (hasDownvoted ? 'text-blue-500' : '')}`} /> <p> {downvote}</p>
                        </button> */}

                        <ReVote comment={comment} />
                        <button className="text-gray-500 hover:text-gray-700" onClick={() => { setShowReplyBox(!showReplyBox) }} >
                            <div className="flex justify-center items-center space-x-1">
                                <ReplyIcon size={18} />
                                <p >reply</p>
                            </div>
                        </button>
                    </div>

                    {showReplyBox && <form onSubmit={handleReplySubmit} className="mt-4 w-full">
                        <textarea
                            ref={textAreaRef}
                            onClick={() => { setShowReplyBox(true); setReply('') }}
                            placeholder="Reply..."
                            rows={1}
                            className="w-full p-2 pl-5 mt-1  dark:bg-transparent border border-[#121212] dark:border-[#fffb] text-gray-900 dark:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#fffb]"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                        <div className={`${showReplyBox ? 'flex' : 'hidden'} justify-end space-x-2 `}>
                            <button onClick={(e) => {
                                e.preventDefault()
                                setShowReplyBox(false)
                            }} className="px-4 py-2 rounded-3xl dark:bg-[#343434d3] dark:brightness-75 dark:text-white  dark:hover:bg-[#343434d3] 
                            bg-[#c4c4c4d3] brightness-75 text-black  hover:bg-[#b8b8b8d3]
                            
                            hover:brightness-110">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-3xl dark:bg-[#262626] dark:brightness-75 dark:text-white  dark:hover:bg-[#262626] 
                            bg-[#b8b8b8] brightness-75 text-black  hover:bg-[#979797] 
                            hover:brightness-110
                            ">
                                Comment
                            </button>
                        </div>
                    </form>}
                </div>


            </div>


            {showReplies && (
                <div className="mt-3  pt-1">
                    {comment.replies.map((reply, index) => {
                        console.log(":THIS", reply)
                        return (
                            <div className="pl-1" key={index}>
                                <Comment comment={reply} onReply={onReply} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

export default Comment;



















const VoteButton = ({ active, direction, count, onClick, loading }) => (
    <button
        onClick={onClick}
        disabled={loading}
        className={`flex flex-row items-center group transition-colors ${loading ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            } rounded-md p-1`}
    >
        {direction === 'up' ? (
            <ArrowUp className={`w-4 h-4 mr-1 transition-colors ${active ? 'text-orange-500 ' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400'
                }`} />
        ) : (
            <ArrowDown className={`w-4 h-4 mr-1 transition-colors ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400'
                }`} />
        )}
        <span className={`text-sm font-medium ${active ? (direction === 'up' ? 'text-orange-500' : 'text-blue-500') : 'text-gray-600 dark:text-gray-300'
            }`}>
            {Math.abs(count)}
        </span>
    </button>
);






export function ReVote({ comment }) {
    // console.log("THOS", comment)
    const { authUser } = useAuthContext();
    const [upvote, setUpvote] = useState(comment.voteId.upVotesCount);
    const [downvote, setDownvote] = useState(comment.voteId.downVotesCount);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHasUpvoted(comment.voteId.userVotes[authUser._id] === 'upvote');
        setHasDownvoted(comment.voteId.userVotes[authUser._id] === 'downvote');
    }, [comment.voteId.userVotes, authUser._id]);

    const handleVote = async (e, voteTypeVal) => {
        e.preventDefault();
        setLoading(true);
        try {
            // `/api/posts/vote-post` 
            const response = await axiosInstance.post("/api/discussion/comment/vote", {
                userId: authUser._id,
                commentId: comment._id,
                voteType: voteTypeVal
            });
            const { upVotesCount, downVotesCount, noneSelected } = response.data;
            if (noneSelected) {
                // console.log("here", noneSelected)
                setHasUpvoted(false);
                setHasDownvoted(false);
            } else {

                setHasUpvoted(voteTypeVal === 'upvote');
                setHasDownvoted(voteTypeVal === 'downvote');
            }
            setUpvote(upVotesCount);
            setDownvote(downVotesCount);
            // console.log("HH", upVotesCount, downVotesCount)
        } catch (error) {
            console.error("Error voting:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-1">
            <VoteButton
                direction="up"
                active={hasUpvoted}
                count={upvote}
                onClick={(e) => handleVote(e, 'upvote')}
                loading={loading}
            />
            <VoteButton
                direction="down"
                active={hasDownvoted}
                count={downvote}
                onClick={(e) => handleVote(e, 'downvote')}
                loading={loading}
            />
        </div>
    );
}