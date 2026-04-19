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
  width: 600,
  height: 900,
};
export const contentType = "image/png";

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

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
    return "Available on request";
  }
  return `₹${p.price.toLocaleString("en-IN")}`;
}

function getFallbackPhoto(): string {
  return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";
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

  const title = p?.title ? `${p.title}` : "Property Listing";
  const location = p ? buildLocation(p) : "The Leasing World";
  const price = p ? buildPrice(p) : "Property preview";
  const photo = p?.images?.[0]
    ? p.images[0].startsWith("http")
      ? p.images[0]
      : new URL(
          p.images[0].startsWith("/") ? p.images[0] : `/${p.images[0]}`,
          getSiteUrl(),
        ).toString()
    : getFallbackPhoto();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #08131f 0%, #0a0f16 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(180deg, rgba(3,7,18,0.10), rgba(3,7,18,0.60)), url(" +
            photo +
            ")",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(8,19,31,0.05) 0%, rgba(8,19,31,0.25) 45%, rgba(8,19,31,0.88) 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "34px 34px 0 34px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            background: "rgba(255,255,255,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0f172a",
            fontSize: 22,
            fontWeight: 800,
            boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
          }}
        >
          TLW
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>
            The Leasing World
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Property preview</div>
        </div>
      </div>

      <div style={{ flex: 1, zIndex: 1 }} />

      <div
        style={{
          zIndex: 1,
          padding: "0 34px 34px 34px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            alignSelf: "flex-start",
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(16,185,129,0.18)",
            border: "1px solid rgba(16,185,129,0.35)",
            color: "#d1fae5",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          Featured Property
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.02 }}>
            {title}
          </div>
          <div style={{ fontSize: 22, opacity: 0.92, lineHeight: 1.2 }}>
            {location || "Prime location"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            paddingTop: 10,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 800 }}>{price}</div>
          <div
            style={{
              fontSize: 16,
              color: "#bae6fd",
              fontWeight: 600,
            }}
          >
            leasingworld.vercel.app
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
