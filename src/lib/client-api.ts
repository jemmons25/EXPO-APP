"use client";

import type { CardData } from "@/lib/card-types";

export type CardWithStats = CardData & { stats?: Record<string, number> };

async function parse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  listCards: () => fetch("/api/cards").then((r) => parse<{ cards: CardWithStats[] }>(r)),

  createCard: (data: { fullName?: string; style?: string; label?: string } = {}) =>
    fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => parse<{ card: CardData }>(r)),

  updateCard: (id: string, data: Partial<CardData> & { slug?: string }) =>
    fetch(`/api/cards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => parse<{ card: CardData }>(r)),

  deleteCard: (id: string) =>
    fetch(`/api/cards/${id}`, { method: "DELETE" }).then((r) => parse<{ ok: true }>(r)),

  uploadImage: (id: string, file: File, kind: "avatar" | "bg" | "qrlogo") => {
    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    return fetch(`/api/cards/${id}/avatar`, { method: "POST", body: form }).then((r) =>
      parse<{ url: string; card: CardData }>(r)
    );
  },

  googleWalletUrl: (cardId: string) =>
    fetch(`/api/wallet/google/${cardId}`, { method: "POST" }).then((r) => parse<{ url: string }>(r)),

  analytics: (cardId: string) =>
    fetch(`/api/analytics/${cardId}`).then((r) =>
      parse<{ counts: Record<string, number>; daily: Record<string, { views: number; scans: number }> }>(r)
    ),

  track: (cardId: string, eventType: string, source?: string) =>
    fetch(`/api/analytics/scan/${cardId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, source }),
      keepalive: true,
    }).catch(() => undefined),

  signOut: () => fetch("/api/auth/signout", { method: "POST" }),

  magicLink: (email: string) =>
    fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then((r) => parse<{ ok: true; delivered: boolean; devUrl?: string }>(r)),
};
