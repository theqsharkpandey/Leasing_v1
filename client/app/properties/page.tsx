"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard, { Property } from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import Pagination from "@/components/Pagination";
import SortDropdown from "@/components/SortDropdown";
import { FadeIn } from "@/components/Motion";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Home,
  ChevronRight,
  Bookmark,
  Loader2,
  CheckCircle,
} from "lucide-react";

function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-white/5" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-5 bg-white/5 rounded w-1/2" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      if (!params.has("sort")) params.set("sort", sort);
      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data.properties || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 0);
      setCurrentPage(res.data.currentPage || 1);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, sort]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/properties?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) return;
    setSaving(true);
    const filters: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      if (k !== "page") filters[k] = v;
    });
    try {
      await api.post("/saved-searches", { name: searchName.trim(), filters });
      setSaveMsg("Saved!");
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveMsg("");
        setSearchName("");
      }, 1500);
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
          <Home className="h-3 w-3" />
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-300">Properties</span>
          {searchParams.get("city") && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-300">{searchParams.get("city")}</span>
            </>
          )}
        </nav>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <PropertyFilters />
            </div>
          </div>

          {/* Mobile filter overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#0a0a0f] overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <PropertyFilters
                  onFilterChange={() => setMobileFiltersOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                </button>
                <h1 className="text-white font-semibold text-lg hidden sm:block">
                  Properties
                </h1>
                <span className="text-gray-500 text-sm">
                  {loading ? "..." : `${total} results`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <SortDropdown value={sort} onChange={handleSortChange} />
                {user && (
                  <button
                    onClick={() => setShowSaveModal(true)}
                    title="Save this search"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Save Search</span>
                  </button>
                )}
                <div className="hidden sm:flex border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setLayout("grid")}
                    className={`p-2 transition-colors ${layout === "grid" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    className={`p-2 transition-colors ${layout === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Property Grid / List */}
            {loading ? (
              <LoadingSkeleton />
            ) : properties.length === 0 ? (
              <FadeIn>
                <div className="text-center py-20">
                  <div className="text-gray-600 text-6xl mb-4">
                    <Home className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={() => router.push("/properties")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </FadeIn>
            ) : layout === "list" ? (
              <div className="space-y-4">
                {properties.map((property) => (
                  <FadeIn key={property._id}>
                    <PropertyCard property={property} layout="list" />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <FadeIn key={property._id}>
                    <PropertyCard property={property} layout="grid" />
                  </FadeIn>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#111118] border border-white/10 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Bookmark className="h-5 w-5 text-blue-400" />
                Save This Search
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {saveMsg === "Saved!" ? (
              <div className="text-center py-4">
                <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />
                <p className="text-white font-medium">Search saved!</p>
                <p className="text-gray-400 text-sm mt-1">
                  Find it in your dashboard.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-3">
                  Give a name to this search so you can quickly find it later.
                </p>
                <input
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveSearch()}
                  placeholder="e.g. 2BHK in Mumbai for Rent"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 mb-3"
                  maxLength={80}
                  autoFocus
                />
                {saveMsg && (
                  <p className="text-red-400 text-xs mb-2">{saveMsg}</p>
                )}
                <button
                  onClick={handleSaveSearch}
                  disabled={saving || !searchName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Search
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0f]">
          <div className="max-w-[1280px] mx-auto px-4 py-6">
            <div className="h-6 w-48 bg-white/5 rounded mb-6 animate-pulse" />
            <div className="flex gap-6">
              <div className="hidden lg:block w-72 shrink-0">
                <div className="bg-[#111118] border border-white/10 rounded-xl p-5 animate-pulse h-96" />
              </div>
              <div className="flex-1">
                <LoadingSkeleton />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
