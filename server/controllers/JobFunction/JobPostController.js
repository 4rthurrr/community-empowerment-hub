const JobPostModel = require("../../models/JobFunction/JobPostModel");

//Display Data
const getAllDetails = async (req, res, next) => {
    let jobPost;
    try {
        jobPost = await JobPostModel.find();
    } catch (err) {
        console.log(err);
    }
    if (!jobPost) {
        return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json({ jobPost });
};

//Insert Data
const addData = async (req, res, next) => {
    const { ownerID,postID, title, industry, location, experienceLevel, applicationCloseDate, description,companyName } = req.body;

    try {
        const jobPost = new JobPostModel({
            ownerID,
            postID,
            title,
            industry,
            location,
            experienceLevel,
            applicationCloseDate,
            description,
            companyName
        });

        await jobPost.save();

        return res.status(200).json({ jobPost });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//Get by Id
const getById = async (req, res, next) => {
    const id = req.params.id;
    let jobPost;
    try {
        jobPost = await JobPostModel.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!jobPost) {
        return res.status(404).json({ message: "Data Not Found" });
    }
    return res.status(200).json({ jobPost });
};

//Update Details
const updateData = async (req, res, next) => {
    const id = req.params.id;
    const { ownerID,postID, title, industry, location, experienceLevel, applicationCloseDate, description,companyName  } = req.body;

    let jobPost;

    try {
        jobPost = await JobPostModel.findByIdAndUpdate(id, {
            ownerID: ownerID,
            postID: postID,
            title: title,
            industry: industry,
            location: location,
            experienceLevel: experienceLevel,
            applicationCloseDate: applicationCloseDate,
            description: description,
            companyName:companyName,
        });
        jobPost = await jobPost.save();
    } catch (err) {
        console.log(err);
    }
    if (!jobPost) {
        return res.status(404).json({ message: "Unable to Update data" });
    }
    return res.status(200).json({ jobPost });
};

//Delete data
const deleteData = async (req, res, next) => {
    const id = req.params.id;

    let jobPost;

    try {
        jobPost = await JobPostModel.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!jobPost) {
        return res.status(404).json({ message: "Unable to Delete Details" });
    }
    return res.status(200).json({ jobPost });
};


exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;