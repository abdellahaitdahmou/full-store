import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    // Vercel Edge Server crashes on Supabase SSR initializing.
    // Bypassing middleware completely; authentication redirects 
    // will be handled by Layout/Page components in the Node runtime.
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
