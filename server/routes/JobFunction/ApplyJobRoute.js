const express = require("express");
const router = express.Router();
const ApplyJobController = require("../../controllers/JobFunction/ApplyJobController");
const multer = require("multer");
const fs = require("fs"); 
const path = require("path"); 


const uploadsDir = path.join(__dirname, "../../uploads/"); 
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); 
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); 
    },
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."), false);
        }
    },
});

// Routes
router.get("/", ApplyJobController.getAllDetails); 
router.get("/:id", ApplyJobController.getById); 

router.post("/", upload.single("cvFile"), ApplyJobController.addData);

module.exports = router;