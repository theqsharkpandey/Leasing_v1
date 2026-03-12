const mongoose = require("mongoose");

const savedSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, maxlength: 80 },
    filters: { type: Object, default: {} }, // stores the query params object
    emailAlert: { type: Boolean, default: true },
    lastNotified: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SavedSearch", savedSearchSchema);
