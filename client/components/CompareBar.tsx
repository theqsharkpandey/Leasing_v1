"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, Trash2 } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import api from "@/lib/api";

interface CompareProperty {
  _id: string;
  title: string;
  images: string[];
}

export default function CompareBar() {
  const { compareIds, removeFromCompare, clearCompare, compareCount } =
    useCompare();
  const [properties, setProperties] = useState<CompareProperty[]>([]);

  useEffect(() => {
    if (compareIds.length === 0) {
      setProperties([]);
      return;
    }
    api
      .post("/properties/batch", { ids: compareIds })
      .then((res) => setProperties(res.data || []))
      .catch(() => {});
  }, [compareIds]);

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111118] border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">
        <span className="text-sm font-semibold text-white shrink-0">
          Compare ({compareCount}/3)
        </span>

        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {compareIds.map((id) => {
            const prop = properties.find((p) => p._id === id);
            const imgUrl =
              prop?.images?.[0] ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=60";
            return (
              <div
                key={id}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 shrink-0"
              >
                <div className="relative h-8 w-12 rounded overflow-hidden bg-white/5">
                  <Image
                    src={imgUrl}
                    alt={prop?.title || "Property"}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs text-gray-300 max-w-[120px] truncate">
                  {prop?.title || "Loading..."}
                </span>
                <button
                  onClick={() => removeFromCompare(id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
          <Link
            href="/compare"
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
              compareCount >= 2
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white/5 text-gray-500 cursor-not-allowed pointer-events-none"
            }`}
          >
            Compare Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
