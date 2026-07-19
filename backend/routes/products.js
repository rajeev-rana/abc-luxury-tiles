const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

// Get All Products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, finish, color, search, brand, size, usage, minPrice, maxPrice, isFeatured, isNewArrival, isTrending, limit, page } = req.query;
    
    let query = {};

    // Apply filters
    if (category) query.category = category;
    if (finish) query.finish = finish;
    if (color) query.color = { $regex: color, $options: 'i' };
    if (brand) query.brand = brand;
    if (size) query.size = size;
    
    if (usage) {
      query.applications = { $in: [usage] };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (isNewArrival) query.isNewArrival = isNewArrival === 'true';
    if (isTrending) query.isTrending = isTrending === 'true';

    // Search query (matches name or SKU or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageSize = Number(limit) || 12;
    const pageNum = Number(page) || 1;
    const skip = (pageNum - 1) * pageSize;

    const products = await Product.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / pageSize),
      totalProducts: total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// Get Single Product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Increment view count
    product.viewsCount = (product.viewsCount || 0) + 1;
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching product details' });
  }
});

// Create Product (Admin Only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating product' });
  }
});

// Update Product (Admin Only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating product' });
  }
});

// Delete Product (Admin Only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting product' });
  }
});

module.exports = router;
