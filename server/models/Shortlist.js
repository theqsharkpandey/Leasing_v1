const mongoose = require("mongoose");

const ShortlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ShortlistSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model("Shortlist", ShortlistSchema);
