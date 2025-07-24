import mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quality: { type: String, required: true },
  image: { type: String, required: true },
  flagColor: { type: String, required: true },
  flagText: { type: String, required: true },
  category: { type: String, required: true },
  farm: { type: String, required: true },
  description: { type: String, required: true },
  prices: [PriceSchema],
  video: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);