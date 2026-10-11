import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serves the Coffee Log on the `log.` subdomain from routes that physically
// live under /log, while keeping the clean permalinks the QR codes point to
// (log.coffeenotes.fyi/2026-014 → /log/2026-014).
//
// Middleware is called Proxy in this Next.js version.

const PROD_MAIN_HOSTS = new Set(["coffeenotes.fyi", "www.coffeenotes.fyi"]);

// Paths served verbatim regardless of host: framework internals, API routes,
// and the public /bags assets (photos + generated QR SVG/PNG).
function isPassThrough(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/bags") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.includes(".") // any other static file
  );
}

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];
  const { pathname } = request.nextUrl;
  const isLogHost = host.startsWith("log.");

  if (isLogHost) {
    if (isPassThrough(pathname) || pathname.startsWith("/log")) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = `/log${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // On the production main host, the log isn't reachable at /log.
  // (Localhost keeps /log accessible for local preview.)
  if (PROD_MAIN_HOSTS.has(host) && pathname.startsWith("/log")) {
    const url = request.nextUrl.clone();
    url.pathname = "/_log-not-found";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and obvious static files; the
  // finer host/path logic lives in the function above.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
