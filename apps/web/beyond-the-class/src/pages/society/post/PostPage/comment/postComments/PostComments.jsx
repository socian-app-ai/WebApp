/* eslint-disable react/prop-types */
import { useState } from "react"

export default function PostComments({ campusReference = '', comments = [] }) {

    console.log("comments", comments)

    const [commentsState, setCommentsState] = useState(comments || [])

    const [openCommentId, setOpenCommentId] = useState(null); // Track open comment box

    const toggleCommentBox = (commentId) => {
        setOpenCommentId(prev => (prev === commentId ? null : commentId)); // Close if already open
    };


    return (
        <div>
            {commentsState && commentsState.length > 0 && (
                commentsState.map(((comment, idx) => {
                    return (
                        <div key={comment._id}>
                            <PostComment
                                campusReference={campusReference}
                                comment={comment}
                                level={1}
                                openCommentId={openCommentId}
                                toggleCommentBox={toggleCommentBox}

                            />
                        </div>
                    )
                }))
            )}
        </div>
    )
}

import React from 'react'
import axiosInstance from "../../../../../../config/users/axios.instance"
import { useAuthContext } from "../../../../../../context/AuthContext"
import { useEffect } from "react"
import { ThumbsUp } from "lucide-react"
import { ThumbsDown } from "lucide-react"
import { CommentOnCommentBox } from "../commentBox/PostCommentBox"
import { Reply } from "lucide-react"

export function PostComment({ campusReference, comment, level = 1, openCommentId, toggleCommentBox }) {

    const [commentBoxState, setCommentBoxState] = useState(false);
    const isOpen = openCommentId === comment._id;
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);

    const [replies, setReplies] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchReplies();
        }
    }, [isOpen]);
    const fetchReplies = async () => {
        try {
            const response = await axiosInstance.get('/api/posts/post/comment/replies', {
                params: {
                    commentId: comment._id
                }
            })
            console.log("REplies", response)
            setReplies(response.data)
        } catch (error) {
            console.error("Error in postComments ", error)
        }
    }

    useEffect(() => {
        if (commentBoxState) {
            fetchReplies()
        }

    }, [commentBoxState])


    return (<div className="p-2 my-2 bg-[#ffffff] dark:bg-[#151515]">

        <div className="flex items-start    rounded-md">
            <div >
                <img src={comment.author.profile.picture ?? 'D'} className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex flex-col mx-2">
                <div >
                    <div className="flex flex-col">
                        <p>{comment.author.name}</p>
                        {/* <p>{comment.author.username}</p> */}
                        {(campusReference !== comment?.author?.university?.campusId?._id) && <p className="text-xs font-mono backdrop-grayscale-0">{comment.author.university.campusId.name}</p>}
                        {/* <p>{comment.author.university.departmentId.name}</p> */}
                    </div>
                    <p className=" text-pretty whitespace-pre-line">{comment.comment}</p>
                </div>
                <ReVote comment={comment} toggleCommentBox={() => {
                    toggleCommentBox(comment._id);
                    setIsRepliesOpen(!isRepliesOpen)
                }} />


                {/* {commentBoxState && <PostComment comment={replies} campusReference={campusReference} />} */}



            </div>

        </div>


        {isRepliesOpen && replies.length > 0 && (
            <div className={`${level < 3 && 'pl-3'}`}>
                {replies.map((reply) => (
                    <PostComment key={reply._id}
                        comment={reply}
                        campusReference={campusReference}
                        level={level + 1}
                        openCommentId={openCommentId}
                        toggleCommentBox={toggleCommentBox}
                    />
                ))}
            </div>
        )}



        {isOpen && openCommentId === comment._id && <CommentOnCommentBox commentId={comment._id} postId={comment.postId} />}
    </div>
    )
}





export function ReVote({ comment, toggleCommentBox }) {
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
            // `/ api / posts / vote - post` 
            const response = await axiosInstance.post('/api/posts/post/comment/vote', {
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
        <div className="flex gap-1 items-center">
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

            <button className="flex"
                onClick={toggleCommentBox}>
                <Reply className="w-4 h-4 mr-1" />
                <p className="text-sm font-medium">{comment.replies.length}</p>
            </button>
        </div>
    );
}



const VoteButton = ({ active, direction, count, onClick, loading }) => (
    <button
        onClick={onClick}
        disabled={loading}
        className={`flex flex-row items-center group transition-colors ${loading ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            } rounded-md p-1`}
    >
        {direction === 'up' ? (
            <ThumbsUp className={`w - 4 h - 4 mr - 1 transition - colors ${active ? 'text-orange-500 ' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400'
                } `} />
        ) : (
            <ThumbsDown className={`w - 4 h - 4 mr - 1 transition - colors ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400'
                } `} />
        )}
        <span className={`text - sm font - medium ${active ? (direction === 'up' ? 'text-orange-500' : 'text-blue-500') : 'text-gray-600 dark:text-gray-300'
            } `}>
            {Math.abs(count)}
        </span>
    </button>
);