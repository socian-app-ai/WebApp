import React from 'react'
import axiosInstance from '../../../config/users/axios.instance';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSetInfoBarState } from '../../../state_management/zustand/useInfoBar';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import PostDiv from '../../society/post/PostDiv';
import { routesForApi } from '../../../utils/routes/routesForLinks';
import { useAuthContext } from '../../../context/AuthContext';

export default function CampusesPosts() {

    const { width } = useWindowDimensions();


    const { infoBarState, setInfoBarState } = useSetInfoBarState();
    const { authUser } = useAuthContext()

    useEffect(() => {
        if (infoBarState === false && width > 768) {
            setInfoBarState(true);
        }
    }, [setInfoBarState, infoBarState]);


    const [posts, setPosts] = useState([]);


    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axiosInstance.get(routesForApi.posts.campusesAll);
                // console.log("POSTS,", response.data)
                setPosts(response.data)
                // console.log("hie", response)
            } catch (err) {
                // setError("Error fetching society data.");
                console.error("Error fetching society details:", err);
            } finally {
                // setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <div className="min-h-screen mt-10  flex flex-col justify-center items-center w-full lg:w-[90%] ">
            <p className="p-2 m-2  font-bold text-xl">see whats happening in all campus of {authUser.university.universityId.name.toUpperCase()}</p>





            {posts.length > 0 && (
                <div className="space-y-4 mx-2 w-full md:w-4/5 lg:w-2/3">
                    {posts.map((post) => {
                        // console.log("POST-", post)
                        return (<PostDiv key={post._id} postInfo={post} society={post.society} />
                        )
                    })}
                </div>
            )}


        </div>

    );
}



