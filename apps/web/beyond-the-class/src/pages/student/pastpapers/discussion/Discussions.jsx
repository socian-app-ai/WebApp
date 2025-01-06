import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommentBox from "./ui/CommentBox";
import Comment from "./ui/Comment";
import ChatBox from "./chatbox/ChatBox";
import axiosInstance from "../../../../config/users/axios.instance";
import { useAuthContext } from "../../../../context/AuthContext";

// eslint-disable-next-line react/prop-types
export default function Discussions({ toBeDisccusedId }) {
    const [discussionId, setDiscussionId] = useState('');
    const [comments, setComments] = useState([]);
    const [sortMethod, setSortMethod] = useState('votes');
    const { authUser } = useAuthContext()



    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const response = await axiosInstance.post(`/api/discussion/create-get?toBeDisccusedId=${toBeDisccusedId}`);
                setDiscussionId(response.data.discussion._id);
                // console.log(response)
                // console.log("DI", discussionId)
                setComments(response.data.discussion.discussioncomments);
            } catch (error) {
                toast.error('Failed to fetch discussion');
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
        setComments((prevComments) => [newComment, ...prevComments]);
    };



    const handleReply = async (commentId, replyContent) => {
        try {
            const response = await axiosInstance.post('/api/discussion/comment/reply-to-comment', {
                commentId,
                userId: authUser._id,
                replyContent: replyContent,
            });
            const updatedComments = comments.map(comment => {
                if (comment._id === commentId) {
                    return { ...comment, replies: [response.data, ...comment.replies] };
                }
                return comment;
            });
            setComments(updatedComments);
        } catch (error) {
            toast.error('Failed to submit reply');
        }
    };



    const sortComments = (comments, method) => {
        if (method === 'votes') {
            return [...comments].sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
        } else if (method === 'newest') {
            return [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return comments;
    };


    return (
        <div className="min-h-screen w-full p-2">
            <div className="flex w-full justify-between">
                <ChatBox discussionId={discussionId} />
            </div>

            <CommentBox discussionId={toBeDisccusedId} onComment={handleNewComment} />
            <div className="flex justify-between">
                <h6 className="text-md font-semibold m-2">The Discussions</h6>

                <div className="flex  items-center justify-center w-40  mb-2 ">
                    <label htmlFor="sort" className="mr-1 text-sm">Sort by:</label>
                    <select
                        id="sort"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                        className="text-sm py-1 px-2  border  dark:bg-[#151515] rounded-3xl shadow-sm  shadow-[#3f3f3fba]"
                    >
                        <option value="votes">Top Votes</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>



            <div className="flex flex-col">

                {comments.length !== 0 ? sortComments(comments, sortMethod).map((comment) => (
                    <div key={comment._id} >
                        {/* className="border-b-[0.05rem]" */}
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onReply={handleReply}

                        />
                    </div>
                )) :
                    <p className="w-full p-2">No Comments to Show</p>
                }
            </div>
        </div>
    );
}
