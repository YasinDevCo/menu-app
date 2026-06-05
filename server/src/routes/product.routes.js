const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadProduct } = require('../middleware/upload.middleware');
const { validateProduct } = require('../middleware/validation.middleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleAvailability
} = require('../controllers/product.controller');

router.use(protect);

router.post('/', uploadProduct, validateProduct.create, createProduct);  // ← حذف .single

router.get('/', getProducts);

router.get('/:id', validateProduct.getById, getProductById);

router.put('/:id', uploadProduct, validateProduct.update, updateProduct);  // ← حذف .single

router.delete('/:id', validateProduct.delete, deleteProduct);

router.patch('/:id/toggle', validateProduct.delete, toggleAvailability);

module.exports = router;