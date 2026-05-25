const jwt = require('jsonwebtoken');
const Business = require('../models/Business');
// const Staff = require('../models/Staff'); // فعلاً غیرفعال
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new AppError('وارد حساب کاربری خود شوید', 401));
  }
  
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('توکن نامعتبر است', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('توکن منقضی شده است. دوباره وارد شوید', 401));
    }
    return next(new AppError('خطا در احراز هویت', 401));
  }
  
  if (!decoded.id) {
    return next(new AppError('توکن نامعتبر است', 401));
  }
  
  const business = await Business.findById(decoded.id).select('-password');
  
  if (!business) {
    return next(new AppError('کاربر یافت نشد', 401));
  }
  
  req.business = business;
  req.businessId = business._id;
  
  next();
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { protect, generateToken };