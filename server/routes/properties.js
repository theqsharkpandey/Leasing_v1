const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  getProperty,
  getSimilarProperties,
  getPropertiesByIds,
  getMyProperties,
  updateProperty,
  deleteProperty,
  moderateProperty,
  getAdminProperties,
  getSuggestions,
} = require("../controllers/propertyController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ── Static routes first (Express 5 requirement) ──────────────────────────────
router.get("/", getProperties);
router.post("/batch", getPropertiesByIds);
router.get("/my-properties", verifyToken, getMyProperties);
router.get("/suggest", getSuggestions);

// Admin-only: get all properties with any status
router.get(
  "/admin/all",
  verifyToken,
  authorizeRoles("admin", "super_admin"),
  getAdminProperties,
);

// All authenticated users can submit
router.post(
  "/",
  verifyToken,
  authorizeRoles(
    "admin",
    "super_admin",
    "agent",
    "owner",
    "user",
    "builder",
    "public_user",
  ),
  createProperty,
);

// ── Param routes last ─────────────────────────────────────────────────────────
router.get("/:id", getProperty);
router.get("/:id/similar", getSimilarProperties);

// Admin moderation: approve / reject / request_documents / schedule_call / mark_verified
router.patch(
  "/:id/moderate",
  verifyToken,
  authorizeRoles("admin", "super_admin"),
  moderateProperty,
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(
    "admin",
    "super_admin",
    "agent",
    "owner",
    "user",
    "builder",
    "public_user",
  ),
  updateProperty,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(
    "admin",
    "super_admin",
    "agent",
    "owner",
    "user",
    "builder",
    "public_user",
  ),
  deleteProperty,
);

module.exports = router;
