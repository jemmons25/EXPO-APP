"use client";

import { CSSProperties, useMemo } from "react";
import type { CardData } from "@/lib/card-types";
import { publicCardUrl } from "@/lib/card-types";
import { CardIcon, type IconName } from "@/components/card-icons";
import { QrCode } from "@/components/qr-code";
import { cn } from "@/lib/utils";

type Props = {
  card: CardData;
  side?: "front" | "back";
  flipped?: boolean;
  onFlip?: () => void;
  className?: string;
  /** Base URL used for the QR target (needed because env isn't available client-side in exports). */
  baseUrl?: string;
};

const SCALE: Record<string, number> = { compact: 0.86, regular: 1, large: 1.15 };
const RADIUS: Record<string, string> = { sharp: "2px", rounded: "20px", pill: "36px" };
const SHADOW: Record<string, string> = {
  none: "none",
  soft: "0 10px 34px -12px rgba(0,0,0,0.45)",
  dramatic: "0 30px 70px -18px rgba(0,0,0,0.65), 0 8px 24px -8px rgba(0,0,0,0.4)",
};

function fontStack(family: string) {
  const serif = ["Playfair Display", "Cormorant", "Instrument Serif"].includes(family);
  return `'${family}', ${serif ? "serif" : "sans-serif"}`;
}

function contrastText(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 150 ? "#18181b" : "#ffffff";
}

export function CardPreview({ card, side, flipped, onFlip, className, baseUrl }: Props) {
  const showBack = side ? side === "back" : flipped ?? false;
  const scale = SCALE[card.fontSizeScale] ?? 1;
  const url = publicCardUrl(card.slug, baseUrl ?? (typeof window !== "undefined" ? window.location.origin : undefined));

  const faceBase: CSSProperties = {
    borderRadius: RADIUS[card.borderRadius] ?? RADIUS.rounded,
    boxShadow: SHADOW[card.shadowStyle] ?? SHADOW.soft,
    color: card.textColor,
    fontFamily: fontStack(card.fontFamily),
  };

  const background: CSSProperties =
    card.style === "gradient" || (card.style === "glass" && card.bgColor2) || card.bgColor2
      ? { background: `linear-gradient(135deg, ${card.bgColor} 0%, ${card.bgColor2 ?? card.bgColor} 100%)` }
      : { background: card.bgColor };

  return (
    <div
      className={cn("perspective-1200 w-full select-none", className)}
      style={{ containerType: "inline-size" } as CSSProperties}
    >
      <div
        className={cn(
          "preserve-3d relative aspect-[7/4] w-full transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0.25,1)]",
          showBack && "rotate-y-180",
          onFlip && "cursor-pointer"
        )}
        onClick={onFlip}
        role={onFlip ? "button" : undefined}
        aria-label={onFlip ? "Flip card" : undefined}
      >
        {/* FRONT */}
        <div className="backface-hidden absolute inset-0 overflow-hidden" style={{ ...faceBase, ...background }}>
          {card.bgImageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.bgImageUrl})`, opacity: card.bgImageOpacity }}
            />
          )}
          <StyleDecor card={card} />
          <FrontContent card={card} scale={scale} />
        </div>

        {/* BACK */}
        <div
          className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden"
          style={{ ...faceBase, ...background }}
        >
          {card.bgImageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.bgImageUrl})`, opacity: card.bgImageOpacity * 0.5 }}
            />
          )}
          <BackContent card={card} scale={scale} url={url} />
        </div>
      </div>
    </div>
  );
}

/** Decorative flourishes that give each style its personality. */
function StyleDecor({ card }: { card: CardData }) {
  const a = card.accentColor;
  switch (card.style) {
    case "bold":
      return (
        <>
          <div className="absolute left-0 top-0 h-full" style={{ width: "3.2cqw", background: a }} />
          <div
            className="absolute -right-[12cqw] -top-[24cqw] h-[48cqw] w-[48cqw] rounded-full"
            style={{ background: a, opacity: 0.12 }}
          />
        </>
      );
    case "glass":
      return (
        <>
          <div className="absolute -left-[10cqw] -top-[16cqw] h-[40cqw] w-[40cqw] rounded-full" style={{ background: "#ffffff", opacity: 0.14, filter: "blur(6cqw)" }} />
          <div className="absolute -bottom-[18cqw] -right-[8cqw] h-[44cqw] w-[44cqw] rounded-full" style={{ background: a, opacity: 0.25, filter: "blur(7cqw)" }} />
          <div className="absolute inset-[4cqw] rounded-[3cqw] border border-white/25 bg-white/10" style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }} />
        </>
      );
    case "dark":
      return (
        <>
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 82% 18%, ${a}33 0%, transparent 52%)` }}
          />
          <div className="absolute bottom-0 left-0 right-0" style={{ height: "1.2cqw", background: `linear-gradient(90deg, transparent, ${a}, transparent)` }} />
        </>
      );
    case "corporate":
      return (
        <div className="absolute left-0 right-0 top-0 flex items-center" style={{ height: "13cqw", background: `${a}1f`, borderBottom: `1px solid ${a}55`, paddingLeft: "6cqw" }}>
          <span style={{ color: a, fontSize: "3.4cqw", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {card.company || card.label || "Business Card"}
          </span>
        </div>
      );
    case "minimal":
      return null;
    default:
      return null;
  }
}

function FrontContent({ card, scale }: { card: CardData; scale: number }) {
  const v = card.visibleFields;
  const a = card.accentColor;
  const em = (n: number) => `${(n * scale).toFixed(2)}cqw`;

  const contactRows: { icon: IconName; value: string }[] = [];
  if (v.email && card.email) contactRows.push({ icon: "mail", value: card.email });
  if (v.phone && card.phone) contactRows.push({ icon: "phone", value: card.phone });
  if (v.website && card.website) contactRows.push({ icon: "globe", value: card.website.replace(/^https?:\/\//, "") });
  if (v.location && card.location) contactRows.push({ icon: "pin", value: card.location });

  const allSocials: { icon: IconName; show: boolean }[] = [
    { icon: "linkedin", show: Boolean(v.linkedin && card.linkedin) },
    { icon: "twitter", show: Boolean(v.twitter && card.twitter) },
    { icon: "instagram", show: Boolean(v.instagram && card.instagram) },
  ];
  const socials = allSocials.filter((s) => s.show);

  const centered = card.layout === "centered";
  const split = card.layout === "split";
  const isGlass = card.style === "glass";
  const isCorporate = card.style === "corporate";
  const isBold = card.style === "bold";

  const identity = (
    <div className={cn("flex min-w-0 flex-col", centered && "items-center text-center")}>
      {card.avatarUrl && (
        <img
          src={card.avatarUrl}
          alt=""
          className="rounded-full object-cover"
          style={{
            width: em(13),
            height: em(13),
            marginBottom: em(2.2),
            border: `${em(0.5)} solid ${a}`,
          }}
        />
      )}
      <div className={cn("flex items-baseline gap-[1.5cqw]", centered && "justify-center")} style={{ flexWrap: "wrap" }}>
        <h2
          className="leading-[1.05]"
          style={{
            fontSize: em(isBold ? 8.2 : 6.4),
            fontWeight: isBold ? 800 : 700,
            textTransform: isBold ? "uppercase" : undefined,
            letterSpacing: isBold ? "0.02em" : undefined,
          }}
        >
          {card.fullName || "Your Name"}
        </h2>
        {v.pronouns && card.pronouns && (
          <span style={{ fontSize: em(2.8), opacity: 0.65 }}>({card.pronouns})</span>
        )}
      </div>
      {card.style === "minimal" && (
        <div style={{ width: em(9), height: em(0.7), background: a, marginTop: em(1.6), borderRadius: 99 }} />
      )}
      {(card.jobTitle || card.company) && (
        <p style={{ fontSize: em(3.4), marginTop: em(1.4), opacity: 0.85 }}>
          {card.jobTitle}
          {card.jobTitle && card.company ? " · " : ""}
          {!isCorporate && card.company ? (
            <span style={{ color: a, fontWeight: 600 }}>{card.company}</span>
          ) : null}
        </p>
      )}
      {v.tagline && card.tagline && (
        <p style={{ fontSize: em(2.9), marginTop: em(1.4), opacity: 0.6, maxWidth: "62cqw", lineHeight: 1.45 }}>
          {card.tagline}
        </p>
      )}
    </div>
  );

  const contacts = (
    <div className={cn("flex min-w-0 flex-col", centered && "items-center")} style={{ gap: em(1.5) }}>
      {contactRows.map((row) => (
        <div key={row.icon} className="flex min-w-0 items-center" style={{ gap: em(1.8) }}>
          <span className="shrink-0" style={{ width: em(3.4), height: em(3.4), display: "inline-flex" }}>
            <CardIcon name={row.icon} set={card.iconSet} color={a} size={999} />
          </span>
          <span className="truncate" style={{ fontSize: em(3), opacity: 0.9 }}>
            {row.value}
          </span>
        </div>
      ))}
      {socials.length > 0 && (
        <div className="flex items-center" style={{ gap: em(2.4), marginTop: em(1) }}>
          {socials.map((s) => (
            <span key={s.icon} style={{ width: em(4), height: em(4), display: "inline-flex" }}>
              <CardIcon name={s.icon} set={card.iconSet} color={a} size={999} />
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "absolute flex",
        isGlass ? "inset-[4cqw] p-[5cqw]" : "inset-0 p-[6.5cqw]",
        split ? "flex-row items-center" : "flex-col",
        !split && centered && "items-center justify-center",
        !split && !centered && "justify-center"
      )}
      style={{ paddingTop: isCorporate ? "16cqw" : undefined, gap: split ? "5cqw" : em(3.2) }}
    >
      {split ? (
        <>
          <div className="min-w-0 flex-1">{identity}</div>
          <div className="self-stretch" style={{ width: 1, background: `${card.textColor}2b` }} />
          <div className="min-w-0 flex-1">{contacts}</div>
        </>
      ) : (
        <>
          {identity}
          {contactRows.length + socials.length > 0 && contacts}
        </>
      )}
    </div>
  );
}

function BackContent({ card, scale, url }: { card: CardData; scale: number; url: string }) {
  const em = (n: number) => `${(n * scale).toFixed(2)}cqw`;
  const displayUrl = url.replace(/^https?:\/\//, "");

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: em(2.4), padding: "6cqw" }}>
      {card.qrShowOnBack ? (
        <>
          <div
            style={{
              padding: "2.2cqw",
              borderRadius: "2.6cqw",
              background: card.qrBgColor !== "transparent" ? card.qrBgColor : "transparent",
              border: card.qrBgColor === "transparent" ? `1px solid ${card.textColor}22` : undefined,
              width: "36cqw",
              height: "36cqw",
            }}
          >
            <QrCode
              data={`${url}?src=qr`}
              color={card.qrColor}
              bgColor="transparent"
              errorLevel={card.qrErrorLevel}
              style={card.qrStyle}
              logoHref={card.qrEmbedLogo ? card.qrLogoUrl ?? card.avatarUrl : null}
              size={512}
              className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
            />
          </div>
          <p style={{ fontSize: em(3), fontWeight: 600, opacity: 0.9, fontFamily: fontStack(card.fontFamily) }}>
            Scan to connect
          </p>
          <p style={{ fontSize: em(2.5), opacity: 0.55, fontFamily: fontStack(card.fontFamily) }}>{displayUrl}</p>
        </>
      ) : (
        <>
          <h3 style={{ fontSize: em(5.4), fontWeight: 700, fontFamily: fontStack(card.fontFamily) }}>
            {card.fullName}
          </h3>
          <p style={{ fontSize: em(2.8), opacity: 0.6, fontFamily: fontStack(card.fontFamily) }}>{displayUrl}</p>
          <div style={{ width: em(9), height: em(0.7), background: card.accentColor, borderRadius: 99 }} />
        </>
      )}
    </div>
  );
}

export { contrastText };
