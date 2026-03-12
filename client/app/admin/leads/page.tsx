"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, Search } from "lucide-react";
import api from "@/lib/api";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: string;
  property?: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-blue-400/10 text-blue-400",
  contacted: "bg-amber-400/10 text-amber-400",
  negotiation: "bg-purple-400/10 text-purple-400",
  closed: "bg-green-400/10 text-green-400",
  lost: "bg-red-400/10 text-red-400",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/leads")
      .then((res) => setLeads(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l)),
      );
    } catch {
      alert("Failed to update status");
    }
  }

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.property?.title?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Leads Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111118] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-2">
          {["all", "new", "contacted", "negotiation", "closed", "lost"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                  filter === s
                    ? "bg-blue-600 text-white"
                    : "bg-[#111118] border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-[#111118] border border-white/10 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-12 text-center">
          <p className="text-gray-500">No leads found.</p>
        </div>
      ) : (
        <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm text-white font-medium">
                        {lead.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-300">
                        <Mail className="h-3 w-3 text-gray-500" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400 truncate max-w-[200px] block">
                        {lead.property?.title || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead._id, e.target.value)
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer border-0 ${
                          STATUS_STYLE[lead.status] ||
                          "bg-gray-400/10 text-gray-400"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="closed">Closed</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && leads.length > 0 && (
        <div className="mt-4 flex gap-4 text-xs text-gray-500">
          <span>Total: {leads.length}</span>
          <span>New: {leads.filter((l) => l.status === "new").length}</span>
          <span>
            Closed: {leads.filter((l) => l.status === "closed").length}
          </span>
        </div>
      )}
    </div>
  );
}
