const mongoose = require("mongoose");

const discussionCommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionComment' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const DiscussionComment = mongoose.model('DiscussionComment', iscussionCommentSchema);
module.exports = DiscussionComment;