const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

// Create Order (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalArea, wastePercent, boxesRequired, pricing, billingAddress, gstin, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Cannot place an order.' });
    }

    // Verify products and build items list
    let orderItems = [];
    for (let i = 0; i < items.length; i++) {
      const dbProduct = await Product.findById(items[i].product);
      if (!dbProduct) {
        return res.status(404).json({ error: `Product with ID ${items[i].product} not found.` });
      }
      orderItems.push({
        product: dbProduct._id,
        quantity: items[i].quantity,
        size: items[i].size || dbProduct.size,
        price: dbProduct.discountPrice || dbProduct.price
      });
    }

    const newOrder = new Order({
      user: req.user.id,
      items: orderItems,
      totalArea,
      wastePercent,
      boxesRequired,
      pricing,
      billingAddress,
      gstin,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed' // Mock payment completion
    });

    const order = await newOrder.save();

    // Reward Loyalty Points (1 point per 100 Rs of subtotal)
    const pointsAwarded = Math.floor((pricing.subtotal || 0) / 100);
    if (pointsAwarded > 0) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { loyaltyPoints: pointsAwarded }
      });
    }

    res.status(201).json({ message: 'Order created successfully', order, loyaltyPointsEarned: pointsAwarded });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error processing checkout order' });
  }
});

// Get User Orders (Protected)
// If admin: return all orders. Otherwise: return user's orders.
router.get('/', auth, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('user', 'name email role companyName')
        .populate('items.product', 'name category image brand')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: req.user.id })
        .populate('items.product', 'name category image brand')
        .sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching order history' });
  }
});

// Update Order Delivery/Payment Status (Admin Only)
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { deliveryStatus, paymentStatus } = req.body;
    
    let updateFields = {};
    if (deliveryStatus) updateFields.deliveryStatus = deliveryStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating order status' });
  }
});

module.exports = router;
