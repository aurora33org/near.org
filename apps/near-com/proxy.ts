import { auth } from "@near/cms-core/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAcceptInvitePage = req.nextUrl.pathname.startsWith("/admin/accept-invite");

  if (isAdminRoute && !isLoginPage && !isAcceptInvitePage && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
