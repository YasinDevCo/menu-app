const Order = require('../models/Order');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// دریافت آمار فروش
exports.getSalesStats = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;
  const { period = 'day' } = req.query; // day, week, month, year

  let startDate;
  const now = new Date();

  switch (period) {
    case 'day':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setHours(0, 0, 0, 0));
  }

  // دریافت سفارشات در بازه زمانی
  const orders = await Order.find({
    businessId,
    createdAt: { $gte: startDate },
    status: { $in: ['DELIVERED', 'COMPLETED'] }
  });

  // محاسبه آمار
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // پرفروش‌ترین محصولات
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.name]) {
        productSales[item.name] = {
          name: item.name,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.name].quantity += item.quantity;
      productSales[item.name].revenue += item.itemTotal;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // فروش روزانه برای نمودار
  const dailySales = {};
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!dailySales[date]) {
      dailySales[date] = { date, revenue: 0, count: 0 };
    }
    dailySales[date].revenue += order.totalAmount;
    dailySales[date].count += 1;
  });

  const chartData = Object.values(dailySales).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue
      },
      topProducts,
      chartData,
      period
    }
  });
});

// دریافت آمار روزانه (برای داشبورد)
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const businessId = req.businessId;

  // امروز
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  // دیروز
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  // امروز
  const todayOrders = await Order.find({
    businessId,
    createdAt: { $gte: todayStart },
    status: { $in: ['DELIVERED', 'COMPLETED'] }
  });

  // دیروز
  const yesterdayOrders = await Order.find({
    businessId,
    createdAt: { $gte: yesterdayStart, $lt: todayStart },
    status: { $in: ['DELIVERED', 'COMPLETED'] }
  });

  // سفارشات در انتظار
  const pendingOrders = await Order.countDocuments({
    businessId,
    status: 'PENDING'
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  
  const revenueChange = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
    : 0;

  res.status(200).json({
    success: true,
    data: {
      todayRevenue,
      todayOrders: todayOrders.length,
      pendingOrders,
      revenueChange: Math.round(revenueChange)
    }
  });
});