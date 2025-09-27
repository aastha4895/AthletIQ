const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No valid token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'athletiq_secret_key');
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Access denied. User not found.'
      });
    }

    // Add user info to request
    req.userId = decoded.userId;
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied. Token expired.'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error during authentication.'
    });
  }
};

// Admin role check middleware
const adminAuth = async (req, res, next) => {
  try {
    // First run regular auth
    await auth(req, res, () => {});
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied. Admin privileges required.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error during admin authentication.'
    });
  }
};

// Coach role check middleware
const coachAuth = async (req, res, next) => {
  try {
    // First run regular auth
    await auth(req, res, () => {});
    
    // Check if user is coach or admin
    if (!['coach', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Coach privileges required.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Coach auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error during coach authentication.'
    });
  }
};

module.exports = {
  auth,
  adminAuth,
  coachAuth
};