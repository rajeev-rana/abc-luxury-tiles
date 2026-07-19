const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const offlineDb = require('../utils/offlineDb');

const JWT_SECRET = process.env.JWT_SECRET || 'abc_secret_key';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, companyName, gstin, address } = req.body;

    if (mongoose.connection.readyState !== 1) {
      // Offline mode registration
      let user = offlineDb.findOne('users', { email });
      if (user) {
        return res.status(400).json({ error: 'User already exists with this email (Offline Mode)' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = offlineDb.insert('users', {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        phone,
        companyName,
        gstin,
        address: address || {},
        loyaltyPoints: 0
      });

      const payload = {
        id: newUser._id,
        role: newUser.role,
        name: newUser.name
      };

      return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            loyaltyPoints: newUser.loyaltyPoints
          }
        });
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user instance
    user = new User({
      name,
      email,
      password,
      role: role || 'user',
      phone,
      companyName,
      gstin,
      address
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT
    const payload = {
      id: user._id,
      role: user.role,
      name: user.name
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints
        }
      });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      // Offline mode login
      const user = offlineDb.findOne('users', { email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid Credentials (Offline Mode)' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid Credentials (Offline Mode)' });
      }

      const payload = {
        id: user._id,
        role: user.role,
        name: user.name
      };

      return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            loyaltyPoints: user.loyaltyPoints
          }
        });
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    // Create JWT
    const payload = {
      id: user._id,
      role: user.role,
      name: user.name
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints
        }
      });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get User Profile (Protected)
router.get('/profile', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Offline mode profile fetch
      const user = offlineDb.findById('users', req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found (Offline Mode)' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

module.exports = router;
