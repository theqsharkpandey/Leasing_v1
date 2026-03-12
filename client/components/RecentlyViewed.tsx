"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import PropertyCard, { Property } from "@/components/PropertyCard";
import api from "@/lib/api";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

const CACHE_KEY = "rv_cache";
const CACHE_TTL = 5 * 60 * 1000;

export default function RecentlyViewed() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -316 : 316,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const ids = getRecentlyViewed();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        const sameIds =
          JSON.stringify(cached.ids) === JSON.stringify(ids.slice(0, 6));
        if (sameIds && Date.now() - cached.ts < CACHE_TTL) {
          setProperties(cached.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    api
      .post("/properties/batch", { ids: ids.slice(0, 6) })
      .then((res) => {
        const data = res.data || [];
        setProperties(data);
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ ids: ids.slice(0, 6), data, ts: Date.now() }),
          );
        } catch {}
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || properties.length === 0) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [properties, checkScroll]);

  if (loading || properties.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">
              Recently Viewed
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {properties.length} propert{properties.length === 1 ? "y" : "ies"}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card row — scrollbar hidden */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none"
      >
        {properties.map((prop) => (
          <div key={prop._id} className="min-w-[280px] max-w-[280px] shrink-0">
            <PropertyCard property={prop} layout="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}
