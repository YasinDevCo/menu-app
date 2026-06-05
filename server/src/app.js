const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');

// ========== Import Routes ==========
const authRoutes = require('./routes/auth.routes');
const businessRoutes = require('./routes/business.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const waiterRoutes = require('./routes/waiter.routes');
const statsRoutes = require('./routes/stats.routes');
const paymentRoutes = require('./routes/payment.routes');
const couponRoutes = require('./routes/coupon.routes');

// ========== CORS Options ==========
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://menu-app-client-n6g0g41be-yasins-projects-e4434943.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
};

const app = express();

// ========== Security Headers ==========
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginEmbedderPolicy: false,
}));

// ========== CORS ==========
app.use(cors(corsOptions));

// ========== Body Parsers ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ========== Static files for uploads ==========
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
}, express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/waiter', waiterRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);

// ========== Health Check ==========
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// ========== 404 Handler ==========
app.use((req, res) => {
  res.status(404).json({ error: 'مسیر مورد نظر یافت نشد' });
});

// ========== Global Error Handler ==========
app.use(errorHandler);

module.exports = app;