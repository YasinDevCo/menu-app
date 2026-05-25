const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    callWaiter,
    respondToWaiter
} = require('../controllers/order.controller');

// مسیرهای عمومی (برای مشتری - نیازی به توکن ندارد)
router.post('/', createOrder);
router.post('/:id/call-waiter', callWaiter);

// مسیرهای محافظت شده (برای ادمین و آشپزخانه)
router.use(protect);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/respond-waiter', respondToWaiter);

module.exports = router;