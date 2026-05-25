// ============================================
// middleware/validation.middleware.js
// اعتبارسنجی داده‌ها با Joi و express-validator
// ============================================

const Joi = require('joi');
const { body, query, param, header, cookie, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// ========== 1. تابع اصلی بررسی خطاهای اعتبارسنجی ==========
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));

    return next(new AppError(
      errorMessages.map(e => `${e.field}: ${e.message}`).join(' | '),
      400
    ));
  }

  next();
};

// ========== 2. اعتبارسنجی Business (رستوران) ==========
const validateBusiness = {
  register: [
    body('name')
      .notEmpty().withMessage('نام رستوران الزامی است')
      .isLength({ min: 3, max: 50 }).withMessage('نام رستوران باید بین 3 تا 50 حرف باشد')
      .trim(),

    body('ownerName')
      .notEmpty().withMessage('نام صاحب رستوران الزامی است')
      .isLength({ min: 3, max: 50 }).withMessage('نام صاحب رستوران باید بین 3 تا 50 حرف باشد')
      .trim(),

    body('phoneNumber')
      .notEmpty().withMessage('شماره موبایل الزامی است')
      .matches(/^09[0-9]{9}$/).withMessage('شماره موبایل باید با 09 شروع شود و 11 رقم باشد'),

    body('password')
      .notEmpty().withMessage('رمز عبور الزامی است')
      .isLength({ min: 6 }).withMessage('رمز عبور باید حداقل 6 کاراکتر باشد')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('رمز عبور باید شامل حداقل یک حرف و یک عدد باشد'),

    body('slug')
      .notEmpty().withMessage('اسلاگ الزامی است')
      .isLength({ min: 3, max: 30 }).withMessage('اسلاگ باید بین 3 تا 30 حرف باشد')
      .matches(/^[a-z0-9-]+$/).withMessage('اسلاگ فقط می‌تواند شامل حروف کوچک، اعداد و خط تیره باشد')
      .trim(),

    body('primaryColor')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('رنگ باید به فرمت HEX باشد (مثلاً #FF5722)'),

    body('isDark')
      .optional()
      .isBoolean().withMessage('isDark باید true یا false باشد'),

    validate
  ],

  login: [
    body('phoneNumber')
      .notEmpty().withMessage('شماره موبایل الزامی است')
      .matches(/^09[0-9]{9}$/).withMessage('شماره موبایل معتبر نیست'),

    body('password')
      .notEmpty().withMessage('رمز عبور الزامی است'),

    validate
  ],

  update: [
    body('name')
      .optional()
      .isLength({ min: 3, max: 50 }).withMessage('نام رستوران باید بین 3 تا 50 حرف باشد')
      .trim(),

    body('primaryColor')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('رنگ باید به فرمت HEX باشد'),

    body('isDark')
      .optional()
      .isBoolean().withMessage('isDark باید true یا false باشد'),

    validate
  ]
};

// ========== 3. اعتبارسنجی Category (دسته‌بندی) ==========
const validateCategory = {
  create: [
    body('title')
      .notEmpty().withMessage('عنوان دسته‌بندی الزامی است')
      .isLength({ min: 2, max: 50 }).withMessage('عنوان باید بین 2 تا 50 حرف باشد')
      .trim(),

    body('priority')
      .optional()
      .isInt({ min: 0, max: 999 }).withMessage('اولویت باید عددی بین 0 تا 999 باشد'),

    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive باید true یا false باشد'),

    body('icon')
      .optional()
      .isString().withMessage('آیکون باید متن باشد')
      .isLength({ max: 15 }).withMessage('آیکون نباید بیشتر از 15 کاراکتر باشد'),

    validate
  ],

  update: [
    param('id')
      .isMongoId().withMessage('آیدی دسته‌بندی معتبر نیست'),

    body('title')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('عنوان باید بین 2 تا 50 حرف باشد')
      .trim(),

    body('priority')
      .optional()
      .isInt({ min: 0, max: 999 }).withMessage('اولویت باید عددی بین 0 تا 999 باشد'),

    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive باید true یا false باشد'),

    validate
  ],

  delete: [
    param('id')
      .isMongoId().withMessage('آیدی دسته‌بندی معتبر نیست'),

    validate
  ]
};

// ========== 4. اعتبارسنجی Product (محصول) ==========
const validateProduct = {
  create: [
    body('name')
      .notEmpty().withMessage('نام محصول الزامی است')
      .isLength({ min: 2, max: 100 }).withMessage('نام محصول باید بین 2 تا 100 حرف باشد')
      .trim(),

    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد'),

    body('price')
      .notEmpty().withMessage('قیمت الزامی است')
      .isInt({ min: 0, max: 100000000 }).withMessage('قیمت باید عددی بین 0 تا 100 میلیون باشد'),

    body('discountPrice')
      .optional()
      .isInt({ min: 0 }).withMessage('قیمت تخفیف‌خورده باید عدد مثبت باشد')
      .custom((value, { req }) => {
        if (value && value >= req.body.price) {
          throw new Error('قیمت تخفیف‌خورده باید کمتر از قیمت اصلی باشد');
        }
        return true;
      }),

    body('categoryId')
      .notEmpty().withMessage('آیدی دسته‌بندی الزامی است')
      .isMongoId().withMessage('آیدی دسته‌بندی معتبر نیست'),

    body('isAvailable')
      .optional()
      .isBoolean().withMessage('isAvailable باید true یا false باشد'),

    body('preparationTime')
      .optional()
      .isInt({ min: 0, max: 120 }).withMessage('زمان آماده‌سازی باید بین 0 تا 120 دقیقه باشد'),

    validate
  ],

  update: [
    param('id')
      .isMongoId().withMessage('آیدی محصول معتبر نیست'),

    body('name')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('نام محصول باید بین 2 تا 100 حرف باشد')
      .trim(),

    body('price')
      .optional()
      .isInt({ min: 0 }).withMessage('قیمت باید عدد مثبت باشد'),

    body('categoryId')
      .optional()
      .isMongoId().withMessage('آیدی دسته‌بندی معتبر نیست'),

    validate
  ],

  delete: [
    param('id')
      .isMongoId().withMessage('آیدی محصول معتبر نیست'),

    validate
  ],

  getById: [
    param('id')
      .isMongoId().withMessage('آیدی محصول معتبر نیست'),

    validate
  ]
};

// ========== 5. اعتبارسنجی Order (سفارش) ==========
const validateOrder = {
  create: [
    body('tableNumber')
      .notEmpty().withMessage('شماره میز الزامی است')
      .isInt({ min: 1, max: 1000 }).withMessage('شماره میز باید بین 1 تا 1000 باشد'),

    body('items')
      .isArray({ min: 1 }).withMessage('حداقل یک آیتم باید سفارش داده شود'),

    body('items.*.productId')
      .notEmpty().withMessage('آیدی محصول الزامی است')
      .isMongoId().withMessage('آیدی محصول معتبر نیست'),

    body('items.*.quantity')
      .isInt({ min: 1, max: 100 }).withMessage('تعداد باید بین 1 تا 100 باشد'),

    body('items.*.note')
      .optional()
      .isLength({ max: 200 }).withMessage('یادداشت نمی‌تواند بیشتر از 200 کاراکتر باشد'),

    body('customer.phoneNumber')
      .optional()
      .matches(/^09[0-9]{9}$/).withMessage('شماره موبایل مشتری معتبر نیست'),

    body('payment.method')
      .optional()
      .isIn(['CASH', 'ONLINE', 'POS']).withMessage('روش پرداخت نامعتبر است'),

    validate
  ],

  updateStatus: [
    param('id')
      .isMongoId().withMessage('آیدی سفارش معتبر نیست'),

    body('status')
      .notEmpty().withMessage('وضعیت الزامی است')
      .isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED', 'COMPLETED'])
      .withMessage('وضعیت نامعتبر است'),

    body('canceledReason')
      .optional()
      .isLength({ max: 200 }).withMessage('دلیل لغو نمی‌تواند بیشتر از 200 کاراکتر باشد'),

    validate
  ],

  callWaiter: [
    param('id')
      .isMongoId().withMessage('آیدی سفارش معتبر نیست'),

    body('message')
      .optional()
      .isLength({ max: 100 }).withMessage('پیام نمی‌تواند بیشتر از 100 کاراکتر باشد'),

    validate
  ]
};

// ========== 6. اعتبارسنجی Coupon (تخفیف) ==========
const validateCoupon = {
  create: [
    body('code')
      .notEmpty().withMessage('کد تخفیف الزامی است')
      .isLength({ min: 3, max: 20 }).withMessage('کد تخفیف باید بین 3 تا 20 حرف باشد')
      .matches(/^[A-Z0-9]+$/).withMessage('کد تخفیف فقط می‌تواند شامل حروف بزرگ و اعداد باشد')
      .toUpperCase(),

    body('type')
      .notEmpty().withMessage('نوع تخفیف الزامی است')
      .isIn(['PERCENTAGE', 'FIXED']).withMessage('نوع تخفیف باید PERCENTAGE یا FIXED باشد'),

    body('value')
      .notEmpty().withMessage('مقدار تخفیف الزامی است')
      .isInt({ min: 1, max: 100000000 }).withMessage('مقدار تخفیف باید بین 1 تا 100 میلیون باشد')
      .custom((value, { req }) => {
        if (req.body.type === 'PERCENTAGE' && value > 100) {
          throw new Error('تخفیف درصدی نمی‌تواند بیشتر از 100 باشد');
        }
        return true;
      }),

    body('validUntil')
      .notEmpty().withMessage('تاریخ انقضا الزامی است')
      .isISO8601().withMessage('فرمت تاریخ نامعتبر است')
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error('تاریخ انقضا باید در آینده باشد');
        }
        return true;
      }),

    body('minOrderAmount')
      .optional()
      .isInt({ min: 0 }).withMessage('حداقل مبلغ سفارش باید عدد مثبت باشد'),

    body('usageLimit')
      .optional()
      .isInt({ min: 1, max: 10000 }).withMessage('محدودیت استفاده باید بین 1 تا 10000 باشد'),

    validate
  ],

  apply: [
    body('code')
      .notEmpty().withMessage('کد تخفیف الزامی است')
      .matches(/^[A-Z0-9]+$/).withMessage('فرمت کد تخفیف نامعتبر است'),

    body('orderAmount')
      .notEmpty().withMessage('مبلغ سفارش الزامی است')
      .isInt({ min: 0 }).withMessage('مبلغ سفارش باید عدد مثبت باشد'),

    validate
  ]
};

// ========== 7. اعتبارسنجی Review (نظر) ==========
const validateReview = {
  create: [
    body('productId')
      .notEmpty().withMessage('آیدی محصول الزامی است')
      .isMongoId().withMessage('آیدی محصول معتبر نیست'),

    body('rating')
      .notEmpty().withMessage('امتیاز الزامی است')
      .isInt({ min: 1, max: 5 }).withMessage('امتیاز باید بین 1 تا 5 باشد'),

    body('comment')
      .optional()
      .isLength({ min: 5, max: 500 }).withMessage('نظر باید بین 5 تا 500 کاراکتر باشد'),

    validate
  ],

  reply: [
    param('id')
      .isMongoId().withMessage('آیدی نظر معتبر نیست'),

    body('reply')
      .notEmpty().withMessage('پاسخ الزامی است')
      .isLength({ min: 3, max: 500 }).withMessage('پاسخ باید بین 3 تا 500 کاراکتر باشد'),

    validate
  ]
};

// ========== 8. اعتبارسنجی Staff (پرسنل) ==========
const validateStaff = {
  create: [
    body('name')
      .notEmpty().withMessage('نام پرسنل الزامی است')
      .isLength({ min: 3, max: 50 }).withMessage('نام باید بین 3 تا 50 حرف باشد'),

    body('phoneNumber')
      .notEmpty().withMessage('شماره موبایل الزامی است')
      .matches(/^09[0-9]{9}$/).withMessage('شماره موبایل معتبر نیست'),

    body('password')
      .notEmpty().withMessage('رمز عبور الزامی است')
      .isLength({ min: 6 }).withMessage('رمز عبور باید حداقل 6 کاراکتر باشد'),

    body('role')
      .notEmpty().withMessage('نقش الزامی است')
      .isIn(['ADMIN', 'MANAGER', 'KITCHEN', 'WAITER', 'CASHIER'])
      .withMessage('نقش نامعتبر است'),

    validate
  ],

  login: [
    body('phoneNumber')
      .notEmpty().withMessage('شماره موبایل الزامی است')
      .matches(/^09[0-9]{9}$/).withMessage('شماره موبایل معتبر نیست'),

    body('password')
      .notEmpty().withMessage('رمز عبور الزامی است'),

    validate
  ]
};

// ========== 9. اعتبارسنجی عمومی (پارامترها و کوئری‌ها) ==========
const validateCommon = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('صفحه باید عددی بزرگتر از 0 باشد')
      .toInt(),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('تعداد آیتم در هر صفحه باید بین 1 تا 100 باشد')
      .toInt(),

    validate
  ],

  mongoId: [
    param('id')
      .isMongoId().withMessage('آیدی معتبر نیست'),

    validate
  ],

  search: [
    query('q')
      .optional()
      .isLength({ min: 2 }).withMessage('عبارت جستجو باید حداقل 2 کاراکتر باشد')
      .trim(),

    validate
  ]
};

// ========== 10. اعتبارسنجی با Joi (برای اعتبارسنجی‌های پیچیده‌تر) ==========
const joiValidate = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return next(new AppError(
        errors.map(e => `${e.field}: ${e.message}`).join(' | '),
        400
      ));
    }

    // جایگزینی با مقدار validated
    req.body = value;
    next();
  };
};

// ========== مثال Schema با Joi ==========
const JoiSchemas = {
  productWithCustomization: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    customization: Joi.object({
      hasOptions: Joi.boolean(),
      options: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          choices: Joi.array().items(
            Joi.object({
              name: Joi.string().required(),
              extraPrice: Joi.number().min(0).default(0)
            })
          ).min(1).required(),
          required: Joi.boolean().default(false)
        })
      )
    })
  }),

  bulkOrder: Joi.object({
    tableNumber: Joi.number().min(1).max(1000).required(),
    orders: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).max(100).required()
      })
    ).min(1).required()
  })
};

// ========== export ==========
module.exports = {
  validate,
  validateBusiness,
  validateCategory,
  validateProduct,
  validateOrder,
  validateCoupon,
  validateReview,
  validateStaff,
  validateCommon,
  joiValidate,
  JoiSchemas
};