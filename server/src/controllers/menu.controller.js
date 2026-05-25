const Category = require('../models/Category');
const Product = require('../models/Product');
const Business = require('../models/Business');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getMenu = catchAsync(async (req, res, next) => {
  const business = await Business.findOne();

  if (!business) {
    return next(new AppError('رستوران یافت نشد', 404));
  }

  const categories = await Category.find({ businessId: business._id, isActive: true })
    .sort({ priority: 1 });

  const products = await Product.find({ businessId: business._id, isAvailable: true })
    .sort({ priority: 1 });

  const menu = categories.map(category => ({
    ...category.toObject(),
    products: products.filter(p => p.categoryId.toString() === category._id.toString())
  }));

  res.status(200).json({
    success: true,
    business: {
      name: business.name,
      slug: business.slug,
      logoUrl: business.logoUrl,
      primaryColor: business.primaryColor
    },
    menu
  });
});

exports.getProductDetail = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const business = await Business.findOne();

  if (!business) {
    return next(new AppError('رستوران یافت نشد', 404));
  }

  const product = await Product.findOne({ _id: productId, businessId: business._id, isAvailable: true })
    .populate('categoryId', 'title');

  if (!product) {
    return next(new AppError('محصول یافت نشد', 404));
  }

  res.status(200).json({ success: true, data: product });
});