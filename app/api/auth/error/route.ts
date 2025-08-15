import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');

  if (error === 'OAuthAccountNotLinked') {
    // Redirect to a custom page that explains the issue
    return NextResponse.redirect(new URL('/auth/link-accounts', request.url));
  }

  // For other errors, redirect to sign-in page
  return NextResponse.redirect(new URL('/api/auth/signin', request.url));
}
