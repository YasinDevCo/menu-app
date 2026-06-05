const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

// تنظیم کلاینت S3
const s3 = new AWS.S3({
  endpoint: 'https://s3.ir-thr-at1.arvanstorage.ir',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

// ذخیره موقت در حافظه با multer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('فقط تصاویر مجاز هستند (jpeg, jpg, png, webp, svg)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// تابع آپلود به S3
const uploadToS3 = async (file, folder) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.originalname);
  const key = `${folder}/${uniqueSuffix}${ext}`;

  const params = {
    Bucket: 'yas-bucket',
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

// Middleware برای آپلود محصول
const uploadProduct = async (req, res, next) => {
  try {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      if (req.file) {
        req.file.location = await uploadToS3(req.file, 'menu-items');
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Middleware برای آپلود لوگو
const uploadBusiness = async (req, res, next) => {
  try {
    const uploadSingle = upload.single('logo');
    uploadSingle(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      if (req.file) {
        req.file.location = await uploadToS3(req.file, 'logos');
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Middleware برای آپلود آیکون
const uploadCategory = async (req, res, next) => {
  try {
    const uploadSingle = upload.single('icon');
    uploadSingle(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      if (req.file) {
        req.file.location = await uploadToS3(req.file, 'icons');
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProduct,
  uploadBusiness,
  uploadCategory,
  upload: uploadProduct,
};