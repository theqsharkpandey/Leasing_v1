const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  upload,
  documentUpload,
  videoUpload,
  IMAGE_MAX_COUNT,
  IMAGE_SIZE_LIMIT_MB,
  DOC_MAX_COUNT,
  DOC_SIZE_LIMIT_MB,
  VIDEO_MAX_COUNT,
  VIDEO_SIZE_LIMIT_MB,
} = require("../middleware/upload");
const {
  uploadImages,
  uploadDocuments,
  uploadVideos,
  getVideoUploadParams,
} = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/authMiddleware");

// Handle multer errors inline rather than via next(err).
// In Express 5, next(err) inside a non-async callback has a timing race where
// res.json() may be flushed before the body is written, producing {} on the
// client. Responding directly in the multer callback avoids this entirely.
function multerHandler(multerMiddleware, { maxCount, maxSizeMb }) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        let message = err.message;
        if (err.code === "LIMIT_FILE_SIZE") {
          message = `File too large. Maximum allowed size is ${maxSizeMb} MB per file.`;
        } else if (err.code === "LIMIT_FILE_COUNT") {
          message = `Too many files. You can upload a maximum of ${maxCount} files at once.`;
        }
        return res
          .status(400)
          .json({ error: message, type: "MulterError", code: err.code });
      }

      // Custom fileFilter rejection (INVALID_FILE_TYPE)
      if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({ error: err.message });
      }

      // Unknown error — fall through to global handler
      return next(err);
    });
  };
}

router.post(
  "/images",
  verifyToken,
  multerHandler(upload.array("images", IMAGE_MAX_COUNT), {
    maxCount: IMAGE_MAX_COUNT,
    maxSizeMb: IMAGE_SIZE_LIMIT_MB,
  }),
  uploadImages,
);
router.post(
  "/documents",
  verifyToken,
  multerHandler(documentUpload.array("documents", DOC_MAX_COUNT), {
    maxCount: DOC_MAX_COUNT,
    maxSizeMb: DOC_SIZE_LIMIT_MB,
  }),
  uploadDocuments,
);
router.get("/video-upload-params", verifyToken, getVideoUploadParams);
router.post(
  "/videos",
  verifyToken,
  multerHandler(videoUpload.array("videos", VIDEO_MAX_COUNT), {
    maxCount: VIDEO_MAX_COUNT,
    maxSizeMb: VIDEO_SIZE_LIMIT_MB,
  }),
  uploadVideos,
);

module.exports = router;
