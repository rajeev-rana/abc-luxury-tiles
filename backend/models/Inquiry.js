const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  businessType: { 
    type: String, 
    required: true,
    enum: ['Dealer', 'Distributor', 'Builder', 'Architect', 'Interior Designer', 'Contractor'] 
  },
  companyName: { type: String },
  city: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed', 'Contacted', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
