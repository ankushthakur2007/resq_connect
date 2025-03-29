import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only run middleware in development or when not using static export
export function middleware(request: NextRequest) {
  // Log API requests for debugging
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API Request] ${request.method} ${request.nextUrl.pathname}`)
  }

  return NextResponse.next()
}

// Only run middleware for API routes
export const config = {
  matcher: [
    // API routes
    '/api/:path*',
  ],
}