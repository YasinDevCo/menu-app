
// ============================================
// middleware/errorHandler.js - نسخه کامل
// ============================================
const AppError = require('../utils/AppError');

// ========== 1. هندلر خطاهای مخصوص مونگو ==========
const handleCastErrorDB = (err) => {
  const message = `مقدار نامعتبر برای فیلد ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  const message = `مقدار '${value}' برای فیلد '${field}' تکراری است. لطفاً از مقدار دیگری استفاده کنید.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `خطای اعتبارسنجی: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleMongoNetworkError = (err) => {
  const message = 'مشکل در اتصال به دیتابیس. لطفاً چند لحظه دیگر تلاش کنید.';
  return new AppError(message, 503);
};

// ========== 2. هندلر خطاهای JWT ==========
const handleJWTError = () => {
  return new AppError('توکن نامعتبر است. لطفاً دوباره وارد شوید.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('توکن منقضی شده است. لطفاً دوباره وارد شوید.', 401);
};

// ========== 3. هندلر خطای 404 ==========
const handleNotFoundError = (req, res, next) => {
  const error = new AppError(`آدرس ${req.originalUrl} پیدا نشد`, 404);
  next(error);
};

// ========== 4. تابع اصلی error handler ==========
const errorHandler = (err, req, res, next) => {
  // کپی از خطا (برای جلوگیری از تغییر خطای اصلی)
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // لاگ خطا در کنسول (برای دیباگ)
  console.error('❌ ERROR:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    code: err.code,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?._id || req.business?._id || 'unknown'
  });

  // ========== خطاهای MongoDB ==========
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(err);
  }

  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    error = handleMongoNetworkError(err);
  }

  // ========== خطاهای JWT ==========
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // ========== خطای 404 از express ==========
  if (err.name === 'NotFoundError') {
    error = new AppError(err.message, 404);
  }

  // ========== خطای 403 دسترسی ==========
  if (err.name === 'ForbiddenError') {
    error = new AppError('شما دسترسی به این بخش را ندارید', 403);
  }

  // ========== خطای body-parser (JSON invalid) ==========
  if (err.type === 'entity.parse.failed') {
    error = new AppError('فرمت JSON ارسالی نامعتبر است', 400);
  }

  // ========== خطای multer (آپلود فایل) ==========
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('حجم فایل ارسالی نباید بیشتر از 5 مگابایت باشد', 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new AppError('تعداد فایل‌های ارسالی بیشتر از حد مجاز است', 400);
  }

  // ========== ارسال پاسخ نهایی ==========
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  // پاسخ برای محیط development (نمایش همه جزئیات)
  if (isDevelopment) {
    return res.status(error.statusCode || 500).json({
      success: false,
      status: error.status || 'error',
      error: {
        message: error.message || err.message,
        name: err.name,
        code: err.code,
        stack: err.stack,
        ...(err.errors && { errors: err.errors })
      },
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }

  // ========== پاسخ برای محیط production ==========
  // خطاهای عملیاتی (Operational errors) - قابل پیش‌بینی
  if (error.isOperational || err.isOperational) {
    return res.status(error.statusCode || err.statusCode || 500).json({
      success: false,
      status: 'fail',
      message: error.message || err.message,
      code: error.statusCode || err.statusCode
    });
  }

  // خطاهای برنامه‌نویسی (Programming errors) - نباید به کاربر نشون داده بشه
  console.error('💥 UNEXPECTED ERROR:', err);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.',
    code: 500
  });
};

// ========== 5. هندلر خطاهای async (برای express 5 به بعد نیاز نیست) ==========
// برای نسخه‌های قدیمی express، این رو اضافه کن:
const setupAsyncErrors = () => {
  const express = require('express');
  const originalHandle = express.Router.prototype.handle;

  express.Router.prototype.handle = function (req, res, next) {
    const handler = originalHandle.bind(this);
    return handler(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  };
};

// ========== 6. هندلر global unhandled rejection (برای امنیت بیشتر) ==========
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  console.error('💀 Shutting down due to unhandled rejection...');

  // در production می‌تونی سرور رو ریستارت کنی
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  console.error('💀 Shutting down due to uncaught exception...');

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// ========== export ==========
module.exports = {
  errorHandler,
  handleNotFoundError,
  AppError,
};