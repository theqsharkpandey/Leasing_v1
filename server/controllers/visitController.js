const Visit = require("../models/Visit");
const Property = require("../models/Property");

// POST /api/visits
exports.createVisit = async (req, res) => {
  try {
    const { property, name, email, phone, date, timeSlot, message } = req.body;
    if (!property || !name || !email || !phone || !date || !timeSlot)
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });

    const visit = await Visit.create({
      property,
      user: req.user?.id,
      name,
      email,
      phone,
      date,
      timeSlot,
      message,
    });

    // Notify property agent/owner
    const prop = await Property.findById(property).select(
      "submittedBy title agent",
    );

    res.status(201).json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/visits/my — user's own visits
exports.getMyVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ user: req.user.id })
      .populate("property", "title city images price listingIntent")
      .sort({ date: 1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/visits/agent — visits for all properties owned by current user
exports.getAgentVisits = async (req, res) => {
  try {
    const myProps = await Property.find({ submittedBy: req.user.id }).select(
      "_id",
    );
    const ids = myProps.map((p) => p._id);
    const visits = await Visit.find({ property: { $in: ids } })
      .populate("property", "title city")
      .sort({ date: 1, createdAt: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/visits/:id — confirm or cancel
exports.updateVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id).populate(
      "property",
      "submittedBy title",
    );
    if (!visit) return res.status(404).json({ error: "Visit not found" });

    const isAdmin = ["admin", "super_admin"].includes(req.user.role);
    const isOwner = String(visit.property?.submittedBy) === String(req.user.id);
    if (!isAdmin && !isOwner)
      return res.status(403).json({ error: "Forbidden" });

    const { status } = req.body;
    if (!["confirmed", "cancelled"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    visit.status = status;
    await visit.save();

    res.json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
