const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    references: {
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Department'
        },
        universityOrigin: {
            type: Schema.Types.ObjectId,
            ref: 'University'
        },
        campusOrigin: {
            type: Schema.Types.ObjectId,
            ref: 'Campus'
        },
    }


})


const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
