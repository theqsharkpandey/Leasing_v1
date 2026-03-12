"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Heart,
  MessageSquare,
  ArrowRight,
  MapPin,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import api from "@/lib/api";
import { useShortlist } from "@/lib/shortlist-context";

interface DashProperty {
  _id: string;
  title: string;
  city: string;
  status: string;
  views?: number;
  createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  active: "bg-green-400/10 text-green-400",
  "pending-approval": "bg-amber-400/10 text-amber-400",
  inactive: "bg-gray-400/10 text-gray-400",
  sold: "bg-blue-400/10 text-blue-400",
  rented: "bg-blue-400/10 text-blue-400",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardOverview() {
  const { shortlistCount } = useShortlist();
  const [propertyCount, setPropertyCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [recentProperties, setRecentProperties] = useState<DashProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [propRes, inqRes, recentRes] = await Promise.all([
          api
            .get("/properties/my-properties?limit=1")
            .catch(() => ({ data: { total: 0 } })),
          api.get("/leads/my-inquiries").catch(() => ({ data: [] })),
          api
            .get("/properties/my-properties?limit=3")
            .catch(() => ({ data: { properties: [] } })),
        ]);
        setPropertyCount(propRes.data.total || 0);
        setInquiryCount(Array.isArray(inqRes.data) ? inqRes.data.length : 0);
        setRecentProperties(recentRes.data.properties || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    {
      label: "My Properties",
      value: propertyCount,
      icon: Building2,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "My Shortlist",
      value: shortlistCount,
      icon: Heart,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
    {
      label: "Inquiries Sent",
      value: inquiryCount,
      icon: MessageSquare,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-[#111118] border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <span className="text-3xl font-bold text-white">
                  {loading ? "—" : s.value}
                </span>
              </div>
              <p className="text-sm text-gray-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/post-property"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Post Property
        </Link>
        <Link
          href="/properties"
          className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Search className="h-4 w-4" />
          Browse Properties
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent Properties</h2>
          <Link
            href="/dashboard/properties"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-white/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : recentProperties.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">
            You haven&apos;t posted any properties yet.{" "}
            <Link
              href="/post-property"
              className="text-blue-400 hover:underline"
            >
              Post your first property
            </Link>
          </p>
        ) : (
          <div className="space-y-2">
            {recentProperties.map((p) => (
              <Link
                key={p._id}
                href={`/properties/${p._id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin className="h-3 w-3" />
                      {p.city}
                    </span>
                    {p.views != null && (
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <Eye className="h-3 w-3" />
                        {p.views} views
                      </span>
                    )}
                    <span className="text-gray-600 text-xs">
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize shrink-0 ml-3 ${
                    STATUS_STYLE[p.status] || "bg-gray-400/10 text-gray-400"
                  }`}
                >
                  {p.status?.replace(/-/g, " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
