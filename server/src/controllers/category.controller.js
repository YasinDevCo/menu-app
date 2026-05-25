const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createCategory = catchAsync(async (req, res, next) => {
  const { title, priority, icon, description } = req.body;

  const category = await Category.create({
    title,
    priority,
    icon,
    description,
    businessId: req.businessId,
    isActive: true
  });

  res.status(201).json({ success: true, data: category });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ businessId: req.businessId, isActive: true })
    .sort({ priority: 1, createdAt: 1 });

  res.status(200).json({ success: true, count: categories.length, data: categories });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const category = await Category.findOne({ _id: id, businessId: req.businessId });
  if (!category) {
    return next(new AppError('دسته‌بندی یافت نشد', 404));
  }

  Object.assign(category, updates);
  await category.save();

  res.status(200).json({ success: true, data: category });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id, businessId: req.businessId });
  if (!category) {
    return next(new AppError('دسته‌بندی یافت نشد', 404));
  }

  await category.deleteOne();

  res.status(200).json({ success: true, message: 'دسته‌بندی حذف شد' });
});