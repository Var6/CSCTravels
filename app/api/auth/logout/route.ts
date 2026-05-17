import { jsonResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// Token is stateless (JWT). Client should discard the token.
// This endpoint clears the cookie for web clients.
export async function POST() {
  const res = jsonResponse({ success: true, message: 'Logged out successfully' })
  res.headers.set('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax')
  return res
}
