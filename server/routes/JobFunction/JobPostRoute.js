const express = require("express");
const router = express.Router();
const JobPost = require("../../models/JobFunction/JobPostModel");

// POST - Create new job post
router.post("/", async (req, res) => {
  try {
    console.log("Received job post data:", req.body); // Debug log
    
    const {
      ownerID,
      postID,
      title,
      industry,
      location,
      experienceLevel,
      applicationCloseDate,
      description,
      companyName,
    } = req.body;

    // More detailed validation with specific error messages
    const missingFields = [];
    if (!ownerID) missingFields.push("ownerID");
    if (!postID) missingFields.push("postID");
    if (!title) missingFields.push("title");
    if (!industry) missingFields.push("industry");
    if (!location) missingFields.push("location");
    if (!experienceLevel) missingFields.push("experienceLevel");
    if (!applicationCloseDate) missingFields.push("applicationCloseDate");
    if (!description) missingFields.push("description");
    if (!companyName) missingFields.push("companyName");

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: "Missing required fields", 
        missingFields: missingFields 
      });
    }

    const newJobPost = new JobPost({
      ownerID,
      postID,
      title,
      industry,
      location,
      experienceLevel,
      applicationCloseDate,
      description,
      companyName,
    });

    const savedJobPost = await newJobPost.save();
    res.status(200).json(savedJobPost);
  } catch (error) {
    console.error("Error creating job post:", error);
    res.status(500).json({ message: "Error creating job post", error: error.message });
  }
});

// GET - Retrieve all job posts
router.get("/", async (req, res) => {
  try {
    const jobPosts = await JobPost.find();
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res.status(500).json({ message: "Error fetching job posts", error: error.message });
  }
});

// GET - Get job post by ID
router.get("/:id", async (req, res) => {
  try {
    const jobPost = await JobPost.findOne({ postID: req.params.id });
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.status(200).json(jobPost);
  } catch (error) {
    console.error("Error fetching job post:", error);
    res.status(500).json({ message: "Error fetching job post", error: error.message });
  }
});

// Add other routes for update, delete, etc.

module.exports = router;