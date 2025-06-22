const Campus = require('../../models/university/campus.university.model');
const FeedBackCommentTeacher = require('../../models/university/teacher/feedback.rating.teacher.model');
const TeacherRating = require('../../models/university/teacher/rating.teacher.model');
const Teacher = require('../../models/university/teacher/teacher.model');

const router = require('express').Router();
const mongoose = require('mongoose')





router.get("/campus", async (req, res) => {
  try {
    const { campusId, page = 1, limit = 10 } = req.query;

    if (!campusId) return res.status(400).json({ error: "Campus ID not provided" });

    const findCampus = await Campus.findById(campusId);
    if (!findCampus) return res.status(404).json({ error: "Campus not found" });

    // Total teachers count for pagination
    const totalTeachers = await Teacher.countDocuments({ campusOrigin: campusId });

    const teachers = await Teacher.find({ campusOrigin: campusId })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate({
        path: "ratingsByStudents",
        select: "feedback upvoteCount userId",
        options: { sort: { upvoteCount: -1 }, limit: 1 },
      })
      .lean();

    const result = teachers.map((teacher) => {
      const topRating = teacher.ratingsByStudents?.[0] || null;
      return {
        ...teacher,
        topFeedback: topRating?.feedback || null,
        topFeedbackUser: topRating?.userId || null,
      };
    });

    res.status(200).json({
      teachers: result,
      pagination: {
        total: totalTeachers,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalTeachers / limit),
        hasNextPage: page * limit < totalTeachers,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error in teacher route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/search", async (req, res) => {
  try {
    const { campusId, search = '', page = 1, limit = 10 } = req.query;

    if (!campusId) return res.status(400).json({ error: "Campus ID not provided" });

    const findCampus = await Campus.findById(campusId);
    if (!findCampus) return res.status(404).json({ error: "Campus not found" });

    // Create filter object
    const query = {
      campusOrigin: campusId,
      ...(search?.trim() && {
        name: { $regex: search.trim(), $options: 'i' }
      })
    };

    const totalTeachers = await Teacher.countDocuments(query);

    const teachers = await Teacher.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate({
        path: "ratingsByStudents",
        select: "feedback upvoteCount userId",
        options: { sort: { upvoteCount: -1 }, limit: 1 },
      })
      .lean();

    const result = teachers.map((teacher) => {
      const topRating = teacher.ratingsByStudents?.[0] || null;
      return {
        ...teacher,
        topFeedback: topRating?.feedback || null,
        topFeedbackUser: topRating?.userId || null,
      };
    });

    res.status(200).json({
      teachers: result,
      pagination: {
        total: totalTeachers,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalTeachers / limit),
        hasNextPage: page * limit < totalTeachers,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error in teacher search route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




router.put("/teacher/hide", async (req, res) => {
  const { teacherId } = req.query;
  const {reason} = req.body;
  try {

    const teacher = await Teacher.findByIdAndUpdate(teacherId, {reason, hiddenBySuper: true});
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher Hidden"});
  } catch (error) {
    console.error("Error In teacherSpeficicInfo", {
      message: "Server error",
      error: error.message,
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/teacher/unhide", async (req, res) => {
  const { teacherId } = req.query;
  const {reason} = req.body;
  try {

    const teacher = await Teacher.findByIdAndUpdate(teacherId, {reason, hiddenBySuper: false});
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher <UN>-Hidden"});
  } catch (error) {
    console.error("Error In teacherSpeficicInfo", {
      message: "Server error",
      error: error.message,
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/reviews/hidden', async (req, res) => {
  try {
    const { teacherId, page = 1, limit = 10 } = req.query;

    if (!teacherId) {
      return res.status(400).json({ error: "teacherId is required" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Count total hidden reviews for pagination
    const totalHiddenReviews = await TeacherRating.countDocuments({
      teacherId,
      $or: [{ hiddenByMod: true }, { hiddenBySuper: true }],
    });

    const hiddenTeacherRatings = await TeacherRating.find({
      teacherId,
      $or: [{ hiddenByMod: true }, { hiddenBySuper: true }],
    })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'userId',
        select: '_id name username profile.picture universityEmailVerified',
      })
      .lean();

    // Transform results to mask names and show reason
    const transformed = hiddenTeacherRatings.map((review) => {
      const hiddenBy = review.hiddenBySuper
        ? 'Hidden by Super Admin'
        : review.hiddenByMod
        ? 'Hidden by Moderator'
        : 'Hidden';

      return {
        _id: review._id,
        rating: review.rating,
        feedback: `🔒 ${hiddenBy}: ${review.reason || 'No reason provided'}`,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        user: review.userId
          ? {
              _id: review.userId._id,
              name: '[hidden]',
              username: null,
              profilePic: null,
              isVerified: false,
            }
          : {
              _id: null,
              name: '[deleted]',
              username: null,
              profilePic: null,
              isVerified: false,
            },
      };
    });

    return res.status(200).json({
      reviews: transformed,
      pagination: {
        total: totalHiddenReviews,
        currentPage: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalHiddenReviews / limit),
        hasNextPage: skip + parseInt(limit) < totalHiddenReviews,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (e) {
    console.error('ERROR in /reviews/hidden:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get("/mob/reviews/feedbacks", async (req, res) => {
  const { id, page = 1, limit = 10 } = req.query;

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const teacher = await Teacher.findById(id)
      .populate({
        path: "ratingsByStudents",
        match: { hiddenByMod: false, hiddenBySuper: false },
        options: {
          skip: skip,
          limit: parseInt(limit),
          sort: { createdAt: -1 }
        },
        populate: [
          {
            path: "userId",
            select: "_id name username profile.picture universityEmailVerified"
          },
          {
            path: "replies",
            populate: {
              path: "user mentions",
              select: "_id name username"
            }
          }
        ]
      });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const populatedRatings = teacher.ratingsByStudents.map((review) => {
      const userData = review.userId
        ? {
            _id: review.userId._id,
            name: review.hideUser ? "Anonymous" : review.userId.name,
            username: review.hideUser ? null : review.userId.username,
            profilePic: review.hideUser ? null : review.userId.profile?.picture,
            isVerified: review.userId.universityEmailVerified
          }
        : {
            _id: null,
            name: "[deleted]",
            username: null,
            profilePic: null,
            isVerified: false
          };

      const processedReplies = review.replies.map((reply) => ({
        _id: reply._id,
        text: reply.text,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        user: reply.user
          ? {
              _id: reply.user._id,
              name: reply.hideUser ? "Anonymous" : reply.user.name,
              username: reply.hideUser ? null : reply.user.username,
              isVerified: reply.user.universityEmailVerified
            }
          : {
              _id: null,
              name: "[deleted]",
              username: null,
              isVerified: false
            },
        isAnonymous: reply.hideUser || false,
        reactions: reply.reactions || {},
        mentions:
          reply.mentions?.map((mention) => ({
            _id: mention._id,
            name: mention.name,
            username: mention.username
          })) || []
      }));

      return {
        _id: review._id,
        rating: review.rating,
        feedback: review.feedback,
        upvoteCount: review.upVotesCount || 0,
        downvoteCount: Math.abs(review.downVotesCount || 0),
        isEdited: review.isFeedbackEdited?.bool || false,
        favouritedByTeacher: review.favouritedByTeacher || false,
        userVotes: review.userVotes || {},
        updatedAt: review.updatedAt,
        createdAt: review.createdAt,
        user: userData,
        isAnonymous: review.hideUser,
        teacherDirectComment: review.teacherDirectComment?.slice(-1)[0] || null,
        replies: processedReplies
      };
    });

    res.status(200).json({
      reviews: populatedRatings,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalFetched: populatedRatings.length
    });
  } catch (err) {
    console.error("Error in /mob/reviews/feedbacks:", err.message);
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

router.get('/reply/feedback', async (req, res) => {
  try {
    const { feedbackCommentId, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const rating = await TeacherRating.findById(feedbackCommentId)
      .populate({
        path: 'replies',
        match: { hiddenByMod: false, hiddenBySuper: false },
        populate: {
          path: 'user',
          select: 'username name profile.picture'
        }
      });

    if (!rating) {
      return res.status(404).json({ message: "No Reply yet" });
    }

    const totalReplies = rating.replies.length;
    const paginatedReplies = rating.replies.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      replies: paginatedReplies,
      totalReplies,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Error in /reply/feedback ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/reply/reply/feedback', async (req, res) => {
  try {
    const { feedbackCommentId, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedbackComment = await FeedBackCommentTeacher.findById(feedbackCommentId).populate({
      path: 'replies',
      match: { hiddenByMod: false, hiddenBySuper: false },
      populate: [
        {
          path: 'user',
          select: 'username name profile.picture'
        },
        {
          path: 'replyTo',
          select: 'username name profile.picture'
        }
      ]
    });

    if (!feedbackComment) {
      return res.status(404).json({ message: "No Reply yet" });
    }

    const totalReplies = feedbackComment.replies.length;
    const paginatedReplies = feedbackComment.replies.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      replies: paginatedReplies,
      totalReplies,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Error in /reply/reply/feedback ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/teacher/reviews/feedbacks/hide", async (req, res) => {
  const { teacherId, reviewId, reason } = req.body;
  

  if (!teacherId || !reviewId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const review = await TeacherRating.findOneAndUpdate({ teacherId, _id: reviewId }, {hiddenBySuper: true, reason: reason}).session(session);
console.log("REVIEW ", review?._id)
    if (!review) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Review not found" });
    }

    const teacher = await Teacher.findById(teacherId).session(session);
    if (teacher) {
      const reviewRating = review.rating;
      const totalRatings = teacher.ratingsByStudents.length;

      if (totalRatings > 1) {
        const newRating =
          (teacher.rating * totalRatings - reviewRating) / (totalRatings - 1);
        teacher.ratingsByStudents = teacher.ratingsByStudents.filter(
          (rating) => !rating.equals(review._id)
        );
        teacher.rating = newRating;
      } else {
        teacher.rating = 0;
        teacher.ratingsByStudents = [];
      }

      await teacher.save({ session });

      // Invalidate relevant Redis caches
      // await Promise.all([
      //   redisClient.del(`campus_teachers_${teacher.campusOrigin}`),
      //   redisClient.del(`campus_teacher_${teacherId}`)
      // ]);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Review hidden successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error hiding review:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put('/teacher/reply/feedback/hide', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { feedbackReviewId } = req.query;
    const {reason} = req.body;

    // Create feedback comment
    const commentedOnaFeedback = await FeedBackCommentTeacher.findByIdAndUpdate(feedbackReviewId, {hiddenBySuper: true, reason: reason}, { session });
    if(!commentedOnaFeedback){
      return res.status(402).json({error: "Feedback could not be hidden"})
    }
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Feedback reply hidden successfully"});
  } catch (error) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Error in /reply/feedback: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put('/teacher/reply/reply/feedback/hide', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { feedbackCommentId } = req.query;
    const {reason} = req.body;

    // console.log("DATA", feedbackCommentId)

    // Create feedback comment
    const commentedOnaFeedback = await FeedBackCommentTeacher.findByIdAndUpdate(feedbackCommentId, {hiddenBySuper: true, reason: reason}, { session });
    if(!commentedOnaFeedback){
      return res.status(402).json({error: "Feedback could not be hidden"})
    }
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Feedback reply hidden successfully"});
  } catch (error) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Error in /reply/feedback: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;