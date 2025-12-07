import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://csctravels.com"), // Update if domain is different
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
    canonical: "https://csctravels.com",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://csctravels.com",
    siteName: "CSC Travels",
    title: "CSC Travels | Best Cab Service in Patna",
    description:
      "Book reliable cab, car rental, and bus rental services in Patna. 24/7 member support, airport rides, and affordable pricing.",
    images: [
      {
        url: "/logo.jpg", // your logo in public folder
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
    images: ["/logo.jpg"],
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
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },

  category: "transportation",
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
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
