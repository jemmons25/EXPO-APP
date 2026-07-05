import { NextRequest } from "next/server";
import { getPublicCard, jsonError, recordEvent } from "@/lib/api-helpers";
import { buildGoogleWalletUrl, googleWalletConfigured } from "@/lib/wallet-google";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: { cardId: string } }) {
  if (!rateLimit(`wallet:${getClientIp(req)}`, 30)) return rateLimitResponse();

  const result = await getPublicCard(params.cardId);
  if (!result.ok) return result.response;

  if (!googleWalletConfigured()) {
    return jsonError(
      "Google Wallet is not configured on this server. Set GOOGLE_WALLET_SERVICE_ACCOUNT_JSON and GOOGLE_PAY_ISSUER_ID (see .env.example and README).",
      501
    );
  }

  try {
    const url = buildGoogleWalletUrl(result.card);
    await recordEvent(params.cardId, "wallet_add_google", req, "wallet");
    return Response.json({ url });
  } catch (err) {
    console.error("Google Wallet JWT failed:", err);
    return jsonError("Failed to create the Google Wallet link. Check the service account key.", 500);
  }
}
