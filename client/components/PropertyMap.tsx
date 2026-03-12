"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Loader2 } from "lucide-react";

// Dynamically import the Leaflet map to avoid SSR issues (Leaflet requires browser APIs)
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0d0d14]">
      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
    </div>
  ),
});

interface PropertyMapProps {
  /** Pre-stored lat/lng from the database */
  coordinates?: { lat: number; lng: number };
  /** Address string used to geocode when coordinates are unavailable */
  address?: string;
  /** Property title shown in the marker popup */
  title?: string;
}

async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Silently fail – we'll just show the placeholder
  }
  return null;
}

export default function PropertyMap({
  coordinates,
  address,
  title,
}: PropertyMapProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    coordinates?.lat && coordinates?.lng ? coordinates : null,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    coordinates?.lat && coordinates?.lng ? "ready" : "loading",
  );

  useEffect(() => {
    if (coords) {
      setStatus("ready");
      return;
    }
    if (!address) {
      setStatus("unavailable");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    geocodeAddress(address).then((result) => {
      if (cancelled) return;
      if (result) {
        setCoords(result);
        setStatus("ready");
      } else {
        setStatus("unavailable");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [coords, address]);

  if (status === "loading") {
    return (
      <div className="bg-[#111118] border border-white/10 rounded-xl h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Loader2 className="h-7 w-7 mx-auto mb-2 animate-spin text-blue-500" />
          <p className="text-sm">Loading map…</p>
        </div>
      </div>
    );
  }

  if (status === "unavailable" || !coords) {
    return (
      <div className="bg-[#111118] border border-white/10 rounded-xl h-64 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Map view coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden h-64 relative">
      <LeafletMap lat={coords.lat} lng={coords.lng} title={title} />
      {/* Google Maps deep-link overlay */}
      <a
        href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2.5 right-2.5 z-[1000] flex items-center gap-1.5 bg-white text-gray-800 text-xs font-medium px-2.5 py-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M21.752 15.002A9.998 9.998 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2c2.637 0 5.022 1.017 6.803 2.674L15.67 7.807A5.99 5.99 0 0 0 12 6.5a5.5 5.5 0 1 0 5.187 7.334l4.565 1.168Z"
          />
          <path
            fill="#34A853"
            d="M12 22v-4a6 6 0 0 0 5.187-3.166l4.565 1.168A10 10 0 0 1 12 22Z"
          />
          <path
            fill="#FBBC05"
            d="M6.306 14.5A5.5 5.5 0 0 1 6.5 12a5.478 5.478 0 0 1 .694-2.694L3.197 7.138A9.963 9.963 0 0 0 2 12c0 1.696.42 3.294 1.163 4.695L6.306 14.5Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.5c1.544 0 2.94.634 3.951 1.655L19.13 4.98A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.803 5.138l3.997 2.168A5.49 5.49 0 0 1 12 6.5Z"
          />
        </svg>
        View on Google Maps
      </a>
    </div>
  );
}
