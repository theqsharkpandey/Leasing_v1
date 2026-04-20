import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit)
    return new URL(explicit.endsWith("/") ? explicit : `${explicit}/`);

  const vercel = process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}/`);

  return new URL("http://localhost:3000/");
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "The Leasing World - Real Estate Advisory Across India",
  description:
    "Expert real estate advisory services — Retail Leasing, Commercial Leasing, PMC, and Sales & Purchase. Trusted by 70+ brands since 2007.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "The Leasing World - Real Estate Advisory Across India",
    description:
      "Expert real estate advisory services — Retail Leasing, Commercial Leasing, PMC, and Sales & Purchase. Trusted by 70+ brands since 2007.",
    url: "/",
    siteName: "The Leasing World",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "The Leasing World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Leasing World - Real Estate Advisory Across India",
    description:
      "Expert real estate advisory services — Retail Leasing, Commercial Leasing, PMC, and Sales & Purchase. Trusted by 70+ brands since 2007.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
