const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", verifyToken, authorizeRoles("admin", "agent"), getStats);

module.exports = router;
