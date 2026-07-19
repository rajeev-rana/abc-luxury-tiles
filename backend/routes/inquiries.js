const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const { auth, adminOnly } = require('../middleware/auth');
const offlineDb = require('../utils/offlineDb');

// Create B2B / Dealer Inquiry (Open Access)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, businessType, companyName, city, message } = req.body;
    
    if (!name || !email || !phone || !businessType) {
      return res.status(400).json({ error: 'Please provide all required fields (name, email, phone, businessType)' });
    }

    if (mongoose.connection.readyState !== 1) {
      const inquiry = offlineDb.insert('inquiries', {
        name,
        email,
        phone,
        businessType,
        companyName,
        city,
        message,
        status: 'Pending'
      });
      return res.status(201).json({ message: 'Inquiry submitted successfully (Offline Mode)', inquiry });
    }

    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      businessType,
      companyName,
      city,
      message
    });

    const inquiry = await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving inquiry request' });
  }
});

// Get All Inquiries (Admin Only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const inquiries = offlineDb.find('inquiries').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Format response to match mongoose object shapes
      const formatted = inquiries.map(inq => ({
        id: inq._id, // For admin frontend compatibility
        _id: inq._id,
        name: inq.name,
        email: inq.email,
        phone: inq.phone,
        businessType: inq.businessType,
        companyName: inq.companyName,
        city: inq.city,
        message: inq.message,
        status: inq.status,
        createdAt: inq.createdAt,
        updatedAt: inq.updatedAt
      }));
      return res.json(formatted);
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving inquiries' });
  }
});

// Update Inquiry Status (Admin Only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Please provide status update' });
    }

    if (mongoose.connection.readyState !== 1) {
      const inquiry = offlineDb.findByIdAndUpdate('inquiries', req.params.id, { status });
      if (!inquiry) {
        return res.status(404).json({ error: 'Inquiry record not found' });
      }
      return res.json({ message: 'Inquiry status updated successfully (Offline Mode)', inquiry });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry record not found' });
    }

    res.json({ message: 'Inquiry status updated successfully', inquiry });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating inquiry status' });
  }
});

module.exports = router;
