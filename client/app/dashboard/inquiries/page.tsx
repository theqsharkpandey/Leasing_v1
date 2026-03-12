"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import Image from "next/image";
import {
  Inbox,
  Send,
  MapPin,
  Calendar,
  Mail,
  Phone,
  User,
  MessageSquare,
  Building2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Property {
  _id: string;
  title: string;
  city: string;
  images: string[];
  price: number;
  listingIntent: string;
}

interface Inquiry {
  _id: string;
  property: Property;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "negotiation" | "closed" | "lost";
  createdAt: string;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  new: { label: "New", bg: "bg-blue-500/15", text: "text-blue-400" },
  contacted: {
    label: "Contacted",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
  },
  negotiation: {
    label: "Negotiation",
    bg: "bg-purple-500/15",
    text: "text-purple-400",
  },
  closed: { label: "Closed", bg: "bg-green-500/15", text: "text-green-400" },
  lost: { label: "Lost", bg: "bg-red-500/15", text: "text-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-lg bg-white/5 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-white/5 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
          <div className="h-3 bg-white/5 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: "sent" | "received" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        {type === "sent" ? (
          <Send className="w-7 h-7 text-white/20" />
        ) : (
          <Inbox className="w-7 h-7 text-white/20" />
        )}
      </div>
      <h3 className="text-lg font-medium text-white/70 mb-1">
        {type === "sent"
          ? "No inquiries sent yet"
          : "No inquiries received yet"}
      </h3>
      <p className="text-sm text-white/40 max-w-sm">
        {type === "sent"
          ? "When you send inquiries about properties, they will appear here."
          : "When someone inquires about your listed properties, they will appear here."}
      </p>
    </div>
  );
}

function SentCard({ inquiry }: { inquiry: Inquiry }) {
  const property = inquiry.property;
  const imageUrl = property?.images?.length > 0 ? property.images[0] : null;

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
      <div className="flex gap-4">
        {imageUrl ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={property?.title || "Property"}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-white/20" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-white font-medium truncate">
              {property?.title || "Unknown Property"}
            </h3>
            <StatusBadge status={inquiry.status} />
          </div>

          {property?.city && (
            <div className="flex items-center gap-1.5 text-sm text-white/50 mb-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{property.city}</span>
            </div>
          )}

          {inquiry.message && (
            <div className="flex items-start gap-1.5 text-sm text-white/40 mb-2">
              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2">{inquiry.message}</p>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(inquiry.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceivedCard({ inquiry }: { inquiry: Inquiry }) {
  const property = inquiry.property;
  const imageUrl = property?.images?.length > 0 ? property.images[0] : null;

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
      <div className="flex gap-4">
        {imageUrl ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={property?.title || "Property"}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-white/20" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-white font-medium truncate">
              {property?.title || "Unknown Property"}
            </h3>
            <StatusBadge status={inquiry.status} />
          </div>

          {property?.city && (
            <div className="flex items-center gap-1.5 text-sm text-white/50 mb-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{property.city}</span>
            </div>
          )}

          <div className="space-y-1 mb-2">
            {inquiry.name && (
              <div className="flex items-center gap-1.5 text-sm text-white/60">
                <User className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
                <span>{inquiry.name}</span>
              </div>
            )}
            {inquiry.email && (
              <div className="flex items-center gap-1.5 text-sm text-white/60">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
                <span className="truncate">{inquiry.email}</span>
              </div>
            )}
            {inquiry.phone && (
              <div className="flex items-center gap-1.5 text-sm text-white/60">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
                <span>{inquiry.phone}</span>
              </div>
            )}
          </div>

          {inquiry.message && (
            <div className="flex items-start gap-1.5 text-sm text-white/40 mb-2">
              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2">{inquiry.message}</p>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(inquiry.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InquiriesPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([]);
  const [receivedInquiries, setReceivedInquiries] = useState<Inquiry[]>([]);
  const [loadingSent, setLoadingSent] = useState(true);
  const [loadingReceived, setLoadingReceived] = useState(true);
  const [errorSent, setErrorSent] = useState("");
  const [errorReceived, setErrorReceived] = useState("");

  const fetchSentInquiries = useCallback(async () => {
    try {
      setLoadingSent(true);
      setErrorSent("");
      const res = await api.get("/leads/my-inquiries");
      setSentInquiries(res.data.data || res.data);
    } catch (err: any) {
      setErrorSent(
        err.response?.data?.message || "Failed to load sent inquiries.",
      );
    } finally {
      setLoadingSent(false);
    }
  }, []);

  const fetchReceivedInquiries = useCallback(async () => {
    try {
      setLoadingReceived(true);
      setErrorReceived("");
      const res = await api.get("/leads/my-property-inquiries");
      setReceivedInquiries(res.data.data || res.data);
    } catch (err: any) {
      setErrorReceived(
        err.response?.data?.message || "Failed to load received inquiries.",
      );
    } finally {
      setLoadingReceived(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSentInquiries();
      fetchReceivedInquiries();
    }
  }, [isAuthenticated, fetchSentInquiries, fetchReceivedInquiries]);

  const inquiries = activeTab === "sent" ? sentInquiries : receivedInquiries;
  const loading = activeTab === "sent" ? loadingSent : loadingReceived;
  const error = activeTab === "sent" ? errorSent : errorReceived;

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">My Inquiries</h1>
          <p className="text-white/50 text-sm">
            Track inquiries you have sent and received for properties.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#111118] border border-white/10 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "sent"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <Send className="w-4 h-4" />
            Sent
            {!loadingSent && sentInquiries.length > 0 && (
              <span
                className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "sent"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {sentInquiries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "received"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <Inbox className="w-4 h-4" />
            Received
            {!loadingReceived && receivedInquiries.length > 0 && (
              <span
                className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "received"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {receivedInquiries.length}
              </span>
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && inquiries.length === 0 && (
          <div className="bg-[#111118] border border-white/10 rounded-xl">
            <EmptyState type={activeTab} />
          </div>
        )}

        {/* Inquiry Cards */}
        {!loading && !error && inquiries.length > 0 && (
          <div className="space-y-4">
            {inquiries.map((inquiry) =>
              activeTab === "sent" ? (
                <SentCard key={inquiry._id} inquiry={inquiry} />
              ) : (
                <ReceivedCard key={inquiry._id} inquiry={inquiry} />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
