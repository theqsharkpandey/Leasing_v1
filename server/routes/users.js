const express = require("express");
const router = express.Router();
const {
  listUsers,
  getUser,
  changeRole,
  changeStatus,
} = require("../controllers/userController");
const {
  verifyToken,
  requireAdmin,
  requireSuperAdmin,
} = require("../middleware/authMiddleware");

// All routes require a valid token
router.use(verifyToken);

// GET /api/admin/users — list all users (admin + super_admin)
router.get("/", requireAdmin, listUsers);

// GET /api/admin/users/:id — get single user (admin + super_admin)
router.get("/:id", requireAdmin, getUser);

// PATCH /api/admin/users/:id/role — change role (super_admin only)
router.patch("/:id/role", requireSuperAdmin, changeRole);

// PATCH /api/admin/users/:id/status — suspend / activate (admin + super_admin)
router.patch("/:id/status", requireAdmin, changeStatus);

module.exports = router;
