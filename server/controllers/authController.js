const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, preferredLanguage, preferredMood } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email,
      password,
      preferredLanguage,
      preferredMood,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        preferredMood: user.preferredMood,
      },
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        preferredLanguage: user.preferredLanguage,
        preferredMood: user.preferredMood,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      name: user.name,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
      preferredMood: user.preferredMood,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
