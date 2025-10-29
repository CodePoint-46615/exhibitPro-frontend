import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);
  const token = req.headers.get("cookie")?.match(/(?:^|; )token=([^;]+)/)?.[1];
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  if (url.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
