// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

const appFont = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

/* ================= SEO METADATA ================= */
export const metadata: Metadata = {
  title: {
    default: "UI Forge – AI UI/UX Creator & Website Builder",
    template: "%s | UI Forge",
  },

  description:
    "UI Forge is an AI-powered UI/UX creator that generates modern website and mobile app designs instantly. Build UI mockups, dashboards, and interfaces faster.",

  keywords: [
    "UI UX creator",
    "UI UX maker",
    "AI UI generator",
    "UI design tool",
    "UX design tool",
    "AI website builder",
    "UI mockup generator",
    "frontend UI generator",
    "Tailwind UI generator",
    "design to code",
  ],

  authors: [{ name: "UI Forge Team" }],
  creator: "UI Forge",

  metadataBase: new URL("https://uixmaker.in"),

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "UI Forge – AI UI/UX Creator",
    description:
      "Generate professional UI/UX designs for websites and mobile apps using AI. Fast, modern, and developer-friendly.",
    url: "https://uixmaker.in",
    siteName: "UI Forge",
    images: [
      {
        url: "/og-image.png", // optional (recommended)
        width: 1200,
        height: 630,
        alt: "UI Forge – AI UI UX Creator",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "UI Forge – AI UI/UX Creator",
    description:
      "Create modern UI/UX designs instantly using AI. Websites, dashboards, and mobile apps.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={appFont.className}>
        <ClerkProvider>
          <Provider>{children}</Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}