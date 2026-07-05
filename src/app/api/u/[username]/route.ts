import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonError } from "@/lib/api-helpers";
import { toCardData, sanitizePublicCard } from "@/lib/card-types";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  if (!rateLimit(`public:${getClientIp(req)}`)) return rateLimitResponse();

  const row = await db.card.findUnique({ where: { slug: params.username } });
  if (!row || !row.isActive || row.visibility === "private") {
    return jsonError("Card not found", 404);
  }

  return Response.json({ card: sanitizePublicCard(toCardData(row)) });
}
