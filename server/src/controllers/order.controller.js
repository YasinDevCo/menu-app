const Order = require('../models/Order');
const Product = require('../models/Product');
const Business = require('../models/Business');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// ایجاد سفارش جدید (عمومی)
exports.createOrder = catchAsync(async (req, res, next) => {
  // دریافت businessId - اولویت با req.businessId (اگر لاگین باشد)، سپس businessSlug
  let businessId = req.businessId;
  const { businessSlug, tableNumber, items, customer, note, paymentMethod } = req.body;

  // اگر businessId وجود نداشت و businessSlug ارسال شده بود، از روی slug پیدا کن
  if (!businessId && businessSlug) {
    const business = await Business.findOne({ slug: businessSlug });
    if (!business) {
      return next(new AppError('رستوران یافت نشد', 404));
    }
    businessId = business._id;
  }

  if (!businessId) {
    return next(new AppError('شناسه رستوران الزامی است', 400));
  }

  if (!tableNumber || !items || items.length === 0) {
    return next(new AppError('شماره میز و آیتم‌های سفارش الزامی است', 400));
  }

  let subtotal = 0;
  const orderItems = [];

  // محاسبه قیمت هر آیتم
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new AppError(`محصول یافت نشد: ${item.productId}`, 404));
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      quantity: item.quantity,
      priceAtTime: product.price,
      note: item.note || null,
      itemTotal
    });
  }

  // محاسبه مالیات (مثلاً 9%)
  const taxAmount = subtotal * 0.09;
  const totalAmount = subtotal + taxAmount;

  const order = await Order.create({
    businessId,
    tableNumber,
    items: orderItems,
    subtotal,
    taxAmount,
    totalAmount,
    payment: {
      method: paymentMethod || 'CASH',
      status: 'PENDING'
    },
    customer: customer || {},
    note: note || null,
    status: 'PENDING'
  });

  // ✅ ارسال اعلان از طریق Socket.io
  const io = req.app.get('io');
  if (io) {
    io.to(`business_${businessId}`).emit('order-notification', {
      orderId: order._id,
      tableNumber: order.tableNumber,
      totalAmount: order.totalAmount,
      itemsCount: orderItems.length
    });
    console.log(`📢 Emitted order-notification for business ${businessId}, table ${order.tableNumber}`);
  } else {
    console.log('❌ io not found in app');
  }

  res.status(201).json({
    success: true,
    data: order
  });
});
// دریافت سفارشات یک رستوران (فقط ادمین)
exports.getOrders = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;
  const { status, limit = 50 } = req.query;

  const filter = { businessId };
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// دریافت یک سفارش (فقط ادمین)
exports.getOrder = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, businessId });
  if (!order) {
    return next(new AppError('سفارش یافت نشد', 404));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// تغییر وضعیت سفارش (فقط ادمین)
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('وضعیت نامعتبر است', 400));
  }

  const order = await Order.findOne({ _id: id, businessId });
  if (!order) {
    return next(new AppError('سفارش یافت نشد', 404));
  }

  order.status = status;

  // ثبت زمان هر وضعیت
  const statusDateMap = {
    'CONFIRMED': 'confirmedAt',
    'PREPARING': 'preparingAt',
    'READY': 'readyAt',
    'DELIVERED': 'deliveredAt',
    'CANCELED': 'canceledAt',
    'COMPLETED': 'completedAt'
  };

  if (statusDateMap[status]) {
    order[statusDateMap[status]] = Date.now();
  }

  await order.save();
  // ارسال رویداد تغییر وضعیت از طریق Socket
  const io = req.app.get('io');
  if (io) {
    io.to(`business_${businessId}`).emit('status-updated', {
      orderId: order._id,
      status: status,
      tableNumber: order.tableNumber
    });
  }
  res.status(200).json({
    success: true,
    data: order
  });

});

// فراخوان گارسون (عمومی - نیاز به businessId ندارد)
exports.callWaiter = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError('سفارش یافت نشد', 404));
  }

  order.callWaiter = {
    isActive: true,
    message: message || null,
    calledAt: Date.now()
  };
  await order.save();

  res.status(200).json({
    success: true,
    message: 'درخواست گارسون ثبت شد'
  });
});

// پاسخ به فراخوان گارسون (فقط ادمین)
exports.respondToWaiter = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, businessId });
  if (!order) {
    return next(new AppError('سفارش یافت نشد', 404));
  }

  order.callWaiter = {
    ...order.callWaiter,
    isActive: false,
    respondedAt: Date.now()
  };
  await order.save();

  res.status(200).json({
    success: true,
    message: 'پاسخ به درخواست گارسون ثبت شد'
  });
});