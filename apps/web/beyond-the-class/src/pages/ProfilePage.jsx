/* eslint-disable react/prop-types */
import React from 'react';
import { ExternalLink, Mail, MoreHorizontal } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { Sparkle } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../config/users/axios.instance';
import toast from 'react-hot-toast';
import PostDiv from './society/post/PostDiv';

const ProfilePage = () => {
    const { id } = useParams()

    const { authUser } = useAuthContext()
    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
                const user = await axiosInstance.get(`/api/user/profile?id=${id}`)
                setUser(user.data)

            } catch (error) {
                toast.error("User not found")
            } finally {
                setLoading(false)
            }

        }
        // console.log(id, authUser._id, "user------------")
        // if (id === authUser._id) {
        //     setUser(authUser)

        //     setLoading(false);
        // } else {
        fetchUser()
        // }
    }, [id, authUser]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return <ProfileComponent user={user} />;

};

export default ProfilePage;




const ProfileComponent = ({ user }) => {
    const { authUser } = useAuthContext()

    // console.log("THIS USER", user, authUser, "\n", authUser._id === user._id)

    return (
        <div>
            {/* Banner */}
            <div className="relative w-full h-48 bg-gradient-to-r from-gray-900 to-black rounded-t-lg overflow-hidden">
                <div className="absolute bottom-4 left-4 text-2xl font-bold">
                    <div className="text-[#98FB98]">Eat</div>
                    <div className="text-gray-300">Sleep</div>
                    <div className="text-blue-400">Code</div>
                    <div className="text-purple-400">Repeat</div>
                </div>
            </div>

            {/* Banner and Profile Section */}
            <div className="max-w-3xl mx-auto border bg-[#eaeaea] dark:bg-transparent dark:border-0">
                {/* Profile Content */}
                <div className=" rounded-b-lg p-6">
                    <div className="flex justify-between items-start">
                        <div className="-mt-20 flex flex-col items-start gap-4 z-10">

                            <div className='flex flex-row items-end justify-between w-full'>
                                {/* Profile Picture */}
                                <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
                                    {user?.profile?.picture ?
                                        <img src={user.profile.picture} className="w-full h-full bg-gray-600" />
                                        :
                                        <div className="w-full h-full bg-gray-600"></div>
                                    }
                                </div>
                                {!(authUser._id === user._id) && <div className='block md:hidden'>
                                    <ConnectButton user={user} authUserId={authUser._id} />
                                </div>}

                            </div>

                            {/* Name and Details */}
                            <div>
                                <div className="flex flex-col md:flex-row  items-start gap-2">
                                    <div className='flex flex-row items-center'>
                                        <h1 className="text-lg md:text-xl font-bold">{user.name}</h1>
                                        <span className="text-blue-400">{user.verified && <BadgeCheck />}</span>
                                    </div>
                                    <span className="px-3 py-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center gap-1">
                                        <span><Sparkle size={14} /></span> Credibility <span> {user?.profile?.credibility?.commentCredibility ? user.profile.credibility.commentCredibility : '0'}</span>
                                    </span>
                                </div>
                                <p className="text-black dark:text-gray-400">@{user.username}</p>
                                <div className="flex items-center gap-2 text-sm text-black dark:text-gray-400 mt-2">
                                    <span>🌍 Global</span>
                                    <span>📅 Joined {user.joined}</span>
                                    <span>🟢 Open to Work</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!(authUser._id === user._id) && <div className="hidden md:flex gap-2">
                            <ConnectButton user={user} authUserId={authUser._id} />
                            <button className="p-2 hover: bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full transition-colors">
                                <Mail className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover: bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>}
                    </div>

                    {/* Bio */}
                    <div className="mt-4">
                        <div className="flex items-center gap-2">
                            <p className="text-black dark:text-gray-300">{user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}</p>
                            <button className="text-black dark:text-gray-400 text-sm hover:text-gray-300">View Resume</button>
                        </div>
                        <p className="text-black dark:text-gray-400 mt-1">Playing long term games with long term people</p>
                    </div>

                    {/* Stats */}

                    <div className="flex gap-4 mt-4 text-sm text-black dark:text-gray-400">
                        <span><strong className="text-gray-200">{user?.connections?.friend?.length ? user.connections.friend.length : '0'}</strong> Connections</span>
                        <span><strong className="text-gray-200">0</strong> Circle Members</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center gap-1">
                            <span>🖥</span> Software Engineering
                        </span>
                        <span className="px-3 py-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center gap-1">
                            <span>⭐</span> Founder
                        </span>
                        <span className="px-3 py-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center gap-1">
                            <span>₿</span> Crypto Enthusiast
                        </span>
                        <span className="px-3 py-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center gap-1">
                            <span>💻</span> Developer
                        </span>
                        <span className="px-3 py-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center gap-1">
                            <span>👨‍💻</span> Freelancer
                        </span>
                        <span className="px-3 py-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center gap-1">
                            <span>🔓</span> Open Source
                        </span>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3 mt-4">
                        {['linkedin', 'twitter', 'github', 'dev.to', 'medium', 'youtube', 'telegram'].map((platform) => (
                            <button
                                key={platform}
                                className="w-8 h-8  bg-gray-300 text-black dark:bg-gray-800 dark:text-white rounded-full hover:bg-gray-700 transition-colors"
                            />
                        ))}
                    </div>

                    {/* Front Page Link */}
                    {user?.profile?.website.length > 0 &&
                        <div className="mt-6 flex items-center justify-between  bg-gray-300 text-black dark:bg-gray-800 dark:text-white p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-black dark:text-gray-400">My Front Page:</p>
                                <p className="text-blue-400">{user.profile.website[0]}</p>
                            </div>
                            <button className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-full text-white flex items-center gap-2 transition-colors">
                                Visit <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>}
                </div>

                <div className='w-full px-3 '>
                    {user?.profile?.posts?.length > 0
                        ? user.profile.posts.map(post => {

                            return (<div key={post._id}
                                className='w-full'>
                                <PostDiv postInfo={post} />
                            </div>)
                        })
                        : <div>Hmm.. Empty Empty</div>
                    }
                </div>

            </div>




        </div>
    );
}




// const ConnectButton = ({ user, authUserId }) => {

//     console.log("useer", user, authUserId)
//     const friendStatus = user.connections[authUserId]
//     console.log("status", friendStatus)

//     if (friendStatus === 'requested') {
//         return <div>requested</div>;
//     } else if (friendStatus === 'accepted') {
//         return <div>connected</div>;
//     }



//     const requestOrCancelRequest = async () => {
//         const res = await axiosInstance.post('/api/user/add-friend',
//             {

//                 toFriendUser: user._id
//             }


//         )
//         console.log("connections", res)
//         if (res.status === 200) return <div>requested</div>;

//     }


//     return (
//         <button onClick={requestOrCancelRequest} className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors">
//             Connect
//         </button>
//     )
// }


const ConnectButton = ({ user, authUserId }) => {
    const [friendStatus, setFriendStatus] = useState(user.connections[authUserId]);

    const requestOrCancelRequest = async () => {
        try {
            const res = await axiosInstance.post('/api/user/add-friend', {
                toFriendUser: user._id,
            });

            if (res.status === 200) {
                setFriendStatus('requested'); // Update state dynamically
            }
        } catch (error) {
            console.error("Error while sending friend request:", error);
        }
    };

    const cancelRequest = async () => {
        try {
            const res = await axiosInstance.post('/api/user/cancel-friend-request', {
                toFriendUser: user._id,
            });

            if (res.status === 200) {
                setFriendStatus(null); // Reset status when canceled
            }
        } catch (error) {
            console.error("Error while canceling friend request:", error);
        }
    };

    if (friendStatus === 'requested') {
        return (
            <button onClick={cancelRequest} className="px-4 py-1 bg-gray-500 hover:bg-gray-600 rounded-full text-white transition-colors">
                Cancel Request
            </button>
        );
    }

    if (friendStatus === 'accepted') {
        return (
            <div className="px-4 py-1 bg-green-500 text-white rounded-full">
                Connected
            </div>
        );
    }

    return (
        <button onClick={requestOrCancelRequest} className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors">
            Connect
        </button>
    );
};












// import React from "react";
// import {
//     Globe,
//     Briefcase,
//     Eye,
//     Users,
//     Code2,
//     Star,
//     Settings,
//     GitBranch,
//     Linkedin,
//     Twitter,
//     Mail,
// } from "lucide-react";

// const ProfilePage = () => {
//     return (
//         <div className="bg-gray-900 text-white min-h-screen p-6">
//             {/* Profile Header Section */}
//             <div className="relative w-full h-48">
//                 {/* Banner Image */}
//                 <img
//                     src="https://via.placeholder.com/1200x300" // Replace with actual banner image
//                     alt="Banner"
//                     className="w-full h-full object-cover rounded-lg"
//                 />
//             </div>

//             {/* Profile Card */}
//             <div className="relative flex items-center mt-4">
//                 {/* Profile Picture */}
//                 <img
//                     src="https://via.placeholder.com/120" // Replace with actual profile picture
//                     alt="Profile"
//                     className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover -mt-16 ml-4"
//                 />

//                 {/* Profile Info */}
//                 <div className="ml-6">
//                     <h1 className="text-2xl font-bold">Daniel Nelson</h1>
//                     <p className="text-black dark:text-gray-400">@danielnelson</p>
//                     <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
//                         <Globe size={16} /> <span>Global</span>
//                         <span>•</span>
//                         <Briefcase size={16} />
//                         <span>Open to Work</span>
//                         <span>•</span>
//                         <span>Joined Jun 2020</span>
//                     </div>
//                 </div>

//                 {/* Follow Button */}
//                 <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
//                     Follow
//                 </button>
//             </div>

//             {/* Bio Section */}
//             <div className="mt-6 ml-4">
//                 <p>Software Engineer, Showcase</p>
//                 <p className="text-black dark:text-gray-400 mt-2">
//                     Playing long-term games with long-term people
//                 </p>
//                 <div className="flex items-center mt-2 gap-4 text-black dark:text-gray-400">
//                     <span>315 Followers</span>
//                     <span>•</span>
//                     <span>328 Following</span>
//                 </div>
//             </div>

//             {/* Tags and Badges */}
//             <div className="flex flex-wrap gap-2 mt-4 ml-4">
//                 <div className="flex items-center gap-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white px-2 py-1 rounded-full text-sm">
//                     <Code2 size={16} /> Software Engineering
//                 </div>
//                 <div className="flex items-center gap-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white px-2 py-1 rounded-full text-sm">
//                     <Star size={16} /> Founder
//                 </div>
//                 <div className="flex items-center gap-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white px-2 py-1 rounded-full text-sm">
//                     <Briefcase size={16} /> Crypto Enthusiast
//                 </div>
//                 <div className="flex items-center gap-1  bg-gray-300 text-black dark:bg-gray-800 dark:text-white px-2 py-1 rounded-full text-sm">
//                     <Settings size={16} /> Developer
//                 </div>
//             </div>

//             {/* Social Links */}
//             <div className="flex gap-4 mt-6 ml-4">
//                 <a href="#" target="_blank" rel="noopener noreferrer">
//                     <GitBranch size={24} />
//                 </a>
//                 <a href="#" target="_blank" rel="noopener noreferrer">
//                     <Linkedin size={24} />
//                 </a>
//                 <a href="#" target="_blank" rel="noopener noreferrer">
//                     <Twitter size={24} />
//                 </a>
//                 <a href="#" target="_blank" rel="noopener noreferrer">
//                     <Mail size={24} />
//                 </a>
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;
