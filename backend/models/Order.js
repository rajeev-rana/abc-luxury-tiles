const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }, // Box count or pieces
    size: { type: String },
    price: { type: Number, required: true }
  }],
  totalArea: { type: Number }, // in sq ft or sq mt
  wastePercent: { type: Number, default: 10 }, // e.g. 5, 10, 15
  boxesRequired: { type: Number },
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true }, // GST
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  billingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  gstin: { type: String }, // Commercial billing info
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'UPI', 'Card', 'NetBanking', 'Wallet'], 
    default: 'COD' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'], 
    default: 'Pending' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
