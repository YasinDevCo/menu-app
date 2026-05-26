const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getSalesStats,
  getDashboardStats
} = require('../controllers/stats.controller');

router.use(protect);
router.get('/sales', getSalesStats);
router.get('/dashboard', getDashboardStats);

module.exports = router;