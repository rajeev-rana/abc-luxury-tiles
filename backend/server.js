const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to ABC Luxury Tiles & Ceramics API" });
});

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const inquiryRoutes = require('./routes/inquiries');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Connect to MongoDB & Start Server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/abc_luxury_tiles';
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    // Start server anyway for mock mode purposes
    app.listen(PORT, () => {
      console.log(`Backend server running in offline mode on port ${PORT} (Database connection failed)`);
    });
  });
