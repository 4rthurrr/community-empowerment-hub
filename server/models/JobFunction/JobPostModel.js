const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobPostSchema = new Schema({
    ownerID: {
        type: String,
        required: true,
    },
    postID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    applicationCloseDate: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    companyName:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("JobPost", JobPostSchema);