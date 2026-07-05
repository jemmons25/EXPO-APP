import { NextRequest } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { getOwnedCard, jsonError } from "@/lib/api-helpers";
import { toCardData } from "@/lib/card-types";

export const maxDuration = 30;

const KIND_CONFIG = {
  avatar: { size: 256, column: "avatarUrl", fit: "cover" as const },
  bg: { size: 900, column: "bgImageUrl", fit: "inside" as const },
  qrlogo: { size: 128, column: "qrLogoUrl", fit: "cover" as const },
};

/**
 * Upload an image for a card. Accepts multipart form data with a "file"
 * field and optional "kind" (avatar | bg | qrlogo). Images are resized with
 * sharp and stored as compact data URIs, so no external object storage is
 * needed. Swap this for S3/R2 uploads in production if preferred.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await getOwnedCard(params.id);
  if (!result.ok) return result.response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof Blob)) return jsonError("No file provided");
  if (file.size > 12 * 1024 * 1024) return jsonError("Image must be under 12MB");

  const kind = (form?.get("kind")?.toString() ?? "avatar") as keyof typeof KIND_CONFIG;
  const config = KIND_CONFIG[kind] ?? KIND_CONFIG.avatar;

  let processed: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    processed = await sharp(input, { failOn: "none" })
      .rotate() // respect EXIF orientation
      .resize(config.size, kind === "bg" ? undefined : config.size, { fit: config.fit, withoutEnlargement: kind === "bg" })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return jsonError("Couldn't read that image. Try a JPG, PNG or WebP file.", 422);
  }

  const dataUri = `data:image/webp;base64,${processed.toString("base64")}`;
  const row = await db.card.update({
    where: { id: params.id },
    data: { [config.column]: dataUri },
  });

  return Response.json({ url: dataUri, card: toCardData(row) });
}
