import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https://csctravels.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "CSC Travels",
  referrer: "origin-when-cross-origin",
  title: {
    default: "CSC Travels | Cab Service in Patna",
    template: "%s | CSC Travels",
  },
  description:
    "CSC Travels provides reliable cab service in Patna including local rides, airport pickup/drop, car rental, and bus rental for members. Also serving on Ola, Uber, and Rapido platforms.",

  keywords: [
    "cab service in Patna",
    "Patna taxi service",
    "CSC cab Patna",
    "car rental Patna",
    "bus rental Patna",
    "Patna airport cab",
    "local taxi service",
    "OLA cab Patna",
    "Uber cab Patna",
    "Rapido Patna",
    "Patna transportation",
    "CSC Travels Patna",
    "best taxi in patna",
    "cab service in patna",
    "taxi booking patna",
    "patna airport taxi",
    "local cab service patna",
    "car rental patna",
    "ola taxi pattna",
    "uber cab patna",
    "rapido patna",
    "patna taxi number",
    'csc travels cab',
    'best cab service patna',
  ],

  authors: [{ name: "CSC Travels" }],
  creator: "CSC Travels",
  publisher: "CSC Travels",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "CSC Travels",
    title: "CSC Travels | Best Cab Service in Patna",
    description:
      "Book reliable cab, car rental, and bus rental services in Patna. 24/7 member support, airport rides, and affordable pricing.",
    images: [
      {
        url: "/logo.png", // your logo in public folder
        width: 800,
        height: 800,
        alt: "CSC Travels Logo",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "CSC Travels | Cab Service in Patna",
    description: "Affordable and reliable cab service in Patna.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },

  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },

  other: {
    "ai-content-policy": "index,follow",
  },

  category: "transportation",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  name: "CSC Travels Services Pvt. Ltd.",
  url: siteUrl,
  image: `${siteUrl}/logo.png`,
  telephone: "+91-98731-01537",
  email: "booking@csctravels.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shanti Devi Nivas, near Sichai Bhawan, Anishabad",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "800002",
    addressCountry: "IN",
  },
  areaServed: ["Patna", "Bihar", "India"],
  priceRange: "₹₹",
  sameAs: [
    "https://www.facebook.com/share/18LUspKNQu/",
    "https://x.com/CscTravels43283",
    "https://www.instagram.com/csc.travel",
    "https://www.linkedin.com/company/csc-travels/",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CSC Travels",
  url: siteUrl,
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "CommunicateAction",
    target: [
      "tel:+919873101537",
      "mailto:booking@csctravels.com",
      `${siteUrl}/Contact`,
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
