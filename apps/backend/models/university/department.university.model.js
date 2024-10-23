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


    references: {
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


const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
