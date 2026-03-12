const SavedSearch = require("../models/SavedSearch");

// POST /api/saved-searches
exports.createSavedSearch = async (req, res) => {
  try {
    const { name, filters, emailAlert } = req.body;
    if (!name || !filters)
      return res.status(400).json({ error: "name and filters required" });

    const count = await SavedSearch.countDocuments({ user: req.user.id });
    if (count >= 10)
      return res
        .status(400)
        .json({ error: "Maximum 10 saved searches allowed" });

    const search = await SavedSearch.create({
      user: req.user.id,
      name,
      filters,
      emailAlert: emailAlert !== false,
    });
    res.status(201).json(search);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/saved-searches
exports.getSavedSearches = async (req, res) => {
  try {
    const searches = await SavedSearch.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(searches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/saved-searches/:id
exports.deleteSavedSearch = async (req, res) => {
  try {
    const result = await SavedSearch.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/saved-searches/:id — toggle email alerts
exports.updateSavedSearch = async (req, res) => {
  try {
    const search = await SavedSearch.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { emailAlert: req.body.emailAlert } },
      { new: true },
    );
    if (!search) return res.status(404).json({ error: "Not found" });
    res.json(search);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
