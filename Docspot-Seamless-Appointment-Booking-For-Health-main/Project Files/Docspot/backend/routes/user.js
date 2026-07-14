const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../utils/userController');
const { protect } = require('../utils/middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Optional: Quick admin bootstrap
router.post('/create-admin', async (req, res) => {
  const User = require('../models/User');
  try {
    const exists = await User.findOne({ email: 'admin@docspot.com' });
    if (exists) return res.status(400).json({ message: 'Admin exists' });

    await User.create({
      name: 'Admin User',
      email: 'admin@docspot.com',
      password: 'admin123',
      role: 'admin',
    });

    res.status(201).json({ message: 'Admin created' });
  } catch {
    res.status(500).json({ message: 'Admin creation failed' });
  }
});

module.exports = router;
