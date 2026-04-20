import { ImageResponse } from "next/og";

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};

type PropertyForImage = {
  title?: string;
  description?: string;
  city?: string;
  area?: string;
  state?: string;
  price?: number;
  listingIntent?: string;
  images?: string[];
};

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function getApiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env) return env.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000/api";
  }

  return "https://leasing-v1.onrender.com/api";
}

function buildLocation(p: PropertyForImage): string {
  return [p.area, p.city, p.state].filter(Boolean).join(", ");
}

function buildPrice(p: PropertyForImage): string {
  if (typeof p.price !== "number" || Number.isNaN(p.price) || p.price <= 0) {
    return "Price on request";
  }
  if (p.price >= 10000000) return `₹${(p.price / 10000000).toFixed(2)} Cr`;
  if (p.price >= 100000) return `₹${(p.price / 100000).toFixed(2)} L`;
  return `₹${p.price.toLocaleString("en-IN")}`;
}

async function fetchProperty(id: string): Promise<PropertyForImage | null> {
  try {
    const res = await fetch(
      `${getApiBaseUrl()}/properties/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as PropertyForImage;
  } catch {
    return null;
  }
}

export default async function Image({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const p = await fetchProperty(id);

  const title = p?.title || "Property Listing";
  const location = p ? buildLocation(p) : "The Leasing World";
  const price = p ? buildPrice(p) : "";
  const intent =
    p?.listingIntent === "rent"
      ? "For Rent"
      : p?.listingIntent === "buy"
        ? "For Sale"
        : "";

  // Use external image URL directly — Satori (used by ImageResponse) will fetch it
  const photoUrl = p?.images?.[0] || "";
  const hasPhoto = Boolean(photoUrl);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter, Arial, sans-serif",
        background: "#0a0f16",
      }}
    >
      {/* Background property photo — uses img tag for Satori compatibility */}
      {hasPhoto ? (
        <img
          src={photoUrl}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        /* Gradient fallback when no photo is available */
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background:
              "linear-gradient(135deg, #1e3a5f 0%, #0a1628 50%, #162a46 100%)",
          }}
        />
      )}

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
        }}
      >
        {/* Top bar: branding + badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo / Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f172a",
                fontSize: 18,
                fontWeight: 800,
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              TLW
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                The Leasing World
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Real Estate Advisory
              </div>
            </div>
          </div>

          {/* Intent badge */}
          {intent && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 18px",
                borderRadius: 999,
                background:
                  intent === "For Rent"
                    ? "rgba(59,130,246,0.25)"
                    : "rgba(16,185,129,0.25)",
                border: `1.5px solid ${intent === "For Rent" ? "rgba(59,130,246,0.5)" : "rgba(16,185,129,0.5)"}`,
                color: intent === "For Rent" ? "#93c5fd" : "#a7f3d0",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {intent}
            </div>
          )}
        </div>

        {/* Bottom: property details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              maxWidth: "85%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title.length > 50 ? title.slice(0, 47) + "..." : title}
          </div>

          {/* Location */}
          {location && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 22,
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 1px 8px rgba(0,0,0,0.4)",
              }}
            >
              {location}
            </div>
          )}

          {/* Price row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: 4,
            }}
          >
            {price && (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#60a5fa",
                  textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}
              >
                {price}
                {p?.listingIntent === "rent" && (
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    /month
                  </span>
                )}
              </div>
            )}
            <div
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 600,
              }}
            >
              leasingworld.vercel.app
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
