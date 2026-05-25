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

router.post('/', uploadProduct.single('image'), validateProduct.create, createProduct);

router.get('/', getProducts);

router.get('/:id', validateProduct.getById, getProductById);

router.put('/:id', uploadProduct.single('image'), validateProduct.update, updateProduct);

router.delete('/:id', validateProduct.delete, deleteProduct);

router.patch('/:id/toggle', validateProduct.delete, toggleAvailability);

module.exports = router;