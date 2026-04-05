import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createSession } from "@/lib/auth";

async function verifyTurnstile(token: string, remoteip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteip) body.append("remoteip", remoteip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, turnstileToken } = await request.json();

    if (!email || !password || !turnstileToken) {
      return NextResponse.json({
        error: "Email, password and Turnstile token are required",
      }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarder-for")?.split(",")[0].trim();
    const turnstileOk = await verifyTurnstile(turnstileToken, ip);

    if (!turnstileOk) {
      return NextResponse.json({
        error: "Capcha verification failed. Please try again."
      }, { status: 401 })
    }

    const isValid = await verifyAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
