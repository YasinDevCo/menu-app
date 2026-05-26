const mongoose = require('mongoose');

// ============================================
// 8. Coupon (تخفیف‌های پیشرفته) - کاملاً جدید
// ============================================
const couponSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
    value: { type: Number, required: true },  // 15 برای 15% یا 50000 برای 50هزار
    
    // محدودیت‌ها
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: null },  // حداکثر تخفیف
    usageLimit: { type: Number, default: 1 },            // حداکثر استفاده
    usedCount: { type: Number, default: 0 },
    
    // زمان اعتبار
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    
    // محدودیت به محصول خاص
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],  // خالی یعنی همه محصولات
    
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);