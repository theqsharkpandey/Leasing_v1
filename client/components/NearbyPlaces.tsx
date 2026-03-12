"use client";

import { useEffect, useState } from "react";
import {
  School,
  Hospital,
  Train,
  ShoppingBag,
  Trees,
  Coffee,
  Loader2,
} from "lucide-react";

interface Place {
  id: number;
  name: string;
  distance?: string;
}

interface Category {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  query: string;
}

const CATEGORIES: Category[] = [
  {
    key: "school",
    label: "Schools",
    icon: <School className="h-4 w-4" />,
    color: "text-yellow-400",
    query: `node["amenity"~"school|college|university"](around:2000,LAT,LNG);`,
  },
  {
    key: "hospital",
    label: "Hospitals",
    icon: <Hospital className="h-4 w-4" />,
    color: "text-red-400",
    query: `node["amenity"~"hospital|clinic|pharmacy"](around:2000,LAT,LNG);`,
  },
  {
    key: "metro",
    label: "Metro / Transit",
    icon: <Train className="h-4 w-4" />,
    color: "text-blue-400",
    query: `node["station"~"subway|railway"](around:3000,LAT,LNG);node["railway"="station"](around:3000,LAT,LNG);`,
  },
  {
    key: "shopping",
    label: "Shopping",
    icon: <ShoppingBag className="h-4 w-4" />,
    color: "text-purple-400",
    query: `node["shop"~"mall|supermarket"](around:2000,LAT,LNG);`,
  },
  {
    key: "park",
    label: "Parks",
    icon: <Trees className="h-4 w-4" />,
    color: "text-green-400",
    query: `node["leisure"="park"](around:2000,LAT,LNG);`,
  },
  {
    key: "restaurant",
    label: "Restaurants",
    icon: <Coffee className="h-4 w-4" />,
    color: "text-orange-400",
    query: `node["amenity"~"restaurant|cafe|fast_food"](around:1000,LAT,LNG);`,
  },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbyPlaces({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const [active, setActive] = useState("school");
  const [places, setPlaces] = useState<Record<string, Place[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.key === active);
    if (!cat || places[active]) return;

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const body =
          "[out:json][timeout:10];\n(" +
          cat.query
            .replaceAll("LAT", String(lat))
            .replaceAll("LNG", String(lng)) +
          ");\nout body 8;";

        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body,
        });
        const json = await res.json();
        const items: Place[] = (json.elements || [])
          .filter(
            (e: { tags?: { name?: string }; lat?: number; lon?: number }) =>
              e.tags?.name,
          )
          .map(
            (e: {
              id: number;
              tags: { name: string };
              lat: number;
              lon: number;
            }) => ({
              id: e.id,
              name: e.tags.name,
              distance:
                e.lat && e.lon
                  ? haversineKm(lat, lng, e.lat, e.lon).toFixed(1) + " km"
                  : undefined,
            }),
          )
          .sort(
            (a: Place, b: Place) =>
              parseFloat(a.distance || "99") - parseFloat(b.distance || "99"),
          )
          .slice(0, 6);

        setPlaces((prev) => ({ ...prev, [active]: items }));
      } catch {
        setPlaces((prev) => ({ ...prev, [active]: [] }));
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [active, lat, lng, places]);

  const currentPlaces = places[active];
  const currentCat = CATEGORIES.find((c) => c.key === active)!;

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-semibold text-lg mb-4">Nearby Places</h3>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              active === cat.key
                ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            <span className={active === cat.key ? "text-blue-300" : cat.color}>
              {cat.icon}
            </span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
          <span className="ml-2 text-gray-400 text-sm">
            Fetching nearby places…
          </span>
        </div>
      ) : currentPlaces && currentPlaces.length > 0 ? (
        <div className="space-y-2">
          {currentPlaces.map((place) => (
            <div
              key={place.id}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className={currentCat.color}>{currentCat.icon}</span>
                <span className="text-gray-300 text-sm">{place.name}</span>
              </div>
              {place.distance && (
                <span className="text-gray-500 text-xs shrink-0 ml-2">
                  {place.distance}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : currentPlaces && currentPlaces.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No {currentCat.label.toLowerCase()} found within range.
        </p>
      ) : (
        <p className="text-gray-600 text-sm text-center py-4">
          Select a category to see nearby places.
        </p>
      )}
    </div>
  );
}
