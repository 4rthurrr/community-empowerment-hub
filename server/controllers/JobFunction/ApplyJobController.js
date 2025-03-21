const ApplyJobModel = require("../../models/JobFunction/ApplyJobModel");

//Display Data
const getAllDetails = async (req, res, next) => {
    let jobPostApplication;
    try {
        jobPostApplication = await ApplyJobModel.find();
    } catch (err) {
        console.log(err);
    }
    if (!jobPostApplication) {
        return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json({ jobPostApplication });
};

//Insert Data
const addData = async (req, res, next) => {
    const { postID, userID, applicationID, fullName, email, phone, postOwnerID } = req.body;
    const cvFile = req.file; 

    if (!cvFile) {
        return res.status(400).json({ message: "Please upload a PDF file." });
    }

    try {
        const jobPostApplication = new ApplyJobModel({
            postID,
            userID,
            applicationID,
            fullName,
            email,
            phone,
            postOwnerID,
            cvFileName: cvFile.filename, 
        });

        await jobPostApplication.save();

        return res.status(200).json({ jobPostApplication });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//Get by Id
const getById = async (req, res, next) => {
    const id = req.params.id;
    let jobPostApplication;
    try {
        jobPostApplication = await ApplyJobModel.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!jobPostApplication) {
        return res.status(404).json({ message: "Data Not Found" });
    }
    return res.status(200).json({ jobPostApplication });
};


exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;