// Layout.tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Provider from "./provider";

const appFont = DM_Sans({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "UI Forge",
  description: "A component library for building modern web applications.",
  icons: {
    icon: '/logoui.png',
  },
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
      <body className={`${appFont.className}`}>
  <ClerkProvider>
    <Provider>
      {children}
    </Provider>
  </ClerkProvider>
</body>
      
      </body>
    </html>
   
  );
}
