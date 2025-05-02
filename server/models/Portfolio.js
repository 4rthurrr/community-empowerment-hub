// models/Portfolio.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters'],
    match: [/^[A-Za-z\s\-',.]+$/, 'Product name can only contain letters, spaces, and basic punctuation']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [20, 'Description should be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    max: [1000000, 'Price cannot exceed 1,000,000 LKR']
  },
  image: {
    type: String,
    required: [false, 'Image URL is required'],
    // validate: {
    //   validator: function(v) {
    //     return /^(https?:\/\/).+\.(jpe?g|png|webp)$/i.test(v);
    //   },
    //   message: props => `${props.value} is not a valid image URL!`
    // }
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    required: [true, 'Review count is required'],
    min: [0, 'Review count cannot be negative']
  },
  sold: {
    type: Number,
    required: [true, 'Sold units count is required'],
    min: [0, 'Sold units cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['topRated', 'bestSelling', 'specialCollection'],
      message: 'Invalid product category'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  craftType: {
    type: String,
    required: [true, 'Craft type is required'],
    trim: true,
    minlength: [3, 'Craft type must be at least 3 characters'],
    maxlength: [50, 'Craft type cannot exceed 50 characters'],
    match: [/^[A-Za-z\s\-',.]+$/, 'Craft type can only contain letters, spaces, and basic punctuation']
  },
  materials: {
    type: [String],
    required: [true, 'At least one material is required'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(item => item.trim().length > 0);
      },
      message: 'Materials array cannot be empty'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
portfolioSchema.index({ category: 1, featured: 1 });
portfolioSchema.index({ name: 'text', description: 'text' });

// Update timestamp before saving
portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);