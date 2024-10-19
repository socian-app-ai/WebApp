const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const campusSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mainLocation: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
    },
    adminEmails: [{ type: String }],

    emailPatterns: {
        teacherPatterns: [String],
        studentPatterns: [String],
        // RollNumberFormat: [String]
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
