const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 *
 * @param {visibilityNone} Boolean sets visibility to None everywher, incase soc-mod doesnot want to
 *  delete the group but wants it to remain their or could use it for sample purpose
 * @param {societyType} SocietyType tells society to be either private, public or restricted
 */
const subSocietySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  visibilityNone: {
    type: Boolean,
    default: false,
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
  isPromoted: {
    promoted: { type: Boolean, default: false },
    byUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
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
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Society",
  },
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

const SubSociety = mongoose.model("SubSociety", subSocietySchema);
module.exports = SubSociety;

// validate: {
//     validator: function (value) {
//         return !(value && value.length > 0 && this.parent)
//     },
//     message: "A society with sub-societies cannot have a parent."
// }

// validate: {
//     validator: function (value) {
//         return !(value && this.subsocieties && this.subsocieties.length > 0)
//     },
//     message: "A society with a parent cannot have sub-societies."
// }
