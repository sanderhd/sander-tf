import { isAuthenticated } from "@/lib/auth";

export async function GET() {
    const authenticated = await isAuthenticated();
    return Response.json({ isAdmin: authenticated });
}