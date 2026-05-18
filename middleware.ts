import { NextResponse, type NextRequest } from 'next/server'
import { corsHeaders } from '@/lib/auth'

// Public website middleware. The admin dashboard now lives at
// app.csctravels.com (CSCBilling) — there is no /admin here anymore.
// We only handle CORS for the public /api/* routes (used by mobile clients).
export function middleware(request: NextRequest) {
  const url = request.nextUrl

  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders() })
    }
    const res = NextResponse.next()
    for (const [key, value] of Object.entries(corsHeaders())) {
      res.headers.set(key, value)
    }
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
