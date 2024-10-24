const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subjects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
    }],

    references: {
        universityOrigin: {
            type: Schema.Types.ObjectId,
            ref: 'University',
            required: true
        },
        campusOrigin: {
            type: Schema.Types.ObjectId,
            ref: 'Campus',
            required: true
        },
    }
})


const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
