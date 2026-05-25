require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
  }
});
app.set('io', io);
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Socket.io connections
io.on('connection', (socket) => {
  console.log('📡 New client connected:', socket.id);

  // دریافت businessId و join کردن به اتاق
  socket.on('join-business', (businessId) => {
    socket.join(`business_${businessId}`);
    console.log(`Socket ${socket.id} joined business_${businessId}`);
  });

  // رویداد سفارش جدید
  socket.on('new-order', (data) => {
    io.to(`business_${data.businessId}`).emit('order-notification', data);
    console.log(`📢 New order notification for business ${data.businessId}`);
  });

  // رویداد فراخوان گارسون
  socket.on('call-waiter', (data) => {
    io.to(`business_${data.businessId}`).emit('waiter-called', data);
    console.log(`🔔 Waiter called for business ${data.businessId}, table ${data.tableNumber}`);
  });

  // رویداد تغییر وضعیت سفارش
  socket.on('order-status-change', (data) => {
    io.to(`business_${data.businessId}`).emit('status-updated', data);
    console.log(`🔄 Order ${data.orderId} status changed to ${data.status}`);
  });

  socket.on('disconnect', () => {
    console.log('📡 Client disconnected:', socket.id);
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB ...');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};

startServer();