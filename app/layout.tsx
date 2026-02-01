import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const appFont = DM_Sans({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "UI Forge",
  description: "A component library for building modern web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${appFont.className}`}   
      >
        {children}
      </body>
    </html>
  );
}
