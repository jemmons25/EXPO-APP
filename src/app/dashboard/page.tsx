import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { toCardData } from "@/lib/card-types";
import { DashboardClient } from "./dashboard-client";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  const rows = await db.card.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });

  const counts = await db.cardEvent.groupBy({
    by: ["cardId", "eventType"],
    where: { cardId: { in: rows.map((r) => r.id) } },
    _count: { _all: true },
  });

  const cards = rows.map((row) => {
    const stats: Record<string, number> = {};
    for (const c of counts.filter((c) => c.cardId === row.id)) stats[c.eventType] = c._count._all;
    return { ...toCardData(row), stats };
  });

  return <DashboardClient cards={cards} email={user.email} />;
}
