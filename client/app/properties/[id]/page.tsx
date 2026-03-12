"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Heart,
  Home,
  ChevronRight,
  Check,
  BedDouble,
  Bath,
  Maximize2,
  Building2,
  Calendar,
  Eye,
  GitCompareArrows,
  CalendarCheck,
  Star,
  Phone,
  Copy,
} from "lucide-react";
import api from "@/lib/api";
import { useShortlist } from "@/lib/shortlist-context";
import { useCompare } from "@/lib/compare-context";
import { addToRecentlyViewed } from "@/lib/recently-viewed";
import { FadeIn } from "@/components/Motion";
import ImageGallery from "@/components/ImageGallery";
import EMICalculator from "@/components/EMICalculator";
import PropertySpecs from "@/components/PropertySpecs";
import ShareButton from "@/components/ShareButton";
import LeadForm from "@/components/LeadForm";
import PropertyCard, { Property } from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import NearbyPlaces from "@/components/NearbyPlaces";
import ReviewSection from "@/components/ReviewSection";
import ScheduleVisitModal from "@/components/ScheduleVisitModal";

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} L`;
  return price.toLocaleString("en-IN");
}

/** Normalise any Indian phone number to the E.164 digits WhatsApp expects (e.g. 916395487932) */
function toWaNumber(raw?: string): string {
  if (!raw) return "";
  const d = raw.replace(/\D/g, "");
  if (!d) return "";
  if (d.length === 12 && d.startsWith("91")) return d; // already correct
  if (d.length === 13 && d.startsWith("091")) return `91${d.slice(3)}`;
  if (d.startsWith("0") && d.length === 11) return `91${d.slice(1)}`;
  if (d.length === 10) return `91${d}`;
  return d; // international or unusual — use as-is
}

/** Format E.164 digits as a human-readable phone number, e.g. "916395487932" → "+91 63954 87932" */
function formatDisplayPhone(raw?: string): string {
  const d = toWaNumber(raw);
  if (!d) return "";
  if (d.startsWith("91") && d.length === 12) {
    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  }
  return `+${d}`;
}

interface FullProperty extends Property {
  description?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  balconies?: number;
  carpetArea?: number;
  totalFloors?: number;
  facing?: string;
  propertyAge?: string;
  possessionStatus?: string;
  possessionDate?: string;
  pricePerSqft?: number;
  maintenanceCharge?: number;
  securityDeposit?: number;
  priceNegotiable?: boolean;
  ownershipType?: string;
  amenities?: string[];
  features?: string[];
  videos?: string[];
  views?: number;
  mapCoordinates?: { lat: number; lng: number };
  status?: string;
  contactPhone?: string;
}

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[1280px] mx-auto px-4 py-6 animate-pulse">
        <div className="h-4 w-48 bg-white/5 rounded mb-6" />
        <div className="h-[420px] bg-white/5 rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-3/4 bg-white/5 rounded" />
            <div className="h-5 w-1/2 bg-white/5 rounded" />
            <div className="h-40 bg-white/5 rounded-xl" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-white/5 rounded-xl" />
            <div className="h-64 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<FullProperty | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isShortlisted, toggleShortlist } = useShortlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const wishlisted = isShortlisted(id);
  const comparing = isInCompare(id);

  useEffect(() => {
    if (id) addToRecentlyViewed(id);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propRes, simRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get(`/properties/${id}/similar`).catch(() => ({ data: [] })),
        ]);
        setProperty(propRes.data);
        setSimilar(simRes.data || []);
      } catch {
        setError("Property not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <PropertyDetailSkeleton />;
  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <FadeIn className="text-center">
          <Home className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-xl mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The property you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/properties"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Browse Properties
          </Link>
        </FadeIn>
      </div>
    );
  }

  const specs = [
    { label: "Property Type", value: property.propertyType },
    { label: "Category", value: property.category },
    { label: "Listing", value: property.listingIntent },
    {
      label: "BHK",
      value: property.bedrooms ? `${property.bedrooms} BHK` : undefined,
    },
    { label: "Bathrooms", value: property.bathrooms },
    { label: "Balconies", value: property.balconies },
    {
      label: "Super Area",
      value: property.areaSqft
        ? `${property.areaSqft.toLocaleString("en-IN")} sqft`
        : undefined,
    },
    {
      label: "Carpet Area",
      value: property.carpetArea
        ? `${property.carpetArea.toLocaleString("en-IN")} sqft`
        : undefined,
    },
    {
      label: "Floor",
      value:
        property.floorNumber != null
          ? `${property.floorNumber}${property.totalFloors ? ` of ${property.totalFloors}` : ""}`
          : undefined,
    },
    { label: "Facing", value: property.facing },
    { label: "Furnishing", value: property.furnishing },
    { label: "Property Age", value: property.propertyAge },
    { label: "Possession", value: property.possessionStatus },
    { label: "Ownership", value: property.ownershipType },
    {
      label: "Price/sqft",
      value: property.pricePerSqft
        ? `₹${property.pricePerSqft.toLocaleString("en-IN")}`
        : undefined,
    },
    {
      label: "Maintenance",
      value: property.maintenanceCharge
        ? `₹${property.maintenanceCharge.toLocaleString("en-IN")}/mo`
        : undefined,
    },
    {
      label: "Security Deposit",
      value: property.securityDeposit
        ? `₹${formatPrice(property.securityDeposit)}`
        : undefined,
    },
    {
      label: "Negotiable",
      value: property.priceNegotiable ? "Yes" : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5 flex-wrap">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            <Home className="h-3 w-3" />
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href="/properties"
            className="hover:text-gray-300 transition-colors"
          >
            Properties
          </Link>
          {property.city && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/properties?city=${property.city}`}
                className="hover:text-gray-300 transition-colors"
              >
                {property.city}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-400 line-clamp-1">{property.title}</span>
        </nav>

        {/* Image Gallery */}
        <FadeIn className="mb-8">
          <ImageGallery images={property.images || []} title={property.title} />
        </FadeIn>

        {/* Property Videos */}
        {property.videos && property.videos.length > 0 && (
          <FadeIn className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Property Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.videos.map((url, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-white/10 bg-black"
                >
                  <video
                    src={url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Title Section */}
        <FadeIn className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  {[property.area, property.city, property.state]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
              {property.views != null && (
                <div className="flex items-center gap-1 text-gray-600 text-xs mt-2">
                  <Eye className="h-3 w-3" />
                  <span>{property.views} views</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleShortlist(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors ${
                  wishlisted
                    ? "border-red-500/50 text-red-400 bg-red-500/10"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${wishlisted ? "fill-red-400" : ""}`}
                />
                {wishlisted ? "Saved" : "Save"}
              </button>
              <button
                onClick={() =>
                  comparing ? removeFromCompare(id) : addToCompare(id)
                }
                className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors ${
                  comparing
                    ? "border-blue-500/50 text-blue-400 bg-blue-500/10"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                <GitCompareArrows className="h-4 w-4" />
                {comparing ? "In Compare" : "Compare"}
              </button>
              <ShareButton />
            </div>
          </div>
        </FadeIn>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Pills */}
            <FadeIn>
              <div className="flex flex-wrap gap-3">
                {property.bedrooms && (
                  <div className="flex items-center gap-1.5 bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                    <BedDouble className="h-4 w-4 text-blue-400" />
                    {property.bedrooms} BHK
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1.5 bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                    <Bath className="h-4 w-4 text-blue-400" />
                    {property.bathrooms} Bath
                  </div>
                )}
                {property.areaSqft && (
                  <div className="flex items-center gap-1.5 bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                    <Maximize2 className="h-4 w-4 text-blue-400" />
                    {property.areaSqft.toLocaleString("en-IN")} sqft
                  </div>
                )}
                {property.floorNumber != null && (
                  <div className="flex items-center gap-1.5 bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                    <Building2 className="h-4 w-4 text-blue-400" />
                    Floor {property.floorNumber}
                    {property.totalFloors ? ` of ${property.totalFloors}` : ""}
                  </div>
                )}
                {property.possessionStatus && (
                  <div className="flex items-center gap-1.5 bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    {property.possessionStatus.replace(/-/g, " ")}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Price */}
            <FadeIn>
              <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-blue-400">
                    ₹{formatPrice(property.price)}
                  </span>
                  {property.listingIntent === "rent" && (
                    <span className="text-gray-500 text-sm">/month</span>
                  )}
                  {property.priceNegotiable && (
                    <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">
                      Negotiable
                    </span>
                  )}
                </div>
                {property.pricePerSqft && (
                  <p className="text-gray-500 text-sm">
                    ₹{property.pricePerSqft.toLocaleString("en-IN")} per sqft
                  </p>
                )}
              </div>
            </FadeIn>

            {/* Description */}
            {property.description && (
              <FadeIn>
                <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-3">
                    About this property
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </FadeIn>
            )}

            {/* Specs Table */}
            <FadeIn>
              <PropertySpecs specs={specs} />
            </FadeIn>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <FadeIn>
                <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <Check className="h-4 w-4 text-green-400 shrink-0" />
                        <span className="capitalize">
                          {amenity.replace(/-/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* EMI Calculator (for buy intent) */}
            {property.listingIntent !== "rent" && property.price > 0 && (
              <FadeIn>
                <EMICalculator propertyPrice={property.price} />
              </FadeIn>
            )}

            {/* Map */}
            <FadeIn>
              <div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  Location
                </h3>
                <PropertyMap
                  coordinates={property.mapCoordinates}
                  address={[
                    property.landmark,
                    property.area,
                    property.city,
                    property.state,
                    property.pincode,
                    "India",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  title={property.title}
                />
              </div>
            </FadeIn>

            {/* Nearby Places */}
            {property.mapCoordinates?.lat && property.mapCoordinates?.lng && (
              <FadeIn>
                <NearbyPlaces
                  lat={property.mapCoordinates.lat}
                  lng={property.mapCoordinates.lng}
                />
              </FadeIn>
            )}

            {/* Similar Properties */}
            {similar.length > 0 && (
              <FadeIn>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Similar Properties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {similar.map((prop) => (
                      <PropertyCard
                        key={prop._id}
                        property={prop}
                        layout="grid"
                      />
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Reviews */}
            <FadeIn>
              <ReviewSection propertyId={id} />
            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-24 space-y-5">
              {/* Price Card */}
              <FadeIn>
                <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
                  <p className="text-gray-500 text-xs mb-1 uppercase">
                    {property.listingIntent === "rent"
                      ? "Rent Price"
                      : "Sale Price"}
                  </p>
                  <div className="text-2xl font-bold text-blue-400 mb-4">
                    ₹{formatPrice(property.price)}
                    {property.listingIntent === "rent" && (
                      <span className="text-sm text-gray-500 font-normal">
                        /mo
                      </span>
                    )}
                  </div>
                  {property.listingIntent !== "rent" && property.price > 0 && (
                    <p className="text-gray-500 text-sm mb-4">
                      EMI starts at ₹
                      {Math.round(
                        (property.price *
                          0.8 *
                          (8.5 / 12 / 100) *
                          Math.pow(1 + 8.5 / 12 / 100, 240)) /
                          (Math.pow(1 + 8.5 / 12 / 100, 240) - 1),
                      ).toLocaleString("en-IN")}
                      /mo
                    </p>
                  )}

                  {/* Agent Info */}
                  {property.agent && (
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <p className="text-gray-500 text-xs mb-2">
                        Posted by {property.postedBy || "Agent"}
                      </p>
                      <p className="text-white font-medium text-sm">
                        {property.agent.name}
                      </p>
                      {(property.agent.phone || property.contactPhone) && (
                        <div className="mt-3 space-y-2">
                          {/* Phone number display — visible on all devices, dialable on mobile */}
                          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                            <span className="text-white text-sm font-medium tracking-wide">
                              {formatDisplayPhone(
                                property.agent?.phone || property.contactPhone,
                              )}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* tap-to-call — triggers dialer on mobile */}
                              <a
                                href={`tel:+${toWaNumber(property.agent?.phone || property.contactPhone)}`}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Call"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                              {/* copy to clipboard — useful on desktop */}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `+${toWaNumber(property.agent?.phone || property.contactPhone)}`,
                                  );
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                                title={copied ? "Copied!" : "Copy number"}
                              >
                                {copied ? (
                                  <Check className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <a
                            href={`https://wa.me/${toWaNumber(property.agent?.phone || property.contactPhone)}?text=${encodeURIComponent(`Hi, I'm interested in your property: ${property.title}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            {/* Official WhatsApp logo SVG */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 32 32"
                              className="h-4 w-4 fill-white"
                            >
                              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.737 5.476 2.027 7.785L0 32l8.435-2.007A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.741-1.831l-.483-.287-4.995 1.189 1.262-4.855-.315-.5A13.264 13.264 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.398-.199-2.356-1.162-2.72-1.294-.364-.133-.629-.199-.894.199s-1.026 1.294-1.257 1.56c-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.976-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.81.179-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.894-2.155-1.225-2.95-.322-.775-.65-.67-.894-.682l-.762-.013c-.265 0-.696.1-1.06.497s-1.391 1.36-1.391 3.316 1.424 3.847 1.623 4.112c.199.265 2.803 4.278 6.79 5.998.949.41 1.69.654 2.268.837.953.303 1.82.26 2.505.158.763-.114 2.356-.963 2.688-1.894.332-.93.332-1.727.232-1.894-.099-.166-.364-.265-.762-.464z" />
                            </svg>
                            WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Lead Form */}
              <FadeIn>
                <LeadForm
                  propertyId={property._id}
                  propertyTitle={property.title}
                />
              </FadeIn>

              {/* Schedule a Visit */}
              <FadeIn>
                <button
                  onClick={() => setShowVisitModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#111118] border border-blue-500/30 hover:border-blue-500/60 text-blue-400 font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Schedule a Visit
                </button>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {showVisitModal && (
        <ScheduleVisitModal
          propertyId={property._id}
          propertyTitle={property.title}
          onClose={() => setShowVisitModal(false)}
        />
      )}
    </div>
  );
}
