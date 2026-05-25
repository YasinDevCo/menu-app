const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadBusiness } = require('../middleware/upload.middleware');  // ← اضافه کن
const { validateBusiness } = require('../middleware/validation.middleware');
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');

// مسیرهای عمومی
router.post('/register', validateBusiness.register, register);
router.post('/login', validateBusiness.login, login);

// مسیرهای محافظت شده
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', uploadBusiness.single('logo'), updateProfile);  

module.exports = router;
