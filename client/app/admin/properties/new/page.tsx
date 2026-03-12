"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

const PROPERTY_TYPES: Record<string, string[]> = {
  residential: [
    "apartment",
    "villa",
    "builder-floor",
    "independent-house",
    "penthouse",
    "studio",
  ],
  commercial: ["office", "retail", "warehouse", "coworking", "showroom"],
  plots: ["residential-plot", "commercial-plot", "agricultural-land"],
};

const AMENITIES = [
  "parking",
  "lift",
  "gym",
  "swimming-pool",
  "security",
  "power-backup",
  "water-supply",
  "garden",
  "clubhouse",
  "fire-safety",
  "cctv",
  "intercom",
  "rain-water-harvesting",
  "waste-disposal",
  "visitor-parking",
  "gas-pipeline",
  "children-play-area",
  "sports-facility",
  "wifi",
  "ac",
];

const FACING_OPTIONS = [
  "north",
  "south",
  "east",
  "west",
  "north-east",
  "north-west",
  "south-east",
  "south-west",
];

const inputCls =
  "w-full px-3 py-2.5 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50";
const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";
const selectCls =
  "w-full px-3 py-2.5 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none";

export default function AddPropertyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    listingIntent: "buy",
    category: "residential",
    propertyType: "apartment",
    price: "",
    city: "",
    area: "",
    state: "",
    pincode: "",
    landmark: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    areaSqft: "",
    carpetArea: "",
    floorNumber: "",
    totalFloors: "",
    facing: "",
    furnishing: "",
    propertyAge: "",
    possessionStatus: "",
    maintenanceCharge: "",
    securityDeposit: "",
    priceNegotiable: false,
    postedBy: "agent",
    ownershipType: "",
    status: "active",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function addImage() {
    const url = imageInput.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls((prev) => [...prev, url]);
      setImageInput("");
    }
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.price || !form.city) {
      alert("Please fill in Title, Price, and City.");
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        ...form,
        price: Number(form.price),
        images: imageUrls,
        amenities: selectedAmenities,
      };
      // Convert numeric fields
      const numericFields = [
        "bedrooms",
        "bathrooms",
        "balconies",
        "areaSqft",
        "carpetArea",
        "floorNumber",
        "totalFloors",
        "maintenanceCharge",
        "securityDeposit",
      ];
      for (const f of numericFields) {
        if (payload[f] === "") delete payload[f];
        else if (payload[f]) payload[f] = Number(payload[f]);
      }
      // Remove empty strings
      for (const [k, v] of Object.entries(payload)) {
        if (v === "") delete payload[k];
      }

      await api.post("/properties", payload);
      router.push("/admin/properties");
    } catch {
      alert("Failed to create property");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/properties"
          className="text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Property</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-[#111118] border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. Spacious 3 BHK Apartment in Gurgaon"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Listing Type *</label>
                <select
                  name="listingIntent"
                  value={form.listingIntent}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="buy">Buy / Sell</option>
                  <option value="rent">Rent</option>
                  <option value="new-launch">New Launch</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={(e) => {
                    handleChange(e);
                    const types = PROPERTY_TYPES[e.target.value] || [];
                    setForm((prev) => ({
                      ...prev,
                      propertyType: types[0] || "",
                    }));
                  }}
                  className={selectCls}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots / Land</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Property Type *</label>
                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  className={selectCls}
                >
                  {(PROPERTY_TYPES[form.category] || []).map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={inputCls}
                placeholder="Describe the property..."
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-[#111118] border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputCls}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className={labelCls}>Area / Locality</label>
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                className={inputCls}
                placeholder="Andheri West"
              />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputCls}
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <label className={labelCls}>Pincode</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className={inputCls}
                placeholder="400053"
              />
            </div>
            <div>
              <label className={labelCls}>Landmark</label>
              <input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className={inputCls}
                placeholder="Near Metro Station"
              />
            </div>
          </div>
        </section>

        {/* Property Details */}
        {form.category !== "plots" && (
          <section className="bg-[#111118] border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {form.category === "residential" && (
                <>
                  <div>
                    <label className={labelCls}>Bedrooms</label>
                    <input
                      name="bedrooms"
                      type="number"
                      value={form.bedrooms}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Bathrooms</label>
                    <input
                      name="bathrooms"
                      type="number"
                      value={form.bathrooms}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Balconies</label>
                    <input
                      name="balconies"
                      type="number"
                      value={form.balconies}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="1"
                    />
                  </div>
                </>
              )}
              <div>
                <label className={labelCls}>Super Area (sqft)</label>
                <input
                  name="areaSqft"
                  type="number"
                  value={form.areaSqft}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="1450"
                />
              </div>
              <div>
                <label className={labelCls}>Carpet Area (sqft)</label>
                <input
                  name="carpetArea"
                  type="number"
                  value={form.carpetArea}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="1200"
                />
              </div>
              <div>
                <label className={labelCls}>Floor Number</label>
                <input
                  name="floorNumber"
                  type="number"
                  value={form.floorNumber}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="5"
                />
              </div>
              <div>
                <label className={labelCls}>Total Floors</label>
                <input
                  name="totalFloors"
                  type="number"
                  value={form.totalFloors}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="20"
                />
              </div>
              <div>
                <label className={labelCls}>Facing</label>
                <select
                  name="facing"
                  value={form.facing}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="">Select</option>
                  {FACING_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Furnishing</label>
                <select
                  name="furnishing"
                  value={form.furnishing}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="">Select</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Property Age</label>
                <select
                  name="propertyAge"
                  value={form.propertyAge}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="">Select</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="0-1 years">0-1 Years</option>
                  <option value="1-5 years">1-5 Years</option>
                  <option value="5-10 years">5-10 Years</option>
                  <option value="10+ years">10+ Years</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Possession</label>
                <select
                  name="possessionStatus"
                  value={form.possessionStatus}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="">Select</option>
                  <option value="ready-to-move">Ready to Move</option>
                  <option value="under-construction">Under Construction</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="bg-[#111118] border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Price (INR) *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className={inputCls}
                placeholder="5000000"
              />
            </div>
            <div>
              <label className={labelCls}>Maintenance (INR/mo)</label>
              <input
                name="maintenanceCharge"
                type="number"
                value={form.maintenanceCharge}
                onChange={handleChange}
                className={inputCls}
                placeholder="5000"
              />
            </div>
            <div>
              <label className={labelCls}>Security Deposit (INR)</label>
              <input
                name="securityDeposit"
                type="number"
                value={form.securityDeposit}
                onChange={handleChange}
                className={inputCls}
                placeholder="100000"
              />
            </div>
            <div>
              <label className={labelCls}>Ownership Type</label>
              <select
                name="ownershipType"
                value={form.ownershipType}
                onChange={handleChange}
                className={selectCls}
              >
                <option value="">Select</option>
                <option value="freehold">Freehold</option>
                <option value="leasehold">Leasehold</option>
                <option value="co-operative">Co-operative Society</option>
                <option value="power-of-attorney">Power of Attorney</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Posted By</label>
              <select
                name="postedBy"
                value={form.postedBy}
                onChange={handleChange}
                className={selectCls}
              >
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
                <option value="builder">Builder</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={selectCls}
              >
                <option value="active">Active</option>
                <option value="pending-approval">Pending Approval</option>
                <option value="inactive">Inactive</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="priceNegotiable"
                  checked={form.priceNegotiable}
                  onChange={handleChange}
                  className="rounded border-white/10 bg-[#0a0a0f] text-blue-600 focus:ring-blue-500/50"
                />
                Price Negotiable
              </label>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-[#111118] border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Images</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              className={`${inputCls} flex-1`}
              placeholder="Paste image URL and press Enter..."
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Upload className="h-4 w-4" />
              Add
            </button>
          </div>
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url) => (
                <div
                  key={url}
                  className="relative h-24 w-32 rounded-lg overflow-hidden border border-white/10 bg-white/5"
                >
                  <Image
                    src={url}
                    alt="Property"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 h-5 w-5 bg-red-500/80 rounded-full flex items-center justify-center"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-600 mt-2">
            Add image URLs. For production, use the upload endpoint at
            /api/upload/images.
          </p>
        </section>

        {/* Amenities */}
        <section className="bg-[#111118] border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg border transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                    : "border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="sr-only"
                />
                <span className="capitalize">{amenity.replace(/-/g, " ")}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-[#111118] border border-white/10 text-gray-400 hover:text-white text-sm rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Creating..." : "Create Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
