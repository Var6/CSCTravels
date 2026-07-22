import { NextResponse } from 'next/server';

/**
 * Which map capabilities are actually configured.
 *
 * Worth having permanently: map failures on this site are almost always a key
 * or an un-enabled API rather than a code fault, and that is invisible from the
 * outside — a missing browser key and a disabled Static Maps API both surface
 * to the rider as the same blank panel.
 *
 * GET /api/maps/health
 *
 * Reports only whether keys are present and which Google APIs answer. Key
 * values are never returned; the browser key is identified by its last four
 * characters so it can be told apart from the server key without exposing it.
 */

export const dynamic = 'force-dynamic';

const SERVER_KEY = process.env.GOOGLE_MAPS_SERVER_KEY ?? '';
/**
 * Read at module scope so it is inlined at build time exactly as the client
 * bundle sees it. Reading it inside the handler would report the runtime value,
 * which is not what the browser actually got.
 */
const BROWSER_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY ?? '';

const tail = (k: string) => (k ? `…${k.slice(-4)}` : null);

async function probe(url: string): Promise<{ ok: boolean; status: number; detail?: string }> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const body = await res.text();
    // Google answers 200 with an error status in the JSON for some APIs, and a
    // plain-text 403 for others, so both shapes have to be checked.
    let detail: string | undefined;
    try {
      const json = JSON.parse(body);
      if (json.status && json.status !== 'OK') detail = json.error_message ?? json.status;
    } catch {
      if (!res.ok) detail = body.slice(0, 160);
    }
    return { ok: res.ok && !detail, status: res.status, detail };
  } catch (err) {
    return { ok: false, status: 0, detail: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET() {
  const checks: Record<string, unknown> = {
    browserKeyConfigured: Boolean(BROWSER_KEY),
    browserKey: tail(BROWSER_KEY),
    serverKeyConfigured: Boolean(SERVER_KEY),
    serverKey: tail(SERVER_KEY),
  };

  if (SERVER_KEY) {
    checks.staticMaps = await probe(
      `https://maps.googleapis.com/maps/api/staticmap?size=100x100&center=25.59,85.13&zoom=10&key=${SERVER_KEY}`,
    );
    checks.geocoding = await probe(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=25.59,85.13&key=${SERVER_KEY}`,
    );
  }

  if (BROWSER_KEY) {
    // No Referer header here, so this only proves the key exists and the API is
    // enabled — not that the referrer restriction allows your domain.
    checks.mapsJavaScript = await probe(
      `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&libraries=geometry`,
    );
  }

  const interactiveReady = Boolean(BROWSER_KEY);
  const staticReady = Boolean(
    SERVER_KEY && (checks.staticMaps as { ok?: boolean } | undefined)?.ok,
  );

  return NextResponse.json({
    summary: interactiveReady
      ? 'Interactive Google map available'
      : staticReady
        ? 'Static Google map only — set NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY for the interactive map'
        : 'No map available — configure NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY, or enable Static Maps API on the server key',
    interactiveReady,
    staticReady,
    checks,
  });
}
