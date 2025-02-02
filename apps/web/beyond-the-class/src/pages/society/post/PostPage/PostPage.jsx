import React from 'react'
import PostDiv from '../PostDiv'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../../config/users/axios.instance'
import { routesForApi } from '../../../../utils/routes/routesForLinks'
import { useState } from 'react'

export default function PostPage() {

    // :societyName/comments/:postId/:postTitle

    const { societyName, postId, postTitle } = useParams();
    const [postInfo, setPostInfo] = useState(null)
    useEffect(() => {

        const fetchPost = async () => {
            try {
                const response = await axiosInstance.get(routesForApi.posts.singlePost, {
                    params: {
                        postId: postId
                    }
                })
                setPostInfo(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        if (postId) {
            fetchPost()
        }

    }, [postId])

    // console.log("DATA", { societyName, postId, postTitle })
    return (
        <div className='min-h-screen pt-10 w-full'>
            {postInfo && <div >
                <PostDiv society={societyName} postInfo={postInfo} linkActivate={false} />
            </div>}
        </div>


    )
}




