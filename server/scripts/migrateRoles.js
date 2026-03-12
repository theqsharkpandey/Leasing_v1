// One-time migration: rename role "user" -> "owner" to match updated enum
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const result = await mongoose.connection
      .collection("users")
      .updateMany({ role: "user" }, { $set: { role: "owner" } });
    console.log(
      `Migrated ${result.modifiedCount} user(s): role "user" → "owner"`,
    );

    // Also fix any missing accountStatus
    const r2 = await mongoose.connection
      .collection("users")
      .updateMany(
        { accountStatus: { $exists: false } },
        { $set: { accountStatus: "active" } },
      );
    console.log(
      `Fixed ${r2.modifiedCount} user(s): added missing accountStatus`,
    );

    process.exit(0);
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
