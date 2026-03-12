const Shortlist = require("../models/Shortlist");

exports.addToShortlist = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const existing = await Shortlist.findOne({
      user: req.user.id,
      property: propertyId,
    });
    if (existing) return res.status(400).json({ error: "Already shortlisted" });

    const item = new Shortlist({ user: req.user.id, property: propertyId });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromShortlist = async (req, res) => {
  try {
    await Shortlist.findOneAndDelete({
      user: req.user.id,
      property: req.params.propertyId,
    });
    res.json({ message: "Removed from shortlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShortlist = async (req, res) => {
  try {
    const items = await Shortlist.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("property");
    const properties = items.map((i) => i.property).filter(Boolean);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkShortlisted = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.json({ shortlisted: [] });
    const idList = ids.split(",");
    const items = await Shortlist.find({
      user: req.user.id,
      property: { $in: idList },
    });
    const shortlisted = items.map((i) => i.property.toString());
    res.json({ shortlisted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
