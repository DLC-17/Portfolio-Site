import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin-studio")) {
    const validUser = process.env.STUDIO_ADMIN_USER;
    const validPass = process.env.STUDIO_ADMIN_PASSWORD;

    // If no credentials configured and in development mode, allow through
    if (!validUser || !validPass) {
      if (process.env.NODE_ENV === "development") {
        return NextResponse.next();
      }
    }

    const basicAuth = req.headers.get("authorization");
    if (basicAuth) {
      const parts = basicAuth.split(" ");
      if (parts.length === 2 && parts[0] === "Basic") {
        try {
          const decoded = atob(parts[1]);
          const [user, pwd] = decoded.split(":");

          if (user === validUser && pwd === validPass) {
            return NextResponse.next();
          }
        } catch {
          // Invalid base64 encoding
        }
      }
    }

    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Sanity Studio Admin"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-studio/:path*"],
};
