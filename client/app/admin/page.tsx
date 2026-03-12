"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ShieldCheck,
  Eye,
  BarChart3,
} from "lucide-react";
import api from "@/lib/api";

interface Stats {
  totalProperties: number;
  pendingReview: number;
  approvedProperties: number;
  rejectedProperties: number;
  needsDocuments: number;
  verifiedProperties: number;
  totalLeads: number;
  newLeads: number;
  closedLeads: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Properties",
      value: stats?.totalProperties ?? 0,
      icon: Building2,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Pending Review",
      value: stats?.pendingReview ?? 0,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Approved",
      value: stats?.approvedProperties ?? 0,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Needs Documents",
      value: stats?.needsDocuments ?? 0,
      icon: FileText,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      label: "Rejected",
      value: stats?.rejectedProperties ?? 0,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
    {
      label: "Verified",
      value: stats?.verifiedProperties ?? 0,
      icon: ShieldCheck,
      color: "text-teal-400",
      bg: "bg-teal-400/10",
    },
    {
      label: "Total Leads",
      value: stats?.totalLeads ?? 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "New Leads",
      value: stats?.newLeads ?? 0,
      icon: Eye,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
    {
      label: "Closed Deals",
      value: stats?.closedLeads ?? 0,
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-[#111118] border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <span className="text-3xl font-bold text-white">
                  {loading ? "—" : card.value}
                </span>
              </div>
              <p className="text-sm text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
