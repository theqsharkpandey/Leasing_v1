/**
 * Seed Script: Create first super_admin
 *
 * Usage:
 *   node server/scripts/seedSuperAdmin.js
 *
 * Set environment variables or edit the values below before running.
 * Run ONCE. If the email already exists the script will exit safely.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Configure these before running ────────────────────────────────────────────
const SUPER_ADMIN_NAME = process.env.SA_NAME || "Super Admin";
const SUPER_ADMIN_EMAIL = process.env.SA_EMAIL || "superadmin@leasingworld.com";
const SUPER_ADMIN_PASSWORD = process.env.SA_PASSWORD || "Change_Me_Now!23";
// ─────────────────────────────────────────────────────────────────────────────

const User = require("../models/User");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: SUPER_ADMIN_EMAIL });
    if (existing) {
      console.log(
        `[SKIP] User ${SUPER_ADMIN_EMAIL} already exists with role: ${existing.role}`,
      );
      if (existing.role !== "super_admin") {
        existing.role = "super_admin";
        existing.accountStatus = "active";
        await existing.save();
        console.log(`[UPDATED] Promoted ${SUPER_ADMIN_EMAIL} to super_admin`);
      }
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);

    const superAdmin = new User({
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "super_admin",
      accountStatus: "active",
    });

    await superAdmin.save();
    console.log(`[SUCCESS] super_admin created: ${SUPER_ADMIN_EMAIL}`);
    console.log(
      "⚠️  IMPORTANT: Change the password immediately after first login!",
    );
  } catch (err) {
    console.error("[ERROR]", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
