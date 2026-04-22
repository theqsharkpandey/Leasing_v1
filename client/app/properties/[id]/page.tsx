import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import PropertyDetailClient from "./PropertyDetailClient";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

type PropertyForMeta = {
  _id: string;
  title?: string;
  description?: string;
  city?: string;
  area?: string;
  state?: string;
  price?: number;
  listingIntent?: string;
  images?: string[];
  updatedAt?: string;
};

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  // local dev fallback
  return "http://localhost:3000";
}

async function getRequestBaseUrl(): Promise<string | null> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (!host) return null;
    const proto = h.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
  } catch {
    return null;
  }
}

function getApiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env) return env.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000/api";
  }

  // production-safe fallback (README)
  return "https://leasing-v1.onrender.com/api";
}

function buildDescription(p: PropertyForMeta): string {
  const parts: string[] = [];
  if (p.area || p.city || p.state) {
    parts.push([p.area, p.city, p.state].filter(Boolean).join(", "));
  }
  if (p.listingIntent) {
    parts.push(p.listingIntent === "rent" ? "For Rent" : "For Sale");
  }
  if (typeof p.price === "number" && p.price > 0) {
    parts.push(`₹${p.price.toLocaleString("en-IN")}`);
  }

  const stitched = parts.filter(Boolean).join(" • ");
  return (
    p.description?.trim() ||
    stitched ||
    "View property details on The Leasing World."
  );
}

/**
 * Apply Cloudinary transformations to resize the image for OG previews.
 *
 * WhatsApp displays a LARGE vertical card for square images (1:1 ratio)
 * and a small horizontal thumbnail for landscape (1.91:1).
 * We use 1080×1080 to match Instagram-style large preview cards.
 */
function getOgImage(imageUrl: string): string {
  if (!imageUrl) return "";

  // For Cloudinary URLs, inject a square resize transformation
  // 1080×1080 triggers WhatsApp's large card display (same as Instagram)
  if (imageUrl.includes("res.cloudinary.com") && imageUrl.includes("/upload/")) {
    return imageUrl.replace(
      "/upload/",
      "/upload/c_fill,w_1080,h_1080,g_auto,q_auto,f_jpg/",
    );
  }

  // Non-Cloudinary URLs — return as-is
  return imageUrl;
}

async function fetchPropertyForMeta(
  id: string,
): Promise<PropertyForMeta | null> {
  const apiBase = getApiBaseUrl();
  const url = `${apiBase}/properties/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      // Keep this reasonably fresh; WhatsApp will cache anyway.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PropertyForMeta;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  const siteUrl = (await getRequestBaseUrl()) || getSiteUrl();
  const propertyUrl = new URL(`/properties/${id}`, siteUrl).toString();

  const p = await fetchPropertyForMeta(id);

  // Fallback logo image (absolute URL)
  const fallbackImage = new URL("/logo.png", siteUrl).toString();

  // Fallback to parent metadata if property fetch fails
  if (!p) {
    const fallbackTitle =
      "The Leasing World - Real Estate Advisory Across India";
    const fallbackDescription = "View property details on The Leasing World.";

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: {
        canonical: propertyUrl,
      },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: propertyUrl,
        siteName: "The Leasing World",
        type: "article",
        images: [
          {
            url: fallbackImage,
            width: 1080,
            height: 1080,
            alt: "The Leasing World",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: [fallbackImage],
      },
    };
  }

  const title = p.title
    ? `${p.title} | The Leasing World`
    : "Property | The Leasing World";
  const description = buildDescription(p);

  // Use the first property image (Cloudinary CDN — fast, reliable)
  // Apply Cloudinary transformations for optimal 1200x630 size
  const image =
    p.images && p.images.length > 0
      ? getOgImage(p.images[0])
      : fallbackImage;

  return {
    title,
    description,
    alternates: {
      canonical: propertyUrl,
    },
    openGraph: {
      title,
      description,
      url: propertyUrl,
      siteName: "The Leasing World",
      type: "article",
      images: [
        {
          url: image,
          width: 1080,
          height: 1080,
          alt: p.title || "Property",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
