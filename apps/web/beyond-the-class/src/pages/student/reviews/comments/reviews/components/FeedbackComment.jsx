import { useEffect, useState } from "react";
import axiosInstance from "../../../../../../config/users/axios.instance";
import SeperateComment from "./SeperateComment";


const FeedbackComment = ({ feedbackCommentId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchFeedbackComment = async () => {
            try {
                const response = await axiosInstance.get(`/api/teacher/reply/feedback?feedbackCommentId=${feedbackCommentId}`);
                setComments(response.data.replies.replies);
            } catch (error) {
                console.error('Error fetching feedback comment:', error);
            }
        };

        fetchFeedbackComment();
    }, [feedbackCommentId]);

    return (
        comments && comments.length > 0 &&
        comments.map((cmt) => (
            <SeperateComment key={cmt._id} comment={cmt} />
        ))
    );
};



export default FeedbackComment; 