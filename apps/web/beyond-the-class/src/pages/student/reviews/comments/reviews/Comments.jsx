import { useEffect, useState } from 'react';
import { Card, CardMedia, CardHeader, IconButton, Rating, Avatar, Skeleton, Menu, MenuItem } from '@mui/material';
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
import { MessageSquareMore } from 'lucide-react';
import FeedbackComment from './components/FeedbackComment';

export default function Reviews() {
    const { id } = useParams();
    const teacherId = id;

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
    const [isLoading, setIsLoading] = useState({});

    const [editAnonymous, setEditAnonymous] = useState(false);

    const [showFeedBackReplies, setShowFeedBackReplies] = useState({});
    const [replyState, setReplyState] = useState({});

    const getChildReplies = async (feedbackId) => {
        try {
            const response = await axiosInstance.get('/api/teacher/reply/feedback', {
                params: { feedbackCommentId: feedbackId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching replies:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/teacher/reviews/feedbacks?id=${teacherId}`);
                const sortedFeedbacks = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setFeedbacks(sortedFeedbacks);
                setFilteredFeedbacks(sortedFeedbacks);
                logWithFileLocation("hide ", data);
                setTriggerReRender(false);
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [triggerReRender, teacherId]);

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
        setIsDialogOpen(true);
    };

    const handleUpdateFeedback = async () => {
        try {
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
            setAnchorEl(null);
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

        const displayEmail = t.hideUser
            ? maskEmail(t.userId?.personalEmail || t.userId?.universityEmail)
            : (t.userId?.personalEmail || t.userId?.universityEmail || t.userId?.email || '[deleted]');

        return (
            <Card key={t._id} className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm mb-4">
                <CardHeader
                    avatar={
                        <Avatar className="border border-border dark:border-gray-700">
                            <CardMedia
                                className="w-10 h-10 object-cover"
                                component="img"
                                image={t.hideUser ? `https://avatar.iran.liara.run/username?username=${t.userId?.name.toString().charAt(0)}` : (t.userId?.profile || `https://avatar.iran.liara.run/username?username=${t.userId?.name.toString().charAt(0)}`)}
                                alt={t.userId?.name ? (t.hideUser ? maskName(t.userId?.name) : t.userId?.name) : '[deleted]'}
                            />
                        </Avatar>
                    }
                    action={
                        <div className="flex items-center space-x-2">
                            <IconButton aria-label="ratings" className="text-muted-foreground dark:text-gray-400">
                                <div className="text-base">
                                    <Rating
                                        value={t.rating}
                                        readOnly
                                        precision={0.5}
                                        size="small"
                                        emptyIcon={<Star className="opacity-90 text-muted-foreground/20 dark:text-gray-600" fontSize="inherit" />}
                                    />
                                </div>
                            </IconButton>
                            <IconButton
                                aria-label="settings"
                                className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white"
                                onClick={(e) => {
                                    setAnchorEl(e.currentTarget);
                                    setSelectedFeedback(t);
                                }}
                            >
                                <MoreVertOutlined />
                            </IconButton>
                        </div>
                    }
                    title={
                        <p className="text-sm font-medium text-primary dark:text-white">
                            {t.userId?.name ? (t.hideUser ? maskName(t.userId?.name) : t.userId?.name) : '[deleted]'}
                            {t.__v > 0 && <span className="ml-2 text-xs text-muted-foreground dark:text-gray-400">(Edited)</span>}
                        </p>
                    }
                    subheader={
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                            {displayEmail}
                        </p>
                    }
                />
                <div className="px-6 pb-4">
                    <p className="text-sm text-foreground dark:text-gray-300 whitespace-pre-line mb-4">
                        {t.feedback}
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <VoteReview review={t} userData={t.userId} />
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={async () => {
                                        setIsLoading(prev => ({ ...prev, [t._id]: true }));
                                        await getChildReplies(t._id);
                                        setShowFeedBackReplies(prev => ({
                                            ...prev,
                                            [t._id]: !prev[t._id]
                                        }));
                                        setIsLoading(prev => ({ ...prev, [t._id]: false }));
                                    }}
                                    disabled={isLoading[t._id]}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 dark:hover:text-white h-8 px-3 bg-secondary dark:bg-gray-600 text-secondary-foreground dark:text-gray-200"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    <span>{isLoading[t._id] ? 'Loading...' : 'View Replies'}</span>
                                </button>
                                <button
                                    onClick={() => setReplyState(prev => ({
                                        ...prev,
                                        [t._id]: !prev[t._id]
                                    }))}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 dark:hover:text-white h-8 px-3 bg-secondary dark:bg-gray-600 text-secondary-foreground dark:text-gray-200"
                                >
                                    <MessageSquareMore className="h-4 w-4 mr-1" />
                                    <span>Reply</span>
                                </button>
                            </div>
                        </div>

                        {replyState[t._id] && (
                            <div className="pl-4 border-l-2 border-border dark:border-gray-700">
                                <FeedbackReplyBox feedbackReviewId={t._id} isRootReply={true} teacherId={id} />
                            </div>
                        )}

                        {showFeedBackReplies[t._id] && (
                            <div className="pl-4 border-l-2 border-border dark:border-gray-700 mt-4">
                                <FeedbackComment feedbackCommentId={t._id} />
                            </div>
                        )}
                    </div>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{
                            className: "bg-popover dark:bg-gray-800 border border-border dark:border-gray-700 rounded-md shadow-md"
                        }}
                    >
                        {selectedFeedback?.userId._id === authUser._id ? (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        handleEditFeedback(selectedFeedback);
                                        setAnchorEl(null);
                                    }}
                                    className="text-sm hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 dark:hover:text-white px-4 py-2"
                                >
                                    Edit
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleDeleteFeedback();
                                        setAnchorEl(null);
                                    }}
                                    className="text-sm text-destructive hover:bg-destructive/10 dark:hover:bg-red-900/30 px-4 py-2"
                                >
                                    Delete
                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem
                                className="text-sm hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 dark:hover:text-white px-4 py-2"
                            >
                                Report
                            </MenuItem>
                        )}
                    </Menu>
                </div>
            </Card>
        );
    };

    return (
        <div className="p-4">
            <div className="flex w-full items-center justify-end mb-3 pr-4">
                <label htmlFor="rating-filter" className="mr-1 text-sm text-muted-foreground dark:text-gray-400">Filter by:</label>
                <select
                    id="rating-filter"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(Number(e.target.value))}
                    className="text-sm py-1 px-2 border rounded-md bg-background dark:bg-gray-800 text-foreground dark:text-white border-input dark:border-gray-700 hover:bg-accent dark:hover:bg-gray-700 hover:text-accent-foreground dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <option value={-1}>All Ratings</option>
                    {[0, 1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} {rating === 1 ? 'Star' : 'Stars'}</option>
                    ))}
                </select>
            </div>
            {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 mx-4 mb-2">
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
                : (feedbacks.length === 0 ? (
                    <Card className="mx-4 mb-2 flex justify-center bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
                        <CardHeader subheader={<p className="text-muted-foreground dark:text-gray-400">No Feedbacks</p>} />
                    </Card>
                ) : filteredFeedbacks.map(renderFeedbackCard))
            }
            {isDialogOpen && (
                <div className="fixed inset-0 flex w-full items-center justify-center bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm z-40" onClick={() => setIsDialogOpen(false)}>
                    <div className="bg-card dark:bg-gray-800 w-full max-w-lg p-6 rounded-lg border border-border dark:border-gray-700 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4 text-foreground dark:text-white">Edit Feedback</h2>
                        <textarea
                            className="w-full p-2 mb-4 rounded-md border border-input dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            rows="4"
                            value={editFeedbackText}
                            onChange={(e) => setEditFeedbackText(e.target.value)}
                        />
                        <div className="flex items-center mb-4">
                            <p className="text-sm text-muted-foreground dark:text-gray-400">Submit anonymously?</p>
                            <BpCheckbox
                                value={editAnonymous}
                                onClick={() => setEditAnonymous(prev => !prev)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm text-foreground dark:text-white">Rating</label>
                            <div className="flex items-center">
                                {[...Array(5).keys()].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setEditRating(value + 1)}
                                        className={`p-1 ${value < editRating ? 'text-yellow-500' : 'text-muted-foreground dark:text-gray-400'}`}
                                    >
                                        <Star />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="px-4 py-2 rounded-md bg-secondary dark:bg-gray-700 text-secondary-foreground dark:text-gray-200 hover:bg-secondary/80 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateFeedback}
                                className="px-4 py-2 rounded-md bg-primary dark:bg-blue-600 text-primary-foreground dark:text-white hover:bg-primary/90 dark:hover:bg-blue-700"
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