import { PKPass } from "passkit-generator";
import sharp from "sharp";
import type { CardData } from "@/lib/card-types";
import { publicCardUrl } from "@/lib/card-types";
import { appName, hexToRgbString } from "@/lib/utils";

export function appleWalletConfigured(): boolean {
  return Boolean(
    process.env.APPLE_TEAM_ID &&
      process.env.APPLE_PASS_TYPE_ID &&
      process.env.APPLE_CERT_PEM_BASE64 &&
      process.env.APPLE_CERT_KEY_PEM_BASE64 &&
      process.env.APPLE_WWDR_CERT_BASE64
  );
}

function fromB64(name: string): Buffer {
  return Buffer.from(process.env[name] ?? "", "base64");
}

/** Render a simple branded rounded-square icon at the given size. */
async function renderIcon(size: number, bg: string, accent: string): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22" fill="${bg}"/>
    <rect x="22" y="30" width="56" height="40" rx="8" fill="none" stroke="${accent}" stroke-width="6"/>
    <circle cx="36" cy="46" r="6" fill="${accent}"/>
    <rect x="48" y="42" width="22" height="4" rx="2" fill="${accent}"/>
    <rect x="48" y="52" width="16" height="4" rx="2" fill="${accent}"/>
  </svg>`;
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function renderLogo(width: number, height: number, fg: string): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <text x="4" y="${height / 2}" dominant-baseline="central" font-family="Helvetica, Arial, sans-serif" font-size="${height * 0.52}" font-weight="700" fill="${fg}">${appName()}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function fetchThumbnail(url: string, size: number): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return await sharp(buf).resize(size, size, { fit: "cover" }).png().toBuffer();
  } catch {
    return null;
  }
}

export async function buildPkPass(card: CardData): Promise<Buffer> {
  const profileUrl = publicCardUrl(card.slug);
  const bg = hexToRgbString(card.bgColor, "rgb(30, 30, 30)");
  const fg = hexToRgbString(card.textColor, "rgb(255, 255, 255)");
  const label = hexToRgbString(card.accentColor, "rgb(180, 180, 180)");

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID,
    serialNumber: card.id,
    teamIdentifier: process.env.APPLE_TEAM_ID,
    organizationName: card.company || appName(),
    description: `${card.fullName} — Business Card`,
    logoText: appName(),
    foregroundColor: fg,
    backgroundColor: bg,
    labelColor: label,
    generic: {
      primaryFields: [{ key: "name", label: "NAME", value: card.fullName }],
      secondaryFields: [
        {
          key: "title",
          label: "TITLE",
          value: [card.jobTitle, card.company].filter(Boolean).join(" at ") || "—",
        },
      ],
      auxiliaryFields: [
        ...(card.email ? [{ key: "email", label: "EMAIL", value: card.email }] : []),
        ...(card.phone ? [{ key: "phone", label: "PHONE", value: card.phone }] : []),
      ],
      backFields: [
        ...(card.website
          ? [{ key: "website", label: "WEBSITE", value: card.website, attributedValue: `<a href='${card.website}'>${card.website}</a>` }]
          : []),
        ...(card.linkedin ? [{ key: "linkedin", label: "LINKEDIN", value: card.linkedin }] : []),
        {
          key: "profile",
          label: "DIGITAL CARD",
          value: profileUrl,
          attributedValue: `<a href='${profileUrl}'>View Full Card</a>`,
        },
      ],
    },
    barcodes: [
      {
        message: `${profileUrl}?src=wallet`,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1",
        altText: "Scan to view full card",
      },
    ],
  };

  const [icon1, icon2, icon3, logo1, logo2] = await Promise.all([
    renderIcon(29, card.bgColor, card.accentColor),
    renderIcon(58, card.bgColor, card.accentColor),
    renderIcon(87, card.bgColor, card.accentColor),
    renderLogo(160, 50, fg),
    renderLogo(320, 100, fg),
  ]);

  const buffers: Record<string, Buffer> = {
    "pass.json": Buffer.from(JSON.stringify(passJson)),
    "icon.png": icon1,
    "icon@2x.png": icon2,
    "icon@3x.png": icon3,
    "logo.png": logo1,
    "logo@2x.png": logo2,
  };

  if (card.avatarUrl) {
    const avatarAbs = card.avatarUrl.startsWith("http")
      ? card.avatarUrl
      : `${process.env.NEXT_PUBLIC_APP_URL}${card.avatarUrl}`;
    const [thumb1, thumb2] = await Promise.all([
      fetchThumbnail(avatarAbs, 90),
      fetchThumbnail(avatarAbs, 180),
    ]);
    if (thumb1 && thumb2) {
      buffers["thumbnail.png"] = thumb1;
      buffers["thumbnail@2x.png"] = thumb2;
    }
  }

  const pass = new PKPass(buffers, {
    wwdr: fromB64("APPLE_WWDR_CERT_BASE64"),
    signerCert: fromB64("APPLE_CERT_PEM_BASE64"),
    signerKey: fromB64("APPLE_CERT_KEY_PEM_BASE64"),
    signerKeyPassphrase: process.env.APPLE_CERT_PASSWORD,
  });

  return pass.getAsBuffer();
}
