const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "owner",
        "agent",
        "builder",
        "admin",
        "super_admin",
        "public_user",
      ],
      default: "owner",
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    avatar: {
      type: String,
    },
    city: {
      type: String,
    },
    companyName: {
      type: String,
    },
    reraNumber: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
