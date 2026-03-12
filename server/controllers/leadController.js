const Lead = require("../models/Lead");
const Property = require("../models/Property");

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ message: "Inquiry submitted successfully", lead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("property", "title city")
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get inquiries sent by the logged-in user (matched by email)
exports.getMyInquiries = async (req, res) => {
  try {
    const leads = await Lead.find({ email: req.user.email })
      .populate("property", "title city images price listingIntent")
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get inquiries received on the logged-in user's properties
exports.getInquiriesOnMyProperties = async (req, res) => {
  try {
    const myProperties = await Property.find({ agent: req.user.id }).select(
      "_id",
    );
    const propertyIds = myProperties.map((p) => p._id);
    const leads = await Lead.find({ property: { $in: propertyIds } })
      .populate("property", "title city images price listingIntent")
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
