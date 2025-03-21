const express = require("express");
const router = express.Router();
const JobSeekerController = require("../../controllers/JobFunction/JobSeekerController");

router.get("/", JobSeekerController.getAllDetails);
router.post("/", JobSeekerController.addData);
router.get("/:id", JobSeekerController.getById);
router.put("/:id", JobSeekerController.updateData);
router.delete("/:id", JobSeekerController.deleteData);
router.post("/login", JobSeekerController.login);
//export
module.exports = router;