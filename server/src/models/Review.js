const mongoose = require('mongoose');

// ============================================
// 7. Review (نظرات و امتیازات) - کاملاً جدید
// ============================================
const reviewSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },  // فقط مشتریانی که خرید کرده‌اند
    customerPhone: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: null },
    images: [{ type: String }],  // آدرس عکس‌ها
    reply: {
        text: String,
        repliedAt: Date,
        repliedBy: mongoose.Schema.Types.ObjectId  // ادمین
    },
    isVerified: { type: Boolean, default: false },  // خرید تأیید شده
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ productId: 1, rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);