const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadCategory } = require('../middleware/upload.middleware');
const { validateCategory } = require('../middleware/validation.middleware');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

router.use(protect);


router.get('/', getCategories);
router.post('/', uploadCategory, validateCategory.create, createCategory);  // ← حذف .single
router.put('/:id', uploadCategory, validateCategory.update, updateCategory);

router.delete('/:id', validateCategory.delete, deleteCategory);

module.exports = router;