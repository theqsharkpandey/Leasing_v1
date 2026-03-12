const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 120 },
    body: { type: String, maxlength: 1000 },
  },
  { timestamps: true },
);

// One review per user per property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
