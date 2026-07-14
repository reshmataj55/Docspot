const User = require('../models/User');
const generateToken = require('./generateToken');

// Register user/doctor/admin
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!['user', 'doctor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Fixed: Wrap user info inside a user object for frontend
    res.status(200).json({
      token: generateToken(user._id),
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch {
    res.status(500).json({ message: 'Profile fetch failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
