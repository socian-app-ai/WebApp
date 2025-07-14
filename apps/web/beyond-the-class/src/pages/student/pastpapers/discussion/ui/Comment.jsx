/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Avatar, Skeleton } from "@mui/material";
import { useAuthContext } from "../../../../../context/AuthContext";
import axiosInstance from "../../../../../config/users/axios.instance";
import { ArrowUp, ArrowDown, ReplyIcon, CheckCircle2, HelpCircle, MessageSquare } from "lucide-react";
import formatTimeDifference from "../../../../../utils/formatDate";
import { useToast } from "../../../../../components/toaster/ToastCustom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AnswerDrawer from './AnswerDrawer';

function Comment({ comment, onReply, onDelete, currentUserId }) {
    const [reply, setReply] = useState('');
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showAnswerDrawer, setShowAnswerDrawer] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [questionTag, setQuestionTag] = useState({
        questionNumber: '',
        part: '',
        isAnswer: false
    });
    const [richContent, setRichContent] = useState('');
    const [existingTags, setExistingTags] = useState([]);
    const [showQuestionFields, setShowQuestionFields] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const { addToast } = useToast();
    const textAreaRef = useRef(null);
    const answerDrawerRef = useRef(null);

    useEffect(() => {
        adjustHeight();
    }, [reply]);

    useEffect(() => {
        if (isAddingTag) {
            fetchExistingTags();
        }
    }, [isAddingTag]);

    useEffect(() => {
        if (showReplies) {
            fetchReplies();
        }
    }, [showReplies]);

    const adjustHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    const fetchReplies = async () => {
        try {
            const response = await axiosInstance.get(`/api/discussion/comment/reply/${comment._id}`);
            setReplies(response.data.replies);
        } catch {
            addToast('Failed to fetch replies');
        }
    };

    const fetchExistingTags = async () => {
        try {
            const response = await axiosInstance.get(`/api/discussion/tags/${comment.discussion}`);
            setExistingTags(response.data.tags);
        } catch {
            addToast('Failed to fetch existing tags');
        }
    };

    const handleReplySubmit = async (event) => {
        event.preventDefault();
        if (reply.trim() || richContent) {
            const replyContent = richContent || reply;
            const payload = {
                commentId: comment._id,
                replyContent,
                questionTag: showQuestionFields ? {
                    ...questionTag,
                    isAnswer: true
                } : undefined
            };
            await onReply(comment._id, payload);
            setReply('');
            setRichContent('');
            setShowReplyBox(false);
            setShowQuestionFields(false);
            setQuestionTag({ questionNumber: '', part: '', isAnswer: false });
            addToast('Reply submitted!');
        }
    };

    const handleTagSubmit = async () => {
        try {
            await axiosInstance.post(`/api/discussion/comment/update-tag/${comment._id}`, {
                questionTag: {
                    ...questionTag,
                    isAnswer: true
                }
            });
            addToast('Answer tag added successfully!');
            setIsAddingTag(false);
        } catch {
            addToast('Failed to add answer tag');
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(comment._id);
            addToast('Comment deleted successfully');
        } catch {
            addToast('Failed to delete comment');
        }
    };

    const renderTagSelector = () => (
        <div className="mt-4 p-4 border dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium dark:text-white mb-4">Tag as Answer</h3>

            {existingTags.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Select from existing tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {existingTags.map((tag) => (
                            <button
                                key={`${tag.questionNumber}-${tag.part}`}
                                onClick={() => setQuestionTag(tag)}
                                className={`px-3 py-1 rounded-full text-sm ${questionTag.questionNumber === tag.questionNumber &&
                                    questionTag.part === tag.part
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                Q{tag.questionNumber}
                                {tag.part && `-${tag.part}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Or create a new tag:</p>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            Question Number
                        </label>
                        <input
                            type="number"
                            value={questionTag.questionNumber}
                            onChange={(e) => setQuestionTag(prev => ({
                                ...prev,
                                questionNumber: e.target.value
                            }))}
                            className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
                            placeholder="e.g. 1"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            Part (optional)
                        </label>
                        <input
                            type="text"
                            value={questionTag.part}
                            onChange={(e) => setQuestionTag(prev => ({
                                ...prev,
                                part: e.target.value.toUpperCase()
                            }))}
                            className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
                            placeholder="e.g. A"
                            maxLength={1}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={() => setIsAddingTag(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={handleTagSubmit}
                    disabled={!questionTag.questionNumber}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Add Tag
                </button>
            </div>
        </div>
    );

    const renderCommentForm = () => (
        <form onSubmit={handleReplySubmit} className="mt-4 w-full">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowQuestionFields(!showQuestionFields)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${showQuestionFields
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            } hover:bg-opacity-80`}
                    >
                        <HelpCircle size={14} />
                        <span>Answer to Question</span>
                    </button>
                    {existingTags.length > 0 && showQuestionFields && (
                        <div className="flex gap-2">
                            {existingTags.map((tag) => (
                                <button
                                    key={`${tag.questionNumber}-${tag.part}`}
                                    type="button"
                                    onClick={() => setQuestionTag(tag)}
                                    className={`px-2 py-1 rounded-full text-xs ${questionTag.questionNumber === tag.questionNumber &&
                                        questionTag.part === tag.part
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Q{tag.questionNumber}
                                    {tag.part && `-${tag.part}`}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showQuestionFields && (
                <div className="flex gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 max-w-[200px]">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            Question Number *
                        </label>
                        <input
                            type="number"
                            value={questionTag.questionNumber}
                            onChange={(e) => setQuestionTag(prev => ({
                                ...prev,
                                questionNumber: e.target.value
                            }))}
                            className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. 1"
                            required={showQuestionFields}
                        />
                    </div>
                    <div className="flex-1 max-w-[200px]">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            Part (optional)
                        </label>
                        <input
                            type="text"
                            value={questionTag.part}
                            onChange={(e) => setQuestionTag(prev => ({
                                ...prev,
                                part: e.target.value.toUpperCase()
                            }))}
                            className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. A"
                            maxLength={1}
                        />
                    </div>
                </div>
            )}

            <ReactQuill
                value={richContent}
                onChange={setRichContent}
                className="mb-4 bg-white dark:bg-gray-800 rounded-lg"
                theme="snow"
                modules={{
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                }}
            />
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={() => {
                        setShowReplyBox(false);
                        setRichContent('');
                        setShowQuestionFields(false);
                        setQuestionTag({ questionNumber: '', part: '', isAnswer: false });
                    }}
                    className="px-4 py-2 rounded-3xl dark:bg-[#343434d3] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={showQuestionFields && !questionTag.questionNumber}
                    className="px-4 py-2 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    Submit
                </button>
            </div>
        </form>
    );

    return (
        <div className="w-full mb-1 border-l dark:border-t bg-white dark:bg-[#151515] rounded-lg dark:rounded-sm border-[#0303031c] dark:border-[#ffffff5a] shadow-[#3f3f3fba] p-3">
            <div className="flex">
                <div className="flex items-start">
                    {comment.user ? (
                        <Avatar
                            className="w-8 h-8 rounded-full"
                            src={comment.user?.profile?.picture ?? ""}
                            alt={comment.user?.name}
                        />
                    ) : (
                        <Skeleton variant="circular" height={35} width={35} />
                    )}
                </div>

                <div className="flex flex-col items-start w-full ml-2">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold dark:text-white">
                            {comment.user ? comment.user.username : '[deleted user]'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTimeDifference(comment.createdAt)}
                        </p>
                        {comment.questionTag && (
                            <button
                                onClick={() => {
                                    setShowAnswerDrawer(true);
                                    if (answerDrawerRef.current) {
                                        answerDrawerRef.current.fetchPastpapers(comment.paperType, comment.subjectId);
                                    }
                                }}
                                className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800"
                            >
                                Q{comment.questionTag.questionNumber}
                                {comment.questionTag.part && `-${comment.questionTag.part}`}
                                {comment.isApprovedAnswer && (
                                    <CheckCircle2 className="inline ml-1 text-green-500" size={12} />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="mt-1 w-full dark:text-white prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                    />

                    <div className="flex justify-between w-full items-center mt-3">
                        <div className="flex items-center space-x-2">
                            <ReVote comment={comment} />
                            <button
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                <MessageSquare size={18} />
                                <span>{replies.length || 0}</span>
                            </button>
                        </div>

                        <div className="flex space-x-2">
                            {!comment.questionTag && (
                                <button
                                    onClick={() => setIsAddingTag(true)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Tag as Answer
                                </button>
                            )}
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowReplyBox(!showReplyBox)}
                            >
                                <div className="flex items-center gap-1">
                                    <ReplyIcon size={18} />
                                    <span>reply</span>
                                </div>
                            </button>
                            {comment.user?._id === currentUserId && (
                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>

                    {isAddingTag && renderTagSelector()}
                    {showReplyBox && renderCommentForm()}

                    {showReplies && replies.length > 0 && (
                        <div className="mt-4 space-y-4">
                            {replies.map((reply) => (
                                <Comment
                                    key={reply._id}
                                    comment={reply}
                                    onReply={onReply}
                                    onDelete={onDelete}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AnswerDrawer
                ref={answerDrawerRef}
                open={showAnswerDrawer}
                onClose={() => setShowAnswerDrawer(false)}
                initialQuestionId={comment.structuredQuestionId}
                paperId={comment.paperId}
            />
        </div>
    );
}

export default Comment;

export function ReVote({ comment }) {
    const { authUser } = useAuthContext();
    const [upvote, setUpvote] = useState(comment.voteId?.upVotesCount || 0);
    const [downvote, setDownvote] = useState(comment.voteId?.downVotesCount || 0);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userVote = comment.voteId?.userVotes?.[authUser._id];
        setHasUpvoted(userVote === 'upvote');
        setHasDownvoted(userVote === 'downvote');
    }, [comment.voteId?.userVotes, authUser._id]);

    const handleVote = async (e, voteTypeVal) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post("/api/discussion/comment/vote", {
                commentId: comment._id,
                voteType: voteTypeVal
            });
            const { upVotesCount, downVotesCount, noneSelected } = response.data;
            if (noneSelected) {
                setHasUpvoted(false);
                setHasDownvoted(false);
            } else {
                setHasUpvoted(voteTypeVal === 'upvote');
                setHasDownvoted(voteTypeVal === 'downvote');
            }
            setUpvote(upVotesCount);
            setDownvote(downVotesCount);
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