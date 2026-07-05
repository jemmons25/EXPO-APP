import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, findOrCreateUser } from "@/lib/auth";
import { appUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(`${appUrl()}/sign-in?error=google`);

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: `${appUrl()}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.id_token) throw new Error("No id_token");

    // Decode the id_token payload (signature verified implicitly by the
    // direct TLS exchange with Google's token endpoint).
    const payload = JSON.parse(Buffer.from(tokens.id_token.split(".")[1], "base64url").toString());
    const email = payload.email as string | undefined;
    if (!email || !payload.email_verified) throw new Error("No verified email");

    const user = await findOrCreateUser(email);
    await createSession(user.id);

    const cardCount = await db.card.count({ where: { userId: user.id } });
    return NextResponse.redirect(`${appUrl()}${cardCount > 0 ? "/dashboard" : "/editor/new"}`);
  } catch {
    return NextResponse.redirect(`${appUrl()}/sign-in?error=google`);
  }
}
