import { NextRequest } from "next/server";
import { getPublicCard, jsonError, recordEvent } from "@/lib/api-helpers";
import { appleWalletConfigured, buildPkPass } from "@/lib/wallet-apple";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";

export const maxDuration = 30;

async function handle(req: NextRequest, cardId: string) {
  if (!rateLimit(`wallet:${getClientIp(req)}`, 30)) return rateLimitResponse();

  const result = await getPublicCard(cardId);
  if (!result.ok) return result.response;

  if (!appleWalletConfigured()) {
    return jsonError(
      "Apple Wallet is not configured on this server. Set APPLE_TEAM_ID, APPLE_PASS_TYPE_ID, APPLE_CERT_PEM_BASE64, APPLE_CERT_KEY_PEM_BASE64 and APPLE_WWDR_CERT_BASE64 (see .env.example and README).",
      501
    );
  }

  try {
    const buffer = await buildPkPass(result.card);
    await recordEvent(cardId, "wallet_add_apple", req, "wallet");
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="${result.card.slug}.pkpass"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("pkpass generation failed:", err);
    return jsonError("Failed to generate the Apple Wallet pass. Check the server certificates.", 500);
  }
}

// GET supports direct link taps on iOS; POST matches the documented API.
export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  return handle(req, params.cardId);
}

export async function POST(req: NextRequest, { params }: { params: { cardId: string } }) {
  return handle(req, params.cardId);
}
