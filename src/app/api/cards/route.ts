import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/api-helpers";
import { slugify, randomSlugSuffix, getClientIp } from "@/lib/utils";
import { toCardData, STYLE_PRESETS, type CardStyle } from "@/lib/card-types";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);

  const rows = await db.card.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const counts = await db.cardEvent.groupBy({
    by: ["cardId", "eventType"],
    where: { cardId: { in: rows.map((r) => r.id) } },
    _count: { _all: true },
  });

  const cards = rows.map((row) => {
    const cardCounts: Record<string, number> = {};
    for (const c of counts.filter((c) => c.cardId === row.id)) {
      cardCounts[c.eventType] = c._count._all;
    }
    return { ...toCardData(row), stats: cardCounts };
  });

  return Response.json({ cards });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(`cards:${getClientIp(req)}`, 30)) return rateLimitResponse();

  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const fullName = typeof body.fullName === "string" && body.fullName.trim() ? body.fullName.trim() : "Your Name";
  const style: CardStyle = STYLE_PRESETS[body.style as CardStyle] ? body.style : "dark";
  const preset = STYLE_PRESETS[style];

  // Slug: username for the first card, otherwise derived from name + suffix.
  const cardCount = await db.card.count({ where: { userId: user.id } });
  let slug = cardCount === 0 && user.username ? user.username : `${slugify(fullName) || "card"}-${randomSlugSuffix()}`;
  while (await db.card.findUnique({ where: { slug } })) {
    slug = `${slugify(fullName) || "card"}-${randomSlugSuffix()}`;
  }

  const row = await db.card.create({
    data: {
      userId: user.id,
      slug,
      label: typeof body.label === "string" ? body.label.slice(0, 60) : cardCount === 0 ? "Personal" : null,
      fullName: fullName.slice(0, 80),
      style,
      bgColor: preset.bgColor ?? "#1a1a1a",
      bgColor2: preset.bgColor2 ?? null,
      accentColor: preset.accentColor ?? "#6366f1",
      textColor: preset.textColor ?? "#ffffff",
    },
  });

  return Response.json({ card: toCardData(row) }, { status: 201 });
}
