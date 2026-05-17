import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { corsHeaders } from '@/lib/auth'

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

  // ── Supabase session refresh + admin route guard ──────────────────────
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = url.pathname.startsWith('/admin')
  const isAdminLogin = url.pathname === '/admin/login'

  if (isAdminRoute && !isAdminLogin && !user) {
    const loginUrl = url.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('redirect', url.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminLogin && user) {
    const dashUrl = url.clone()
    dashUrl.pathname = '/admin'
    dashUrl.search = ''
    return NextResponse.redirect(dashUrl)
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
