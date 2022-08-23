import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // Exclude all paths except slugs (hopefully)
  const shouldExecute: Boolean = !(
    path.includes('.') ||
    path === "/" ||
    path.startsWith("/api")
  );

  if (shouldExecute) {
    const slug = req.nextUrl.pathname.split("/").pop();
    const fetchUrl = await fetch(`${req.nextUrl.origin}/api/fetch-url/${slug}`);

    // If we have slug, then redirect to the corresponding URL from the db
    if (fetchUrl.status === 200) {
      const data = await fetchUrl.json();
      return NextResponse.redirect(data.url);
    }

    // Else go to origin
    return NextResponse.redirect(req.nextUrl.origin);
  }

  // Do nothing in case we're dealing with something else except slug
  return;

};