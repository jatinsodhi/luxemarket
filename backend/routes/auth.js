const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Mock function to simulate sending emails
const sendEmail = async (email, subject, text) => {
    console.log(`------------------------------------`);
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log(`------------------------------------`);
    return true;
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @desc Auth user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified && !email.includes('admin')) {
        // In production, you might force verification here
        // return res.status(401).json({ message: 'Please verify your email first' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc Register a new user and send OTP
router.post('/signup', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({ 
      name, 
      email, 
      password, 
      phoneNumber, 
      otp,
      isVerified: false 
  });

  if (user) {
    await sendEmail(email, 'LuxeMarket Verification Code', `Your OTP is: ${otp}`);
    res.status(201).json({ message: 'User created. Please verify OTP.', email: user.email });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc Verify OTP
router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp === otp) {
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin,
            isVerified: true,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

module.exports = router;