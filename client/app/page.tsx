"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Search, MapPin, ChevronDown, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/Motion";
import RecentlyViewed from "@/components/RecentlyViewed";
import Stats from "@/components/home/Stats";
import WhyUs from "@/components/home/WhyUs";
import TrustedBrands, { BRANDS } from "@/components/home/TrustedBrands";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const TABS = ["Buy", "Rent", "Commercial", "Plots/Land", "Projects"];

const TYPE_OPTIONS: Record<string, string[]> = {
  Buy: [
    "Flat/Apartment",
    "Builder Floor",
    "Independent House/Villa",
    "Residential Land",
    "1 RK/ Studio Apartment",
    "Farm House",
    "Serviced Apartments",
    "Other",
  ],
  Rent: [
    "Flat/Apartment",
    "Builder Floor",
    "Independent House/Villa",
    "1 RK/ Studio Apartment",
    "Farm House",
    "Serviced Apartments",
    "PG/Co-living",
    "Other",
  ],
  Commercial: [
    "Office Space",
    "Retail Shop",
    "Warehouse/Godown",
    "Co-working Space",
    "Industrial Land",
    "Showroom",
    "Other",
  ],
  "Plots/Land": [
    "Residential Plot",
    "Commercial Land",
    "Agricultural Land",
    "Farm Land",
  ],
  Projects: ["Residential Project", "Commercial Project", "Township"],
};

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const [activeTab, setActiveTab] = useState("Buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [nearMeTooltip, setNearMeTooltip] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ type: string; label: string; sublabel?: string; id?: string }>
  >([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced autocomplete fetch
  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      setSuggestOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const tabParams = tabToParams(activeTab);
        const qs = new URLSearchParams({ q: searchQuery.trim(), ...tabParams });
        const res = await api.get(`/properties/suggest?${qs.toString()}`);
        const list = res.data.suggestions || [];
        setSuggestions(list);
        setSuggestOpen(list.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        suggestRef.current &&
        !suggestRef.current.contains(e.target as Node)
      ) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map homepage tab label → API query params
  function tabToParams(tab: string): Record<string, string> {
    switch (tab) {
      case "Buy":
        return { listingIntent: "buy" };
      case "Rent":
        return { listingIntent: "rent" };
      case "Commercial":
        return { category: "commercial" };
      case "Plots/Land":
        return { category: "plots" };
      default:
        return {};
    }
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    setSelectedTypes([]);
    setDropdownOpen(false);
  }

  function handleSuggestionClick(s: {
    type: string;
    label: string;
    sublabel?: string;
    id?: string;
  }) {
    setSuggestOpen(false);
    setSearchQuery(s.type !== "property" ? s.label : "");
    if (s.type === "city") {
      const p = new URLSearchParams({
        city: s.label,
        ...tabToParams(activeTab),
      });
      router.push(`/properties?${p.toString()}`);
    } else if (s.type === "area") {
      const p = new URLSearchParams({
        area: s.label,
        ...tabToParams(activeTab),
      });
      router.push(`/properties?${p.toString()}`);
    } else {
      router.push(`/properties/${s.id}`);
    }
  }

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  async function handleNearMe() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { "Accept-Language": "en" } },
          );
          const data = await res.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            "";
          if (city) {
            const params = new URLSearchParams({
              city,
              ...tabToParams(activeTab),
            });
            router.push(`/properties?${params.toString()}`);
          }
        } catch {
          // silently ignore
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  }

  const currentTypes = TYPE_OPTIONS[activeTab] ?? TYPE_OPTIONS["Buy"];
  const dropdownLabel =
    selectedTypes.length === 0
      ? "All Types"
      : selectedTypes.length === 1
        ? selectedTypes[0]
        : `${selectedTypes.length} Types`;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[420px] flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        {/* Blue edge glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-blue-900/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f] pointer-events-none" />

        <FadeIn className="relative z-10 max-w-[900px] mx-auto px-4 pt-16 pb-32 text-center">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Trusted by 70+ major brands
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Unlocking Real Estate Value
            <br className="hidden md:block" />
            <span className="text-blue-400"> Across India</span>
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Since 2007 · Expert Real Estate Advisory Services
          </p>
          <p className="text-gray-500 text-sm">{BRANDS.join(" · ")}</p>
        </FadeIn>
      </section>

      {/* ── SEARCH PANEL ── */}
      <section
        id="hero-search"
        className="max-w-[880px] w-full mx-auto px-4 -mt-24 relative z-20"
      >
        <div className="bg-white rounded-2xl shadow-2xl">
          {/* Tabs */}
          <div className="flex items-center border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors relative shrink-0
                  ${
                    activeTab === tab
                      ? "text-[#1565c0] border-b-2 border-[#1565c0]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {tab}
              </button>
            ))}
            <Link
              href="/post-property"
              className="ml-auto px-4 py-3.5 text-sm font-semibold text-green-600 hover:text-green-700 border-l border-gray-200 shrink-0 flex items-center gap-1 whitespace-nowrap"
            >
              Post Property
              <span className="bg-green-500 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                FREE
              </span>
            </Link>
          </div>

          {/* Search Row */}
          <div className="flex items-center gap-2 p-3 relative">
            {/* Type Dropdown */}
            <div className="shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className={`flex items-center gap-1.5 border rounded-lg px-3 py-2.5 text-sm font-medium transition-colors bg-gray-50 whitespace-nowrap
                  ${dropdownOpen ? "border-blue-500 text-[#1565c0]" : "border-gray-300 text-gray-700 hover:border-blue-400"}`}
              >
                {dropdownLabel}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180 text-[#1565c0]" : "text-gray-500"}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => setSelectedTypes([])}
                      className="text-sm text-[#1565c0] hover:underline font-medium"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                    {currentTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="h-4 w-4 rounded border-gray-300 accent-[#1565c0] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-[#1565c0] transition-colors">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div ref={suggestRef} className="flex-1 relative">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-blue-500 transition-colors bg-white">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder={`Search "Office space in BKC, Retail space in Delhi..."`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setSuggestOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSuggestOpen(false);
                    if (e.key === "Enter") {
                      setSuggestOpen(false);
                      const p = new URLSearchParams({
                        q: searchQuery,
                        ...tabToParams(activeTab),
                      });
                      router.push(`/properties?${p.toString()}`);
                    }
                  }}
                  className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
                />
              </div>
              {suggestOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(s);
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left${i < suggestions.length - 1 ? " border-b border-gray-100" : ""}`}
                    >
                      <span className="text-sm text-gray-800">
                        {s.label}
                        {s.sublabel && (
                          <span className="text-gray-500">, {s.sublabel}</span>
                        )}
                      </span>
                      <span className="text-sm text-gray-400 shrink-0 ml-4">
                        {s.type === "city"
                          ? "City"
                          : s.type === "area"
                            ? "Locality"
                            : "Project"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setNearMeTooltip(true)}
              onMouseLeave={() => setNearMeTooltip(false)}
            >
              <button
                onClick={handleNearMe}
                disabled={locating}
                className="p-2.5 border border-gray-300 rounded-lg text-[#1565c0] hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </button>
              {nearMeTooltip && !locating && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium z-50 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#1565c0]" />
                  Search <strong>Near Me</strong>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                const p = new URLSearchParams({ ...tabToParams(activeTab) });
                if (searchQuery.trim()) p.set("q", searchQuery.trim());
                router.push(`/properties?${p.toString()}`);
              }}
              className="bg-[#1565c0] hover:bg-[#0d47a1] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <Stats />

      {/* ── RECENTLY VIEWED ── */}
      <section className="max-w-[1280px] mx-auto px-4 py-12">
        <RecentlyViewed />
      </section>

      {/* ── WHY CHOOSE US ── */}
      <WhyUs />

      {/* ── TRUSTED BRANDS ── */}
      <TrustedBrands />
    </div>
  );
}
