const multer = require("multer");

const storage = multer.memoryStorage();

const IMAGE_MAX_COUNT = 10;
const IMAGE_SIZE_LIMIT_MB = 15;
const DOC_MAX_COUNT = 5;
const DOC_SIZE_LIMIT_MB = 10;
const VIDEO_MAX_COUNT = 3;
const VIDEO_SIZE_LIMIT_MB = 100;

// Image upload — max 10 files, 15 MB per file, images only
const upload = multer({
  storage,
  limits: {
    fileSize: IMAGE_SIZE_LIMIT_MB * 1024 * 1024,
    files: IMAGE_MAX_COUNT,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      const err = new Error("Only image files are allowed");
      err.code = "INVALID_FILE_TYPE";
      cb(err, false);
    }
  },
});

// Document upload — max 5 files, 10 MB per file, PDF only
const documentUpload = multer({
  storage,
  limits: { fileSize: DOC_SIZE_LIMIT_MB * 1024 * 1024, files: DOC_MAX_COUNT },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      const err = new Error("Only PDF files are allowed for documents");
      err.code = "INVALID_FILE_TYPE";
      cb(err, false);
    }
  },
});

// Video upload — max 3 files, 100 MB per file, video only
const videoUpload = multer({
  storage,
  limits: {
    fileSize: VIDEO_SIZE_LIMIT_MB * 1024 * 1024,
    files: VIDEO_MAX_COUNT,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      const err = new Error("Only video files are allowed");
      err.code = "INVALID_FILE_TYPE";
      cb(err, false);
    }
  },
});

module.exports = {
  upload,
  documentUpload,
  videoUpload,
  IMAGE_MAX_COUNT,
  IMAGE_SIZE_LIMIT_MB,
  DOC_MAX_COUNT,
  DOC_SIZE_LIMIT_MB,
  VIDEO_MAX_COUNT,
  VIDEO_SIZE_LIMIT_MB,
};
