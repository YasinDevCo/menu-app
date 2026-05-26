const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// درخواست پرداخت (شبیه زرین‌پال)
exports.requestPayment = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const businessId = req.businessId;

  const order = await Order.findOne({ _id: orderId, businessId });
  if (!order) {
    return next(new AppError('سفارش یافت نشد', 404));
  }

  if (order.payment.status === 'PAID') {
    return next(new AppError('این سفارش قبلاً پرداخت شده است', 400));
  }

  // بررسی وجود تراکنش قبلی
  const existingTransaction = await Transaction.findOne({ orderId, status: 'PENDING' });
  if (existingTransaction) {
    const paymentUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/checkout?authority=${existingTransaction.gatewayReference}&orderId=${order._id}`;
    return res.status(200).json({
      success: true,
      data: {
        authority: existingTransaction.gatewayReference,
        paymentUrl,
        amount: order.totalAmount
      }
    });
  }

  // ایجاد تراکنش جدید
  const authority = `AUTH-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  const transaction = await Transaction.create({
    orderId: order._id,
    businessId,
    amount: order.totalAmount,
    type: 'PAYMENT',
    method: 'ONLINE',
    status: 'PENDING',
    gatewayReference: authority,
    description: `پرداخت سفارش شماره ${order._id.toString().slice(-6)}`
  });

  const paymentUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/checkout?authority=${authority}&orderId=${order._id}`;

  res.status(200).json({
    success: true,
    data: {
      authority,
      paymentUrl,
      amount: order.totalAmount
    }
  });
});

// تأیید پرداخت (شبیه زرین‌پال)
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { authority, orderId, Status } = req.query; // ← اضافه کردن Status برای زرین‌پال

  console.log('🔍 Verify payment:', { authority, orderId, Status });

  if (!authority || !orderId) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?status=failed&error=missing_params`);
  }

  const transaction = await Transaction.findOne({ gatewayReference: authority, orderId });
  if (!transaction) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?status=failed&error=transaction_not_found`);
  }

  if (transaction.status === 'SUCCESS') {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?status=already_paid`);
  }

  // برای نمونه، همیشه موفق فرض می‌کنیم
  const isSuccess = true;

  if (isSuccess) {
    transaction.status = 'SUCCESS';
    transaction.gatewayReference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    await transaction.save();

    // به‌روزرسانی سفارش
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'PAID',
      'payment.paidAt': new Date(),
      status: 'CONFIRMED'
    });

    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?status=success&refId=${transaction.gatewayReference}`);
  } else {
    transaction.status = 'FAILED';
    await transaction.save();
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?status=failed`);
  }
});