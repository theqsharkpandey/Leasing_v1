"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  X,
  BedDouble,
  Bath,
  Maximize2,
  Building2,
  MapPin,
  Calendar,
  Home,
} from "lucide-react";
import api from "@/lib/api";
import { useCompare } from "@/lib/compare-context";
import { FadeIn } from "@/components/Motion";

interface CompareProperty {
  _id: string;
  title: string;
  price: number;
  listingIntent?: string;
  category?: string;
  propertyType?: string;
  city: string;
  area?: string;
  state?: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  areaSqft?: number;
  carpetArea?: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  furnishing?: string;
  propertyAge?: string;
  possessionStatus?: string;
  postedBy?: string;
  ownershipType?: string;
  amenities?: string[];
  pricePerSqft?: number;
  maintenanceCharge?: number;
  securityDeposit?: number;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

const COMPARE_ROWS: {
  label: string;
  key: string;
  format?: (val: unknown) => string;
}[] = [
  { label: "Price", key: "price", format: (v) => formatPrice(v as number) },
  {
    label: "Price/sqft",
    key: "pricePerSqft",
    format: (v) => `₹${(v as number).toLocaleString("en-IN")}`,
  },
  { label: "Type", key: "propertyType" },
  { label: "Category", key: "category" },
  { label: "Listing", key: "listingIntent" },
  { label: "Bedrooms", key: "bedrooms", format: (v) => `${v} BHK` },
  { label: "Bathrooms", key: "bathrooms" },
  { label: "Balconies", key: "balconies" },
  {
    label: "Super Area",
    key: "areaSqft",
    format: (v) => `${(v as number).toLocaleString("en-IN")} sqft`,
  },
  {
    label: "Carpet Area",
    key: "carpetArea",
    format: (v) => `${(v as number).toLocaleString("en-IN")} sqft`,
  },
  {
    label: "Floor",
    key: "floorNumber",
    format: (v) => `${v}`,
  },
  { label: "Total Floors", key: "totalFloors" },
  { label: "Facing", key: "facing" },
  { label: "Furnishing", key: "furnishing" },
  { label: "Property Age", key: "propertyAge" },
  { label: "Possession", key: "possessionStatus" },
  { label: "Ownership", key: "ownershipType" },
  { label: "Posted By", key: "postedBy" },
  {
    label: "Maintenance",
    key: "maintenanceCharge",
    format: (v) => `₹${(v as number).toLocaleString("en-IN")}/mo`,
  },
  {
    label: "Security Deposit",
    key: "securityDeposit",
    format: (v) => formatPrice(v as number),
  },
];

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const [properties, setProperties] = useState<CompareProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .post("/properties/batch", { ids: compareIds })
      .then((res) => {
        // Maintain the order from compareIds
        const map = new Map(
          (res.data || []).map((p: CompareProperty) => [p._id, p]),
        );
        setProperties(
          compareIds
            .map((id) => map.get(id))
            .filter(Boolean) as CompareProperty[],
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [compareIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-white/5 rounded mb-8 animate-pulse" />
          <div className="h-[600px] bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <FadeIn className="text-center">
          <Home className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-xl mb-2">
            No Properties to Compare
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Add at least 2 properties to compare them side by side.
          </p>
          <Link
            href="/properties"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Browse Properties
          </Link>
        </FadeIn>
      </div>
    );
  }

  // Collect all amenities across all properties
  const allAmenities = [
    ...new Set(properties.flatMap((p) => p.amenities || [])),
  ].sort();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/properties"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Compare Properties ({properties.length})
            </h1>
          </div>
          <button
            onClick={clearCompare}
            className="text-sm text-gray-500 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>

        <FadeIn>
          <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Property images + titles header */}
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left text-sm font-medium text-gray-500 w-40 shrink-0 sticky left-0 bg-[#111118] z-10">
                      Property
                    </th>
                    {properties.map((p) => {
                      const imgUrl =
                        p.images?.[0] ||
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=60";
                      return (
                        <th key={p._id} className="p-4 text-left min-w-[240px]">
                          <div className="relative">
                            <button
                              onClick={() => removeFromCompare(p._id)}
                              className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center z-10"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <Link href={`/properties/${p._id}`}>
                              <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-white/5">
                                <Image
                                  src={imgUrl}
                                  alt={p.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <h3 className="text-white font-semibold text-sm line-clamp-2 hover:text-blue-400 transition-colors">
                                {p.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              {p.area ? `${p.area}, ` : ""}
                              {p.city}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {COMPARE_ROWS.map((row) => {
                    // Skip rows where all properties have null value
                    const hasValue = properties.some(
                      (p) =>
                        (p as unknown as Record<string, unknown>)[row.key] !=
                          null &&
                        (p as unknown as Record<string, unknown>)[row.key] !==
                          "",
                    );
                    if (!hasValue) return null;

                    // Check if values differ
                    const values = properties.map(
                      (p) => (p as unknown as Record<string, unknown>)[row.key],
                    );
                    const allSame = values.every(
                      (v) => String(v) === String(values[0]),
                    );

                    return (
                      <tr
                        key={row.key}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="p-4 text-sm text-gray-500 font-medium sticky left-0 bg-[#111118]">
                          {row.label}
                        </td>
                        {properties.map((p) => {
                          const val = (p as unknown as Record<string, unknown>)[
                            row.key
                          ];
                          const display =
                            val != null
                              ? row.format
                                ? row.format(val)
                                : String(val).replace(/-/g, " ")
                              : "—";
                          return (
                            <td
                              key={p._id}
                              className={`p-4 text-sm capitalize ${
                                val != null && !allSame
                                  ? "text-blue-400 font-medium"
                                  : val != null
                                    ? "text-gray-300"
                                    : "text-gray-600"
                              }`}
                            >
                              {display}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {/* Location row */}
                  <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-sm text-gray-500 font-medium sticky left-0 bg-[#111118]">
                      Location
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 text-sm text-gray-300">
                        {[p.area, p.city, p.state].filter(Boolean).join(", ")}
                      </td>
                    ))}
                  </tr>

                  {/* Amenities section */}
                  {allAmenities.length > 0 && (
                    <>
                      <tr className="border-b border-white/5">
                        <td
                          colSpan={properties.length + 1}
                          className="px-4 pt-5 pb-2 text-sm font-semibold text-white"
                        >
                          Amenities
                        </td>
                      </tr>
                      {allAmenities.map((amenity) => (
                        <tr
                          key={amenity}
                          className="border-b border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className="p-4 text-sm text-gray-500 capitalize sticky left-0 bg-[#111118]">
                            {amenity.replace(/-/g, " ")}
                          </td>
                          {properties.map((p) => {
                            const has = p.amenities?.includes(amenity);
                            return (
                              <td key={p._id} className="p-4">
                                {has ? (
                                  <Check className="h-4 w-4 text-green-400" />
                                ) : (
                                  <X className="h-4 w-4 text-gray-700" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
