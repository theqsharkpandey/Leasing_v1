const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

// Allows admin OR super_admin
const requireAdmin = (req, res, next) => {
  if (!["admin", "super_admin"].includes(req.user?.role)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Allows super_admin only
const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ error: "Super-admin access required" });
  }
  next();
};

module.exports = {
  verifyToken,
  authorizeRoles,
  requireAdmin,
  requireSuperAdmin,
};
