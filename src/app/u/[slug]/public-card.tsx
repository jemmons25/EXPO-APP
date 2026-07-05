"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Contact, Expand, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { CardData } from "@/lib/card-types";
import { api } from "@/lib/client-api";
import { CardPreview } from "@/components/card-preview";
import { CardIcon } from "@/components/card-icons";
import { QrCode } from "@/components/qr-code";
import { WalletButtons } from "@/components/wallet-buttons";
import { CopyLinkButton, FullscreenQr, useCardUrl } from "@/components/share-sheet";

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4l7.1 9.3L4.4 20h2.1l5.6-5.8L16.6 20H20l-7.4-9.7L18.9 4h-2.1l-5 5.2L8 4H4z" />
    </svg>
  );
}

export function PublicCard({ card }: { card: CardData }) {
  const url = useCardUrl(card);
  const [flipped, setFlipped] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const track = (id: string) => api.track(card.id, "link_click", id ? "direct" : undefined);

  const links = [
    card.email && { icon: <Mail size={18} />, label: "Email", href: `mailto:${card.email}` },
    card.phone && { icon: <Phone size={18} />, label: "Call", href: `tel:${card.phone.replace(/[^+\d]/g, "")}` },
    card.website && { icon: <Globe size={18} />, label: "Website", href: card.website },
    card.linkedin && {
      icon: <CardIcon name="linkedin" set="filled" color="currentColor" size={18} />,
      label: "LinkedIn",
      href: card.linkedin,
    },
    card.twitter && { icon: <XIcon />, label: "X", href: card.twitter },
    card.instagram && {
      icon: <CardIcon name="instagram" set="minimal" color="currentColor" size={18} />,
      label: "Instagram",
      href: card.instagram,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href: string }[];

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-10 pt-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <CardPreview card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        <p className="mt-2.5 text-center text-[12px] text-ink-600">Tap the card to flip it</p>
      </motion.div>

      {/* Social buttons */}
      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              onClick={() => track(link.label)}
              className="btn-secondary !min-h-[46px] !px-4"
            >
              {link.icon}
              <span className="text-[14px]">{link.label}</span>
            </a>
          ))}
        </div>
      )}
      {card.location && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-ink-500">
          <MapPin size={14} /> {card.location}
        </p>
      )}

      {/* Actions */}
      <div className="mt-7 space-y-3">
        <a href={`/api/vcf/${card.id}`} download className="btn-primary w-full !min-h-[52px]">
          <Contact size={18} /> Save contact
        </a>
        <WalletButtons cardId={card.id} />
      </div>

      {/* QR block */}
      <div className="glass-panel mt-7 flex items-center gap-4 rounded-2xl p-4">
        <button
          type="button"
          onClick={() => setQrOpen(true)}
          className="shrink-0 rounded-xl bg-white p-2 transition hover:scale-105"
          aria-label="Show QR full screen"
        >
          <QrCode
            data={`${url}?src=qr`}
            color="#000000"
            bgColor="#ffffff"
            errorLevel={card.qrErrorLevel}
            style={card.qrStyle}
            size={200}
            className="h-[76px] w-[76px] [&>svg]:h-full [&>svg]:w-full"
          />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">Scan to share</p>
          <p className="truncate text-[12px] text-ink-500">{url.replace(/^https?:\/\//, "")}</p>
          <div className="mt-2 flex gap-2">
            <CopyLinkButton url={url} className="btn-secondary !min-h-[36px] !px-3 !text-[12px]" />
            <button type="button" className="btn-secondary !min-h-[36px] !px-3 !text-[12px]" onClick={() => setQrOpen(true)}>
              <Expand size={13} /> Full screen
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-auto pt-10 text-center">
        <Link href="/" className="text-[13px] text-ink-500 transition hover:text-ink-300">
          Made with <span className="font-semibold text-ink-300">CardDrop</span> — create your own free card →
        </Link>
      </footer>

      <AnimatePresence>
        {qrOpen && <FullscreenQr card={card} url={url} onClose={() => setQrOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}
