export async function GET() {
  const content = `# CSC Travels

> Official website for CSC Travels Services Pvt. Ltd. (Patna, Bihar, India)

## About
CSC Travels offers intracity and outstation taxi services, rental cars, and travel support with transparent fare structure and no surge pricing.

## Key Pages
- Home: https://csctravels.com/
- Services (Fare Structure): https://csctravels.com/Services
- Contact: https://csctravels.com/Contact
- About: https://csctravels.com/About
- Partners: https://csctravels.com/Partners
- Sitemap: https://csctravels.com/sitemap.xml

## Booking and Contact
- Phone: tel:+919873101537
- Email: mailto:booking@csctravels.com
- Contact page: https://csctravels.com/Contact

## Fare Summary
- Intracity: ₹20/KM
- Outstation: ₹12/KM
- Toll/Parking: Actuals extra
- Member discount: 10% on base fare
- Employee/official discount: 25% on base fare (with approval)

## Data Usage
This website allows public indexing of informational content and service details for discovery and summarization by compliant crawlers.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
