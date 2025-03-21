const JobSeekerModel = require("../../models/JobFunction/JobSeekerModel");

//Display Data
const getAllDetails = async (req, res, next) => {
    let jobSeeker;
    try {
        jobSeeker = await JobSeekerModel.find();
    } catch (err) {
        console.log(err);
    }
    if (!jobSeeker) {
        return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json({ jobSeeker });
};

//Insert Data
const addData = async (req, res, next) => {
    const { fullName, email, phone, password } = req.body;

    try {

        // Check if email already exists
        const existingEmail = await JobSeekerModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // If username and email are unique, proceed to create the new manager
        const jobSeeker = new JobSeekerModel({
            fullName,
            email,
            password,
            phone
        });

        await jobSeeker.save();

        return res.status(200).json({ jobSeeker });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//Get by Id
const getById = async (req, res, next) => {
    const id = req.params.id;
    let jobSeeker;
    try {
        jobSeeker = await JobSeekerModel.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!jobSeeker) {
        return res.status(404).json({ message: "Data Not Found" });
    }
    return res.status(200).json({ jobSeeker });
};

//Update Details
const updateData = async (req, res, next) => {
    const id = req.params.id;
    const { fullName, email, phone, password } = req.body;

    let jobSeeker;

    try {
        jobSeeker = await JobSeekerModel.findByIdAndUpdate(id, {
            fullName: fullName,
            email: email,
            password: password,
            phone: phone
        });
        jobSeeker = await jobSeeker.save();
    } catch (err) {
        console.log(err);
    }
    if (!jobSeeker) {
        return res.status(404).json({ message: "Unable to Update data" });
    }
    return res.status(200).json({ jobSeeker });
};

//Delete data
const deleteData = async (req, res, next) => {
    const id = req.params.id;

    let jobSeeker;

    try {
        jobSeeker = await JobSeekerModel.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!jobSeeker) {
        return res.status(404).json({ message: "Unable to Delete Details" });
    }
    return res.status(200).json({ jobSeeker });
};
// Login Controller
const login = async (req, res, next) => {
    const { email, password } = req.body;

    let jobSeeker;

    try {
        jobSeeker = await JobSeekerModel.findOne({ email: email });

        if (!jobSeeker) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        if (jobSeeker.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({ message: "Login successful", jobSeeker });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.login = login;