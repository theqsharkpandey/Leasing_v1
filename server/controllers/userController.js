const User = require("../models/User");

// Role hierarchy — higher index = more privileged
const ROLE_RANK = {
  owner: 0,
  agent: 1,
  builder: 1,
  public_user: 0,
  admin: 2,
  super_admin: 3,
};

// Roles that can be assigned via API (super_admin is seeded only)
const ASSIGNABLE_ROLES = ["owner", "agent", "builder", "admin"];

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
// GET /admin/users
// Access: admin, super_admin
exports.listUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.accountStatus = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── CHANGE ROLE ─────────────────────────────────────────────────────────────
// PATCH /admin/users/:id/role
// Access: super_admin only
exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetId = req.params.id;
    const requesterId = req.user.id;

    // Validate requested role
    if (!ASSIGNABLE_ROLES.includes(role)) {
      return res.status(400).json({
        error: `Invalid role. Allowed: ${ASSIGNABLE_ROLES.join(", ")}`,
      });
    }

    // Prevent self-demotion
    if (String(targetId) === String(requesterId)) {
      return res.status(400).json({ error: "You cannot change your own role" });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ error: "User not found" });

    // Prevent modifying another super_admin
    if (target.role === "super_admin") {
      return res
        .status(403)
        .json({ error: "Cannot modify a super_admin account" });
    }

    // Only super_admin can promote to admin
    if (role === "admin" && req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ error: "Only super_admin can promote users to admin" });
    }

    const oldRole = target.role;
    target.role = role;
    await target.save();

    console.log(
      `[ROLE CHANGE] User ${target.email} changed from ${oldRole} → ${role} by ${req.user.id}`,
    );

    res.json({
      message: `Role updated to ${role}`,
      user: {
        id: target._id,
        name: target.name,
        email: target.email,
        role: target.role,
        accountStatus: target.accountStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── CHANGE ACCOUNT STATUS ───────────────────────────────────────────────────
// PATCH /admin/users/:id/status
// Access: admin, super_admin
exports.changeStatus = async (req, res) => {
  try {
    const { accountStatus } = req.body;
    const targetId = req.params.id;

    if (!["active", "suspended"].includes(accountStatus)) {
      return res
        .status(400)
        .json({ error: "accountStatus must be 'active' or 'suspended'" });
    }

    // Prevent self-suspension
    if (String(targetId) === String(req.user.id)) {
      return res
        .status(400)
        .json({ error: "You cannot change your own account status" });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ error: "User not found" });

    // admin cannot suspend another admin or super_admin
    if (
      req.user.role === "admin" &&
      ["admin", "super_admin"].includes(target.role)
    ) {
      return res
        .status(403)
        .json({ error: "Admins cannot suspend other admins" });
    }

    // super_admin cannot be suspended via API
    if (target.role === "super_admin") {
      return res
        .status(403)
        .json({ error: "Cannot suspend a super_admin account" });
    }

    const oldStatus = target.accountStatus;
    target.accountStatus = accountStatus;
    await target.save();

    console.log(
      `[STATUS CHANGE] User ${target.email} changed from ${oldStatus} → ${accountStatus} by ${req.user.id}`,
    );

    res.json({
      message: `Account ${accountStatus}`,
      user: {
        id: target._id,
        name: target.name,
        email: target.email,
        role: target.role,
        accountStatus: target.accountStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET SINGLE USER ─────────────────────────────────────────────────────────
// GET /admin/users/:id
// Access: admin, super_admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
