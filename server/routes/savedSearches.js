const express = require("express");
const router = express.Router();
const {
  createSavedSearch,
  getSavedSearches,
  deleteSavedSearch,
  updateSavedSearch,
} = require("../controllers/savedSearchController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createSavedSearch);
router.get("/", verifyToken, getSavedSearches);
router.patch("/:id", verifyToken, updateSavedSearch);
router.delete("/:id", verifyToken, deleteSavedSearch);

module.exports = router;
