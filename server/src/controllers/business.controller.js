const Business = require('../models/Business');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// ========== Helper Functions ==========
const generateToken = (id) => {
    return jwt.sign({ id, type: 'business' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ========== Register ==========
exports.register = catchAsync(async (req, res, next) => {
    const { name, ownerName, phoneNumber, password, slug } = req.body;

    const existingBusiness = await Business.findOne({ $or: [{ phoneNumber }, { slug }] });
    if (existingBusiness) {
        return next(new AppError('این شماره یا اسلاگ قبلاً ثبت شده است', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const business = await Business.create({
        name,
        ownerName,
        phoneNumber,
        password: hashedPassword,
        slug
    });

    const token = generateToken(business._id);

    res.status(201).json({
        success: true,
        token,
        business: {
            id: business._id,
            name: business.name,
            slug: business.slug,
            phoneNumber: business.phoneNumber,
            ownerName: business.ownerName,
            logoUrl: business.logoUrl
        }
    });
});

// ========== Login ==========
exports.login = catchAsync(async (req, res, next) => {
    const { phoneNumber, password } = req.body;

    const business = await Business.findOne({ phoneNumber });
    if (!business) {
        return next(new AppError('شماره موبایل یا رمز عبور اشتباه است', 401));
    }

    const isPasswordCorrect = await bcrypt.compare(password, business.password);
    if (!isPasswordCorrect) {
        return next(new AppError('شماره موبایل یا رمز عبور اشتباه است', 401));
    }

    const token = generateToken(business._id);

    res.status(200).json({
        success: true,
        token,
        business: {
            id: business._id,
            name: business.name,
            slug: business.slug,
            phoneNumber: business.phoneNumber,
            ownerName: business.ownerName,
            logoUrl: business.logoUrl
        }
    });
});

// ========== Get Profile ==========
exports.getProfile = catchAsync(async (req, res, next) => {
    const business = await Business.findById(req.businessId).select('-password');

    res.status(200).json({
        success: true,
        business
    });
});

// ========== Update Profile ==========
exports.updateProfile = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const updates = req.body;

    // فیلدهای قابل به‌روزرسانی (ownerName را حذف کردم چون required است)
    const allowedFields = ['name', 'phoneNumber', 'slug', 'primaryColor', 'isDark'];
    const filteredUpdates = {};

    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            filteredUpdates[field] = updates[field];
        }
    });

    // اگر عکس آپلود شده
    if (req.file && req.file.location) {
        filteredUpdates.logoUrl = req.file.location;
    }

    const business = await Business.findByIdAndUpdate(
        businessId,
        filteredUpdates,
        { new: true, runValidators: false }  // ← runValidators: false برای جلوگیری از خطای ownerName
    ).select('-password');

    const token = generateToken(business._id);

    res.status(200).json({
        success: true,
        token,
        business
    });
});

// ========== Change Password ==========
exports.changePassword = catchAsync(async (req, res, next) => {
    const businessId = req.businessId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new AppError('رمز عبور فعلی و جدید الزامی است', 400));
    }

    if (newPassword.length < 6) {
        return next(new AppError('رمز عبور جدید باید حداقل 6 کاراکتر باشد', 400));
    }

    const business = await Business.findById(businessId).select('+password');

    if (!business) {
        return next(new AppError('کاربر یافت نشد', 404));
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, business.password);
    if (!isPasswordCorrect) {
        return next(new AppError('رمز عبور فعلی اشتباه است', 401));
    }

    business.password = await bcrypt.hash(newPassword, 12);
    await business.save();

    res.status(200).json({
        success: true,
        message: 'رمز عبور با موفقیت تغییر کرد'
    });
});