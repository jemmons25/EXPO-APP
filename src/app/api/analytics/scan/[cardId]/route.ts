import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonError, recordEvent, type EventType } from "@/lib/api-helpers";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";

const ALLOWED_EVENTS: EventType[] = ["view", "qr_scan", "link_click"];
const ALLOWED_SOURCES = ["direct", "qr", "share", "wallet"];

export async function POST(req: NextRequest, { params }: { params: { cardId: string } }) {
  if (!rateLimit(`track:${getClientIp(req)}`)) return rateLimitResponse();

  const card = await db.card.findUnique({ where: { id: params.cardId }, select: { id: true } });
  if (!card) return jsonError("Card not found", 404);

  const body = await req.json().catch(() => ({}));
  const eventType = ALLOWED_EVENTS.includes(body.eventType) ? (body.eventType as EventType) : "qr_scan";
  const source = ALLOWED_SOURCES.includes(body.source) ? body.source : "qr";

  await recordEvent(params.cardId, eventType, req, source);
  return Response.json({ ok: true });
}
