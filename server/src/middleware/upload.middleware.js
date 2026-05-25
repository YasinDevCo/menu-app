const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ========== پوشه محصولات ==========
const productsDir = 'uploads/products';
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// ========== پوشه لوگو رستوران ==========
const businessDir = 'uploads/business';
if (!fs.existsSync(businessDir)) {
  fs.mkdirSync(businessDir, { recursive: true });
}

// ========== پوشه آیکون دسته‌بندی ==========
const categoryDir = 'uploads/categories';
if (!fs.existsSync(categoryDir)) {
  fs.mkdirSync(categoryDir, { recursive: true });
}

// ========== تنظیمات ذخیره برای محصولات ==========
const productsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// ========== تنظیمات ذخیره برای لوگو ==========
const businessStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, businessDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `logo-${uniqueSuffix}${ext}`);
  }
});

// ========== تنظیمات ذخیره برای آیکون ==========
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `icon-${uniqueSuffix}${ext}`);
  }
});

// ========== فیلتر فایل ==========
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('فقط تصاویر مجاز هستند (jpeg, jpg, png, webp, svg)'));
  }
};

// ========== آپلودرها ==========
const uploadProduct = multer({
  storage: productsStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

const uploadBusiness = multer({
  storage: businessStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});

const uploadCategory = multer({
  storage: categoryStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter
});

// ========== export ==========
module.exports = {
  uploadProduct,
  uploadBusiness,
  uploadCategory,
  upload: uploadProduct
};