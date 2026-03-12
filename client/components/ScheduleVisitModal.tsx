"use client";

import { useState } from "react";
import { X, CalendarCheck, Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

interface Props {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
}

export default function ScheduleVisitModal({
  propertyId,
  propertyTitle,
  onClose,
}: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    date: "",
    timeSlot: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.date || !form.timeSlot) {
      setError("Please select a date and time slot.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/visits", { ...form, property: propertyId });
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response
              ?.data?.error || "Failed to schedule visit";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-semibold">
            <CalendarCheck className="h-5 w-5 text-blue-400" />
            Schedule a Visit
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold text-lg mb-1">
              Visit Requested!
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              We&apos;ve sent your request. The agent will confirm shortly.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-gray-400 text-xs line-clamp-2">
              Property: <span className="text-gray-300">{propertyTitle}</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Phone *
                </label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                  placeholder="+91"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Email *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                placeholder="you@email.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Date *
                </label>
                <input
                  required
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Time Slot *
                </label>
                <select
                  required
                  value={form.timeSlot}
                  onChange={(e) =>
                    setForm({ ...form, timeSlot: e.target.value })
                  }
                  className="w-full bg-[#1a1a25] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">Select</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Message (optional)
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="Any special requests or questions?"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Booking…
                </>
              ) : (
                <>
                  <CalendarCheck className="h-4 w-4" /> Confirm Visit
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
