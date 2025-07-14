import React from 'react'
import axiosInstance from '../../../config/users/axios.instance';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSetInfoBarState } from '../../../state_management/zustand/useInfoBar';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import PostDiv from '../../society/post/PostDiv';
import { routesForApi } from '../../../utils/routes/routesForLinks';
import { useAuthContext } from '../../../context/AuthContext';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import { ChevronDown } from 'lucide-react';

export default function CampusesPosts() {
    const { width } = useWindowDimensions();
    const { infoBarState, setInfoBarState } = useSetInfoBarState();
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (infoBarState === false && width > 768) {
            setInfoBarState(true);
        }
    }, [setInfoBarState, infoBarState]);

    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false
    });
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const fetchPosts = async (page = 1, append = false) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(routesForApi.posts.campusesAll, {
                params: { page, limit: pagination.limit }
            });
            
            const { data: newPosts, pagination: newPagination } = response.data;
            
            if (append) {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
            } else {
                setPosts(newPosts);
            }
            
            setPagination(newPagination);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLoadMore = () => {
        if (pagination.hasNextPage && !loading) {
            fetchPosts(pagination.page + 1, true);
        }
    };

    const { lastElementRef } = useInfiniteScroll(
        pagination.hasNextPage,
        loading,
        handleLoadMore
    );

    const updatePostVotes = (postId, voteData) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId
                    ? {
                          ...post,
                          voteId: {
                              ...post.voteId,
                              upVotesCount: voteData.upVotesCount,
                              downVotesCount: voteData.downVotesCount,
                              userVotes: {
                                  ...post.voteId.userVotes,
                                  [authUser._id]: voteData.userVote
                              }
                          }
                      }
                    : post
            )
        );
    };

    if (initialLoad && loading) {
        return (
            <div className="min-h-screen mt-10 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-10 flex flex-col justify-center items-center w-full lg:w-[90%] ">
            <p className="p-2 m-2 font-bold text-xl">
                See what's happening in all campus of {authUser.university.universityId.name.toUpperCase()}
            </p>

            {posts.length > 0 && (
                <div className="space-y-4 mx-2 w-full md:w-4/5 lg:w-2/3">
                    {posts.map((post, index) => (
                        <div
                            key={post._id}
                            ref={index === posts.length - 1 ? lastElementRef : null}
                        >
                            <PostDiv 
                                postInfo={post} 
                                society={post.society}
                                onVoteUpdate={updatePostVotes}
                            />
                        </div>
                    ))}
                    
                    {loading && !initialLoad && (
                        <div className="flex justify-center py-6">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                <span className="text-gray-600">Loading more posts...</span>
                            </div>
                        </div>
                    )}
                    
                    {!pagination.hasNextPage && posts.length > 0 && (
                        <div className="text-center py-6">
                            <p className="text-gray-500">You've reached the end of the posts</p>
                        </div>
                    )}
                </div>
            )}

            {!initialLoad && posts.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No posts found</p>
                </div>
            )}
        </div>
    );
}



