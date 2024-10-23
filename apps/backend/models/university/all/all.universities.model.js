const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const allUniversitySchema = new Schema({
    name: {// only one entry. in this all universities with their campuses will be aavailable
        type: String,
        required: true,
    },
    universities: [{
        name: String,
        location: String,
        type: Schema.ObjectId,
        ref: 'University'
    }],

    allCommunities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    allSubCommunities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCommunity'
    }]



})


const AllUniversity = mongoose.model("AllUniversity", allUniversitySchema);

module.exports = AllUniversity;
