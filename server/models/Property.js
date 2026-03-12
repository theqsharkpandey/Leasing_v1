const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  // --- Core ---
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  images: [{ type: String }],
  videos: [{ type: String }],
  features: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },

  // --- Listing Intent ---
  listingIntent: {
    type: String,
    enum: ["buy", "rent", "new-launch"],
    required: true,
    default: "rent",
  },

  // --- Category (replaces old type field) ---
  category: {
    type: String,
    enum: ["residential", "commercial", "plots"],
    required: true,
    default: "commercial",
  },

  // --- Property Sub-type ---
  propertyType: {
    type: String,
    enum: [
      // Residential
      "apartment",
      "builder-floor",
      "villa",
      "independent-house",
      "studio",
      "farm-house",
      "penthouse",
      "serviced-apartment",
      "pg-coliving",
      // Commercial
      "office",
      "retail",
      "warehouse",
      "coworking",
      "showroom",
      "industrial-land",
      // Plots
      "residential-plot",
      "commercial-land",
      "agricultural-land",
      "farm-land",
    ],
    required: true,
  },

  // --- Location ---
  area: { type: String },
  state: { type: String },
  pincode: { type: String },
  landmark: { type: String },
  mapCoordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },

  // --- Residential Details ---
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  balconies: { type: Number },
  areaSqft: { type: Number },
  carpetArea: { type: Number },
  floorNumber: { type: Number },
  totalFloors: { type: Number },
  facing: {
    type: String,
    enum: [
      "north",
      "south",
      "east",
      "west",
      "north-east",
      "north-west",
      "south-east",
      "south-west",
    ],
  },
  furnishing: {
    type: String,
    enum: ["furnished", "semi-furnished", "unfurnished"],
  },
  propertyAge: {
    type: String,
    enum: [
      "under-construction",
      "less-than-1-year",
      "1-3-years",
      "3-5-years",
      "5-10-years",
      "10-plus-years",
    ],
  },
  possessionStatus: {
    type: String,
    enum: ["ready-to-move", "under-construction"],
  },
  possessionDate: { type: Date },

  // --- Financial ---
  pricePerSqft: { type: Number },
  maintenanceCharge: { type: Number },
  securityDeposit: { type: Number },
  priceNegotiable: { type: Boolean, default: false },

  // --- Ownership ---
  postedBy: {
    type: String,
    enum: ["owner", "agent", "builder"],
    default: "agent",
  },
  ownershipType: {
    type: String,
    enum: [
      "freehold",
      "leasehold",
      "cooperative",
      "power-of-attorney",
      "cooperative-society",
    ],
  },

  // --- Status & Verification ---
  status: {
    type: String,
    enum: [
      "pending_review",
      "approved",
      "rejected",
      "needs_documents",
      "verified",
      "leased",
      // legacy values kept for backward compat
      "active",
      "sold",
      "rented",
      "inactive",
      "pending-approval",
    ],
    default: "pending_review",
  },
  verificationStatus: {
    type: String,
    enum: [
      "not_verified",
      "documents_uploaded",
      "verification_call_pending",
      "verification_call_completed",
    ],
    default: "not_verified",
  },
  verifiedListing: { type: Boolean, default: false },
  rejectionReason: { type: String },

  // --- Submission ---
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contactPhone: { type: String },
  documents: [{ type: String }],

  // --- Amenities ---
  amenities: [
    {
      type: String,
      enum: [
        "parking",
        "lift",
        "power-backup",
        "security",
        "gym",
        "swimming-pool",
        "garden",
        "clubhouse",
        "children-play-area",
        "fire-safety",
        "water-storage",
        "rain-water-harvesting",
        "gas-pipeline",
        "visitor-parking",
        "intercom",
        "maintenance-staff",
        "wi-fi",
        "wifi",
        "waste-disposal",
        "gated-community",
        "piped-gas",
        "cctv",
        "ac",
        "atm",
        "shopping-center",
      ],
    },
  ],

  // --- Metadata ---
  views: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

// Text index for search
PropertySchema.index({
  title: "text",
  description: "text",
  city: "text",
  area: "text",
});

// Compound indexes for common queries
PropertySchema.index({ listingIntent: 1, category: 1, city: 1, status: 1 });
PropertySchema.index({ city: 1, propertyType: 1, price: 1 });
// Indexes for suggest autocomplete (prefix regex on title/city/area)
PropertySchema.index({ status: 1, title: 1 });
PropertySchema.index({ status: 1, city: 1 });
PropertySchema.index({ status: 1, area: 1 });

// Pre-save hook to auto-compute pricePerSqft and updatedAt
PropertySchema.pre("save", async function () {
  if (this.price && this.areaSqft) {
    this.pricePerSqft = Math.round(this.price / this.areaSqft);
  }
  this.updatedAt = new Date();
});

module.exports = mongoose.model("Property", PropertySchema);
