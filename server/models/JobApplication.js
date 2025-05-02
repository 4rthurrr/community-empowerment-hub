const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required']
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant reference is required']
  },
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^0[0-9]{9}$|^\+94[0-9]{9}$|^07[0-9]-[0-9]{3}-[0-9]{4}$/, 'Please enter a valid Sri Lankan phone number']
  },
  experience: {
    type: String,
    required: [true, 'Experience information is required'],
    trim: true,
    minlength: [20, 'Experience details must be at least 20 characters'],
    maxlength: [500, 'Experience details must be less than 500 characters']
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    trim: true,
    minlength: [50, 'Cover letter must be at least 50 characters'],
    maxlength: [1000, 'Cover letter must be less than 1000 characters']
  },
  resume: {
    type: String, // URL or file path
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for efficient querying
JobApplicationSchema.index({ jobId: 1 });
JobApplicationSchema.index({ applicantId: 1 });
JobApplicationSchema.index({ status: 1 });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
