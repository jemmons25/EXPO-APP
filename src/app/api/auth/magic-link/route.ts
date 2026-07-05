import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { findOrCreateUser } from "@/lib/auth";
import { sendMagicLink } from "@/lib/mail";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp, appUrl } from "@/lib/utils";
import { jsonError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  if (!rateLimit(`magic:${getClientIp(req)}`, 10)) return rateLimitResponse();

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("Enter a valid email address");

  const user = await findOrCreateUser(email);
  const token = randomBytes(32).toString("hex");
  await db.loginToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
  });

  const url = `${appUrl()}/api/auth/callback?token=${token}`;
  const result = await sendMagicLink(email, url);

  return Response.json({
    ok: true,
    delivered: result.delivered,
    // In dev (no SMTP configured) return the link so the flow is testable.
    ...(result.delivered ? {} : { devUrl: url }),
  });
}
