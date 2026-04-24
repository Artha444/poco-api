import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

const protectedRoutes = ['/admin', '/pos']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Role based access control
    if (pathname.startsWith('/admin') && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/pos', request.url)) // redirect cashier away from admin
    }
    
    if (pathname.startsWith('/pos') && session.user.role !== 'CASHIER' && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged in users away from login
  if (pathname === '/login') {
    const session = await getSession()
    if (session) {
      if (session.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        return NextResponse.redirect(new URL('/pos', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
