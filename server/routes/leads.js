const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getMyInquiries,
  getInquiriesOnMyProperties,
} = require("../controllers/leadController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", createLead); // Public
router.get("/", verifyToken, authorizeRoles("admin", "agent"), getLeads);
router.get("/my-inquiries", verifyToken, getMyInquiries);
router.get("/my-property-inquiries", verifyToken, getInquiriesOnMyProperties);
router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin", "agent"),
  updateLeadStatus,
);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteLead);

module.exports = router;
