"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import {
  Link2,
  QrCode as QrIcon,
  ImageDown,
  Contact,
  Share2,
  X,
  Check,
  Download,
} from "lucide-react";
import type { CardData } from "@/lib/card-types";
import { publicCardUrl } from "@/lib/card-types";
import { QrCode } from "@/components/qr-code";
import { CardPreview } from "@/components/card-preview";
import { WalletButtons } from "@/components/wallet-buttons";

export function useCardUrl(card: CardData) {
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  useEffect(() => setOrigin(window.location.origin), []);
  return publicCardUrl(card.slug, origin);
}

export function CopyLinkButton({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className ?? "btn-secondary"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          // Older browsers: fall back to a prompt.
          window.prompt("Copy your card link:", url);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check size={17} className="text-emerald-400" /> : <Link2 size={17} />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

/** Full-screen QR view with brightness-friendly white backdrop and pulse. */
export function FullscreenQr({
  card,
  url,
  onClose,
}: {
  card: CardData;
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white p-8"
      onClick={onClose}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.y) > 120) onClose();
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-ring rounded-[28px] border-4 border-black/10" />
        <motion.div
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[28px] bg-white p-5 shadow-2xl ring-1 ring-black/10"
        >
          <QrCode
            data={`${url}?src=qr`}
            color="#000000"
            bgColor="#ffffff"
            errorLevel={card.qrErrorLevel}
            style={card.qrStyle}
            logoHref={card.qrEmbedLogo ? card.qrLogoUrl ?? card.avatarUrl : null}
            size={560}
            className="h-[68vw] max-h-[420px] w-[68vw] max-w-[420px] [&>svg]:h-full [&>svg]:w-full"
          />
        </motion.div>
      </div>
      <p className="mt-8 text-center text-lg font-semibold text-black">{card.fullName}</p>
      <p className="mt-1 text-center text-sm text-black/50">{url.replace(/^https?:\/\//, "")}</p>
      <p className="mt-8 text-center text-xs uppercase tracking-widest text-black/35">
        Tap anywhere or swipe to close
      </p>
    </motion.div>
  );
}

export function ShareSheet({
  card,
  open,
  onClose,
}: {
  card: CardData;
  open: boolean;
  onClose: () => void;
}) {
  const url = useCardUrl(card);
  const [qrOpen, setQrOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${card.slug}-card.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  }, [card.slug]);

  const nativeShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: `${card.fullName} — CardDrop`, url }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(url).catch(() => undefined);
    }
  }, [card.fullName, url]);

  return (
    <>
      {/* Hidden clean render used for PNG export */}
      <div className="pointer-events-none fixed -left-[9999px] top-0 w-[700px]">
        <div ref={exportRef}>
          <CardPreview card={card} side="front" />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110) onClose();
              }}
              className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-lg rounded-t-3xl border border-b-0 border-ink-700 bg-ink-900 p-5 pb-[calc(20px+env(safe-area-inset-bottom))]"
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-600" />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Share your card</h3>
                <button type="button" onClick={onClose} className="rounded-lg p-2 text-ink-400 hover:bg-ink-800">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <CopyLinkButton url={url} className="btn-secondary !justify-start" />
                <button type="button" className="btn-secondary !justify-start" onClick={() => setQrOpen(true)}>
                  <QrIcon size={17} /> Show QR code
                </button>
                <button type="button" className="btn-secondary !justify-start" onClick={downloadImage} disabled={exporting}>
                  <ImageDown size={17} /> {exporting ? "Exporting…" : "Download image"}
                </button>
                <a className="btn-secondary !justify-start" href={`/api/vcf/${card.id}`} download>
                  <Contact size={17} /> Download .vcf
                </a>
                <a className="btn-secondary !justify-start" href={`/api/qr/${card.id}?format=png`} download>
                  <Download size={17} /> QR as PNG
                </a>
                <button type="button" className="btn-secondary !justify-start" onClick={nativeShare}>
                  <Share2 size={17} /> Share via…
                </button>
              </div>

              <div className="mt-4 border-t border-ink-800 pt-4">
                <p className="label-base !mb-2.5">Add to your phone&apos;s wallet</p>
                <WalletButtons cardId={card.id} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {qrOpen && <FullscreenQr card={card} url={url} onClose={() => setQrOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
