const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Helper function to check if Object ID is valid
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// POST create a new job application
exports.createApplication = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { jobId } = req.params;
    
    if (!isValidObjectId(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user has already applied to this job
    const existingApplication = await JobApplication.findOne({
      jobId,
      applicantId: req.user.id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    
    // Extract data from request body
    const {
      applicantName,
      email,
      phone,
      experience,
      coverLetter,
      resume
    } = req.body;
    
    // Create new application
    const newApplication = new JobApplication({
      jobId,
      applicantId: req.user.id,
      applicantName,
      email,
      phone,
      experience,
      coverLetter,
      resume,
      status: 'pending',
      appliedDate: new Date()
    });
    
    // Save to database
    const savedApplication = await newApplication.save();
    
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error creating application:', error);
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

// GET all applications submitted by the authenticated user
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ applicantId: req.user.id })
      .populate({
        path: 'jobId',
        select: 'jobTitle companyName location salary category postedDate',
        populate: {
          path: 'postedBy',
          select: 'userName'
        }
      })
      .sort({ appliedDate: -1 })
      .lean();
    
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single application by ID (if user is the applicant or job owner)
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid application ID format' });
    }
    
    const application = await JobApplication.findById(id)
      .populate({
        path: 'jobId',
        select: 'jobTitle companyName location salary category postedDate postedBy'
      })
      .lean();
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the authenticated user is the applicant or the job owner
    const isApplicant = application.applicantId.toString() === req.user.id;
    const isJobOwner = application.jobId.postedBy.toString() === req.user.id;
    
    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({ message: 'You are not authorized to view this application' });
    }
    
    res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT update application status (only job owner can do this)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid application ID format' });
    }
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Find application
    const application = await JobApplication.findById(id).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the authenticated user is the job owner
    if (application.jobId.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this application' });
    }
    
    // Update status
    application.status = status;
    
    // Save to database
    const updatedApplication = await application.save();
    
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE an application (only the applicant can delete their application)
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid application ID format' });
    }
    
    // Find application
    const application = await JobApplication.findById(id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the authenticated user is the applicant
    if (application.applicantId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this application' });
    }
    
    // Delete the application
    await JobApplication.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
