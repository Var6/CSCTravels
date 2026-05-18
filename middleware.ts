import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { corsHeaders } from '@/lib/auth'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'csctravels-secret-change-in-production'
)

async function readAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token')?.value
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl

  // ── CORS for all /api/* routes (used by mobile APK) ──────────────────
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

  // ── Admin gate (JWT, role=admin) ─────────────────────────────────────
  const isAdminRoute = url.pathname.startsWith('/admin')
  const isAdminLogin = url.pathname === '/admin/login'

  if (isAdminRoute) {
    const isAdmin = await readAdmin(request)

    if (!isAdminLogin && !isAdmin) {
      const loginUrl = url.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('redirect', url.pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isAdminLogin && isAdmin) {
      const dashUrl = url.clone()
      dashUrl.pathname = '/admin'
      dashUrl.search = ''
      return NextResponse.redirect(dashUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
