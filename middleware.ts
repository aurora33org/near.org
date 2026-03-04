import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Middleware temporarily disabled to test routing
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
