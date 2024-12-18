import React from 'react'
import axiosInstance from '../../../config/users/axios.instance';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSetInfoBarState } from '../../../state_management/zustand/useInfoBar';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import PostDiv from '../../society/post/PostDiv';
import { routesForApi } from '../../../utils/routes/routesForLinks';

export default function CampusesPosts() {

    const { width } = useWindowDimensions();


    const { infoBarState, setInfoBarState } = useSetInfoBarState();

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
                console.log("POSTS,", response.data)
                setPosts(response.data)
                console.log("hie", response)
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
        <div className="min-h-screen px-2 pt-8">
            {/* <p className="p-10 m-10 font-extrabold text-4xl">CREATE UI FIRST</p> */}





            {posts.length > 0 && (
                <div className="space-y-4 w-2/3">
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



