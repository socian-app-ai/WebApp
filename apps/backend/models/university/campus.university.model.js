const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const campusSchema = new Schema({
    universityOrigin: {
        type: Schema.ObjectId,
        ref: 'University'
    },
    name: {
        type: String,
        required: true,
    },
    location: { //lahore,islamabad etc
        type: String,
        required: true,
    },

    emailPatterns: {
        teacherPatterns: [String],
        studentPatterns: [String],
        // RollNumberFormat: [String]
    },
    picture: {
        type: String,
        default: ''
    },


    departments: [{
        type: Schema.ObjectId,
        ref: 'Department'
    }],

    registered: {
        isRegistered: {
            type: Boolean,
            default: true
        },
        registeredBy:
        {
            type: Schema.ObjectId,
            ref: 'User'
        },
    },

    users: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]
})


const Campus = mongoose.model("Campus", campusSchema);

module.exports = Campus;
