"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Eye,
  Trash2,
  ExternalLink,
  Plus,
  Pencil,
} from "lucide-react";
import api from "@/lib/api";

interface MyProperty {
  _id: string;
  title: string;
  city: string;
  area?: string;
  price: number;
  images: string[];
  status: string;
  views?: number;
  createdAt: string;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} L`;
  return price.toLocaleString("en-IN");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLE: Record<string, string> = {
  active: "bg-green-400/10 text-green-400",
  "pending-approval": "bg-amber-400/10 text-amber-400",
  inactive: "bg-gray-400/10 text-gray-400",
  sold: "bg-blue-400/10 text-blue-400",
  rented: "bg-blue-400/10 text-blue-400",
};

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending-approval" },
  { label: "Inactive", value: "inactive" },
];

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<MyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const statusParam = filter === "all" ? "" : `&status=${filter}`;
        const res = await api.get(
          `/properties/my-properties?limit=50${statusParam}`,
        );
        setProperties(res.data.properties || []);
        setTotal(res.data.total || 0);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter]);

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      alert("Failed to delete property");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Properties</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total} {total === 1 ? "property" : "properties"} total
          </p>
        </div>
        <Link
          href="/post-property"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === tab.value
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#111118] border border-white/10 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">No properties found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {filter === "all"
              ? "You haven't posted any properties yet."
              : `No ${filter.replace(/-/g, " ")} properties.`}
          </p>
          {filter === "all" && (
            <Link
              href="/post-property"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Post Your First Property
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => {
            const imgUrl =
              p.images?.[0] ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=60";
            return (
              <div
                key={p._id}
                className="bg-[#111118] border border-white/10 rounded-xl p-4 flex gap-4 items-center hover:border-white/20 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-white/5">
                  <Image
                    src={imgUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white text-sm font-semibold truncate">
                      {p.title}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize shrink-0 ${
                        STATUS_STYLE[p.status] || "bg-gray-400/10 text-gray-400"
                      }`}
                    >
                      {p.status?.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {p.area ? `${p.area}, ` : ""}
                      {p.city}
                    </span>
                    <span className="font-medium text-blue-400">
                      ₹{formatPrice(p.price)}
                    </span>
                    {p.views != null && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {p.views}
                      </span>
                    )}
                    <span>{formatDate(p.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/properties/${p._id}`}
                    className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                    title="View"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/edit-property/${p._id}`}
                    className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
