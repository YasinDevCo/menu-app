const mongoose = require('mongoose');

// ============================================
// 9. Staff (پرسنل با دسترسی‌های مختلف) - جدید
// ============================================
const staffSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['ADMIN', 'MANAGER', 'KITCHEN', 'WAITER', 'CASHIER'],
        default: 'WAITER'
    },
    permissions: {
        canManageMenu: { type: Boolean, default: false },
        canViewOrders: { type: Boolean, default: true },
        canChangeOrderStatus: { type: Boolean, default: false },
        canManageStaff: { type: Boolean, default: false },
        canViewReports: { type: Boolean, default: false },
        canManageFinance: { type: Boolean, default: false }
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);