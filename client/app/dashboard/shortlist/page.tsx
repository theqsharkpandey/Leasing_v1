"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Search } from "lucide-react";
import api from "@/lib/api";
import { useShortlist } from "@/lib/shortlist-context";

interface ShortlistProperty {
  _id: string;
  title: string;
  city: string;
  area?: string;
  price: number;
  images: string[];
  listingIntent?: string;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} L`;
  return price.toLocaleString("en-IN");
}

export default function MyShortlistPage() {
  const { toggleShortlist } = useShortlist();
  const [properties, setProperties] = useState<ShortlistProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/shortlist");
        setProperties(res.data || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleRemove(id: string) {
    toggleShortlist(id);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">My Shortlist</h1>
      <p className="text-gray-500 text-sm mb-6">
        {properties.length} saved{" "}
        {properties.length === 1 ? "property" : "properties"}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-[#111118] border border-white/10 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-12 text-center">
          <Heart className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">
            Your shortlist is empty
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Save properties you like to compare them later
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {properties.map((p) => {
            const imgUrl =
              p.images?.[0] ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=60";
            return (
              <div
                key={p._id}
                className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors group"
              >
                <Link
                  href={`/properties/${p._id}`}
                  className="block relative h-40 bg-white/5"
                >
                  <Image
                    src={imgUrl}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-4">
                  <Link href={`/properties/${p._id}`}>
                    <h3 className="text-white text-sm font-semibold line-clamp-1 mb-1 hover:text-blue-400 transition-colors">
                      {p.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin className="h-3 w-3" />
                    {p.area ? `${p.area}, ` : ""}
                    {p.city}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-400 font-bold">
                      ₹{formatPrice(p.price)}
                      {p.listingIntent === "rent" && (
                        <span className="text-gray-500 font-normal text-xs">
                          /mo
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => handleRemove(p._id)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5 fill-red-400" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
