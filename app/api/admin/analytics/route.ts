import { isAuthenticated } from "@/lib/auth";

async function requireAdmin() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 403 });
  }
  return null;
}

export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const teamSlug = process.env.VERCEL_TEAM_SLUG;
  const projectSlug = process.env.VERCEL_PROJECT_SLUG;

  const dashboardUrl = teamSlug && projectSlug
    ? `https://vercel.com/${teamSlug}/${projectSlug}/analytics`
    : "https://vercel.com/dashboard";

  return Response.json({
    configured: true,
    dashboardUrl,
    message:
      "Vercel does not expose a stable public Web Analytics read endpoint for custom dashboards. Open the official Vercel Analytics dashboard via the link below.",
    analyticsScriptEnabled: true,
  });
}
