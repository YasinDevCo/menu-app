const express = require('express');
const router = express.Router();
const { getMenu, getProductDetail } = require('../controllers/menu.controller');

router.get('/', getMenu);
router.get('/product/:productId', getProductDetail);

module.exports = router;