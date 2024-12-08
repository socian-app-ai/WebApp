// import React from 'react'
// import { useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { useSetInfoBarState } from '../../state_management/zustand/useInfoBar';
// import { useState } from 'react';
// import axiosInstance from '../../config/users/axios.instance';

// export default function Society() {
//     const { id } = useParams()
//     const [society, setSociety] = useState(null)
//     const [loading, setLoading] = useState(null)
//     const [error, setError] = useState('')


//     const { infoBarState, setInfoBarState } = useSetInfoBarState();

//     useEffect(() => {
//         if (infoBarState === true) {
//             setInfoBarState(false);
//         }
//     }, [setInfoBarState, infoBarState]);

//     useEffect(() => {

//         const fetch = async () => {
//             setLoading(true);
//             try {
//                 const campus = await axiosInstance.get(`/api/society/${id}`);
//                 setSociety(campus.data);
//             } catch (err) {
//                 setError("Error fetching single campus.");
//                 console.error("Error fetching single campus societies: ", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetch();
//     }, [])


//     return (
//         <div>Society {id}

//             {loading ?
//                 <div className="flex justify-center items-center">
//                     <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
//                 </div>
//                 :
//                 <div>
//                     {society}
//                 </div>
//             }</div>
//     )
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSetInfoBarState } from "../../state_management/zustand/useInfoBar";
import axiosInstance from "../../config/users/axios.instance";
import { FaMoon, FaSun } from "react-icons/fa";
import PostDiv from "./post/PostDiv";

export default function Society() {
    const { id } = useParams();
    const [society, setSociety] = useState(null);

    const [posts, setPosts] = useState([]);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const { infoBarState, setInfoBarState } = useSetInfoBarState();


    const [joined, setJoined] = useState(false)


    // useEffect(() => {
    //     society.members.

    // }, [society, joined, setJoined]);


    const fetch = async () => {
        try {
            let societyId = society._id
            const response = await axiosInstance.post(`/api/society/join-society/${societyId}`);
            setJoined(response.data.joined);
            console.log("hie", response)
        } catch (err) {
            setError("Error fetching society data.");
            console.error("Error fetching society details:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleJoinOrLeave = (e) => {
        e.preventDefault()
        fetch();
    }

    useEffect(() => {
        if (infoBarState === true) {
            setInfoBarState(false);
        }
    }, [setInfoBarState, infoBarState]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axiosInstance.get(`/api/society/${id}`);
                setSociety(response.data);
                console.log("POSTS,", response.data.postsCollectionRef.posts)
                setPosts(response.data.postsCollectionRef.posts)
                console.log("hie", response)
            } catch (err) {
                setError("Error fetching society data.");
                console.error("Error fetching society details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-blue-500 rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 text-xl mt-8">
                {error}
            </div>
        );
    }

    if (!society) {
        return (
            <div className="text-center text-gray-500 text-xl mt-8">
                No society found.
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen px-6 py-10 transition duration-300 ${darkMode ? " text-gray-200" : " text-gray-800"
                }`}
        >
            {/* Theme Toggle */}
            <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="fixed top-4 right-4 p-2 rounded-full shadow-lg focus:outline-none"
            >
                {darkMode ? (
                    <FaSun className="text-yellow-500 w-6 h-6" />
                ) : (
                    <FaMoon className="text-blue-500 w-6 h-6" />
                )}
            </button>

            {/* Society Header */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
                <h1 className="dark:text-white text-bg-var-dark text-3xl font-bold mb-2">
                    {society.name}{" "}
                    <span className="ml-2 text-sm px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded">
                        {society.societyType.societyType}
                    </span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300">{society.description}</p>
                <div className="mt-4 flex items-center gap-4">
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 text-sm font-medium rounded">
                        {society.category}
                    </span>
                    <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-200 text-sm font-medium rounded">
                        {society.totalMembers} Members
                    </span>
                </div>


                <button
                    className="px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-200 text-sm font-medium rounded"
                    onClick={handleJoinOrLeave}>{joined ? 'leave' : 'Join'}</button>
            </div>

            {/* Details & Rules */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* About Society */}
                <div className="bg-white dark:bg-gray-800 dark:text-white text-bg-var-dark shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">About the Society</h2>
                    <ul className="space-y-2">
                        <li>
                            <strong>President:</strong> {society.president.username}
                        </li>
                        <li>
                            <strong>Visibility:</strong>{" "}
                            {society.visibilityNone ? "Not Seeable to anyone" : "Public"}
                        </li>
                        <li>
                            <strong>Verified:</strong> {society.verified ? "Yes" : "No"}
                        </li>
                        <li>
                            <strong>Allows:</strong> {society?.allows}
                        </li>
                        <li>
                            <strong>Created At:</strong>{" "}
                            {new Date(society.createdAt).toLocaleDateString()}
                        </li>
                    </ul>
                </div>

                {/* Rules */}
                <div className="bg-white dark:bg-gray-800 dark:text-white text-bg-var-dark shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Rules</h2>
                    {society.rules && society.rules.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2">
                            {society.rules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            No rules defined for this society.
                        </p>
                    )}
                </div>
            </div>

            {/* Sub-Societies */}
            {society.subSocieties && society.subSocieties.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4">Sub-Societies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {society.subSocieties.map((subSociety, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-bold">{subSociety.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {subSociety.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {
                posts.length != 0 && posts.map((post) => {
                    console.log(":HERE", post)

                    return <PostDiv key={post.postId._id} postInfo={post.postId} society={society} />
                })
            }
        </div>
    );
}
