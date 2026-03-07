import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {
  return;
}, {
  secret:
    process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0
      ? process.env.NEXTAUTH_SECRET
      : "local-dev-secret-change-me",
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};