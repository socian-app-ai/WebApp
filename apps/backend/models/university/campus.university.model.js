const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const campusSchema = new Schema({
    universityOrigin: {
        type: Schema.ObjectId,
        ref: 'University',
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: { //lahore,islamabad etc
        type: String,
        required: true,
        index: true,
    },

    emailPatterns: {
        teacherPatterns: [String],
        studentPatterns: [String],
        convertedRegEx: {
            teacherPatterns: [String],
            studentPatterns: [String],
        }
        // RollNumberFormat: [String]
    },
    picture: {
        type: String,
        default: ''
    },


    departments: [{
        type: Schema.ObjectId,
        ref: 'Department',
        index: true,
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
        ref: 'User',
        index: true,
    }],

    teachers: [{
        type: Schema.ObjectId,
        ref: 'Teacher'
    }],

    academicFormat: {
        type: Schema.ObjectId,
        ref: 'AcademicFormat',
        index: true,
    },
}, { timestamps: true })


const Campus = mongoose.model("Campus", campusSchema);

module.exports = Campus;
