import { NextRequest } from "next/server";
import sharp from "sharp";
import { getPublicCard, jsonError } from "@/lib/api-helpers";
import { buildQrSvg } from "@/lib/qr-svg";
import { publicCardUrl, type QrErrorLevel, type QrDotStyle } from "@/lib/card-types";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";

export const maxDuration = 30;

async function handle(req: NextRequest, cardId: string) {
  if (!rateLimit(`qr:${getClientIp(req)}`, 60)) return rateLimitResponse();

  const result = await getPublicCard(cardId);
  if (!result.ok) return result.response;
  const card = result.card;

  const search = req.nextUrl.searchParams;
  const format = search.get("format") === "svg" ? "svg" : "png";
  const size = Math.min(2048, Math.max(128, Number(search.get("size")) || 1024));
  const transparent = search.get("transparent") === "1";

  // Downloads default to solid backgrounds so scanners always have contrast.
  const bgColor = transparent
    ? "transparent"
    : card.qrBgColor !== "transparent"
      ? card.qrBgColor
      : "#ffffff";
  const color =
    card.qrColor.toLowerCase() === "#ffffff" && bgColor === "#ffffff" ? "#111111" : card.qrColor;

  const svg = buildQrSvg(`${publicCardUrl(card.slug)}?src=qr`, {
    color,
    bgColor,
    errorLevel: card.qrErrorLevel as QrErrorLevel,
    style: card.qrStyle as QrDotStyle,
    size,
    logoHref: card.qrEmbedLogo ? card.qrLogoUrl ?? card.avatarUrl : null,
  });

  if (format === "svg") {
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${card.slug}-qr.svg"`,
      },
    });
  }

  try {
    const png = await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer();
    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${card.slug}-qr.png"`,
      },
    });
  } catch (err) {
    console.error("QR PNG render failed:", err);
    return jsonError("Failed to render QR code", 500);
  }
}

export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  return handle(req, params.cardId);
}

export async function POST(req: NextRequest, { params }: { params: { cardId: string } }) {
  return handle(req, params.cardId);
}
