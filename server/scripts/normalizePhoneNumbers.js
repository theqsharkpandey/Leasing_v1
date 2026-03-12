/**
 * One-time migration: normalise all phone numbers in User and Property
 * collections to proper E.164 format for India (+91).
 *
 * Rules applied (in order):
 *  1. Strip everything except digits.
 *  2. If empty → skip (leave unchanged).
 *  3. If already 12 digits starting with "91" → already correct.
 *  4. If 13 digits starting with "091" → strip leading "0".
 *  5. If starts with "91" and is > 12 digits → leave as-is (unusual, skip).
 *  6. If starts with "0" and remaining digits are 10 → strip the "0", prepend "91".
 *  7. If exactly 10 digits → prepend "91".
 *  8. Anything else → leave as-is (could be international, don't guess).
 *
 * Run:  node server/scripts/normalizePhoneNumbers.js
 */

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Property = require("../models/Property");

function normalize(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return null;

  // Already correct E.164 India: 91XXXXXXXXXX (12 digits)
  if (digits.length === 12 && digits.startsWith("91")) return digits;

  // 91 + leading zero artefact: 091XXXXXXXXXX (13 digits)
  if (digits.length === 13 && digits.startsWith("091"))
    return `91${digits.slice(3)}`;

  // Leading 0 + 10-digit number: 0XXXXXXXXXX
  if (digits.startsWith("0") && digits.length === 11)
    return `91${digits.slice(1)}`;

  // Plain 10-digit Indian mobile
  if (digits.length === 10) return `91${digits}`;

  // Can't determine — return unchanged digits (no dashes/spaces at least)
  return digits;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  /* ── Users ───────────────────────────────────────────────────── */
  const users = await User.find({
    phone: { $exists: true, $ne: null, $ne: "" },
  });
  let userUpdated = 0;
  let userSkipped = 0;

  for (const u of users) {
    const fixed = normalize(u.phone);
    if (!fixed) {
      userSkipped++;
      continue;
    }
    if (fixed === u.phone) {
      userSkipped++;
      continue;
    }
    await User.updateOne({ _id: u._id }, { $set: { phone: fixed } });
    console.log(`  User [${u.email}]: "${u.phone}" → "${fixed}"`);
    userUpdated++;
  }

  /* ── Properties (contactPhone) ───────────────────────────────── */
  const props = await Property.find({
    contactPhone: { $exists: true, $ne: null, $ne: "" },
  });
  let propUpdated = 0;
  let propSkipped = 0;

  for (const p of props) {
    const fixed = normalize(p.contactPhone);
    if (!fixed) {
      propSkipped++;
      continue;
    }
    if (fixed === p.contactPhone) {
      propSkipped++;
      continue;
    }
    await Property.updateOne({ _id: p._id }, { $set: { contactPhone: fixed } });
    console.log(`  Property [${p.title}]: "${p.contactPhone}" → "${fixed}"`);
    propUpdated++;
  }

  console.log("\n── Summary ─────────────────────────");
  console.log(
    `Users:      ${userUpdated} updated, ${userSkipped} already correct / skipped`,
  );
  console.log(
    `Properties: ${propUpdated} updated, ${propSkipped} already correct / skipped`,
  );

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
