const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Helper function to check if Object ID is valid
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// GET all jobs with optional filters
exports.getAllJobs = async (req, res) => {
  try {
    const { 
      category, 
      location, 
      search,
      minSalary,
      maxSalary,
      postedBy 
    } = req.query;
    
    // Build the filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (location) filter.location = location;
    if (postedBy && isValidObjectId(postedBy)) filter.postedBy = postedBy;
    if (minSalary) filter.salary = { $gte: parseInt(minSalary) };
    if (maxSalary) {
      filter.salary = { ...filter.salary, $lte: parseInt(maxSalary) };
    }
    
    // Handle text search
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Execute query with populated user data (excluding sensitive info)
    const jobs = await Job.find(filter)
      .populate('postedBy', 'userName email')
      .sort({ postedDate: -1 }) // Newest first
      .lean();
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single job by ID with its applications
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    const job = await Job.findById(id)
      .populate('postedBy', 'userName email')
      .lean();
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST create a new job
exports.createJob = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract data from request body
    const {
      jobTitle,
      companyName,
      location,
      salary,
      jobDescription,
      category
    } = req.body;
    
    // Create new job with user ID from authenticated request
    const newJob = new Job({
      jobTitle,
      companyName,
      location,
      salary: salary || null, // Handle empty salary
      jobDescription,
      category,
      postedBy: req.user.id // From auth middleware
    });
    
    // Save to database
    const savedJob = await newJob.save();
    
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT update an existing job
exports.updateJob = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    // Find job and check ownership
    const job = await Job.findById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the authenticated user is the owner of this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this job' });
    }
    
    // Extract data from request body
    const {
      jobTitle,
      companyName,
      location,
      salary,
      jobDescription,
      category
    } = req.body;
    
    // Update job
    job.jobTitle = jobTitle;
    job.companyName = companyName;
    job.location = location;
    job.salary = salary || null; // Handle empty salary
    job.jobDescription = jobDescription;
    job.category = category;
    
    // Save to database
    const updatedJob = await job.save();
    
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    // Find job and check ownership
    const job = await Job.findById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the authenticated user is the owner of this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this job' });
    }
    
    // Delete all applications for this job (cascade delete)
    await JobApplication.deleteMany({ jobId: id });
    
    // Delete the job
    await Job.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Job and associated applications deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all jobs posted by the authenticated user
exports.getMyJobs = async (req, res) => {
  try {
    // Log the user info to debug
    console.log('User info in getMyJobs:', req.user);
    
    // Get user ID from auth middleware - handle both object ID and string formats
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing from authentication' });
    }
    
    console.log('Fetching jobs for user ID:', userId);
    
    const jobs = await Job.find({ postedBy: userId })
      .sort({ postedDate: -1 }) // Newest first
      .lean();
    
    console.log(`Found ${jobs.length} jobs for this user`);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET applications for a specific job (if user is the owner)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    if (!isValidObjectId(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the authenticated user is the owner of this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view these applications' });
    }
    
    // Fetch applications
    const applications = await JobApplication.find({ jobId })
      .populate('applicantId', 'userName email')
      .sort({ appliedDate: -1 })
      .lean();
    
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
