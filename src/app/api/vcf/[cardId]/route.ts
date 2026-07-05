import { NextRequest } from "next/server";
import { getPublicCard, recordEvent } from "@/lib/api-helpers";
import { buildVCard } from "@/lib/vcard";
import { sanitizePublicCard } from "@/lib/card-types";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp, slugify } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  if (!rateLimit(`vcf:${getClientIp(req)}`, 60)) return rateLimitResponse();

  const result = await getPublicCard(params.cardId);
  if (!result.ok) return result.response;

  const vcf = buildVCard(sanitizePublicCard(result.card));
  await recordEvent(params.cardId, "vcf_download", req);

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugify(result.card.fullName) || "contact"}.vcf"`,
      "Cache-Control": "no-store",
    },
  });
}
