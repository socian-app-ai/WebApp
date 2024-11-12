const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postsCollectionSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      // , required: true, unique: true //is already required and unique
    },

    posts: [
      {
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    references: {
      universityOrigin: {
        type: Schema.ObjectId,
        ref: "University",
        index: true,
      },
      campusOrigin: {
        type: Schema.Types.ObjectId,
        ref: "Campus",
        required: true,
      },
    },
  },
  { _id: false, timestamps: true }
);

const PostsCollection = model("PostsCollection", postsCollectionSchema);
module.exports = PostsCollection;
