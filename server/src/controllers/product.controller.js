const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, price, description, discountPrice, categoryId, preparationTime } = req.body;

  const category = await Category.findOne({ _id: categoryId, businessId: req.businessId });
  if (!category) {
    return next(new AppError('دسته‌بندی یافت نشد', 404));
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/products/${req.file.filename}`;
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
    if (product.imageUrl) {
      const oldImagePath = path.join(__dirname, '../../', product.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    updates.imageUrl = `/uploads/products/${req.file.filename}`;
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

  if (product.imageUrl) {
    const imagePath = path.join(__dirname, '../../', product.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
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