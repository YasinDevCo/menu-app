const Coupon = require('../models/Coupon');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// دریافت لیست کوپن‌ها
exports.getCoupons = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const coupons = await Coupon.find({ businessId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});

// دریافت یک کوپن
exports.getCoupon = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const { id } = req.params;

    const coupon = await Coupon.findOne({ _id: id, businessId });
    if (!coupon) {
        return next(new AppError('کوپن یافت نشد', 404));
    }

    res.status(200).json({
        success: true,
        data: coupon
    });
});

// ایجاد کوپن جدید
exports.createCoupon = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const { code, type, value, minOrderAmount, maxDiscountAmount, usageLimit, validUntil } = req.body;

    // بررسی تکراری نبودن کد
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase(), businessId });
    if (existingCoupon) {
        return next(new AppError('این کد تخفیف قبلاً ثبت شده است', 400));
    }

    const coupon = await Coupon.create({
        businessId,
        code: code.toUpperCase(),
        type,
        value,
        minOrderAmount: minOrderAmount || 0,
        maxDiscountAmount: maxDiscountAmount || null,
        usageLimit: usageLimit || 1,
        validUntil: new Date(validUntil),
        isActive: true
    });

    res.status(201).json({
        success: true,
        data: coupon
    });
});

// ویرایش کوپن
exports.updateCoupon = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const { id } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findOne({ _id: id, businessId });
    if (!coupon) {
        return next(new AppError('کوپن یافت نشد', 404));
    }

    // جلوگیری از تغییر businessId
    delete updates.businessId;
    delete updates._id;

    Object.assign(coupon, updates);
    await coupon.save();

    res.status(200).json({
        success: true,
        data: coupon
    });
});

// حذف کوپن
exports.deleteCoupon = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const { id } = req.params;

    const coupon = await Coupon.findOne({ _id: id, businessId });
    if (!coupon) {
        return next(new AppError('کوپن یافت نشد', 404));
    }

    await coupon.deleteOne();

    res.status(200).json({
        success: true,
        message: 'کوپن با موفقیت حذف شد'
    });
});

// اعتبارسنجی و اعمال کوپن (برای سبد خرید)
exports.validateCoupon = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
        return next(new AppError('کد تخفیف و مبلغ سفارش الزامی است', 400));
    }

    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        businessId,
        isActive: true
    });

    if (!coupon) {
        return next(new AppError('کد تخفیف نامعتبر است', 404));
    }

    // بررسی زمان اعتبار
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
        return next(new AppError('کد تخفیف منقضی شده است', 400));
    }

    // بررسی حداقل مبلغ سفارش
    if (orderAmount < coupon.minOrderAmount) {
        return next(new AppError(`حداقل مبلغ سفارش برای این کد ${coupon.minOrderAmount.toLocaleString()} تومان است`, 400));
    }

    // بررسی تعداد استفاده
    if (coupon.usedCount >= coupon.usageLimit) {
        return next(new AppError('تعداد استفاده از این کد تخفیف به پایان رسیده است', 400));
    }

    // محاسبه مبلغ تخفیف
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
        discountAmount = (orderAmount * coupon.value) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
        }
    } else {
        discountAmount = Math.min(coupon.value, orderAmount);
    }

    res.status(200).json({
        success: true,
        data: {
            coupon: {
                id: coupon._id,
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                discountAmount: Math.round(discountAmount)
            }
        }
    });
});

// استفاده از کوپن (افزایش count)
exports.useCoupon = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const { couponId } = req.body;

    const coupon = await Coupon.findOne({ _id: couponId, businessId });
    if (!coupon) {
        return next(new AppError('کوپن یافت نشد', 404));
    }

    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
        success: true,
        message: 'کوپن با موفقیت اعمال شد'
    });
});