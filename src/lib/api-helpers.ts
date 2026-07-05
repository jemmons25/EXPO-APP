import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getClientIp, hashIp } from "@/lib/utils";
import { toCardData, type CardData } from "@/lib/card-types";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

/** Fetch a card and verify the current session owns it. */
export async function getOwnedCard(cardId: string): Promise<
  | { ok: true; card: CardData; userId: string }
  | { ok: false; response: Response }
> {
  const user = await getSessionUser();
  if (!user) return { ok: false, response: jsonError("Unauthorized", 401) };
  const row = await db.card.findUnique({ where: { id: cardId } });
  if (!row || row.userId !== user.id) return { ok: false, response: jsonError("Card not found", 404) };
  return { ok: true, card: toCardData(row), userId: user.id };
}

/** Fetch a card for public consumption (wallet, vcf, qr, profile). */
export async function getPublicCard(cardId: string): Promise<
  | { ok: true; card: CardData }
  | { ok: false; response: Response }
> {
  const row = await db.card.findUnique({ where: { id: cardId } });
  if (!row || !row.isActive) return { ok: false, response: jsonError("Card not found", 404) };
  if (row.visibility === "private") {
    const user = await getSessionUser();
    if (!user || user.id !== row.userId) return { ok: false, response: jsonError("Card not found", 404) };
  }
  return { ok: true, card: toCardData(row) };
}

export type EventType =
  | "view"
  | "qr_scan"
  | "wallet_add_apple"
  | "wallet_add_google"
  | "vcf_download"
  | "link_click";

export async function recordEvent(
  cardId: string,
  eventType: EventType,
  req: Request,
  source?: string
) {
  try {
    await db.cardEvent.create({
      data: {
        cardId,
        eventType,
        source: source ?? "direct",
        userAgent: req.headers.get("user-agent")?.slice(0, 250) ?? null,
        ipHash: hashIp(getClientIp(req)),
      },
    });
  } catch {
    // Analytics failures must never break the main flow.
  }
}
