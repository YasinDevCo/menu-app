// ============================================
// 5. Order (سفارش) - بهبود یافته کامل
// ============================================
const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },          // ⭐ اسنپ‌شات اسم
    quantity: { type: Number, required: true, min: 1 },
    priceAtTime: { type: Number, required: true },
    
    // ⭐ اضافه شده: جزئیات سفارشی‌سازی
    selectedOptions: [{
        optionName: String,
        choiceName: String,
        extraPrice: Number
    }],
    selectedAddons: [{
        name: String,
        price: Number
    }],
    note: { type: String, default: null },           // توضیحات اضافه
    
    itemTotal: { type: Number, required: true }      // قیمت نهایی این آیتم (با تخفیف و اضافات)
});

const orderSchema = new mongoose.Schema({
    // اطلاعات پایه (همان)
    tableNumber: { type: Number, required: true },   // تغییر به Number
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    items: [orderItemSchema],
    
    // محاسبات مالی کامل
    subtotal: { type: Number, required: true },       // جمع آیتم‌ها
    discountAmount: { type: Number, default: 0 },     // مقدار تخفیف
    taxAmount: { type: Number, default: 0 },          // مالیات
    serviceFeeAmount: { type: Number, default: 0 },   // هزینه خدمات
    totalAmount: { type: Number, required: true },    // مبلغ نهایی
    
    // وضعیت سفارش (تکمیل‌شده)
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED', 'COMPLETED'],
        default: 'PENDING'
    },
    
    // ⭐ اضافه شده: وضعیت هر آیتم (برای آشپزخانه)
    itemStatuses: [{
        productId: mongoose.Schema.Types.ObjectId,
        status: { type: String, enum: ['PENDING', 'PREPARING', 'READY', 'DELIVERED'], default: 'PENDING' }
    }],
    
    // ⭐ اضافه شده: اطلاعات پرداخت
    payment: {
        method: { type: String, enum: ['CASH', 'ONLINE', 'POS', 'WALLET'], default: 'CASH' },
        status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
        transactionId: { type: String, default: null },  // برای پیگیری آنلاین
        paidAt: { type: Date, default: null }
    },
    
    // ⭐ اضافه شده: کوپن تخفیف
    coupon: {
        code: String,
        discountAmount: Number
    },
    
    // ⭐ اضافه شده: فراخوان گارسون
    callWaiter: {
        isActive: { type: Boolean, default: false },
        message: { type: String, default: null },
        calledAt: Date,
        respondedAt: Date
    },
    
    // ⭐ اضافه شده: اطلاعات مشتری (برای CRM)
    customer: {
        phoneNumber: { type: String, match: /^09[0-9]{9}$/ },
        name: String,
        note: String
    },
    
    // زمان‌بندی
    createdAt: { type: Date, default: Date.now },
    confirmedAt: Date,
    preparingAt: Date,
    readyAt: Date,
    deliveredAt: Date,
    canceledAt: Date,
    completedAt: Date,
    
    // یادداشت داخلی (برای آشپزخانه)
    kitchenNote: { type: String, default: null },
    canceledReason: { type: String, default: null }
});

// ایندکس‌ها برای سرعت بالا
orderSchema.index({ businessId: 1, createdAt: -1 });
orderSchema.index({ status: 1, tableNumber: 1 });
orderSchema.index({ 'payment.status': 1 });

module.exports = mongoose.model('Order', orderSchema);