const BusinessManagerModel = require("../../models/JobFunction/BusinessManagerModel");

//Display Data
const getAllDetails = async (req, res, next) => {
    let businessManager;
    try {
        businessManager = await BusinessManagerModel.find();
    } catch (err) {
        console.log(err);
    }
    if (!businessManager) {
        return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json({ businessManager });
};

//Insert Data
const addData = async (req, res, next) => {
    const { managerID, fullName, userName, email, phone, companyName, password } = req.body;

    try {
        // Check if username already exists
        const existingUsername = await BusinessManagerModel.findOne({ userName });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await BusinessManagerModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // If username and email are unique, proceed to create the new manager
        const businessManager = new BusinessManagerModel({
            managerID,
            fullName,
            userName,
            email,
            phone,
            companyName,
            password
        });

        await businessManager.save();

        return res.status(200).json({ businessManager });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//Get by Id
const getById = async (req, res, next) => {
    const id = req.params.id;
    let businessManager;
    try {
        businessManager = await BusinessManagerModel.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!businessManager) {
        return res.status(404).json({ message: "Data Not Found" });
    }
    return res.status(200).json({ businessManager });
};

//Update Details
const updateData = async (req, res, next) => {
    const id = req.params.id;
    const { managerID, fullName, userName, email, phone, companyName, password } = req.body;

    let businessManager;

    try {
        businessManager = await BusinessManagerModel.findByIdAndUpdate(id, {
            managerID: managerID,
            fullName: fullName,
            userName: userName,
            email: email,
            phone: phone,
            companyName: companyName,
            password: password,
        });
        businessManager = await businessManager.save();
    } catch (err) {
        console.log(err);
    }
    if (!businessManager) {
        return res.status(404).json({ message: "Unable to Update data" });
    }
    return res.status(200).json({ businessManager });
};

//Delete data
const deleteData = async (req, res, next) => {
    const id = req.params.id;

    let businessManager;

    try {
        businessManager = await BusinessManagerModel.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!businessManager) {
        return res.status(404).json({ message: "Unable to Delete Details" });
    }
    return res.status(200).json({ businessManager });
};
// Login Controller
const login = async (req, res, next) => {
    const { email, password } = req.body;

    let businessManager;

    try {
        businessManager = await BusinessManagerModel.findOne({ email: email });

        if (!businessManager) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        // Simple password validation (assuming password is stored in plain text)
        if (businessManager.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({ message: "Login successful", businessManager });

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