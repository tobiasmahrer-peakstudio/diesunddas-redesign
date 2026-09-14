import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.atelierdiesunddas.ch";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ATELIER dies & das — Schönes für dich & dein Zuhause | Laufen",
    template: "%s | ATELIER dies & das",
  },
  description:
    "ATELIER dies & das in Laufen: Wohnaccessoires, Mode, Schmuck, Geschenke und Fine Food — sorgfältig ausgewählt, persönlich beraten.",
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "ATELIER dies & das",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de-CH"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
