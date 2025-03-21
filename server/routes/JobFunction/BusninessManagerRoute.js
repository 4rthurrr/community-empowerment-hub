const express = require("express");
const router = express.Router();
const BusninessManagerController = require("../../controllers/JobFunction/BusinessManagerController");

router.get("/", BusninessManagerController.getAllDetails);
router.post("/", BusninessManagerController.addData);
router.get("/:id", BusninessManagerController.getById);
router.put("/:id", BusninessManagerController.updateData);
router.delete("/:id", BusninessManagerController.deleteData);
router.post("/login", BusninessManagerController.login);
//export
module.exports = router;