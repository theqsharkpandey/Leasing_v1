const Review = require("../models/Review");
const Property = require("../models/Property");

// GET /api/reviews?property=:id
exports.getReviews = async (req, res) => {
  try {
    const { property } = req.query;
    if (!property)
      return res.status(400).json({ error: "property id required" });

    const reviews = await Review.find({ property })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const avg = reviews.length
      ? parseFloat(
          (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(
            1,
          ),
        )
      : 0;

    res.json({ reviews, avg, total: reviews.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { property, rating, title, body } = req.body;
    if (!property || !rating)
      return res.status(400).json({ error: "property and rating required" });

    const existing = await Review.findOne({ property, user: req.user.id });
    if (existing)
      return res
        .status(409)
        .json({ error: "You have already reviewed this property" });

    const review = await Review.create({
      property,
      user: req.user.id,
      rating,
      title,
      body,
    });

    const populated = await review.populate("user", "name");

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(409)
        .json({ error: "You have already reviewed this property" });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const isOwner = String(review.user) === String(req.user.id);
    const isAdmin = ["admin", "super_admin"].includes(req.user.role);
    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: "Forbidden" });

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
