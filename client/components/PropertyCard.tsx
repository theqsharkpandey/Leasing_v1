"use client";

import React from "react";
import { useShortlist } from "@/lib/shortlist-context";
import { useCompare } from "@/lib/compare-context";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Heart,
  BedDouble,
  Maximize2,
  Building2,
  BadgeCheck,
  User,
  HardHat,
  GitCompareArrows,
} from "lucide-react";

export interface Property {
  _id: string;
  title: string;
  price: number;
  listingIntent?: string;
  category?: string;
  propertyType?: string;
  city: string;
  area?: string;
  images: string[];
  videos?: string[];
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnishing?: string;
  postedBy?: string;
  verifiedListing?: boolean;
  createdAt?: string;
  agent?: { name: string; email: string; phone?: string };
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} L`;
  return price.toLocaleString("en-IN");
}

function isNewListing(createdAt?: string): boolean {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

const POSTED_BY_ICON: Record<string, React.ElementType> = {
  owner: User,
  agent: Building2,
  builder: HardHat,
};

export default React.memo(PropertyCard);

function PropertyCard({
  property,
  layout = "grid",
}: {
  property: Property;
  layout?: "grid" | "list";
}) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const wishlisted = isShortlisted(property._id);
  const comparing = isInCompare(property._id);

  const postedByIcon = POSTED_BY_ICON[property.postedBy || "owner"] || User;
  const PostedByIcon = postedByIcon;

  const imageUrl =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

  const infoPills: string[] = [];
  if (property.bedrooms) infoPills.push(`${property.bedrooms} BHK`);
  if (property.areaSqft)
    infoPills.push(`${property.areaSqft.toLocaleString("en-IN")} sqft`);
  if (property.floorNumber != null && property.totalFloors)
    infoPills.push(`Floor ${property.floorNumber}/${property.totalFloors}`);
  else if (property.floorNumber != null)
    infoPills.push(`${property.floorNumber}th Floor`);
  if (property.furnishing) infoPills.push(property.furnishing);

  if (layout === "list") {
    return (
      <Link href={`/properties/${property._id}`} className="block group">
        <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors flex">
          {/* Image */}
          <div className="relative w-64 min-h-[180px] shrink-0 bg-white/5">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes="256px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 flex gap-1.5">
              {property.propertyType && (
                <span className="bg-blue-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {property.propertyType.replace(/-/g, " ").toUpperCase()}
                </span>
              )}
              {property.verifiedListing && (
                <span className="bg-green-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <BadgeCheck className="h-3 w-3" /> VERIFIED
                </span>
              )}
              {isNewListing(property.createdAt) && (
                <span className="bg-amber-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  NEW
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleShortlist(property._id);
              }}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-white/70"}`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-semibold line-clamp-1 mb-1">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">
                  {property.area ? `${property.area}, ` : ""}
                  {property.city}
                </span>
              </div>
              {infoPills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {infoPills.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-blue-400 font-bold text-lg">
                ₹{formatPrice(property.price)}
                {property.listingIntent === "rent" && (
                  <span className="text-gray-500 font-normal text-sm">/mo</span>
                )}
              </p>
              {property.postedBy && (
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded capitalize">
                  <PostedByIcon className="h-3 w-3" />
                  {property.postedBy}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout (default)
  return (
    <Link href={`/properties/${property._id}`} className="block group">
      <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 w-full bg-white/5">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {property.propertyType && (
              <span className="bg-blue-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                {property.propertyType.replace(/-/g, " ").toUpperCase()}
              </span>
            )}
            {property.verifiedListing && (
              <span className="bg-green-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-0.5">
                <BadgeCheck className="h-3 w-3" /> VERIFIED
              </span>
            )}
            {isNewListing(property.createdAt) && (
              <span className="bg-amber-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleShortlist(property._id);
            }}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-white/70"}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              comparing
                ? removeFromCompare(property._id)
                : addToCompare(property._id);
            }}
            className={`absolute bottom-2 right-2 h-7 rounded-full backdrop-blur-sm flex items-center gap-1 px-2 text-[10px] font-medium transition-all ${
              comparing
                ? "bg-blue-600/80 text-white"
                : "bg-black/50 text-white/70 hover:text-white"
            }`}
          >
            <GitCompareArrows className="h-3 w-3" />
            {comparing ? "Added" : "Compare"}
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-1.5">
            {property.title}
          </h3>
          <p className="text-blue-400 font-bold text-lg mb-1.5">
            ₹{formatPrice(property.price)}
            {property.listingIntent === "rent" && (
              <span className="text-gray-500 font-normal text-sm">/mo</span>
            )}
          </p>

          {infoPills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 mb-2">
              {property.bedrooms && (
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="h-3 w-3" />
                  {property.bedrooms} BHK
                </span>
              )}
              {property.areaSqft && (
                <span className="inline-flex items-center gap-1">
                  <Maximize2 className="h-3 w-3" />
                  {property.areaSqft.toLocaleString("en-IN")} sqft
                </span>
              )}
              {property.floorNumber != null && (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {property.floorNumber}
                  {property.totalFloors
                    ? `/${property.totalFloors}`
                    : "th"}{" "}
                  Floor
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">
                {property.area ? `${property.area}, ` : ""}
                {property.city}
              </span>
            </div>
            {property.postedBy && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 capitalize">
                <PostedByIcon className="h-3 w-3" />
                {property.postedBy}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
