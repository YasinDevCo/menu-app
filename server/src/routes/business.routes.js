const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadBusiness } = require('../middleware/upload.middleware');
const businessController = require('../controllers/business.controller');

router.post('/register', businessController.register);
router.post('/login', businessController.login);

router.use(protect);

router.get('/profile', businessController.getProfile);
router.put('/profile', uploadBusiness, businessController.updateProfile);
router.put('/change-password', businessController.changePassword);

module.exports = router;