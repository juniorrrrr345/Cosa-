import mongoose from 'mongoose';

const ShopConfigSchema = new mongoose.Schema({
  background: { type: String, required: true },
  theme: { type: String, default: 'dark' },
  shopName: { type: String, default: 'BIPCOSA06' },
  telegramLink: { type: String, default: 'https://t.me/bipcosa06' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ShopConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ShopConfig || mongoose.model('ShopConfig', ShopConfigSchema);