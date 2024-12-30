
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../../../context/AuthContext";
import axiosInstance from "../../../../../config/users/axios.instance";

// eslint-disable-next-line react/prop-types
export default function CommentBox({ discussionId, onComment }) {
    const { authUser } = useAuthContext()
    const [comment, setComment] = useState('');


    const textAreaRef = useRef(null);

    useEffect(() => {
        adjustHeight();
    }, [comment]);

    const adjustHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    const handleSubmit = async (event) => {
        // console.log("here", authUser._id)
        event.preventDefault();
        if (comment.trim()) {
            try {
                const response = await axiosInstance.post('/api/discussion/comment/add-comment', {
                    toBeDiscussedId: discussionId,
                    userId: authUser._id,
                    commentContent: comment,
                });
                onComment(response.data);
                setComment('');
                toast.success('Comment submitted successfully!');
                setShowCommentBox(false)
            } catch (error) {
                console.error('Error submitting comment:', error);
                toast.error('Failed to submit comment');
            }
        }
    };

    const [showCommentBox, setShowCommentBox] = useState('')

    // const handleCommentShow = () => {
    //     if (showCommentBox) {
    //         setShowCommentBox(false)
    //     } else {
    //         setShowCommentBox(true)
    //     }
    // }

    return (
        <form onSubmit={handleSubmit} className="my-1">
            <div className="bg-gray-100 dark:bg-[#151515] mb-5 rounded-3xl shadow-md p-4">
                <div className="flex  items-start">
                    <img className="mt-3 w-10 h-10 rounded-full" src={authUser.picture} alt={authUser.name} />
                    <div className="ml-4 w-full">
                        <textarea
                            onClick={() => { setShowCommentBox(true) }}
                            ref={textAreaRef}
                            placeholder="Add a comment"
                            rows={1}
                            className="w-full p-3 pl-5 mt-2  dark:bg-transparent border border-[#fffb] text-gray-900 dark:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#fffb]"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div id="comment-box" className={`${showCommentBox ? 'flex' : 'hidden'} justify-end space-x-2 my-1`}>
                            <button onClick={(e) => {
                                e.preventDefault()
                                setShowCommentBox(false)
                                setComment('')
                            }} className="px-4 py-2 rounded-3xl border border-[#4f4f4f]  bg-[#343434d3] brightness-75 text-white  hover:bg-[#343434d3] hover:brightness-110">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-3xl border border-[#7a7a7a] bg-[#262626] brightness-75 text-white  hover:bg-[#262626] hover:brightness-110">
                                Comment
                            </button>

                        </div>
                    </div>
                </div>


            </div>
        </form>
    );
}
