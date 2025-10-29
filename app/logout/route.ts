import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL("/login", request.url);
  const res = NextResponse.redirect(url);
  res.cookies.set({ name: "token", value: "", path: "/", maxAge: 0 });
  return res;
}

