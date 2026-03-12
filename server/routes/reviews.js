const express = require("express");
const router = express.Router();
const {
  getReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", getReviews);
router.post("/", verifyToken, createReview);
router.delete("/:id", verifyToken, deleteReview);

module.exports = router;
