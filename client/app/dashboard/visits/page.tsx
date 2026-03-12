"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarX,
  Building2,
} from "lucide-react";
import { FadeIn } from "@/components/Motion";

interface Visit {
  _id: string;
  property: {
    _id: string;
    title: string;
    city: string;
    images: string[];
    price: number;
    listingIntent: string;
  };
  name: string;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "cancelled";
  message?: string;
  createdAt: string;
}

interface AgentVisit extends Visit {
  email: string;
  phone: string;
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    color: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

export default function VisitsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"mine" | "agent">("mine");
  const [myVisits, setMyVisits] = useState<Visit[]>([]);
  const [agentVisits, setAgentVisits] = useState<AgentVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const isAgent =
    user &&
    ["agent", "owner", "builder", "admin", "super_admin"].includes(user.role);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const promises = [api.get("/visits/my")];
      if (isAgent) promises.push(api.get("/visits/agent"));
      const [myRes, agentRes] = await Promise.all(promises);
      setMyVisits(myRes.data);
      if (agentRes) setAgentVisits(agentRes.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [isAgent]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const updateStatus = async (
    id: string,
    status: "confirmed" | "cancelled",
  ) => {
    setUpdating(id);
    try {
      await api.patch(`/visits/${id}`, { status });
      setAgentVisits((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status } : v)),
      );
    } catch {
      /* ignore */
    } finally {
      setUpdating(null);
    }
  };

  const formatPrice = (price?: number) => {
    if (price == null || isNaN(price)) return "Price N/A";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const visits = tab === "mine" ? myVisits : agentVisits;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Property Visits</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your visit requests
          </p>
        </div>
      </div>

      {/* Tabs */}
      {isAgent && (
        <div className="flex gap-2">
          <button
            onClick={() => setTab("mine")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "mine"
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            My Visits
          </button>
          <button
            onClick={() => setTab("agent")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "agent"
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Incoming Requests
            {agentVisits.filter((v) => v.status === "pending").length > 0 && (
              <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                {agentVisits.filter((v) => v.status === "pending").length}
              </span>
            )}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      ) : visits.length === 0 ? (
        <FadeIn>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarX className="h-16 w-16 text-gray-700 mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">
              No visits yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {tab === "mine"
                ? "Schedule a property visit to see it here."
                : "Incoming visit requests will appear here."}
            </p>
            {tab === "mine" && (
              <Link
                href="/properties"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Browse Properties
              </Link>
            )}
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => {
            const sc = STATUS_CONFIG[visit.status];
            const isAgentVisit = tab === "agent";
            return (
              <FadeIn key={visit._id}>
                <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
                  <div className="flex gap-4 p-4">
                    {/* Property Thumbnail */}
                    <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-white/5">
                      {visit.property?.images?.[0] ? (
                        <Image
                          src={visit.property.images[0]}
                          alt={visit.property.title}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-600 absolute inset-0 m-auto" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <Link
                            href={`/properties/${visit.property?._id}`}
                            className="text-white font-medium hover:text-blue-400 transition-colors text-sm line-clamp-1"
                          >
                            {visit.property?.title || "Property"}
                          </Link>
                          <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {visit.property?.city}
                            <span className="mx-1">·</span>
                            {formatPrice(visit.property?.price)}
                            {visit.property?.listingIntent === "rent" && "/mo"}
                          </div>
                        </div>
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${sc.color}`}
                        >
                          {sc.icon}
                          {sc.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <CalendarCheck className="h-3.5 w-3.5" />
                          {new Date(visit.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {visit.timeSlot}
                        </div>
                      </div>

                      {/* Agent view: visitor details + action buttons */}
                      {isAgentVisit && (
                        <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="text-gray-300 text-xs">
                              {(visit as AgentVisit).name} ·{" "}
                              {(visit as AgentVisit).phone}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {(visit as AgentVisit).email}
                            </p>
                          </div>
                          {visit.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateStatus(visit._id, "confirmed")
                                }
                                disabled={updating === visit._id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs rounded-lg transition-colors"
                              >
                                {updating === visit._id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(visit._id, "cancelled")
                                }
                                disabled={updating === visit._id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white text-xs rounded-lg transition-colors"
                              >
                                <XCircle className="h-3 w-3" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
