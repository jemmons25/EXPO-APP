import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { toCardData } from "@/lib/card-types";
import { CardEditor } from "@/components/card-editor";

export const metadata = { title: "Editor" };
export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  const row = await db.card.findUnique({ where: { id: params.id } });
  if (!row || row.userId !== user.id) notFound();

  return <CardEditor initial={toCardData(row)} />;
}
