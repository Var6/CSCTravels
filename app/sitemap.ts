import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://csctravels.com",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://csctravels.com/About",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://csctravels.com/Contact",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://csctravels.com/Services",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://csctravels.com/Booking",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: "https://csctravels.com/Partners",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
