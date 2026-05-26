const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    useCoupon
} = require('../controllers/coupon.controller');

// همه مسیرها نیاز به احراز هویت دارند
router.use(protect);

router.get('/', getCoupons);
router.get('/:id', getCoupon);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);
router.post('/validate', validateCoupon);
router.post('/use', useCoupon);

module.exports = router;