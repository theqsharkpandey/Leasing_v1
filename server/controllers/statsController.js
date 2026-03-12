const Property = require("../models/Property");
const Lead = require("../models/Lead");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  try {
    const [
      totalProperties,
      pendingReview,
      approvedProperties,
      rejectedProperties,
      needsDocuments,
      verifiedProperties,
      totalLeads,
      newLeads,
      closedLeads,
      totalUsers,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "pending_review" }),
      Property.countDocuments({ status: { $in: ["approved", "active"] } }),
      Property.countDocuments({ status: "rejected" }),
      Property.countDocuments({ status: "needs_documents" }),
      Property.countDocuments({ status: "verified" }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ status: "closed" }),
      User.countDocuments(),
    ]);

    res.json({
      totalProperties,
      pendingReview,
      approvedProperties,
      rejectedProperties,
      needsDocuments,
      verifiedProperties,
      // legacy aliases
      activeProperties: approvedProperties,
      pendingProperties: pendingReview,
      totalLeads,
      newLeads,
      closedLeads,
      totalUsers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
