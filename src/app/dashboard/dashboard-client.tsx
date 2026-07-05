"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, LogOut, Plus, QrCode as QrIcon, Share2, Wallet } from "lucide-react";
import type { CardWithStats } from "@/lib/client-api";
import { api } from "@/lib/client-api";
import { CardPreview } from "@/components/card-preview";
import { ShareSheet } from "@/components/share-sheet";

export function DashboardClient({ cards, email }: { cards: CardWithStats[]; email: string }) {
  const router = useRouter();
  const [shareCard, setShareCard] = useState<CardWithStats | null>(null);

  async function signOut() {
    await api.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            Card<span className="text-brand">Drop</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-[13px] text-ink-500 sm:block">{email}</span>
            <button type="button" onClick={signOut} className="btn-ghost !min-h-[38px] !px-3 text-[13px]">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Your cards</h1>
            <p className="mt-1 text-[14px] text-ink-500">
              {cards.length === 0 ? "Create your first card to get started" : "Tap a card to edit it"}
            </p>
          </div>
          <Link href="/editor/new" className="btn-primary">
            <Plus size={17} /> New card
          </Link>
        </div>

        {cards.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="group rounded-3xl border border-ink-800 bg-ink-900/50 p-4 transition hover:border-ink-600"
              >
                <Link href={`/editor/${card.id}`} className="block">
                  <CardPreview card={card} side="front" className="pointer-events-none" />
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">{card.label || card.fullName}</p>
                    <p className="truncate text-[12px] text-ink-500">/u/{card.slug}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShareCard(card)}
                    className="btn-ghost !min-h-[38px] !px-3"
                    aria-label="Share card"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
                <div className="mt-3 flex gap-4 border-t border-ink-800 pt-3 text-[12px] text-ink-400">
                  <span className="flex items-center gap-1.5">
                    <Eye size={13} /> {card.stats?.view ?? 0} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <QrIcon size={13} /> {card.stats?.qr_scan ?? 0} scans
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet size={13} />{" "}
                    {(card.stats?.wallet_add_apple ?? 0) + (card.stats?.wallet_add_google ?? 0)} saves
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {shareCard && <ShareSheet card={shareCard} open onClose={() => setShareCard(null)} />}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-700 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15">
        <Plus size={28} className="text-brand-soft" />
      </div>
      <h2 className="text-lg font-semibold">No cards yet</h2>
      <p className="mt-1 max-w-xs text-[14px] text-ink-500">
        Design your first digital business card in under two minutes.
      </p>
      <Link href="/editor/new" className="btn-primary mt-6">
        Create your card
      </Link>
    </div>
  );
}
