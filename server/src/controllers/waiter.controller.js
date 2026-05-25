const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// ذخیره درخواست‌های گارسون (می‌توان در دیتابیس یا یک آرایه موقت ذخیره کرد)
let waiterCalls = [];

exports.callWaiter = catchAsync(async (req, res, next) => {
  const { tableNumber, message } = req.body;
  const businessId = req.businessId;

  if (!tableNumber) {
    return next(new AppError('شماره میز الزامی است', 400));
  }

  const callData = {
    id: Date.now().toString(),
    businessId,
    tableNumber,
    message: message || null,
    calledAt: new Date(),
    isActive: true
  };

  waiterCalls.push(callData);

  // در اینجا می‌توانی از Socket.io هم استفاده کنی
  // io.to(`business_${businessId}`).emit('waiter-called', callData);

  res.status(200).json({
    success: true,
    message: 'درخواست گارسون ثبت شد',
    data: callData
  });
});

exports.getWaiterCalls = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;
  const activeCalls = waiterCalls.filter(call => 
    call.businessId === businessId && call.isActive === true
  );

  res.status(200).json({
    success: true,
    data: activeCalls
  });
});

exports.respondToWaiter = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const call = waiterCalls.find(c => c.id === id);
  
  if (!call) {
    return next(new AppError('درخواست یافت نشد', 404));
  }

  call.isActive = false;
  call.respondedAt = new Date();

  res.status(200).json({
    success: true,
    message: 'پاسخ به درخواست گارسون ثبت شد'
  });
});