const mongoose = require('mongoose');

// ============================================
// 2. Table (مدیریت میزها) - کاملاً جدید
// ============================================
const tableSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    tableNumber: { type: Number, required: true },
    qrCodeUrl: { type: String, required: true },  // لینک QR کد
    isActive: { type: Boolean, default: true },
    capacity: { type: Number, default: 4 },       // ظرفیت میز
    section: { type: String, default: 'main' },   // بخش: حیاط، سالن، تراس
    createdAt: { type: Date, default: Date.now }
});

// ترکیب businessId + tableNumber باید یکتا باشد
tableSchema.index({ businessId: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);