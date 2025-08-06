
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, Award, Calendar, Eye, EyeOff, User, ChevronRight } from "lucide-react";
import PostDiv from "./post/PostDiv";
import axiosInstance from "../../config/users/axios.instance";
import { useAuthContext } from "../../context/AuthContext";
import { routesForApi } from "../../utils/routes/routesForLinks";
import { useToast } from "../../components/toaster/ToastCustom";
import logWithFileLocation from "../../utils/consoleLog";
import SEO from "../../components/seo/SEO";



export default function Society() {
    const { id } = useParams();
    const [society, setSociety] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joined, setJoined] = useState(false);
    const [page, setPage] = useState(1); // Track the current page for pagination
    const { authUser } = useAuthContext();
    const { addToast } = useToast();

    // Fetch society and posts data
    useEffect(() => {
        const fetchSociety = async () => {
            try {
                const response = await axiosInstance.get(`/api/society/${id}?page=${page}&limit=10`);
                setSociety(response.data.society);
                if (page === 1) {
                    setPosts(response.data.posts); // Set posts for the first page
                } else {
                    setPosts(prevPosts => [...prevPosts, ...response.data.posts]); // Append posts for subsequent pages
                }
                setJoined(response.data.society?.members?.members?.includes(authUser._id) ?? false);
            } catch (err) {
                setError("Your Society has vanished into space.");
                console.error("Error fetching society details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSociety();
    }, [id, page]); // Depend on both `id` and `page`

    // Load more posts when scrolling
    const loadMorePosts = () => {
        if (!loading) {
            setPage(prevPage => prevPage + 1); // Increment the page to load more posts
        }
    };

    const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (scrollPosition >= documentHeight * 0.9 && !loading) {
            loadMorePosts();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading]);

    // Handle join or leave society action
    const handleJoinOrLeave = async (e) => {
        e.preventDefault();
        try {
            if (joined) {
                const response = await axiosInstance.get(`${routesForApi.society.leave}/${society._id}`);
                setJoined(response.data.joined);
            } else {
                const response = await axiosInstance.get(`${routesForApi.society.join}/${society._id}`);
                setJoined(response.data.joined);
            }
        } catch (err) {
            // setError("Failed to update membership status.");
            addToast((err?.response?.data?.message ?? err?.message) || 'Error')
            logWithFileLocation("Error updating membership:", err);
        }
    };

    // Loading state
    if (loading && page === 1) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    // No society found
    if (!society) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-lg p-6 shadow">
                    <p className="text-center text-gray-500">No society found.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO 
                title={`${society?.name || 'Society'} - Socian`}
                description={`${society?.description || 'Join this student society on Socian'} - ${society?.totalMembers || 0} members`}
                keywords={`${society?.name}, student society, ${society?.societyType?.societyType}, university club, socian`}
                pageType="societies"
            />
            <div className="min-h-screen">
            <div className=" mx-auto p-6 space-y-6">
                {/* Society Header */}
                <div className="rounded-lg w-full shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-3xl font-bold">{society.name}</h1>
                                <span className="opacity-70 text-sm">
                                    {society.societyType.societyType}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                                {society.description}
                            </p>
                        </div>
                        <button
                            onClick={handleJoinOrLeave}
                            className={`px-6 py-2 rounded-lg min-w-[100px] transition-colors ${joined
                                ? "border border-[#212121] dark:border-[#ffffff80] hover:bg-gray-100 dark:hover:bg-[#3e3e3e]"
                                : "bg-[#242424] text-white hover:bg-[#333] hover:border-[#ffffff] border border-[#ffffff80]"
                                }`}
                        >
                            {joined ? "Leave" : "Join"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#373737] rounded-full text-sm">
                            <Users className="w-3 h-3" />
                            {society.totalMembers} Members
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#373737] rounded-full text-sm">
                            <Users className="w-3 h-3" />
                            {society.allows}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#373737] rounded-full text-sm">
                            {society.verified && <Award className="w-3 h-3" />}
                            {society.category}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#373737] rounded-full text-sm">
                            {society.visibilityNone ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {society.visibilityNone ? "Private" : "Public"}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#373737] rounded-full text-sm">
                            <Calendar className="w-3 h-3" />
                            {new Date(society.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Posts */}
                {posts.length > 0 ? (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostDiv key={post._id} postInfo={post} society={society} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Be the First One to Post!</div>
                )}
            </div>
            </div>
        </>
    );
}
