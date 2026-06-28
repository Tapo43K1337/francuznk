import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { Grain } from "@/components/Grain";
import { Header } from "@/components/layout/Header";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Providers } from "@/components/providers/Providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "кав'ярня",
    "пекарня",
    "спешелті кава",
    "кава",
    "сніданки",
    "круасани",
    "ФРАНЦУЗ",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#16120f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: SITE.name,
  description: SITE.description,
  servesCuisine: ["Coffee", "Bakery", "Breakfast"],
  address: { "@type": "PostalAddress", streetAddress: SITE.address },
  telephone: SITE.phone,
  url: SITE.url,
  openingHours: "Mo-Su 08:00-21:00",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${playfair.variable} ${manrope.variable} antialiased`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Grain />
        <Providers>
          <Header />
          <div className="flex min-h-[100svh] flex-col">
            <main id="top" className="flex-1">
              {children}
            </main>
            <SiteChrome />
          </div>
        </Providers>
      </body>
    </html>
  );
}
