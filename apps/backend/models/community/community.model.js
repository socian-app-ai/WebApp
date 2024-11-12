const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const communitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    default: "default",
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moderators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  previousModerators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  rules: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],
  banner: { type: String },
  icon: { type: String },
  topics: [{ type: String }],
  communityType: {
    type: Schema.Types.ObjectId,
    ref: "CommunityType",
    required: true,
  },
  totalMembers: {
    type: Number,
    default: 0,
  },
  members: {
    type: Schema.Types.ObjectId,
    ref: "Members",
    // required: true
  },
  postsCollectionRef: {
    type: Schema.Types.ObjectId,
    ref: "PostsCollection",
  },
  isPromoted: {
    promoted: { type: Boolean, default: false },
    byUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  subCommunities: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubCommunity",
      index: true,
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
});

const Community = mongoose.model("Community", communitySchema);
module.exports = Community;
