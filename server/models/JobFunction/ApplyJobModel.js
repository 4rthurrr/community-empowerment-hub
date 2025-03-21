const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema({
    postID: {
        type: String,
        required: true,
    },
    postOwnerID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    applicationID: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    cvFileName: { // New field to store the CV file name
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);