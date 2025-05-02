const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Environment variables should be used for the secret
const JWT_SECRET = process.env.JWT_SECRET || 'community-empowerment-secret-key';

/**
 * Middleware to authenticate user JWT tokens
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user with that id and check if token is still valid
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }
    
    // Add user data to request object
    req.user = user;
    req.user.id = user._id; // For convenience
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    
    res.status(500).json({ message: 'Server authentication error.' });
  }
};

module.exports = authenticateUser;
