import { useState } from 'react';
import { useParams } from 'react-router-dom';

import PropTypes from 'prop-types';
import { useToast } from '../../../../../../components/toaster/ToastCustom';
import axiosInstance from '../../../../../../config/users/axios.instance';

const FeedBackReply = ({ reply, commentId }) => {
    const { id } = useParams();
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleReply = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        try {
            if (replyText === '') return;
            await axiosInstance.post('/api/teacher/reply/reply/feedback', {
                teacherId: id,
                feedbackCommentId: commentId,
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

    return (
        <div className="border-l-2 border-border pl-4 dark:border-gray-700">
            <div className="flex items-start space-x-2">
                <div className="h-6 w-6 rounded-full bg-secondary/50 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs font-medium text-secondary-foreground dark:text-gray-200">
                        {reply.user.username.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-primary dark:text-gray-200">@{reply.user.username}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{reply.comment}</p>
                </div>
            </div>

            <div className="ml-8 mt-2">
                <button
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 h-7 px-3 bg-secondary dark:bg-gray-800 text-secondary-foreground dark:text-gray-200"
                    onClick={() => setShowReplyBox(!showReplyBox)}
                >
                    Reply
                </button>
            </div>

            {showReplyBox && (
                <div className="ml-8 mt-3">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-200"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to @${reply.user.username}...`}
                        />
                        <button
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary dark:bg-gray-700 text-primary-foreground dark:text-gray-200 hover:bg-primary/90 dark:hover:bg-gray-600 h-9 px-4"
                            onClick={handleReply}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Submit'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

FeedBackReply.propTypes = {
    reply: PropTypes.shape({
        user: PropTypes.shape({
            username: PropTypes.string.isRequired
        }).isRequired,
        comment: PropTypes.string.isRequired
    }).isRequired,
    commentId: PropTypes.string.isRequired
};

export default FeedBackReply;