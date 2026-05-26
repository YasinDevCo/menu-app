const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    requestPayment,
    verifyPayment
} = require('../controllers/payment.controller');

// درخواست پرداخت (نیاز به احراز هویت)
router.post('/request', protect, requestPayment);

// تأیید پرداخت (عمومی - بانک به اینجا می‌زند)
router.get('/verify', verifyPayment);  // ← مسیر درست است

module.exports = router;