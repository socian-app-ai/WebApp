const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const societySchema = new Schema({
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
  societyType: {
    type: Schema.Types.ObjectId,
    ref: "SocietyType",
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
  subSocieties: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSociety",
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

const Society = mongoose.model("Society", societySchema);
module.exports = Society;
