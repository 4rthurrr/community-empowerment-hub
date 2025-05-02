const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: [3, 'Job title must be at least 3 characters'],
    maxlength: [100, 'Job title must be less than 100 characters']
  },
  companyName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    minlength: [3, 'Organization name must be at least 3 characters'],
    maxlength: [100, 'Organization name must be less than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters'],
    maxlength: [50, 'Location must be less than 50 characters']
  },
  salary: {
    type: Number,
    min: [0, 'Salary must be a positive number'],
    max: [1000000, 'Salary value is too high']
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    minlength: [50, 'Job description must be at least 50 characters'],
    maxlength: [1000, 'Job description must be less than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Trades', 'Crafts', 'Agriculture', 'Education', 'Healthcare', 'Culinary'],
      message: '{VALUE} is not a valid category'
    }
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Job must be associated with a user']
  }
}, { timestamps: true });

// Create indexes for efficient querying
JobSchema.index({ location: 1 });
JobSchema.index({ category: 1 });
JobSchema.index({ postedBy: 1 });
JobSchema.index({ jobTitle: 'text', companyName: 'text', jobDescription: 'text' });

module.exports = mongoose.model('Job', JobSchema);
