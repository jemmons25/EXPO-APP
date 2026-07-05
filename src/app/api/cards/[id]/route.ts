import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getOwnedCard, jsonError } from "@/lib/api-helpers";
import { slugify, randomSlugSuffix } from "@/lib/utils";
import { toCardData, DEFAULT_VISIBLE_FIELDS } from "@/lib/card-types";

const STRING_FIELDS = [
  "label", "fullName", "jobTitle", "company", "email", "phone", "website",
  "linkedin", "twitter", "instagram", "location", "pronouns", "tagline",
  "avatarUrl", "style", "bgColor", "bgColor2", "accentColor", "textColor",
  "fontFamily", "fontSizeScale", "layout", "borderRadius", "shadowStyle",
  "iconSet", "bgImageUrl", "qrColor", "qrBgColor", "qrErrorLevel", "qrStyle",
  "qrLogoUrl", "visibility",
] as const;

const BOOL_FIELDS = ["qrShowOnBack", "qrEmbedLogo", "isActive"] as const;

const MAX_LEN: Record<string, number> = {
  tagline: 120,
  fullName: 80,
  label: 60,
  avatarUrl: 500_000, // data URIs allowed
  bgImageUrl: 1_500_000,
  qrLogoUrl: 500_000,
};

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await getOwnedCard(params.id);
  if (!result.ok) return result.response;
  return Response.json({ card: result.card });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await getOwnedCard(params.id);
  if (!result.ok) return result.response;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Invalid body");

  const data: Record<string, unknown> = {};

  for (const field of STRING_FIELDS) {
    if (!(field in body)) continue;
    const value = body[field];
    if (value === null) {
      data[field] = null;
    } else if (typeof value === "string") {
      const max = MAX_LEN[field] ?? 2000;
      data[field] = value.slice(0, max);
    }
  }

  for (const field of BOOL_FIELDS) {
    if (field in body && typeof body[field] === "boolean") data[field] = body[field];
  }

  if ("bgImageOpacity" in body && typeof body.bgImageOpacity === "number") {
    data.bgImageOpacity = Math.min(1, Math.max(0, body.bgImageOpacity));
  }

  if ("visibleFields" in body && body.visibleFields && typeof body.visibleFields === "object") {
    const merged: Record<string, boolean> = { ...DEFAULT_VISIBLE_FIELDS };
    for (const key of Object.keys(DEFAULT_VISIBLE_FIELDS)) {
      if (typeof body.visibleFields[key] === "boolean") merged[key] = body.visibleFields[key];
    }
    data.visibleFields = JSON.stringify(merged);
  }

  if ("slug" in body && typeof body.slug === "string") {
    const candidate = slugify(body.slug);
    if (candidate.length < 3) return jsonError("Link must be at least 3 characters");
    const existing = await db.card.findUnique({ where: { slug: candidate } });
    if (existing && existing.id !== params.id) {
      return jsonError(`"${candidate}" is taken — try "${candidate}-${randomSlugSuffix()}"`);
    }
    data.slug = candidate;
  }

  if (data.fullName === null || data.fullName === "") return jsonError("Name is required");

  const row = await db.card.update({ where: { id: params.id }, data });
  return Response.json({ card: toCardData(row) });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await getOwnedCard(params.id);
  if (!result.ok) return result.response;
  await db.card.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
