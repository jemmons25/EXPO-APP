import jwt from "jsonwebtoken";
import type { CardData } from "@/lib/card-types";
import { publicCardUrl } from "@/lib/card-types";

type ServiceAccount = { client_email: string; private_key: string };

export function googleWalletConfigured(): boolean {
  return Boolean(process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_PAY_ISSUER_ID);
}

function serviceAccount(): ServiceAccount {
  return JSON.parse(process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON ?? "{}");
}

/** Build the "Save to Google Wallet" URL for a card. */
export function buildGoogleWalletUrl(card: CardData): string {
  const sa = serviceAccount();
  const issuerId = process.env.GOOGLE_PAY_ISSUER_ID!;
  const classId = `${issuerId}.${process.env.GOOGLE_WALLET_CLASS_ID ?? "carddrop_business_card"}`;
  const objectId = `${issuerId}.card_${card.id.replace(/-/g, "")}`;
  const profileUrl = publicCardUrl(card.slug);

  // Google Wallet requires a publicly reachable HTTPS URL for images, so
  // data-URI avatars (the local-storage default) are skipped.
  const avatarAbs =
    card.avatarUrl && !card.avatarUrl.startsWith("data:")
      ? card.avatarUrl.startsWith("http")
        ? card.avatarUrl
        : `${process.env.NEXT_PUBLIC_APP_URL}${card.avatarUrl}`
      : null;

  const genericObject = {
    id: objectId,
    classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    hexBackgroundColor: card.bgColor,
    ...(avatarAbs ? { logo: { sourceUri: { uri: avatarAbs } } } : {}),
    cardTitle: { defaultValue: { language: "en-US", value: card.fullName } },
    subheader: { defaultValue: { language: "en-US", value: "BUSINESS CARD" } },
    header: {
      defaultValue: {
        language: "en-US",
        value: [card.jobTitle, card.company].filter(Boolean).join(" · ") || card.fullName,
      },
    },
    textModulesData: [
      ...(card.email ? [{ id: "email", header: "EMAIL", body: card.email }] : []),
      ...(card.phone ? [{ id: "phone", header: "PHONE", body: card.phone }] : []),
      ...(card.website ? [{ id: "website", header: "WEBSITE", body: card.website }] : []),
    ],
    linksModuleData: {
      uris: [
        { uri: profileUrl, description: "View Digital Card", id: "profile" },
        ...(card.email ? [{ uri: `mailto:${card.email}`, description: "Send Email", id: "email_link" }] : []),
      ],
    },
    barcode: {
      type: "QR_CODE",
      value: `${profileUrl}?src=wallet`,
      alternateText: "Scan to view full card",
    },
    state: "ACTIVE",
  };

  const claims = {
    iss: sa.client_email,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    origins: [process.env.NEXT_PUBLIC_APP_URL ?? ""],
    payload: {
      genericClasses: [{ id: classId }],
      genericObjects: [genericObject],
    },
  };

  const token = jwt.sign(claims, sa.private_key, { algorithm: "RS256" });
  return `https://pay.google.com/gp/v/save/${token}`;
}
