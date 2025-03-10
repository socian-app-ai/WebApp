import { useState } from 'react';
import { useParams } from 'react-router-dom';
import FeedBackReply from './FeedBackReply';
import PropTypes from 'prop-types';
import { useToast } from '../../../../../../components/toaster/ToastCustom';
import axiosInstance from '../../../../../../config/users/axios.instance';

const SeperateComment = ({ comment }) => {
    const { id } = useParams();
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleReply = async (event, feedbackId) => {
        setIsLoading(true);
        event.preventDefault();
        try {
            if (replyText === '') return;
            await axiosInstance.post('/api/teacher/reply/reply/feedback', {
                teacherId: id,
                feedbackCommentId: feedbackId,
                feedbackComment: replyText,
            });
            addToast('Reply submitted successfully!');
            setReplyText('');
        } catch (error) {
            console.error('Error submitting reply:', error);
        } finally {
            setIsLoading(false);
            setShowReplyBox(false);
        }
    };

    const getChildReplies = async (feedbackCommentId) => {
        try {
            const response = await axiosInstance.get('/api/teacher/reply/reply/feedback', {
                params: { feedbackCommentId }
            });
            if (response.data) {
                setReplies(response.data.replies);
            }
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    return (
        <div className="py-3 dark:bg-gray-800">
            <div className="flex items-start space-x-2">
                <div className="h-8 w-8 rounded-full bg-secondary dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-secondary-foreground dark:text-gray-200">
                        {comment.user.username.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-primary dark:text-white">@{comment.user.username}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{comment.comment}</p>
                </div>
            </div>

            <div className="ml-10 mt-2 space-x-2">
                <button
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 h-7 px-3 bg-secondary dark:bg-gray-600 text-secondary-foreground dark:text-gray-200"
                    onClick={() => setShowReplyBox(!showReplyBox)}
                >
                    Reply
                </button>
                <button
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 h-7 px-3 bg-secondary dark:bg-gray-600 text-secondary-foreground dark:text-gray-200"
                    onClick={async () => {
                        setIsLoading(true);
                        await getChildReplies(comment._id);
                        setIsLoading(false);
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'View Replies'}
                </button>
            </div>

            {showReplyBox && (
                <div className="ml-10 mt-3">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-gray-700 dark:border-gray-600 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to @${comment.user.username}...`}
                        />
                        <button
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary dark:bg-gray-600 text-primary-foreground dark:text-white hover:bg-primary/90 dark:hover:bg-gray-700 h-9 px-4"
                            onClick={(e) => handleReply(e, comment._id)}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Submit'}
                        </button>
                    </div>
                </div>
            )}

            {replies?.replies && (
                <div className="ml-10 mt-4 space-y-3">
                    {replies.replies.map((reply) => (
                        <FeedBackReply
                            key={reply._id}
                            reply={reply}
                            commentId={comment._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

SeperateComment.propTypes = {
    comment: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired
        }).isRequired,
        comment: PropTypes.string.isRequired
    }).isRequired
};

export default SeperateComment;