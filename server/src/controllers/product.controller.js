const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const AWS = require('aws-sdk');

// تنظیم کلاینت S3 برای حذف فایل‌های قدیمی
const s3 = new AWS.S3({
  endpoint: process.env.ARVAN_ENDPOINT,
  accessKeyId: process.env.ARVAN_ACCESS_KEY,
  secretAccessKey: process.env.ARVAN_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, price, description, discountPrice, categoryId, preparationTime } = req.body;

  const category = await Category.findOne({ _id: categoryId, businessId: req.businessId });
  if (!category) {
    return next(new AppError('دسته‌بندی یافت نشد', 404));
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = req.file.location;  // آدرس کامل از S3
  }

  const product = await Product.create({
    name,
    price,
    description,
    discountPrice: discountPrice || null,
    categoryId,
    businessId: req.businessId,
    imageUrl,
    preparationTime: preparationTime || 15,
    isAvailable: true
  });

  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const product = await Product.findOne({ _id: id, businessId: req.businessId });
  if (!product) {
    return next(new AppError('محصول یافت نشد', 404));
  }

  if (req.file) {
    updates.imageUrl = req.file.location;  // آدرس جدید از S3
  }

  Object.assign(product, updates);
  await product.save();

  res.status(200).json({ success: true, data: product });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const { categoryId, isAvailable } = req.query;
  const filter = { businessId: req.businessId };

  if (categoryId) filter.categoryId = categoryId;
  if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

  const products = await Product.find(filter)
    .populate('categoryId', 'title')
    .sort({ priority: 1, createdAt: -1 });

  res.status(200).json({ success: true, count: products.length, data: products });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, businessId: req.businessId })
    .populate('categoryId', 'title');

  if (!product) {
    return next(new AppError('محصول یافت نشد', 404));
  }

  res.status(200).json({ success: true, data: product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const product = await Product.findOne({ _id: id, businessId: req.businessId });
  if (!product) {
    return next(new AppError('محصول یافت نشد', 404));
  }

  if (req.file) {
    // حذف فایل قدیمی از S3
    if (product.imageUrl) {
      try {
        // استخراج کلید فایل از آدرس کامل
        const oldKey = product.imageUrl.replace(/^https?:\/\/[^\/]+\//, '');
        await s3.deleteObject({
          Bucket: process.env.ARVAN_BUCKET_NAME,
          Key: oldKey,
        }).promise();
        console.log('✅ فایل قدیمی حذف شد:', oldKey);
      } catch (err) {
        console.error('❌ خطا در حذف فایل قدیمی:', err);
      }
    }
    // ذخیره آدرس جدید
    updates.imageUrl = req.file.location;
  }

  Object.assign(product, updates);
  await product.save();

  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, businessId: req.businessId });
  if (!product) {
    return next(new AppError('محصول یافت نشد', 404));
  }

  // حذف فایل از S3
  if (product.imageUrl) {
    try {
      const oldKey = product.imageUrl.replace(/^https?:\/\/[^\/]+\//, '');
      await s3.deleteObject({
        Bucket: process.env.ARVAN_BUCKET_NAME,
        Key: oldKey,
      }).promise();
      console.log('✅ فایل محصول حذف شد:', oldKey);
    } catch (err) {
      console.error('❌ خطا در حذف فایل:', err);
    }
  }

  await product.deleteOne();

  res.status(200).json({ success: true, message: 'محصول حذف شد' });
});

exports.toggleAvailability = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, businessId: req.businessId });
  if (!product) {
    return next(new AppError('محصول یافت نشد', 404));
  }

  product.isAvailable = !product.isAvailable;
  await product.save();

  res.status(200).json({ success: true, data: product });
});