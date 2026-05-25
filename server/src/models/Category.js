const mongoose = require('mongoose');
// ============================================
// 3. Category (دسته‌بندی) - بهبود یافته
// ============================================
const categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleEn: { type: String, default: null },     // ⭐ برای چندزبانه
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    icon: { type: String, default: null },        // ⭐ آیکون emoji یا آدرس عکس
    description: { type: String, default: null }   // ⭐ توضیحات دسته
});

module.exports = mongoose.model('Category', categorySchema);