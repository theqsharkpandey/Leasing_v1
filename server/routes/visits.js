const express = require("express");
const router = express.Router();
const {
  createVisit,
  getMyVisits,
  getAgentVisits,
  updateVisit,
} = require("../controllers/visitController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", createVisit); // Allow guests to book
router.get("/my", verifyToken, getMyVisits);
router.get("/agent", verifyToken, getAgentVisits);
router.patch("/:id", verifyToken, updateVisit);

module.exports = router;
