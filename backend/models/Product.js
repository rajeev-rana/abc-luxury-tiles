const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Ceramic Tiles, Vitrified Tiles, Granite, Marble, Sanitaryware
  brand: { type: String, required: true }, // e.g. ABC Luxury, Kajaria, Somany
  finish: { type: String }, // e.g. Glossy, Matt, Satin, Rustic, Carving, Metallic
  material: { type: String }, // e.g. Ceramic, Vitrified, Porcelain, Double Charge, Quartzite
  surface: { type: String }, // e.g. Glazed, Polished, Unpolished
  color: { type: String },
  thickness: { type: String }, // e.g. 9mm, 12mm, 15mm
  size: { type: String, required: true }, // e.g. 600x600 mm, 600x1200 mm
  shape: { type: String }, // e.g. Square, Rectangular, Hexagonal
  weight: { type: String }, // e.g. 15 kg/box
  sku: { type: String, unique: true },
  description: { type: String },
  specifications: { type: Map, of: String }, // key-value for specific technical sheets
  applications: [{ type: String }], // e.g. ["Living Room", "Bathroom", "Outdoor", "Wall", "Floor"]
  installationGuide: { type: String },
  cleaningGuide: { type: String },
  warranty: { type: String },
  stockStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  availability: { type: Number, default: 100 }, // Number of boxes/pieces available
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  images: [{ type: String }], // URL links to Cloudinary images
  viewsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
