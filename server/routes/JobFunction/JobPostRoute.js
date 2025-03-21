const express = require("express");
const router = express.Router();
const JobPostController = require("../../controllers/JobFunction/JobPostController");

router.get("/", JobPostController.getAllDetails);
router.post("/", JobPostController.addData);
router.get("/:id", JobPostController.getById);
router.put("/:id", JobPostController.updateData);
router.delete("/:id", JobPostController.deleteData);
//export
module.exports = router;