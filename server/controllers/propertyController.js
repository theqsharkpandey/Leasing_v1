const Property = require("../models/Property");
const User = require("../models/User");
const emailService = require("../services/emailService");
const https = require("https");

// Geocode an address string using the free Nominatim (OpenStreetMap) API.
// Returns { lat, lng } or null on failure.
function geocodeAddress(address) {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(address);
    const options = {
      hostname: "nominatim.openstreetmap.org",
      path: `/search?format=json&q=${encoded}&limit=1&addressdetails=0`,
      method: "GET",
      headers: {
        "User-Agent": "LeasingWorld/1.0 (leasing-app)",
        "Accept-Language": "en",
      },
    };
    const req = https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.length > 0) {
            resolve({
              lat: parseFloat(parsed[0].lat),
              lng: parseFloat(parsed[0].lon),
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(6000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

// Only super_admin/admin gets auto-approved status; all other roles go through review
const PUBLIC_ROLES = ["owner", "user", "public_user", "agent", "builder"];

// ─── CREATE ──────────────────────────────────────────────────────────────────
exports.createProperty = async (req, res) => {
  try {
    const isPublic = PUBLIC_ROLES.includes(req.user.role);
    const roleToPostedBy = {
      owner: "owner",
      user: "owner",
      public_user: "owner",
      agent: "agent",
      builder: "builder",
      admin: "agent",
      super_admin: "agent",
    };
    // Auto-geocode the address if coordinates were not supplied by the client
    let coords = req.body.mapCoordinates;
    if (!coords || !coords.lat || !coords.lng) {
      const addressParts = [
        req.body.landmark,
        req.body.area,
        req.body.city,
        req.body.state,
        req.body.pincode,
        "India",
      ].filter(Boolean);
      if (addressParts.length > 1) {
        coords = await geocodeAddress(addressParts.join(", "));
      }
    }

    const property = new Property({
      ...req.body,
      agent: req.user.id,
      submittedBy: req.user.id,
      postedBy: roleToPostedBy[req.user.role] || "owner",
      status: isPublic ? "pending_review" : "approved",
      verificationStatus: "not_verified",
      mapCoordinates: coords || undefined,
    });
    await property.save();
    if (isPublic) {
      const user = await User.findById(req.user.id);
      if (user)
        emailService.sendPropertySubmitted(property, user).catch(() => {});
    }
    res.status(201).json(property);
  } catch (err) {
    console.error("Create Property Error:", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ error: `Invalid value for field: ${err.path}` });
    }
    res.status(500).json({ error: err.message });
  }
};

// ─── ADMIN MODERATION ────────────────────────────────────────────────────────
exports.moderateProperty = async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    let submitter = property.submittedBy
      ? await User.findById(property.submittedBy)
      : null;
    switch (action) {
      case "approve":
        property.status = "approved";
        property.rejectionReason = undefined;
        if (submitter) {
          emailService
            .sendPropertyApproved(property, submitter)
            .catch(() => {});
        }
        break;
      case "reject":
        property.status = "rejected";
        property.rejectionReason = rejectionReason || "";
        if (submitter) {
          emailService
            .sendPropertyRejected(property, submitter, rejectionReason)
            .catch(() => {});
        }
        break;
      case "request_documents":
        property.status = "needs_documents";
        if (submitter) {
          emailService
            .sendDocumentsRequested(property, submitter)
            .catch(() => {});
        }
        break;
      case "schedule_call":
        property.verificationStatus = "verification_call_pending";
        if (submitter) {
          emailService
            .sendVerificationCallScheduled(property, submitter)
            .catch(() => {});
        }
        break;
      case "mark_verified":
        property.status = "verified";
        property.verificationStatus = "verification_call_completed";
        property.verifiedListing = true;
        break;
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    console.error("Moderate Property Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─── ADMIN: ALL PROPERTIES WITH COUNTS ───────────────────────────────────────
exports.getAdminProperties = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status && status !== "all") {
      query.status = status.includes(",") ? { $in: status.split(",") } : status;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total, counts] = await Promise.all([
      Property.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip)
        .populate("agent", "name email phone")
        .populate("submittedBy", "name email phone"),
      Property.countDocuments(query),
      Property.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    const statusCounts = {};
    counts.forEach((c) => (statusCounts[c._id] = c.count));
    res.json({
      properties,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      statusCounts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const {
      q,
      listingIntent,
      category,
      propertyType,
      city,
      area,
      bedrooms,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      furnishing,
      possessionStatus,
      postedBy,
      amenities,
      sort,
      page = 1,
      limit = 12,
      status,
    } = req.query;

    // Public callers get only approved/verified; admins can pass explicit status
    let statusFilter;
    if (status && status !== "public") {
      statusFilter = status.includes(",") ? { $in: status.split(",") } : status;
    } else {
      statusFilter = { $in: ["approved", "verified", "active"] };
    }
    let query = { status: statusFilter };

    if (q) query.$text = { $search: q };
    if (listingIntent) query.listingIntent = listingIntent;
    if (category) query.category = category;
    if (propertyType) {
      const types = propertyType.split(",");
      query.propertyType = types.length === 1 ? types[0] : { $in: types };
    }
    if (city) query.city = { $regex: city, $options: "i" };
    if (area) query.area = { $regex: area, $options: "i" };
    if (bedrooms) query.bedrooms = { $in: bedrooms.split(",").map(Number) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
      query.areaSqft = {};
      if (minArea) query.areaSqft.$gte = Number(minArea);
      if (maxArea) query.areaSqft.$lte = Number(maxArea);
    }
    if (furnishing) query.furnishing = furnishing;
    if (possessionStatus) query.possessionStatus = possessionStatus;
    if (postedBy) query.postedBy = postedBy;
    if (amenities) query.amenities = { $all: amenities.split(",") };

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "area_asc") sortOption = { areaSqft: 1 };
    if (sort === "area_desc") sortOption = { areaSqft: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const lim = Number(limit);

    // Single aggregation: fetch page + total count in one round-trip
    const [result] = await Property.aggregate([
      { $match: query },
      {
        $facet: {
          properties: [{ $sort: sortOption }, { $skip: skip }, { $limit: lim }],
          count: [{ $count: "total" }],
        },
      },
    ]);
    let properties = result.properties || [];
    const total = result.count[0]?.total || 0;

    // Populate agent field on the returned docs
    properties = await Property.populate(properties, {
      path: "agent",
      select: "name email phone",
    });

    res.json({
      properties,
      total,
      totalPages: Math.ceil(total / lim),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { q, listingIntent, category } = req.query;
    if (!q || q.trim().length < 1) return res.json({ suggestions: [] });
    const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const startRegex = new RegExp(`^${escaped}`, "i");
    const statusFilter = {
      $nin: [
        "rejected",
        "inactive",
        "sold",
        "rented",
        "leased",
        "needs_documents",
        "pending-approval",
      ],
    };
    const base = { status: statusFilter };
    if (listingIntent) base.listingIntent = listingIntent;
    if (category) base.category = category;
    const [cities, areas, props] = await Promise.all([
      Property.distinct("city", { ...base, city: { $regex: startRegex } }),
      Property.distinct("area", { ...base, area: { $regex: startRegex } }),
      Property.find({ ...base, title: { $regex: startRegex } })
        .select("_id title city")
        .limit(4)
        .lean(),
    ]);
    const suggestions = [
      ...cities.slice(0, 3).map((c) => ({ type: "city", label: c })),
      ...areas.slice(0, 3).map((a) => ({ type: "area", label: a })),
      ...props.map((p) => ({
        type: "property",
        label: p.title,
        sublabel: p.city,
        id: String(p._id),
      })),
    ];
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("agent", "name email phone companyName")
      .populate("submittedBy", "name email");
    if (!property) return res.status(404).json({ error: "Property not found" });
    property.views = (property.views || 0) + 1;
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSimilarProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    const priceRange = property.price * 0.3;
    const similar = await Property.find({
      _id: { $ne: property._id },
      status: { $in: ["approved", "verified", "active"] },
      city: property.city,
      category: property.category,
      price: {
        $gte: property.price - priceRange,
        $lte: property.price + priceRange,
      },
    })
      .limit(6)
      .populate("agent", "name email phone");
    res.json(similar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertiesByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids))
      return res.status(400).json({ error: "ids array required" });
    if (ids.length > 20)
      return res.status(400).json({ error: "Maximum 20 ids allowed" });

    const properties = await Property.find({
      _id: { $in: ids },
      status: { $in: ["approved", "verified", "active"] },
    }).populate("agent", "name email phone");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const { status, page = 1, limit = 12 } = req.query;
    let query = { submittedBy: req.user.id };
    if (status && status !== "all") query.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);
    const total = await Property.countDocuments(query);
    res.json({
      properties,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Non-admins can only edit their own properties
    const isAdmin = ["admin", "super_admin"].includes(req.user.role);
    if (!isAdmin && String(property.submittedBy) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Not authorised to edit this property" });
    }

    // Non-admins cannot change status directly
    if (!isAdmin) {
      delete req.body.status;
      delete req.body.verificationStatus;
    }

    // Re-geocode if address fields changed and no coords provided
    if (!req.body.mapCoordinates || !req.body.mapCoordinates.lat) {
      const addressParts = [
        req.body.landmark ?? property.landmark,
        req.body.area ?? property.area,
        req.body.city ?? property.city,
        req.body.state ?? property.state,
        req.body.pincode ?? property.pincode,
        "India",
      ].filter(Boolean);
      if (addressParts.length > 1) {
        const coords = await geocodeAddress(addressParts.join(", "));
        if (coords) req.body.mapCoordinates = coords;
      }
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Non-admins can only delete their own properties
    const isAdmin = ["admin", "super_admin"].includes(req.user.role);
    if (!isAdmin && String(property.submittedBy) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Not authorised to delete this property" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
