const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const universitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mainLocationAddress: { //lahore,islamabad etc
        type: String,
        required: true,
    },
    telephone: {
        type: String,
    },
    adminEmails: [{ type: String }],
    picture: {
        type: String,
        default: ''
    },


    campuses: [{
        name: String,
        location: String,//lahore,islamabad etc
        type: Schema.ObjectId,
        ref: 'Campus'
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


const University = mongoose.model("University", universitySchema);

module.exports = University;
