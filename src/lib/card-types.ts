export type CardStyle = "minimal" | "bold" | "glass" | "dark" | "gradient" | "corporate";
export type FontScale = "compact" | "regular" | "large";
export type CardLayout = "centered" | "left" | "split";
export type RadiusStyle = "sharp" | "rounded" | "pill";
export type ShadowStyle = "none" | "soft" | "dramatic";
export type IconSet = "minimal" | "filled" | "rounded" | "phosphor";
export type QrDotStyle = "square" | "rounded" | "dots";
export type QrErrorLevel = "L" | "M" | "Q" | "H";
export type Visibility = "public" | "link-only" | "private";

export type VisibleFields = {
  email: boolean;
  phone: boolean;
  website: boolean;
  linkedin: boolean;
  twitter: boolean;
  instagram: boolean;
  location: boolean;
  pronouns: boolean;
  tagline: boolean;
};

export const DEFAULT_VISIBLE_FIELDS: VisibleFields = {
  email: true,
  phone: true,
  website: true,
  linkedin: true,
  twitter: false,
  instagram: false,
  location: true,
  pronouns: false,
  tagline: true,
};

export type CardData = {
  id: string;
  slug: string;
  label: string | null;
  fullName: string;
  jobTitle: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  location: string | null;
  pronouns: string | null;
  tagline: string | null;
  avatarUrl: string | null;
  style: CardStyle;
  bgColor: string;
  bgColor2: string | null;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  fontSizeScale: FontScale;
  layout: CardLayout;
  borderRadius: RadiusStyle;
  shadowStyle: ShadowStyle;
  iconSet: IconSet;
  bgImageUrl: string | null;
  bgImageOpacity: number;
  qrShowOnBack: boolean;
  qrColor: string;
  qrBgColor: string;
  qrErrorLevel: QrErrorLevel;
  qrStyle: QrDotStyle;
  qrLogoUrl: string | null;
  qrEmbedLogo: boolean;
  visibleFields: VisibleFields;
  visibility: Visibility;
  isActive: boolean;
};

export const CARD_FONTS = [
  "Inter",
  "Playfair Display",
  "Space Grotesk",
  "Sora",
  "DM Sans",
  "Bebas Neue",
  "Cormorant",
  "Plus Jakarta Sans",
  "Bricolage Grotesque",
  "Instrument Serif",
  "Geist",
  "Lato",
] as const;

export const CARD_STYLES: { id: CardStyle; name: string; blurb: string }[] = [
  { id: "minimal", name: "Minimal", blurb: "Clean whitespace, quiet type" },
  { id: "bold", name: "Bold", blurb: "Big type, high contrast" },
  { id: "glass", name: "Glassmorphism", blurb: "Frosted panels, soft glow" },
  { id: "dark", name: "Dark Mode", blurb: "Deep blacks, neon accent" },
  { id: "gradient", name: "Gradient", blurb: "Two-stop color wash" },
  { id: "corporate", name: "Corporate", blurb: "Structured, professional" },
];

export const SWATCHES = [
  "#0f0f10", "#1a1a2e", "#111827", "#7f1d1d",
  "#9a3412", "#a16207", "#166534", "#065f46",
  "#0e7490", "#1d4ed8", "#4f46e5", "#7c3aed",
  "#a21caf", "#be123c", "#f8fafc", "#e7e5e4",
];

export const ACCENT_SWATCHES = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#f59e0b", "#84cc16", "#10b981",
  "#14b8a6", "#06b6d4", "#3b82f6", "#a855f7",
  "#ffffff", "#d4d4d8", "#71717a", "#facc15",
];

/** Style presets applied when a user picks a card style. */
export const STYLE_PRESETS: Record<
  CardStyle,
  Partial<Pick<CardData, "bgColor" | "bgColor2" | "accentColor" | "textColor">>
> = {
  minimal: { bgColor: "#fafafa", bgColor2: null, accentColor: "#18181b", textColor: "#18181b" },
  bold: { bgColor: "#18181b", bgColor2: null, accentColor: "#facc15", textColor: "#ffffff" },
  glass: { bgColor: "#312e81", bgColor2: "#831843", accentColor: "#e0e7ff", textColor: "#ffffff" },
  dark: { bgColor: "#09090b", bgColor2: null, accentColor: "#22d3ee", textColor: "#f4f4f5" },
  gradient: { bgColor: "#4f46e5", bgColor2: "#ec4899", accentColor: "#fef3c7", textColor: "#ffffff" },
  corporate: { bgColor: "#0f172a", bgColor2: null, accentColor: "#38bdf8", textColor: "#f1f5f9" },
};

export function parseVisibleFields(raw: string | null | undefined): VisibleFields {
  if (!raw) return { ...DEFAULT_VISIBLE_FIELDS };
  try {
    return { ...DEFAULT_VISIBLE_FIELDS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_VISIBLE_FIELDS };
  }
}

/** Map a raw Prisma card row to the typed CardData shape. */
export function toCardData(row: Record<string, unknown>): CardData {
  return {
    ...(row as unknown as Omit<CardData, "visibleFields">),
    visibleFields: parseVisibleFields(row.visibleFields as string),
  } as CardData;
}

/** Strip hidden fields so public payloads only contain what's visible. */
export function sanitizePublicCard(card: CardData): CardData {
  const v = card.visibleFields;
  return {
    ...card,
    email: v.email ? card.email : null,
    phone: v.phone ? card.phone : null,
    website: v.website ? card.website : null,
    linkedin: v.linkedin ? card.linkedin : null,
    twitter: v.twitter ? card.twitter : null,
    instagram: v.instagram ? card.instagram : null,
    location: v.location ? card.location : null,
    pronouns: v.pronouns ? card.pronouns : null,
    tagline: v.tagline ? card.tagline : null,
  };
}

export function publicCardUrl(slug: string, base?: string) {
  const origin = base ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${origin}/u/${slug}`;
}
