import { useEffect, useState } from 'react';
import { Card, CardMedia, Typography, CardHeader, IconButton, Rating, Avatar, Skeleton, Menu, MenuItem } from '@mui/material';
import { MoreVertOutlined, Star } from '@mui/icons-material';
import useTriggerReRender from '../../../../../state_management/zustand/useTriggerReRender';
import { useAuthContext } from '../../../../../context/AuthContext';
import axiosInstance from '../../../../../config/users/axios.instance';
import { useParams } from 'react-router-dom';
import VoteReview from '../vote/VoteReview';
import BpCheckbox from '../../../../../components/MaterialUI/BpCheckbox';

export default function Reviews() {

    const { id } = useParams()
    const teacherId = id


    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const { triggerReRender, setTriggerReRender } = useTriggerReRender();
    const [selectedRating, setSelectedRating] = useState(-1);
    const { authUser } = useAuthContext();
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editAnonymous, setEditAnonymous] = useState(false);

    useEffect(() => {

        const fetchComments = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/teacher/reviews/comments?id=${teacherId}`);
                const sortedComments = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setComments(sortedComments);
                setFilteredComments(sortedComments);
                setTriggerReRender(false);
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            } finally {
                setLoading(false)
            }
        };
        fetchComments();
    }, [triggerReRender, location.search]);

    useEffect(() => {
        if (selectedRating === -1) {
            setFilteredComments(comments);
        } else {
            setFilteredComments(comments.filter(comment => comment.rating === selectedRating));
        }
    }, [selectedRating, comments]);

    const handleEditComment = (comment) => {
        setEditingComment(comment);
        setEditCommentText(comment.comment);
        setEditRating(comment.rating);
        setEditAnonymous(comment.hideUser);
        // console.log("hide ", comment.hideUser)
        setIsDialogOpen(true);
    };

    const handleUpdateComment = async () => {
        try {
            // console.log("Hide", editingComment)
            await axiosInstance.post('/api/teacher/rate', {
                teacherId,
                userId: editingComment.userId._id,
                rating: editRating,
                comment: editCommentText,
                hideUser: editingComment.hideUser
            });

            const updatedComments = comments.map(c =>
                c._id === editingComment._id
                    ? { ...c, rating: editRating, comment: editCommentText }
                    : c
            );
            const sortedComments = updatedComments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setComments(sortedComments);
            setFilteredComments(sortedComments);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteComment = async () => {
        try {

            await axiosInstance.delete(`/api/teacher/reviews/comments/delete`, {
                data: { teacherId: teacherId, userId: authUser._id }
            });

            const updatedComments = comments.filter(c => c._id !== selectedComment._id);
            const sortedComments = updatedComments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setComments(sortedComments);
            setFilteredComments(sortedComments);
            setAnchorEl(null); // Colse menu
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        return `${localPart.charAt(0)}****@${domain}`;
    };


    const renderCommentCard = (t) => {
        const maskName = (name) => {
            if (!name) return '[deleted]';
            return name.charAt(0) + "****";
        };


        const displayEmail = t.hideUser
            ? maskEmail(t.userId?.personalEmail || t.userId?.universityEmail)
            : (t.userId?.personalEmail || t.userId?.universityEmail || t.userId?.email || '[deleted]');

        // console.log("user id", t.userId)

        return <Card key={t._id} className="bg-gray-100 dark:bg-[#222222] md:mx-2 mb-2">
            <CardHeader
                avatar={
                    <Avatar aria-label="student">
                        <CardMedia
                            className='w-8 md:w-10'
                            component="img"
                            image={t.hideUser ? `https://avatar.iran.liara.run/username?username=${t.userId?.name.toString().charAt(0)}` : (t.userId?.profile || `https://avatar.iran.liara.run/username?username=${t.userId?.name.toString().charAt(0)}`)}
                            alt={t.userId?.name ? (t.hideUser ? maskName(t.userId?.name) : t.userId?.name) : '[deleted]'}
                        />
                    </Avatar>
                }
                action={
                    <div className='flex items-center space-x-1'>
                        <IconButton aria-label="ratings">
                            <div className='text-[1.2rem] md:text-[1.5rem]'>
                                <Rating
                                    style={{ fontSize: 'inherit' }}
                                    value={t.rating}
                                    readOnly
                                    precision={0.5}
                                    emptyIcon={<Star className="opacity-90 text-[#BABBBD]" style={{ fontSize: 'inherit' }} />}
                                />
                            </div>
                        </IconButton>
                        <IconButton aria-label="settings" onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedComment(t);
                        }}>
                            <MoreVertOutlined />
                        </IconButton>
                    </div>
                }
                title={<p className="mt-2 text-xs md:text-md lg:text-md-lg font-semibold dark:text-white">
                    {t.userId?.name ? (t.hideUser ? maskName(t.userId?.name) : t.userId?.name) : '[deleted]'} <span className='font-thin'>{t.__v > 0 ? '(Edited)' : ''}</span>
                </p>}
                subheader={<p className="text-xs md:text-md lg:text-md-lg text-gray-600 dark:text-gray-400">
                    {displayEmail}
                    {/*   {t.userId?.personalEmail || t.userId?.universityEmail || '[deleted]'} */}
                </p>}
            />
            <Typography variant="p" className="mt-2 text-sm md:text-md  font-semibold dark:text-white whitespace-pre-line" component="div" marginLeft="4.2rem" marginBottom="2rem">
                {t.comment}
            </Typography>
            <VoteReview review={t} userData={t.userId} />
            <div className='mr-20'>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        className: `bg-white dark:bg-gray-800 text-black dark:text-white left-10`
                    }}
                    className='text-sm'
                >
                    {selectedComment?.userId._id === authUser._id ?
                        <>
                            <MenuItem key={selectedComment._id} onClick={() => handleEditComment(selectedComment)}>edit</MenuItem>
                            <MenuItem key={selectedComment._id + "d"} onClick={handleDeleteComment}>delete</MenuItem>

                        </>
                        : <MenuItem >report</MenuItem>
                    }

                </Menu>
            </div>
        </Card>
    }


    // if (filteredComments.length === 0) {
    //     return (<Card className='mx-4 mb-2 flex justify-center bg-gray-100 dark:bg-[#222222]'>
    //         <CardHeader subheader={<p className='text-gray-600 dark:text-white'>No Comments</p>} />
    //     </Card>)
    // }
    return (
        <div className="p-4">
            <div className="flex w-full items-center justify-end mb-3 pr-4">
                <label htmlFor="rating-filter" className="mr-1 text-sm">Filter by:</label>
                <select
                    id="rating-filter"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(Number(e.target.value))}
                    className="text-sm py-1 px-2 border dark:bg-[#151515] rounded-3xl shadow-sm shadow-[#3f3f3fba]"
                >
                    <option value={-1}>All Ratings</option>
                    {[0, 1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} {rating === 1 ? 'Star' : 'Stars'}</option>
                    ))}
                </select>
            </div>
            {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="bg-gray-100 dark:bg-[#222222] mx-4 mb-2">
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
                : (comments.length === 0 ? (<Card className='mx-4 mb-2 flex justify-center bg-gray-100 dark:bg-[#222222]'>
                    <CardHeader subheader={<p className='text-gray-600 dark:text-white'>No Comments</p>} />
                </Card>) :
                    filteredComments.map(renderCommentCard)
                )
            }
            {isDialogOpen && (
                <div className="fixed inset-0 flex w-full items-center justify-center bg-black bg-opacity-50 z-40" onClick={() => setIsDialogOpen(false)}>
                    <div className="bg-white w-full dark:bg-[#333333] p-6 rounded-lg max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4 dark:text-white">Edit Comment</h2>
                        <textarea
                            className="w-full p-2 mb-4 border rounded dark:bg-[#444444] dark:text-white"
                            rows="4"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                        />
                        <div className="flex -mt-[0.4rem] items-center">
                            <p className="text-xs md:text-md  text-gray-600 dark:text-gray-400">Submit anonymously?</p>
                            {console.log("THIS IS EDIT ANONYMOUS: ", editAnonymous)}
                            <BpCheckbox
                                value={editAnonymous}
                                onClick={() => setEditAnonymous(prev => !prev)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm dark:text-white">Rating</label>
                            <div className="flex items-center">
                                {[...Array(5).keys()].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setEditRating(value + 1)}
                                        className={`p-1 ${value < editRating ? 'text-yellow-500' : 'text-gray-400'}`}
                                    >
                                        <Star />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="px-4 py-2 rounded-3xl bg-[#343434d3] brightness-75 text-white hover:bg-[#343434d3] hover:brightness-110"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateComment}
                                className="px-4 py-2 rounded-3xl bg-[#262626] brightness-75 text-white hover:bg-[#262626] hover:brightness-110"
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
