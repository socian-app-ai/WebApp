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


export default function PostDiv({ society, postInfo, linkActivate = true }) {
    const { authUser } = useAuthContext()
    const [showHoverCard, setShowHoverCard] = useState(false);

    // console.log("INFO", postInfo)


    const navigate = useNavigate()

    return (
        <Link
            to={`${linkActivate ? `${authUser.role}/${society?.name ?? "unknown"}/comments/${postInfo._id}/${postInfo.title.toString().replace(/\s+/g, '-')}` : '#'}`}
            className="block max-w-2xl m-2"
        >
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
                                <p
                                    onClick={(e) => {

                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigate(`/user/${postInfo.author?._id}`)
                                    }}

                                    className="text-sm font-medium text-gray-900 dark:text-white">
                                    {postInfo?.author ? `${postInfo.author.name}` : '[deleted-user]'}
                                </p>
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


                    {/* Content */}
                    <div className="space-y-2 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {postInfo.title}
                        </h2>
                        {postInfo?.body && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {postInfo.body}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center  pt-3 border-t border-gray-200 dark:border-gray-700">
                        <ReVote postInfo={postInfo} />

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
        </Link >
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






export function ReVote({ postInfo }) {
    const { authUser } = useAuthContext();
    const [upvote, setUpvote] = useState(postInfo.voteId.upVotesCount);
    const [downvote, setDownvote] = useState(postInfo.voteId.downVotesCount);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHasUpvoted(postInfo.voteId.userVotes[authUser._id] === 'upvote');
        setHasDownvoted(postInfo.voteId.userVotes[authUser._id] === 'downvote');
    }, [postInfo.voteId.userVotes, authUser._id]);

    const handleVote = async (e, voteTypeVal) => {
        e.preventDefault();
        setLoading(true);
        try {
            // `/api/posts/vote-post` 
            const response = await axiosInstance.post(routesForApi.posts.votePost, {
                postId: postInfo._id,
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