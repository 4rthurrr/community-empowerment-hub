const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const {
      userName,
      email,
      phone,
      bio,
      location,
      profileImage,
      interestedCategories,
      emailNotifications,
      orderUpdates,
      promotions,
      newsletter
    } = req.body;

    // Prepare profile fields object
    const profileFields = {};
    
    // Only include fields that were provided in the request
    if (userName) profileFields.userName = userName;
    if (email) profileFields.email = email;
    if (phone !== undefined) profileFields.phone = phone;
    if (bio !== undefined) profileFields.bio = bio;
    if (location !== undefined) profileFields.location = location;
    if (profileImage !== undefined) profileFields.profileImage = profileImage;
    if (interestedCategories) profileFields.interestedCategories = interestedCategories;
    
    // Update notification preferences if provided
    if (emailNotifications !== undefined) profileFields.emailNotifications = emailNotifications;
    if (orderUpdates !== undefined) profileFields.orderUpdates = orderUpdates;
    if (promotions !== undefined) profileFields.promotions = promotions;
    if (newsletter !== undefined) profileFields.newsletter = newsletter;
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This username or email is already taken'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user from database
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Deactivate account
exports.deactivateAccount = async (req, res) => {
  try {
    // Instead of deleting, set isActive to false
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { isActive: false } },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
    
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
