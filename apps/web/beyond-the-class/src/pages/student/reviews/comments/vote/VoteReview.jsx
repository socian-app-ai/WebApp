/* eslint-disable react/prop-types */
import { useState } from 'react';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import axiosInstance from '../../../../../config/users/axios.instance';

export default function VoteReview({ review, userData }) {


    const [upvoted, setUpvoted] = useState(review.userVote === 'upVote');
    const [downvoted, setDownvoted] = useState(review.userVote === 'downVote');
    const [upvoteCount, setUpvoteCount] = useState(review.upvoteCount);
    const [downvoteCount, setDownvoteCount] = useState(review.downvoteCount);



    const handleVote = async (voteType) => {
        // console.log("vote handle", voteType)
        try {
            const response = await axiosInstance.post('/api/teacher/reviews/feedbacks/vote', {
                reviewId: review._id,
                userIdOther: userData._id,
                voteType,
            });

            const { upvoteCount, downvoteCount } = response.data;
            // console.log("VTOE REs", response.data)

            setUpvoted(voteType === 'upVote' && !upvoted);
            setDownvoted(voteType === 'downVote' && !downvoted);


            setUpvoteCount(upvoteCount);
            setDownvoteCount(downvoteCount);

        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    return (
        <div className='flex justify-start space-x-2 m-2 -mt-5'>
            <button
                className="flex text-gray-500 hover:text-gray-700"
                onClick={() => handleVote('upVote')}
            >
                <ArrowUpward className={`${upvoted ? 'text-red-500' : ''}`} />
                <p> {upvoteCount}</p>
            </button>
            <button
                className="flex text-gray-500 hover:text-gray-700"
                onClick={() => handleVote('downVote')}
            >
                <ArrowDownward className={`${downvoted ? 'text-blue-500' : ''}`} />
                <p> {downvoteCount}</p>
            </button>
        </div>
    );
}
