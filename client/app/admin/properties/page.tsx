"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  FileText,
  PhoneCall,
  ShieldCheck,
  ExternalLink,
  Trash2,
  MapPin,
  Eye,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminProperty {
  _id: string;
  title: string;
  propertyType?: string;
  category?: string;
  price: number;
  city: string;
  area?: string;
  images: string[];
  status: string;
  verificationStatus?: string;
  rejectionReason?: string;
  contactPhone?: string;
  views?: number;
  createdAt: string;
  submittedBy?: { name: string; email: string; phone?: string };
  agent?: { name: string; email: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending_review: {
    label: "Pending Review",
    cls: "bg-amber-400/10  text-amber-400  border-amber-400/20",
  },
  approved: {
    label: "Approved",
    cls: "bg-green-400/10  text-green-400  border-green-400/20",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-400/10    text-red-400    border-red-400/20",
  },
  needs_documents: {
    label: "Needs Documents",
    cls: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  },
  verified: {
    label: "Verified",
    cls: "bg-blue-400/10   text-blue-400   border-blue-400/20",
  },
  leased: {
    label: "Leased",
    cls: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  },
  "pending-approval": {
    label: "Pending Approval",
    cls: "bg-amber-400/10  text-amber-400  border-amber-400/20",
  },
  active: {
    label: "Active",
    cls: "bg-green-400/10  text-green-400  border-green-400/20",
  },
};

const VERIF_META: Record<string, string> = {
  not_verified: "—",
  documents_uploaded: "Docs Uploaded",
  verification_call_pending: "Call Pending",
  verification_call_completed: "Call Done",
};

const TABS = [
  { key: "pending_review", label: "Pending", countKey: "pending_review" },
  { key: "approved", label: "Approved", countKey: "approved" },
  { key: "needs_documents", label: "Needs Docs", countKey: "needs_documents" },
  { key: "rejected", label: "Rejected", countKey: "rejected" },
  { key: "verified", label: "Verified", countKey: "verified" },
  { key: "all", label: "All", countKey: "__all__" },
];

// ─── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#16161f] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-semibold text-lg mb-3">
          Reject Property
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Provide a reason for rejection (optional — sent to submitter).
        </p>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Incomplete ownership details..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500/50 resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({
  p,
  onAction,
  acting,
}: {
  p: AdminProperty;
  onAction: (id: string, action: string, reason?: string) => void;
  acting: string | null;
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const meta = STATUS_META[p.status] || {
    label: p.status,
    cls: "bg-gray-400/10 text-gray-400 border-gray-400/20",
  };
  const imgUrl =
    p.images?.[0] ||
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=60";
  const isActing = acting === p._id;

  return (
    <>
      {showRejectModal && (
        <RejectModal
          onConfirm={(reason) => {
            setShowRejectModal(false);
            onAction(p._id, "reject", reason);
          }}
          onCancel={() => setShowRejectModal(false)}
        />
      )}
      <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
        {/* Header row */}
        <div className="flex gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative h-20 w-28 rounded-lg overflow-hidden shrink-0 bg-white/5">
            <Image src={imgUrl} alt={p.title} fill className="object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap mb-1">
              <h3 className="text-white text-sm font-semibold truncate max-w-xs">
                {p.title}
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${meta.cls}`}
              >
                {meta.label}
              </span>
              {p.verificationStatus &&
                p.verificationStatus !== "not_verified" && (
                  <span className="text-[10px] px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 bg-blue-500/10 shrink-0">
                    {VERIF_META[p.verificationStatus] || p.verificationStatus}
                  </span>
                )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1 capitalize">
                <MapPin className="h-3 w-3" />
                {p.city}
                {p.area ? `, ${p.area}` : ""}
              </span>
              <span className="text-blue-300 font-medium">
                {formatPrice(p.price)}
              </span>
              {p.propertyType && (
                <span className="capitalize">
                  {p.propertyType.replace(/-/g, " ")}
                </span>
              )}
              {p.views != null && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {p.views}
                </span>
              )}
            </div>
            {p.submittedBy && (
              <p className="text-xs text-gray-500">
                By: <span className="text-gray-300">{p.submittedBy.name}</span>
                <span className="mx-1">·</span>
                {p.submittedBy.email}
                {p.contactPhone && (
                  <>
                    <span className="mx-1">·</span>
                    {p.contactPhone}
                  </>
                )}
              </p>
            )}
            <p className="text-[10px] text-gray-600 mt-0.5">
              {new Date(p.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Right controls */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <Link
              href={`/properties/${p._id}`}
              target="_blank"
              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              title="View listing"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-1.5 rounded-lg border border-white/10 transition-colors ${showDetails ? "text-white border-white/20" : "text-gray-400 hover:text-white hover:border-white/20"}`}
              title="Toggle actions"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Action row — expands on chevron click */}
        {showDetails && (
          <div className="border-t border-white/5 px-4 py-3 flex flex-wrap gap-2 bg-white/2">
            {p.status !== "approved" && p.status !== "verified" && (
              <button
                disabled={isActing}
                onClick={() => onAction(p._id, "approve")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Approve
              </button>
            )}
            {p.status !== "rejected" && (
              <button
                disabled={isActing}
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
            )}
            {p.status !== "needs_documents" && (
              <button
                disabled={isActing}
                onClick={() => onAction(p._id, "request_documents")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 disabled:opacity-50 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" /> Request Docs
              </button>
            )}
            {p.verificationStatus !== "verification_call_pending" &&
              p.verificationStatus !== "verification_call_completed" && (
                <button
                  disabled={isActing}
                  onClick={() => onAction(p._id, "schedule_call")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5" /> Schedule Call
                </button>
              )}
            {p.status !== "verified" && (
              <button
                disabled={isActing}
                onClick={() => onAction(p._id, "mark_verified")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Mark Verified
              </button>
            )}
            <button
              disabled={isActing}
              onClick={async () => {
                if (!confirm("Delete this property permanently?")) return;
                try {
                  await api.delete(`/properties/${p._id}`);
                  window.location.reload();
                } catch {
                  alert("Delete failed");
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-900/20 border border-red-900/30 text-red-500 hover:bg-red-900/30 disabled:opacity-50 transition-colors ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}

        {/* Rejection reason if set */}
        {p.rejectionReason && (
          <div className="border-t border-red-500/10 px-4 py-2 bg-red-500/5">
            <p className="text-xs text-red-400">
              <span className="font-semibold">Rejection reason:</span>{" "}
              {p.rejectionReason}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPropertiesPage() {
  const [activeTab, setActiveTab] = useState("pending_review");
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProperties = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      const params = tab !== "all" ? `?status=${tab}&limit=50` : "?limit=100";
      const res = await api.get(`/properties/admin/all${params}`);
      setProperties(res.data.properties || []);
      if (res.data.statusCounts) setStatusCounts(res.data.statusCounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties(activeTab);
  }, [activeTab, loadProperties]);

  const handleAction = async (id: string, action: string, reason?: string) => {
    setActing(id);
    try {
      await api.patch(`/properties/${id}/moderate`, {
        action,
        rejectionReason: reason,
      });
      showToast(`Property ${action.replace(/_/g, " ")} successfully`);
      loadProperties(activeTab);
    } catch (err: any) {
      showToast(err.response?.data?.error || "Action failed", false);
    } finally {
      setActing(null);
    }
  };

  const totalAll = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const filtered = search.trim()
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.city.toLowerCase().includes(search.toLowerCase()) ||
          p.submittedBy?.name.toLowerCase().includes(search.toLowerCase()) ||
          p.submittedBy?.email.toLowerCase().includes(search.toLowerCase()),
      )
    : properties;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Property Moderation</h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {TABS.map((tab) => {
          const count =
            tab.key === "all" ? totalAll : statusCounts[tab.countKey] || 0;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                isActive
                  ? "bg-white/10 border-white/20 text-white"
                  : "border-white/5 text-gray-400 hover:text-white hover:border-white/10"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-blue-600 text-white" : "bg-white/10 text-gray-400"}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by title, city, or submitter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/40"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-[#111118] border border-white/10 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-12 text-center">
          <p className="text-gray-500">No properties found in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <PropertyCard
              key={p._id}
              p={p}
              onAction={handleAction}
              acting={acting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
