const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth, adminOnly } = require('../middleware/auth');

// Submit Product Review (Open Access / User Verification)
router.post('/', async (req, res) => {
  try {
    const { product, name, email, rating, comment, images, video, isVerified } = req.body;

    if (!product || !name || !rating || !comment) {
      return res.status(400).json({ error: 'Please provide all required fields (product, name, rating, comment)' });
    }

    const newReview = new Review({
      product,
      name,
      email,
      rating: Number(rating),
      comment,
      images,
      video,
      isVerified: isVerified || false
    });

    const review = await newReview.save();
    res.status(201).json({ message: 'Review submitted for moderation.', review });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving product review' });
  }
});

// Get Approved Reviews for a Specific Product (Public)
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'Approved' })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching product reviews' });
  }
});

// Get All Reviews (Admin Only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name SKU brand')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching reviews for moderation' });
  }
});

// Moderate Review (Admin Only)
router.put('/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid moderation status (must be Approved or Rejected)' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: `Review has been marked as ${status}`, review });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error moderating review' });
  }
});

module.exports = router;
