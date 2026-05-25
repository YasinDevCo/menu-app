const mongoose = require('mongoose');
// ============================================
// 4. Product (محصولات) - بهبود یافته
// ============================================
const productSchema = new mongoose.Schema({
    // اطلاعات پایه (همان مدل شما)
    name: { type: String, required: true },
    nameEn: { type: String, default: null },       // ⭐ چندزبانه
    description: { type: String, default: null },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    imageUrl: { type: String, default: null },
    isAvailable: { type: Boolean, default: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    // ⭐ اضافه شده: موجودی انبار (برای فاز ۴)
    stock: {
        quantity: { type: Number, default: -1 },   // -1 یعنی نامحدود
        trackInventory: { type: Boolean, default: false }
    },

    // ⭐ اضافه شده: امکانات سفارشی‌سازی (برای پیتزا، قهوه)
    customization: {
        hasOptions: { type: Boolean, default: false },
        options: [{
            name: String,                          // مثلاً "اندازه"
            choices: [{
                name: String,                      // "بزرگ", "متوسط"
                extraPrice: Number                  // 20000, 0
            }],
            required: { type: Boolean, default: false }
        }],
        addons: [{                                 // مواد اضافی
            name: String,                          // "پنیر اضافه"
            price: Number,                         // 15000
            maxSelect: { type: Number, default: 3 }
        }]
    },

    // ⭐ اضافه شده: زمان آماده‌سازی
    preparationTime: { type: Number, default: 15 },  // دقیقه

    // ⭐ اضافه شده: آماری
    salesCount: { type: Number, default: 0 },        // تعداد فروش
    rating: { type: Number, default: 0 },            // میانگین امتیاز

    priority: { type: Number, default: 0 },          // ترتیب نمایش

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);