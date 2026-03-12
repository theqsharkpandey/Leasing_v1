"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { ChevronDown, X, Search } from "lucide-react";

const RESIDENTIAL_TYPES = [
  "apartment",
  "villa",
  "builder-floor",
  "independent-house",
  "penthouse",
  "studio",
  "farm-house",
];
const COMMERCIAL_TYPES = [
  "office",
  "retail",
  "warehouse",
  "coworking",
  "showroom",
  "plot-commercial",
];
const PLOT_TYPES = ["residential-plot", "farm-land", "industrial-plot"];

const BUDGET_PRESETS = [
  { label: "5 L", value: 500000 },
  { label: "10 L", value: 1000000 },
  { label: "20 L", value: 2000000 },
  { label: "50 L", value: 5000000 },
  { label: "1 Cr", value: 10000000 },
  { label: "2 Cr", value: 20000000 },
  { label: "5 Cr", value: 50000000 },
  { label: "10 Cr+", value: 100000000 },
];

const BHK_OPTIONS = [1, 2, 3, 4, 5];

const FURNISHING_OPTIONS = ["furnished", "semi-furnished", "unfurnished"];
const POSSESSION_OPTIONS = ["ready-to-move", "under-construction"];
const POSTED_BY_OPTIONS = ["owner", "agent", "builder"];

interface Filters {
  listingIntent: string;
  category: string;
  propertyType: string[];
  bedrooms: number[];
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  furnishing: string;
  possessionStatus: string;
  postedBy: string[];
  city: string;
  area: string;
}

function parseFiltersFromParams(params: URLSearchParams): Filters {
  return {
    listingIntent: params.get("listingIntent") || "buy",
    category: params.get("category") || "",
    propertyType: params.get("propertyType")?.split(",") || [],
    bedrooms: params.get("bedrooms")?.split(",").map(Number) || [],
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    minArea: params.get("minArea") || "",
    maxArea: params.get("maxArea") || "",
    furnishing: params.get("furnishing") || "",
    possessionStatus: params.get("possessionStatus") || "",
    postedBy: params.get("postedBy")?.split(",") || [],
    city: params.get("city") || "",
    area: params.get("area") || "",
  };
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/5 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-300 mb-3 hover:text-white transition-colors"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children}
    </div>
  );
}

interface PropertyFiltersContentProps {
  onFilterChange?: () => void;
}

function PropertyFiltersContent({
  onFilterChange,
}: PropertyFiltersContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromParams(searchParams),
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFilters(parseFiltersFromParams(searchParams));
  }, [searchParams]);

  const applyFilters = useCallback(
    (newFilters: Filters) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams();
        if (newFilters.listingIntent)
          params.set("listingIntent", newFilters.listingIntent);
        if (newFilters.category) params.set("category", newFilters.category);
        if (newFilters.propertyType.length)
          params.set("propertyType", newFilters.propertyType.join(","));
        if (newFilters.bedrooms.length)
          params.set("bedrooms", newFilters.bedrooms.join(","));
        if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
        if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
        if (newFilters.minArea) params.set("minArea", newFilters.minArea);
        if (newFilters.maxArea) params.set("maxArea", newFilters.maxArea);
        if (newFilters.furnishing)
          params.set("furnishing", newFilters.furnishing);
        if (newFilters.possessionStatus)
          params.set("possessionStatus", newFilters.possessionStatus);
        if (newFilters.postedBy.length)
          params.set("postedBy", newFilters.postedBy.join(","));
        if (newFilters.city) params.set("city", newFilters.city);
        if (newFilters.area) params.set("area", newFilters.area);
        router.push(`/properties?${params.toString()}`);
        onFilterChange?.();
      }, 400);
    },
    [router, onFilterChange],
  );

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    applyFilters(updated);
  };

  const toggleArrayValue = (
    key: "propertyType" | "bedrooms" | "postedBy",
    value: string | number,
  ) => {
    const arr = filters[key] as (string | number)[];
    const updated = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    updateFilter(key, updated as Filters[typeof key]);
  };

  const handleReset = () => {
    const defaults: Filters = {
      listingIntent: "buy",
      category: "",
      propertyType: [],
      bedrooms: [],
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      furnishing: "",
      possessionStatus: "",
      postedBy: [],
      city: "",
      area: "",
    };
    setFilters(defaults);
    router.push("/properties");
    onFilterChange?.();
  };

  const getPropertyTypes = () => {
    switch (filters.category) {
      case "commercial":
        return COMMERCIAL_TYPES;
      case "plots":
        return PLOT_TYPES;
      case "residential":
        return RESIDENTIAL_TYPES;
      default:
        return [...RESIDENTIAL_TYPES, ...COMMERCIAL_TYPES, ...PLOT_TYPES];
    }
  };

  const activeFilterCount = [
    filters.propertyType.length > 0,
    filters.bedrooms.length > 0,
    filters.minPrice || filters.maxPrice,
    filters.minArea || filters.maxArea,
    filters.furnishing,
    filters.possessionStatus,
    filters.postedBy.length > 0,
    filters.city,
    filters.area,
  ].filter(Boolean).length;

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Listing Intent Toggle */}
      <div className="flex rounded-lg border border-white/10 overflow-hidden">
        {["buy", "rent"].map((intent) => (
          <button
            key={intent}
            onClick={() => updateFilter("listingIntent", intent)}
            className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${
              filters.listingIntent === intent
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {intent}
          </button>
        ))}
      </div>

      {/* Category */}
      <div className="grid grid-cols-2 gap-1">
        {["all", "residential", "commercial", "plots"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              const newCat = cat === "all" ? "" : cat;
              const updated = {
                ...filters,
                category: newCat,
                propertyType: [],
              };
              setFilters(updated);
              applyFilters(updated);
            }}
            className={`py-2 text-xs font-medium transition-colors capitalize rounded-lg border ${
              (cat === "all" && filters.category === "") ||
              filters.category === cat
                ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5 border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Locality */}
      <FilterSection title="Location">
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Locality / Area"
            value={filters.area}
            onChange={(e) => updateFilter("area", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </FilterSection>

      {/* BHK (only for residential) */}
      {filters.category === "residential" && (
        <FilterSection title="BHK">
          <div className="flex flex-wrap gap-2">
            {BHK_OPTIONS.map((bhk) => (
              <button
                key={bhk}
                onClick={() => toggleArrayValue("bedrooms", bhk)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  (filters.bedrooms as number[]).includes(bhk)
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                {bhk} BHK
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Budget */}
      <FilterSection title="Budget">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  const current = Number(filters.maxPrice) || 0;
                  if (current === preset.value) {
                    updateFilter("maxPrice", "");
                  } else {
                    updateFilter("maxPrice", String(preset.value));
                  }
                }}
                className={`px-2 py-1 text-[10px] font-medium rounded border transition-colors ${
                  Number(filters.maxPrice) === preset.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-400"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {getPropertyTypes().map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.propertyType.includes(type)}
                onChange={() => toggleArrayValue("propertyType", type)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 capitalize">
                {type.replace(/-/g, " ")}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Area range */}
      <FilterSection title="Area (sqft)" defaultOpen={false}>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minArea}
            onChange={(e) => updateFilter("minArea", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxArea}
            onChange={(e) => updateFilter("maxArea", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </FilterSection>

      {/* Furnishing */}
      {filters.category !== "plots" && (
        <FilterSection title="Furnishing" defaultOpen={false}>
          <div className="space-y-1.5">
            {FURNISHING_OPTIONS.map((f) => (
              <label
                key={f}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="furnishing"
                  checked={filters.furnishing === f}
                  onChange={() => updateFilter("furnishing", f)}
                  className="h-3.5 w-3.5 border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 capitalize">
                  {f.replace(/-/g, " ")}
                </span>
              </label>
            ))}
            {filters.furnishing && (
              <button
                onClick={() => updateFilter("furnishing", "")}
                className="text-[10px] text-gray-500 hover:text-gray-400 mt-1"
              >
                Clear
              </button>
            )}
          </div>
        </FilterSection>
      )}

      {/* Possession Status */}
      <FilterSection title="Possession Status" defaultOpen={false}>
        <div className="space-y-1.5">
          {POSSESSION_OPTIONS.map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="possessionStatus"
                checked={filters.possessionStatus === p}
                onChange={() => updateFilter("possessionStatus", p)}
                className="h-3.5 w-3.5 border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 capitalize">
                {p.replace(/-/g, " ")}
              </span>
            </label>
          ))}
          {filters.possessionStatus && (
            <button
              onClick={() => updateFilter("possessionStatus", "")}
              className="text-[10px] text-gray-500 hover:text-gray-400 mt-1"
            >
              Clear
            </button>
          )}
        </div>
      </FilterSection>

      {/* Posted By */}
      <FilterSection title="Posted By" defaultOpen={false}>
        <div className="space-y-1.5">
          {POSTED_BY_OPTIONS.map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.postedBy.includes(p)}
                onChange={() => toggleArrayValue("postedBy", p)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 capitalize">
                {p}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

export default function PropertyFilters({
  onFilterChange,
}: {
  onFilterChange?: () => void;
}) {
  return (
    <Suspense
      fallback={
        <div className="bg-[#111118] border border-white/10 rounded-xl p-5 animate-pulse h-96" />
      }
    >
      <PropertyFiltersContent onFilterChange={onFilterChange} />
    </Suspense>
  );
}
