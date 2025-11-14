import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CSC Travels - Cab Service in Patna",
    short_name: "CSC Travels",
    description: "Best cab and taxi service in Patna with car rental and bus rental facilities.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpg",
      },
    ],
  };
}
