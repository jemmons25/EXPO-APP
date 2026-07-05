import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { appUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(`${appUrl()}/sign-in?error=invalid`);

  const record = await db.loginToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.redirect(`${appUrl()}/sign-in?error=expired`);
  }

  await db.loginToken.update({ where: { token }, data: { usedAt: new Date() } });
  await createSession(record.userId);

  const cardCount = await db.card.count({ where: { userId: record.userId } });
  return NextResponse.redirect(`${appUrl()}${cardCount > 0 ? "/dashboard" : "/editor/new"}`);
}
