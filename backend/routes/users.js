const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;