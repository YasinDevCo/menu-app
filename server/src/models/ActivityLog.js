// ============================================
// 10. ActivityLog (لاگ تمام فعالیت‌ها) - جدید
// ============================================
const activityLogSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId },  // می‌تواند Staff یا مشتری باشد
    userType: { type: String, enum: ['STAFF', 'CUSTOMER', 'SYSTEM'] },
    action: { type: String, required: true },  // "ORDER_CREATED", "ORDER_STATUS_CHANGED", "PRODUCT_ADDED"
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now, expires: 86400 }  // 30 روز نگهداری
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);