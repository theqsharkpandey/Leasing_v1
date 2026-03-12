"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  Bell,
  BellOff,
  Loader2,
  Search,
  ExternalLink,
} from "lucide-react";
import { FadeIn } from "@/components/Motion";

interface SavedSearch {
  _id: string;
  name: string;
  filters: Record<string, string>;
  emailAlert: boolean;
  createdAt: string;
}

function filtersToQuery(filters: Record<string, string>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => params.set(k, v));
  return params.toString();
}

function filtersToLabel(filters: Record<string, string>): string {
  const parts: string[] = [];
  if (filters.city) parts.push(filters.city);
  if (filters.listingIntent) parts.push(filters.listingIntent);
  if (filters.bedrooms) parts.push(`${filters.bedrooms} BHK`);
  if (filters.minPrice || filters.maxPrice)
    parts.push(`₹${filters.minPrice || "0"} – ₹${filters.maxPrice || "any"}`);
  if (filters.category) parts.push(filters.category);
  return parts.length ? parts.join(" · ") : "All Properties";
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSearches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/saved-searches");
      setSearches(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearches();
  }, [fetchSearches]);

  const toggleAlert = async (id: string, current: boolean) => {
    setToggling(id);
    try {
      const res = await api.patch(`/saved-searches/${id}`, {
        emailAlert: !current,
      });
      setSearches((prev) => prev.map((s) => (s._id === id ? res.data : s)));
    } catch {
      /* ignore */
    } finally {
      setToggling(null);
    }
  };

  const deleteSearch = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/saved-searches/${id}`);
      setSearches((prev) => prev.filter((s) => s._id !== id));
    } catch {
      /* ignore */
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Saved Searches</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your saved property searches. Enable alerts to get notified when new
          matching properties are listed.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      ) : searches.length === 0 ? (
        <FadeIn>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-16 w-16 text-gray-700 mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">
              No saved searches
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Use the <strong className="text-gray-400">Save Search</strong>{" "}
              button on the properties page to save a filter set.
            </p>
            <Link
              href="/properties"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-3">
          {searches.map((s) => (
            <FadeIn key={s._id}>
              <div className="bg-[#111118] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Bookmark className="h-4 w-4 text-blue-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{s.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">
                    {filtersToLabel(s.filters)}
                  </p>
                  <p className="text-gray-700 text-xs mt-0.5">
                    Saved{" "}
                    {new Date(s.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* View results */}
                  <Link
                    href={`/properties?${filtersToQuery(s.filters)}`}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="View results"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  {/* Toggle email alert */}
                  <button
                    onClick={() => toggleAlert(s._id, s.emailAlert)}
                    disabled={toggling === s._id}
                    title={
                      s.emailAlert
                        ? "Disable email alerts"
                        : "Enable email alerts"
                    }
                    className={`p-2 transition-colors ${
                      s.emailAlert
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    {toggling === s._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : s.emailAlert ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteSearch(s._id)}
                    disabled={deleting === s._id}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    {deleting === s._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
