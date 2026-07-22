import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Static Maps proxy.
 *
 * The interactive map needs a *browser* key (Maps JavaScript API), which is a
 * different key from GOOGLE_MAPS_SERVER_KEY and has to be restricted by HTTP
 * referrer. Until one is configured this route renders the same view as a
 * static Google image, so the site shows a Google map rather than falling back
 * to OpenStreetMap tiles.
 *
 * The key stays on the server. The browser only ever sees this endpoint.
 *
 * GET /api/maps/static?pickup=lat,lng&dropoff=lat,lng&path=<encoded>&w=&h=
 */

export const dynamic = 'force-dynamic';
// Static map images for the same coordinates never change; let the CDN keep
// them so a re-render does not spend another Google request.
export const revalidate = 3600;

const KEY = process.env.GOOGLE_MAPS_SERVER_KEY ?? '';

/** "25.59,85.13" → validated "lat,lng", or null. */
function coord(raw: string | null): string | null {
  if (!raw) return null;
  const m = /^(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)$/.exec(raw.trim());
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return `${lat},${lng}`;
}

export async function GET(req: NextRequest) {
  if (!KEY) {
    return NextResponse.json(
      { error: 'GOOGLE_MAPS_SERVER_KEY is not configured' },
      { status: 503 },
    );
  }

  const p = req.nextUrl.searchParams;
  const pickup = coord(p.get('pickup'));
  const dropoff = coord(p.get('dropoff'));
  const encoded = p.get('path');

  if (!pickup && !dropoff) {
    return NextResponse.json({ error: 'A pickup or dropoff coordinate is required' }, { status: 400 });
  }

  // Clamped so a crafted URL cannot ask Google for an enormous image.
  const width = Math.min(Math.max(Number(p.get('w')) || 640, 200), 640);
  const height = Math.min(Math.max(Number(p.get('h')) || 400, 200), 640);
  const scale = 2; // retina

  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');
  url.searchParams.set('size', `${width}x${height}`);
  url.searchParams.set('scale', String(scale));
  url.searchParams.set('maptype', 'roadmap');
  url.searchParams.set('key', KEY);

  if (pickup) url.searchParams.append('markers', `color:orange|label:P|${pickup}`);
  if (dropoff) url.searchParams.append('markers', `color:red|label:D|${dropoff}`);

  if (encoded) {
    url.searchParams.append('path', `color:0xf97316dd|weight:5|enc:${encoded}`);
  } else if (pickup && dropoff) {
    // No route geometry yet — a straight line still communicates the trip.
    url.searchParams.append('path', `color:0xf9731688|weight:4|${pickup}|${dropoff}`);
  }

  // Google auto-fits when markers/path are given; only a lone point needs a zoom.
  if (pickup && !dropoff && !encoded) url.searchParams.set('zoom', '14');
  if (dropoff && !pickup && !encoded) url.searchParams.set('zoom', '14');

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Static Maps returned ${res.status}` },
        { status: 502 },
      );
    }

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (err) {
    console.error('static map proxy failed', err);
    return NextResponse.json({ error: 'Could not load the map' }, { status: 502 });
  }
}
