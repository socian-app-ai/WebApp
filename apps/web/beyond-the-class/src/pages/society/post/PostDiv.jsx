/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */




import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MoreHorizontal, MessageCircle, Share2 } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import formatTimeDifference from '../../../utils/formatDate';
import axiosInstance from '../../../config/users/axios.instance';
import { routesForApi } from '../../../utils/routes/routesForLinks';
import { Heart } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';
import { ThumbUp } from '@mui/icons-material';
import { ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import { Dot } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { useRef } from 'react';
import MediaSwiper from '../../../components/postBox/MediaSwiper';


export default function PostDiv({ society, postInfo, linkActivate = true, onVoteUpdate }) {
    const { authUser } = useAuthContext()
    const [showHoverCard, setShowHoverCard] = useState(false);

    // console.log("INFO", postInfo)


    const navigate = useNavigate()

    return (
        <article className="block max-w-2xl m-2">
            <article className="bg-white dark:bg-[#1E1F24] rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div

                                onMouseEnter={() => setShowHoverCard(true)}
                                onMouseLeave={() => setShowHoverCard(false)}
                                onClick={(e) => {

                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/user/${postInfo.author?._id}`)
                                }}

                                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                {
                                    postInfo?.author?.profile?.picture
                                        ?
                                        <img className='rounded-full' src={postInfo.author.profile.picture} />
                                        :
                                        <span className="text-white text-sm font-medium">
                                            {postInfo?.author ? postInfo.author.name.charAt(0).toUpperCase() : 'D'}
                                        </span>
                                }
                            </div>
                            <div>
                                <div className='flex items-center align-baseline'>
                                    <p
                                        onClick={(e) => {

                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/user/${postInfo.author?._id}`)
                                        }}

                                        className="text-sm font-medium text-gray-900 dark:text-white">
                                        {postInfo?.author ? `${postInfo.author.name}` : '[deleted-user]'}
                                    </p>
                                    <Dot />
                                    <a href={`${import.meta.env.VITE_FRONTENT_URL}/${authUser.role}/society/${postInfo?.society?._id}`} className="text-sm font-medium text-gray-900 dark:text-white">

                                        {postInfo?.society?.name ?? society?.name}</a>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {postInfo?.society?.isPromoted?.promoted && <BadgeCheck size={20} />}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeDifference(postInfo.createdAt)}
                                </p>
                            </div>

                        </div>


                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {showHoverCard && (
                        <ProfileHoverCard author={postInfo.author} />
                    )}

                    <Link
                        to={`${linkActivate ? `${import.meta.env.VITE_FRONTENT_URL}/${authUser.role}/${society?.name ?? "unknown"}/comments/${postInfo._id}/${postInfo.title.toString().replace(/\s+/g, '-')}` : '#'}`}

                    >
                        {/* Content */}
                        <div className="space-y-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {postInfo.title}
                            </h2>

                            {postInfo?.body && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">
                                    {postInfo.body}
                                </p>
                            )}

                        </div>
                    </Link >
                    {/* {console.log("HERE , ", postInfo?.media)} */}

                    {/* {postInfo?.media && <ScrollingImages media={postInfo.media} />} */}
                    {postInfo?.media && <div className=' flex justify-center items-center'>
                        < MediaSwiper media={postInfo.media} />
                    </div>}



                    {/* Footer */}
                    <div className="flex items-center  pt-3 border-t border-gray-200 dark:border-gray-700">
                        <ReVote postInfo={postInfo} onVoteUpdate={onVoteUpdate} />

                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">{postInfo.commentsCount}</span>
                            </button>

                            <button className="flex items-center space-x-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </article>
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
            <ThumbsUp className={`w-4 h-4 mr-1 transition-colors ${active ? 'text-orange-500 ' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400'
                }`} />
        ) : (
            <ThumbsDown className={`w-4 h-4 mr-1 transition-colors ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400'
                }`} />
        )}
        <span className={`text-sm font-medium ${active ? (direction === 'up' ? 'text-orange-500' : 'text-blue-500') : 'text-gray-600 dark:text-gray-300'
            }`}>
            {Math.abs(count)}
        </span>
    </button>
);






export function ReVote({ postInfo, onVoteUpdate }) {
    const { authUser } = useAuthContext();
    const [upvote, setUpvote] = useState(postInfo.voteId.upVotesCount);
    const [downvote, setDownvote] = useState(postInfo.voteId.downVotesCount);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [optimisticVote, setOptimisticVote] = useState(null);

    useEffect(() => {
        setHasUpvoted(postInfo.voteId.userVotes[authUser._id] === 'upvote');
        setHasDownvoted(postInfo.voteId.userVotes[authUser._id] === 'downvote');
        setUpvote(postInfo.voteId.upVotesCount);
        setDownvote(postInfo.voteId.downVotesCount);
    }, [postInfo.voteId.userVotes, postInfo.voteId.upVotesCount, postInfo.voteId.downVotesCount, authUser._id]);

    const handleVote = async (e, voteTypeVal) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (loading) return;
        
        setLoading(true);
        setOptimisticVote(voteTypeVal);
        
        // Optimistic update
        const currentVote = postInfo.voteId.userVotes[authUser._id];
        let newUpvoteCount = upvote;
        let newDownvoteCount = downvote;
        let newHasUpvoted = hasUpvoted;
        let newHasDownvoted = hasDownvoted;
        let newUserVote = voteTypeVal;
        
        // Calculate optimistic changes
        if (currentVote === voteTypeVal) {
            // User is undoing their vote
            if (voteTypeVal === 'upvote') {
                newUpvoteCount--;
                newHasUpvoted = false;
            } else {
                newDownvoteCount--;
                newHasDownvoted = false;
            }
            newUserVote = null;
        } else if (currentVote && currentVote !== voteTypeVal) {
            // User is switching votes
            if (currentVote === 'upvote') {
                newUpvoteCount--;
                newHasUpvoted = false;
            } else {
                newDownvoteCount--;
                newHasDownvoted = false;
            }
            
            if (voteTypeVal === 'upvote') {
                newUpvoteCount++;
                newHasUpvoted = true;
            } else {
                newDownvoteCount++;
                newHasDownvoted = true;
            }
        } else {
            // User is voting for the first time
            if (voteTypeVal === 'upvote') {
                newUpvoteCount++;
                newHasUpvoted = true;
            } else {
                newDownvoteCount++;
                newHasDownvoted = true;
            }
        }
        
        // Update local state immediately
        setUpvote(newUpvoteCount);
        setDownvote(newDownvoteCount);
        setHasUpvoted(newHasUpvoted);
        setHasDownvoted(newHasDownvoted);
        
        // Update parent component if callback provided
        if (onVoteUpdate) {
            onVoteUpdate(postInfo._id, {
                upVotesCount: newUpvoteCount,
                downVotesCount: newDownvoteCount,
                userVote: newUserVote
            });
        }
        
        try {
            const response = await axiosInstance.post(routesForApi.posts.votePost, {
                postId: postInfo._id,
                voteType: voteTypeVal
            });
            
            const { upVotesCount, downVotesCount, noneSelected } = response.data;
            
            // Update with server response
            setUpvote(upVotesCount);
            setDownvote(downVotesCount);
            
            if (noneSelected) {
                setHasUpvoted(false);
                setHasDownvoted(false);
                // Update parent component with server response
                if (onVoteUpdate) {
                    onVoteUpdate(postInfo._id, {
                        upVotesCount,
                        downVotesCount,
                        userVote: null
                    });
                }
            } else {
                setHasUpvoted(voteTypeVal === 'upvote');
                setHasDownvoted(voteTypeVal === 'downvote');
                // Update parent component with server response
                if (onVoteUpdate) {
                    onVoteUpdate(postInfo._id, {
                        upVotesCount,
                        downVotesCount,
                        userVote: voteTypeVal
                    });
                }
            }
        } catch (error) {
            console.error("Error voting:", error.message);
            
            // Revert optimistic update on error
            setUpvote(postInfo.voteId.upVotesCount);
            setDownvote(postInfo.voteId.downVotesCount);
            setHasUpvoted(postInfo.voteId.userVotes[authUser._id] === 'upvote');
            setHasDownvoted(postInfo.voteId.userVotes[authUser._id] === 'downvote');
            
            // Revert parent component state
            if (onVoteUpdate) {
                onVoteUpdate(postInfo._id, {
                    upVotesCount: postInfo.voteId.upVotesCount,
                    downVotesCount: postInfo.voteId.downVotesCount,
                    userVote: postInfo.voteId.userVotes[authUser._id] || null
                });
            }
        } finally {
            setLoading(false);
            setOptimisticVote(null);
        }
    };

    return (
        <div className="flex gap-1">
            <VoteButton
                direction="up"
                active={hasUpvoted}
                count={upvote}
                onClick={(e) => handleVote(e, 'upvote')}
                loading={loading && optimisticVote === 'upvote'}
            />
            <VoteButton
                direction="down"
                active={hasDownvoted}
                count={downvote}
                onClick={(e) => handleVote(e, 'downvote')}
                loading={loading && optimisticVote === 'downvote'}
            />
        </div>
    );
}







const ProfileHoverCard = ({ author }) => {
    if (!author) return null;

    return (
        <div className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 w-64 z-50">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {author.profile?.picture ? (
                        <img
                            className="rounded-full"
                            src={author.profile.picture}
                            alt={`${author.name}'s profile`}
                        />
                    ) : (
                        <span className="text-white font-bold text-lg">
                            {author.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {author.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {author.bio || 'No bio available'}
                    </p>
                </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
                Joined: {new Date(author.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};





// export  function ScrollingImages({ media }) {
//     const scrollRef = useRef(null);

//     useEffect(() => {
//         const scrollContainer = scrollRef.current;
//         let direction = 1;

//         const scrollImages = () => {
//             if (scrollContainer) {
//                 if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
//                     direction = -1;
//                 } else if (scrollContainer.scrollLeft <= 0) {
//                     direction = 1;
//                 }
//                 scrollContainer.scrollLeft += direction * 2; // Adjust speed here
//             }
//         };

//         const interval = setInterval(scrollImages, 50); // Adjust speed of scrolling
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div
//             ref={scrollRef}
//             className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth whitespace-nowrap w-full"
//         >
//             {media.map((file, index) => (
//                 <div key={index} className="min-w-[200px] flex-shrink-0">
//                     {file.type.startsWith('video') ? (
//                         <video controls className="rounded-lg w-full h-auto">
//                             <source src={file.url} type={file.type} />
//                             Your browser does not support the video tag.
//                         </video>
//                     ) : (
//                         <img src={file.url} className="rounded-lg w-full h-auto" alt="Post media" />
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }





