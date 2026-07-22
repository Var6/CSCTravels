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

type Reason = 'ok' | 'billing_disabled' | 'api_not_enabled' | 'key_restricted' | 'other';

/**
 * Classifies Google's refusal.
 *
 * These three failures look almost identical from the outside but need
 * completely different fixes, and confusing them costs hours: billing is an
 * account-level switch, enabling is per-API, and a key restriction is per-key.
 */
function classify(text: string): Reason {
  const t = text.toLowerCase();
  if (t.includes('enable billing') || t.includes('must enable billing')) return 'billing_disabled';
  if (t.includes('has not been used in project') || t.includes('is not activated')) return 'api_not_enabled';
  if (t.includes('not authorized to use this service') || t.includes('api restrictions')) return 'key_restricted';
  return 'other';
}

async function probe(
  url: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; reason: Reason; detail?: string }> {
  try {
    const res = await fetch(url, { ...init, cache: 'no-store' });
    const body = await res.text();

    // Google answers 200 with an error status in the JSON for some APIs, and a
    // plain-text 403 for others, so both shapes have to be checked.
    let detail: string | undefined;
    try {
      const json = JSON.parse(body);
      if (json.status && json.status !== 'OK') detail = json.error_message ?? json.status;
      if (json.error?.message) detail = json.error.message;
    } catch {
      if (!res.ok) detail = body.slice(0, 200);
    }

    const reason: Reason = detail ? classify(detail) : 'ok';
    return { ok: res.ok && !detail, status: res.status, reason, detail };
  } catch (err) {
    return {
      ok: false, status: 0, reason: 'other',
      detail: err instanceof Error ? err.message : String(err),
    };
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
    // Distance Matrix is the plainest billing signal: it reports the billing
    // state directly rather than hiding it behind an authorisation message.
    checks.distanceMatrix = await probe(
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=25.5941,85.1376&destinations=25.6,85.15&key=${SERVER_KEY}`,
    );
    checks.routes = await probe(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': SERVER_KEY,
          'X-Goog-FieldMask': 'routes.distanceMeters',
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: 25.5941, longitude: 85.1376 } } },
          destination: { location: { latLng: { latitude: 25.6, longitude: 85.15 } } },
          travelMode: 'DRIVE',
        }),
      },
    );
  }

  if (BROWSER_KEY) {
    // No Referer header here, so this only proves the key exists and the API is
    // enabled — not that the referrer restriction allows your domain.
    checks.mapsJavaScript = await probe(
      `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&libraries=geometry`,
    );
  }

  const probes = Object.values(checks).filter(
    (c): c is { ok: boolean; reason: Reason } =>
      typeof c === 'object' && c !== null && 'reason' in c,
  );

  /*
   * Billing beats everything else. Maps Platform refuses every API without an
   * active billing account, and the per-API messages it returns in that state
   * misleadingly talk about activation and key restrictions — which sends you
   * chasing the wrong fix.
   */
  const billingDisabled = probes.some((c) => c.reason === 'billing_disabled');
  const anyNotEnabled = probes.some((c) => c.reason === 'api_not_enabled');
  const anyKeyRestricted = probes.some((c) => c.reason === 'key_restricted');

  const blocker = billingDisabled
    ? 'billing_disabled'
    : anyNotEnabled
      ? 'api_not_enabled'
      : anyKeyRestricted
        ? 'key_restricted'
        : null;

  const advice: Record<string, string> = {
    billing_disabled:
      'Enable billing on the Google Cloud project. Every Maps Platform API refuses ' +
      'requests without an active billing account, even within the free tier — this ' +
      'blocks search, geocoding, routing and static maps regardless of which APIs are enabled.',
    api_not_enabled:
      'Enable the failing APIs in Google Cloud Console under APIs & Services > Library.',
    key_restricted:
      'The server key is restricted to a subset of APIs. Add the failing ones under ' +
      'Credentials > the key > API restrictions.',
  };

  return NextResponse.json({
    summary: blocker
      ? `Maps degraded — ${blocker.replace('_', ' ')}`
      : 'All Google map services available',
    blocker,
    advice: blocker ? advice[blocker] : null,
    interactiveReady: Boolean(BROWSER_KEY) && !billingDisabled,
    staticReady: Boolean((checks.staticMaps as { ok?: boolean } | undefined)?.ok),
    /** Without these, search, addresses and fare distance silently use OpenStreetMap. */
    routingReady: Boolean((checks.routes as { ok?: boolean } | undefined)?.ok),
    geocodingReady: Boolean((checks.geocoding as { ok?: boolean } | undefined)?.ok),
    checks,
  });
}
