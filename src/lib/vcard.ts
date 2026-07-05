import type { CardData } from "@/lib/card-types";
import { publicCardUrl } from "@/lib/card-types";

function esc(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Build an RFC 6350-compatible vCard 3.0 string (best iOS/Android support). */
export function buildVCard(card: CardData): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  const nameParts = card.fullName.trim().split(/\s+/);
  const family = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const given = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0] ?? "";

  lines.push(`N:${esc(family)};${esc(given)};;;`);
  lines.push(`FN:${esc(card.fullName)}`);
  if (card.company || card.jobTitle) {
    if (card.company) lines.push(`ORG:${esc(card.company)}`);
    if (card.jobTitle) lines.push(`TITLE:${esc(card.jobTitle)}`);
  }
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${esc(card.email)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL,VOICE:${esc(card.phone)}`);
  if (card.website) lines.push(`URL:${esc(card.website)}`);
  if (card.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${esc(card.linkedin)}`);
  if (card.twitter) lines.push(`X-SOCIALPROFILE;TYPE=twitter:${esc(card.twitter)}`);
  if (card.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${esc(card.instagram)}`);
  if (card.location) lines.push(`ADR;TYPE=WORK:;;;${esc(card.location)};;;`);
  if (card.tagline) lines.push(`NOTE:${esc(card.tagline)}`);
  lines.push(`URL;TYPE=CardDrop:${publicCardUrl(card.slug)}`);
  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  return lines.join("\r\n") + "\r\n";
}
