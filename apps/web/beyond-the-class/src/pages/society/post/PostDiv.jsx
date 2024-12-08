/* eslint-disable react/prop-types */
import { BiDotsHorizontal, BiMessage } from "react-icons/bi";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import formatTimeDifference from "../../../utils/formatDate";
import axiosInstance from "../../../config/users/axios.instance";
import { useAuthContext } from "../../../context/AuthContext";
// import MediaContent from "../home/society/MediaContent";

export default function PostDiv({ society, postInfo, key }) {


    return (
        <Link to={`${society.name}/comments/${postInfo._id}/${postInfo.title.toString().replace(/\s+/g, '-')}`}
            key={key} className="z-10 text-black dark:text-gray-500   p-1 "
        >

            <div className="p-2 space-y-2 rounded-t-lg  border-b  border-black dark:border-[#ffffff8e]">
                <div className="w-full flex justify-between items-center mb-1">
                    <div className="flex items-center">
                        <h6 className="text-sm mr-2 text-black dark:text-white"> {postInfo?.author ? `u/${postInfo.author.name}` : 'u/[deleted-user]'}</h6>
                        <p className="text-xs">    {formatTimeDifference(postInfo.createdAt)}
                        </p>
                        {/* <p className="text-xs">{new Date(p.createdAt).toLocaleString()}</p> */}

                    </div>
                    <BiDotsHorizontal className="rounded-full text-white" />
                </div>
                <h6 className="text-lg text-black dark:text-white break-words">{postInfo.title}</h6>
                {postInfo?.body && <p className="break-words" >{postInfo.body}</p>}

                {/* {p?.media && <MediaContent media={p.media} />} */}

                <div className="w-full z-20 flex text-white py-1">
                    <ReVote postInfo={postInfo} />

                    <div className="p-1 pr-2 ml-1 flex flex-row space-x-1 text-gray-500 hover:text-gray-700">
                        <BiMessage className="px-1" size={26} />
                        <p className="ml-1 text-white hover:brightness-50">{postInfo.commentsCount}</p>
                    </div>
                </div>
            </div>

        </Link>
    )
}


export function ReVote({ postInfo }) {

    const { authUser } = useAuthContext()
    const [upvote, setUpvote] = useState(postInfo.voteId.upVotesCount)
    const [downvote, setDownvote] = useState(postInfo.voteId.downVotesCount)
    const [state, setState] = useState(postInfo.voteId.userVotes[authUser._id])


    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);


    useEffect(() => {
        const fetchVoteDetails = async () => {
            try {
                const response = await axiosInstance.post(`/api/post/get-post-votes`, {
                    postId: postInfo._id
                })
                const { hasUpVoted, hasDownVoted } = response.data
                setHasDownvoted(hasDownVoted)
                setHasUpvoted(hasUpVoted)

            } catch (error) {
                console.error("Error submitting comment", error.message);
            }
        }
        // fetchVoteDetails()
        console.log("HERE", state)
    }, [postInfo._id, hasUpvoted, state, hasDownvoted,])







    useEffect(() => {
        const stateChange = () => {
            if (state) {
                state === 'downvote' ?
                    setHasDownvoted(true) :
                    setHasUpvoted(true)
            }
        }
        stateChange()
        console.log("HERE", state)
    }, [state])


    const handleVote = async (e, voteTypeVal) => {
        e.preventDefault();



        // let newUpvote = upvote;
        // let newDownvote = downvote;
        // let newHasUpvoted = hasUpvoted;
        // let newHasDownvoted = hasDownvoted;

        // if (voteTypeVal === "upvote") {
        //     if (hasUpvoted) {
        //         // Cancel upvote
        //         newUpvote -= 1;
        //         newHasUpvoted = false;
        //     } else if (hasDownvoted) {
        //         // Switch from downvote to upvote
        //         newUpvote += 1;
        //         newDownvote -= 1;
        //         newHasUpvoted = true;
        //         newHasDownvoted = false;
        //     } else {
        //         // New upvote
        //         newUpvote += 1;
        //         newHasUpvoted = true;
        //     }
        // } else if (voteTypeVal === "downvote") {
        //     if (hasDownvoted) {
        //         // Cancel downvote
        //         newDownvote -= 1;
        //         newHasDownvoted = false;
        //     } else if (hasUpvoted) {
        //         // Switch from upvote to downvote
        //         newUpvote -= 1;
        //         newDownvote += 1;
        //         newHasUpvoted = false;
        //         newHasDownvoted = true;
        //     } else {
        //         // New downvote
        //         newDownvote += 1;
        //         newHasDownvoted = true;
        //     }
        // }

        // setUpvote(newUpvote);
        // setDownvote(newDownvote);
        // setHasUpvoted(newHasUpvoted);
        // setHasDownvoted(newHasDownvoted);



        // console.log(voteTypeVal, postId)
        try {
            const response = await axiosInstance.post(`/api/posts/vote-post`, {
                postId: postInfo._id,
                voteType: voteTypeVal
            });
            // console.log(response)
            const { upVotesCount, downVotesCount } = response.data;
            setUpvote(upVotesCount);
            setDownvote(downVotesCount)


            voteTypeVal === 'upvote' ? setHasUpvoted(true) : setHasDownvoted(true)


        } catch (error) {
            console.error("Error submitting comment", error.message);
        }
    };

    return <>
        <button className="flex items-center text-gray-500 hover:text-gray-700" onClick={(e) => { handleVote(e, 'upvote') }}>
            <ArrowUpward sx={{ width: '1.2rem' }} className={`${(hasUpvoted === hasDownvoted) ? '' : (hasUpvoted ? 'text-red-500' : '')}`} /> <p className="text-white brightness-90 hover:brightness-50"> {upvote}</p>
        </button>
        <button className="flex items-center text-gray-500 hover:text-gray-700" onClick={(e) => { handleVote(e, 'downvote') }}>
            <ArrowDownward sx={{ width: '1.2rem' }} className={`${(hasUpvoted === hasDownvoted) ? '' : (hasDownvoted ? 'text-blue-500' : '')}`} /> <p className="text-white brightness-90 hover:brightness-50"> {(downvote * (-1))}</p>
        </button>
    </>


}