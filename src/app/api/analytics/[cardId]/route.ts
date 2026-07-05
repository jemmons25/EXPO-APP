import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getOwnedCard } from "@/lib/api-helpers";

export async function GET(_req: NextRequest, { params }: { params: { cardId: string } }) {
  const result = await getOwnedCard(params.cardId);
  if (!result.ok) return result.response;

  const grouped = await db.cardEvent.groupBy({
    by: ["eventType"],
    where: { cardId: params.cardId },
    _count: { _all: true },
  });

  const counts: Record<string, number> = {
    view: 0,
    qr_scan: 0,
    wallet_add_apple: 0,
    wallet_add_google: 0,
    vcf_download: 0,
    link_click: 0,
  };
  for (const g of grouped) counts[g.eventType] = g._count._all;

  // Daily views + scans for the last 30 days.
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = await db.cardEvent.findMany({
    where: { cardId: params.cardId, createdAt: { gte: since } },
    select: { createdAt: true, eventType: true },
    orderBy: { createdAt: "asc" },
  });

  const daily: Record<string, { views: number; scans: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    daily[d.toISOString().slice(0, 10)] = { views: 0, scans: 0 };
  }
  for (const e of recent) {
    const key = e.createdAt.toISOString().slice(0, 10);
    if (!daily[key]) continue;
    if (e.eventType === "view") daily[key].views++;
    if (e.eventType === "qr_scan") daily[key].scans++;
  }

  return Response.json({ counts, daily });
}
