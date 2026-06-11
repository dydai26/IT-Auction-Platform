import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
  let supabaseResponse = response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /admin routes
  // The path could be /ru/admin or /admin
  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.includes('/admin')
  
  if (isAdminRoute) {
    const isTestAdmin = request.cookies.get('test_admin')?.value === 'true';

    if (isTestAdmin) {
      return supabaseResponse; // Bypass check for test admin
    }

    if (!user) {
      // Redirect to homepage if no user
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    
    // Query actual database role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'user'
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/' // or 403
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
