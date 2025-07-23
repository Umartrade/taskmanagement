import multer from 'multer';
import path from 'path';
import { AppError } from './appError.js';

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Helper function to convert buffer to base64 data URL
export const bufferToDataURL = (buffer, mimetype) => {
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};

// In a production environment, you would typically:
// 1. Upload files to cloud storage (AWS S3, Cloudinary, etc.)
// 2. Store only the file URL in the database
// 3. Implement proper file validation and security measures
// 4. Add image resizing/optimization

export const handleImageUpload = (req, res, next) => {
  if (req.file) {
    // Convert buffer to data URL for demo purposes
    // In production, upload to cloud storage and store URL
    req.body.image = {
      url: bufferToDataURL(req.file.buffer, req.file.mimetype),
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    };
  }
  next();
};