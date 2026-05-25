const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  callWaiter,
  getWaiterCalls,
  respondToWaiter
} = require('../controllers/waiter.controller');

// مسیر عمومی برای مشتری (بدون توکن)
router.post('/call', callWaiter);

// مسیرهای محافظت شده برای ادمین
router.use(protect);
router.get('/calls', getWaiterCalls);
router.post('/respond/:id', respondToWaiter);

module.exports = router;