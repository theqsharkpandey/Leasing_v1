const express = require("express");
const router = express.Router();
const {
  addToShortlist,
  removeFromShortlist,
  getShortlist,
  checkShortlisted,
} = require("../controllers/shortlistController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, addToShortlist);
router.delete("/:propertyId", verifyToken, removeFromShortlist);
router.get("/", verifyToken, getShortlist);
router.get("/check", verifyToken, checkShortlisted);

module.exports = router;
