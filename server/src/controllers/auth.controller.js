const Business = require('../models/Business');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const generateToken = (id) => {
  return jwt.sign({ id, type: 'business' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

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
      phoneNumber: business.phoneNumber
    }
  });
});

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
      phoneNumber: business.phoneNumber
    }
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const business = await Business.findById(req.businessId).select('-password');
  res.status(200).json({ success: true, data: business });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;
  const updates = req.body;

  const allowedFields = ['name', 'ownerName', 'phoneNumber', 'slug', 'primaryColor', 'isDark'];
  const filteredUpdates = {};

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  if (req.file) {
    filteredUpdates.logoUrl = `/uploads/business/${req.file.filename}`;
  }

  const business = await Business.findByIdAndUpdate(
    businessId,
    filteredUpdates,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    business
  });
});