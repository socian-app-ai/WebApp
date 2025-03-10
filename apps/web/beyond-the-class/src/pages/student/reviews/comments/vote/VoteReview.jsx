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
        try {
            const response = await axiosInstance.post('/api/teacher/reviews/feedbacks/vote', {
                reviewId: review._id,
                userIdOther: userData._id,
                voteType,
            });

            const { upvoteCount, downvoteCount } = response.data;

            setUpvoted(voteType === 'upVote' && !upvoted);
            setDownvoted(voteType === 'downVote' && !downvoted);
            setUpvoteCount(upvoteCount);
            setDownvoteCount(downvoteCount);
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    return (
        <div className="flex items-center space-x-2 py-2">
            <button
                onClick={() => handleVote('upVote')}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 ${upvoted
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
            >
                <ArrowUpward className="h-4 w-4" />
            </button>
            <span className={`text-sm font-medium ${upvoted ? 'text-primary' : 'text-muted-foreground'}`}>
                {upvoteCount}
            </span>

            <button
                onClick={() => handleVote('downVote')}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 ${downvoted
                    ? 'bg-destructive/10 text-destructive'
                    : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
            >
                <ArrowDownward className="h-4 w-4" />
            </button>
            <span className={`text-sm font-medium ${downvoted ? 'text-destructive' : 'text-muted-foreground'}`}>
                {downvoteCount}
            </span>
        </div>
    );
}
