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


router.post('/', uploadCategory.single('icon'), validateCategory.create, createCategory);

router.put('/:id', uploadCategory.single('icon'), validateCategory.update, updateCategory);

router.delete('/:id', validateCategory.delete, deleteCategory);

module.exports = router;