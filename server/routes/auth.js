const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  uploadAvatar,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const multer = require("multer");

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// Inline error handler so multer rejections return clean JSON
function avatarUploadMiddleware(req, res, next) {
  avatarUpload.single("avatar")(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE")
      return res
        .status(400)
        .json({ error: "Photo must be smaller than 2 MB." });
    return res.status(400).json({ error: err.message || "Invalid file." });
  });
}

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/avatar", verifyToken, avatarUploadMiddleware, uploadAvatar);

module.exports = router;
