import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { toCardData, sanitizePublicCard } from "@/lib/card-types";
import { hashIp } from "@/lib/utils";
import { PublicCard } from "./public-card";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string }; searchParams: { src?: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await db.card.findUnique({ where: { slug: params.slug } });
  if (!row || !row.isActive || row.visibility === "private") return { title: "Card not found" };
  return {
    title: `${row.fullName}${row.jobTitle ? ` — ${row.jobTitle}` : ""}`,
    description: row.tagline ?? `${row.fullName}'s digital business card on CardDrop.`,
    robots: row.visibility === "link-only" ? { index: false, follow: false } : undefined,
  };
}

export default async function PublicCardPage({ params, searchParams }: Props) {
  const row = await db.card.findUnique({ where: { slug: params.slug } });
  if (!row || !row.isActive || row.visibility === "private") notFound();

  const source = ["qr", "share", "wallet"].includes(searchParams.src ?? "") ? searchParams.src! : "direct";
  const h = headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";

  // Pixel-style view tracking, done server-side so it works without JS.
  db.cardEvent
    .create({
      data: {
        cardId: row.id,
        eventType: source === "qr" ? "qr_scan" : "view",
        source,
        userAgent: h.get("user-agent")?.slice(0, 250) ?? null,
        ipHash: hashIp(ip),
      },
    })
    .catch(() => undefined);

  return <PublicCard card={sanitizePublicCard(toCardData(row))} />;
}
