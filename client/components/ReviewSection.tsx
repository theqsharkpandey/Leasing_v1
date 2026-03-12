"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, Loader2, Trash2, User } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
}

function StarRating({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const sz = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const active = hover || value;
  return (
    <div className="flex gap-0.5" onMouseLeave={() => onChange && setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`${sz} ${
              active >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 0, title: "", body: "" });
  const [formError, setFormError] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews?property=${propertyId}`);
      setReviews(res.data.reviews);
      setAvg(res.data.avg);
      setTotal(res.data.total);
      if (user) {
        setAlreadyReviewed(
          res.data.reviews.some((r: Review) => r.user._id === user.id),
        );
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [propertyId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.rating) {
      setFormError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/reviews", {
        property: propertyId,
        rating: form.rating,
        title: form.title,
        body: form.body,
      });
      setForm({ rating: 0, title: "", body: "" });
      fetchReviews();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to submit review";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      id="reviews"
      className="bg-[#111118] border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Reviews</h3>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avg)} size="sm" />
            <span className="text-yellow-400 font-semibold">{avg}</span>
            <span className="text-gray-500 text-sm">({total})</span>
          </div>
        )}
      </div>

      {/* Write a review */}
      {user && !alreadyReviewed && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-white/3 border border-white/8 rounded-xl space-y-3"
        >
          <p className="text-gray-400 text-sm font-medium">Write a Review</p>
          <div>
            <StarRating
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
            />
          </div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
            placeholder="Title (optional)"
            maxLength={120}
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none"
            placeholder="Share your experience…"
            maxLength={1000}
          />
          {formError && <p className="text-red-400 text-xs">{formError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
            Submit Review
          </button>
        </form>
      )}

      {/* Review list */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          No reviews yet. Be the first to review this property.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium">
                      {review.user.name}
                    </span>
                    <p className="text-gray-600 text-xs">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="sm" />
                  {(user?.id === review.user._id ||
                    ["admin", "super_admin"].includes(user?.role || "")) && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {review.title && (
                <p className="text-white text-sm font-medium mt-1">
                  {review.title}
                </p>
              )}
              {review.body && (
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  {review.body}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
