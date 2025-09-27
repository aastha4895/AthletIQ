const express = require('express');
const { adminAuth } = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

const router = express.Router();

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalAthletes = await User.countDocuments({ role: 'athlete' });
    const totalAssessments = await Assessment.countDocuments();
    const pendingReviews = await Assessment.countDocuments({ status: 'flagged' });
    
    res.json({
      totalAthletes,
      totalAssessments,
      pendingReviews
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;