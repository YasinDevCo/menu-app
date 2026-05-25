// ============================================
// 1. Business (رستوران/کافه) - بهبود یافته
// ============================================
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    // اطلاعات پایه (همان مدل شما)
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true, match: /^09[0-9]{9}$/ },
    password: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    logoUrl: { type: String, default: null },
    
    // تنظیمات ظاهری (همان)
    primaryColor: { type: String, default: "#ff5722" },
    isDark: { type: Boolean, default: false },
    
    // ⭐ اضافه شده: تنظیمات مالیاتی و خدمت
    settings: {
        taxRate: { type: Number, default: 9 },      // مالیات (درصد)
        serviceFee: { type: Number, default: 0 },    // خدمات (درصد یا عدد ثابت)
        serviceFeeType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
        currency: { type: String, default: 'تومان' },
        language: { type: String, enum: ['fa', 'en', 'ar'], default: 'fa' }
    },
    
    // ⭐ اضافه شده: تنظیمات پرداخت آنلاین
    paymentSettings: {
        merchantId: { type: String, default: null },  // برای زرین‌پال
        isEnabled: { type: Boolean, default: false },
        gateway: { type: String, enum: ['zarinpal', 'idpay', 'nextpay'], default: 'zarinpal' }
    },
    
    // ⭐ اضافه شده: اطلاعات سئو و اشتراک
    seo: {
        description: String,
        keywords: [String]
    },
    
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null }  // برای نسخه آزمایشی
});

module.exports = mongoose.model('Business', businessSchema);