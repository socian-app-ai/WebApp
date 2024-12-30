// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Users, Award, Calendar, Eye, EyeOff, User, ChevronRight } from "lucide-react";
// import PostDiv from "./post/PostDiv";
// import axiosInstance from "../../config/users/axios.instance";
// import { useAuthContext } from "../../context/AuthContext";

// export default function Society() {



//     const { id } = useParams();
//     const [society, setSociety] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [joined, setJoined] = useState(false);
//     const [page, setPage] = useState(1); // Track the current page for pagination
//     const { authUser } = useAuthContext();



//     useEffect(() => {
//         const fetchSociety = async () => {
//             try {
//                 const response = await axiosInstance.get(`/api/society/${id}`);
//                 console.log("society", response.data)
//                 setSociety(response.data.society);
//                 setPosts(response.data.posts);
//                 setJoined(response.data.society.members.members.includes(authUser._id))
//             } catch (err) {
//                 setError("Error fetching society data.");
//                 console.error("Error fetching society details:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchSociety();
//     }, [id]);


//     const loadMorePosts = () => {
//         setPage((prevPage) => prevPage + 1); // Increment the page to load more posts
//     };
//     // Load more posts when the user scrolls to 90% of the page
//     const handleScroll = () => {
//         const scrollPosition = window.scrollY + window.innerHeight;
//         const documentHeight = document.documentElement.scrollHeight;
//         if (scrollPosition >= documentHeight * 0.9 && !loading) {
//             loadMorePosts();
//         }
//     };

//     useEffect(() => {
//         window.addEventListener("scroll", handleScroll);
//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//         };
//     }, [loading]);























//     const handleJoinOrLeave = async (e) => {
//         e.preventDefault();
//         try {
//             if (joined) {
//                 const response = await axiosInstance.post(`/api/society/leave-society/${society._id}`);
//                 setJoined(response.data.joined);
//             } else {

//                 const response = await axiosInstance.post(`/api/society/join-society/${society._id}`);
//                 setJoined(response.data.joined);
//             }
//         } catch (err) {
//             setError("Failed to update membership status.");
//             console.error("Error updating membership:", err);
//         }
//     };



//     if (loading) {
//         return (
//             <div className="container mx-auto p-6 space-y-6">
//                 <div className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
//                 <div className="grid md:grid-cols-2 gap-6">
//                     <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
//                     <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto p-6">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                     <p className="text-red-600 text-center">{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!society) {
//         return (
//             <div className="container mx-auto p-6">
//                 <div className="bg-white rounded-lg p-6 shadow">
//                     <p className="text-center text-gray-500">No society found.</p>
//                 </div>
//             </div>
//         );
//     }




//     return (
//         <div className="min-h-screen ">
//             <div className="container mx-auto p-6 space-y-6">


//                 {/* Society Header */}
//                 <div className="rounded-lg shadow-lg p-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div className="space-y-2">
//                             <div className="flex items-center gap-2 flex-wrap">
//                                 <h1 className="text-3xl font-bold">{society.name}</h1>
//                                 <span className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full">
//                                     {society.societyType.societyType}
//                                 </span>
//                             </div>
//                             <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
//                                 {society.description}
//                             </p>
//                         </div>
//                         <button
//                             onClick={handleJoinOrLeave}
//                             className={`px-6 py-2 rounded-lg min-w-[100px] transition-colors ${joined
//                                 ? "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 : "bg-blue-600 text-white hover:bg-blue-700"
//                                 }`}
//                         >
//                             {joined ? "Leave" : "Join"}
//                         </button>
//                     </div>

//                     <div className="flex flex-wrap gap-2 mt-4">
//                         <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
//                             <Users className="w-3 h-3" />
//                             {society.totalMembers} Members
//                         </span>
//                         <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
//                             {society.verified && <Award className="w-3 h-3" />}
//                             {society.category}
//                         </span>
//                         <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
//                             {society.visibilityNone ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
//                             {society.visibilityNone ? "Private" : "Public"}
//                         </span>
//                         <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
//                             <Calendar className="w-3 h-3" />
//                             {new Date(society.createdAt).toLocaleDateString()}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Details Grid */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                     {/* About */}
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//                         <div className="p-4 border-b dark:border-gray-700">
//                             <h2 className="text-xl font-semibold flex items-center gap-2">
//                                 <User className="w-5 h-5" />
//                                 About
//                             </h2>
//                         </div>
//                         <div className="p-4 space-y-2">
//                             <div className="flex items-center gap-2">
//                                 <span className="font-medium">President:</span>
//                                 <span>{society?.president?.username ? society.president.username : '[/deleted]'}</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <span className="font-medium">Allows:</span>
//                                 <span>{society.allows}</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Rules */}
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//                         <div className="p-4 border-b dark:border-gray-700">
//                             <h2 className="text-xl font-semibold">Rules</h2>
//                         </div>
//                         <div className="p-4">
//                             {society.rules && society.rules.length > 0 ? (
//                                 <ul className="space-y-2">
//                                     {society.rules.map((rule, index) => (
//                                         <li key={index} className="flex items-start gap-2">
//                                             <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5" />
//                                             <span>{rule}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-gray-500 dark:text-gray-400">No rules defined for this society.</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Sub-Societies */}
//                 {society.subSocieties?.length > 0 && (
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//                         <div className="p-4 border-b dark:border-gray-700">
//                             <h2 className="text-xl font-semibold">Sub-Societies</h2>
//                         </div>
//                         <div className="p-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {society.subSocieties.map((subSociety, index) => (
//                                     <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                                         <h3 className="font-semibold mb-1">{subSociety.name}</h3>
//                                         <p className="text-sm text-gray-600 dark:text-gray-300">
//                                             {subSociety.description}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Posts */}
//                 {posts.length > 0 && (
//                     <div className="space-y-4">

//                         {console.log("posts >>", posts)}
//                         {posts.map((post) => (
//                             <PostDiv key={post._id} postInfo={post} society={society} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, Award, Calendar, Eye, EyeOff, User, ChevronRight } from "lucide-react";
import PostDiv from "./post/PostDiv";
import axiosInstance from "../../config/users/axios.instance";
import { useAuthContext } from "../../context/AuthContext";

export default function Society() {
    const { id } = useParams();
    const [society, setSociety] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joined, setJoined] = useState(false);
    const [page, setPage] = useState(1); // Track the current page for pagination
    const { authUser } = useAuthContext();

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
                setJoined(response.data.society.members.members.includes(authUser._id));
            } catch (err) {
                setError("Error fetching society data.");
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
                const response = await axiosInstance.post(`/api/society/leave-society/${society._id}`);
                setJoined(response.data.joined);
            } else {
                const response = await axiosInstance.post(`/api/society/join-society/${society._id}`);
                setJoined(response.data.joined);
            }
        } catch (err) {
            setError("Failed to update membership status.");
            console.error("Error updating membership:", err);
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
        <div className="min-h-screen">
            <div className="container mx-auto p-6 space-y-6">
                {/* Society Header */}
                <div className="rounded-lg shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-3xl font-bold">{society.name}</h1>
                                <span className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full">
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
                                ? "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {joined ? "Leave" : "Join"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                            <Users className="w-3 h-3" />
                            {society.totalMembers} Members
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                            {society.verified && <Award className="w-3 h-3" />}
                            {society.category}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                            {society.visibilityNone ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {society.visibilityNone ? "Private" : "Public"}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
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
                    <div className="text-center text-gray-500">No posts yet.</div>
                )}
            </div>
        </div>
    );
}
