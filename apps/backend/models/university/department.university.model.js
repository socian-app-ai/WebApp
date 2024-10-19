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
    ]
})


const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
