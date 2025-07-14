import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import CommentBox from "./ui/CommentBox";
import Comment from "./ui/Comment";
import ChatBox from "./chatbox/ChatBox";
import axiosInstance from "../../../../config/users/axios.instance";
import { useAuthContext } from "../../../../context/AuthContext";
import { useToast } from "../../../../components/toaster/ToastCustom";

// eslint-disable-next-line react/prop-types
export default function Discussions({ toBeDisccusedId }) {
    const [discussionId, setDiscussionId] = useState('');
    const [comments, setComments] = useState([]);
    const [sortMethod, setSortMethod] = useState('votes');
    const [isLoading, setIsLoading] = useState(true);
    const { authUser } = useAuthContext()

    const { addToast } = useToast();



    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.post(`/api/discussion/create-get?toBeDisccusedId=${toBeDisccusedId}`);
                setDiscussionId(response.data.discussion._id);
                // console.log(response)
                // console.log("DI", discussionId)
                setComments(response.data.discussion.discussioncomments || []);
            } catch (error) {
                // toast.error('Failed to fetch discussion');
                // toast.custom("Be the first to discuss", {
                //     className: "border border-white dart:bg-[121212] w-fit ",
                //     position: 'bottom-right',
                //     duration: 2000
                // })
                addToast(error.response?.data?.error || "Failed to fetch discussion");


            } finally {
                setIsLoading(false);
            }
        };
        fetchDiscussion();
    }, [toBeDisccusedId]);

    // const handleNewComment = (newComment) => {
    //     setComments((prevComments) => [newComment, ...prevComments]);
    // };

    const handleNewComment = (newComment) => {
        // console.log("NEW COMMET", newComment)
        // Ensure the new comment has the 'user' field
        if (!newComment.user) {
            newComment.user = {
                username: authUser.username,
                profile: { picture: authUser.profile.picture },
                _id: authUser._id,
            };
        }
        
        // Ensure the new comment has the proper voteId structure
        if (!newComment.voteId) {
            newComment.voteId = {
                upVotesCount: 0,
                downVotesCount: 0,
                userVotes: {}
            };
        }
        
        // Ensure replies array exists
        if (!newComment.replies) {
            newComment.replies = [];
        }
        
        setComments((prevComments) => [newComment, ...prevComments]);
    };



    const handleReply = async (commentId, replyContent) => {
        try {
            const response = await axiosInstance.post('/api/discussion/comment/reply-to-comment', {
                commentId,
                ...replyContent
            });

            const updatedComments = comments.map(comment => {
                if (comment._id === commentId) {
                    return { ...comment, replies: [response.data, ...comment.replies] };
                }
                return comment;
            });
            setComments(updatedComments);
            addToast("Reply added successfully");
        } catch (error) {
            // toast.error('Failed to submit reply');
            addToast(error.response?.data?.error || "Failed to submit reply");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axiosInstance.delete(`/api/discussion/comment/${commentId}`);
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
            addToast("Comment deleted successfully");
        } catch (error) {
            addToast(error.response?.data?.error || "Failed to delete comment");
        }
    };



    const sortComments = (comments, method) => {
        // Filter out any null or undefined comments
        const validComments = comments.filter(comment => comment != null);
        
        if (method === 'votes') {
            return [...validComments].sort((a, b) => {
                // Add null checks to prevent errors
                const aVotes = (a?.voteId?.upVotesCount || 0) - (a?.voteId?.downVotesCount || 0);
                const bVotes = (b?.voteId?.upVotesCount || 0) - (b?.voteId?.downVotesCount || 0);
                if (a.questionTag?.isAnswer !== b.questionTag?.isAnswer) {
                    return b.questionTag?.isAnswer ? 1 : -1;
                }
                return bVotes - aVotes;
            });
        } else if (method === 'newest') {
            return [...validComments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return validComments;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-full p-2 flex items-center justify-center">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">
                    Loading discussion...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full p-2">
            <div className="flex w-full justify-between">
                <ChatBox discussionId={discussionId} />
            </div>

            <CommentBox discussionId={toBeDisccusedId} onComment={handleNewComment} />
            <div className="flex justify-between items-center mb-4">
                <h6 className="text-md font-semibold">The Discussions</h6>

                <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-sm">Sort by:</label>
                    <select
                        id="sort"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                        className="text-sm py-1 px-3 border dark:bg-[#151515] rounded-3xl shadow-sm"
                    >
                        <option value="votes">Top Votes</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {comments.length > 0 ? (
                    sortComments(comments, sortMethod).map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onReply={handleReply}
                            onDelete={handleDeleteComment}
                            currentUserId={authUser._id}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No comments yet. Be the first to discuss!
                    </p>
                )}
            </div>
        </div>
    );
}
