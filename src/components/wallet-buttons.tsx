"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { cn } from "@/lib/utils";

function detectOS(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios"; // iPadOS
  return "other";
}

function AppleWalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5V7H4V5.5z" fill="#f97316" />
      <path d="M4 7h16v2.5H4V7z" fill="#facc15" />
      <path d="M4 9.5h16V12H4V9.5z" fill="#22c55e" />
      <path d="M4 12h16v6.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5V12z" fill="#3b82f6" />
    </svg>
  );
}

function GoogleWalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 8.5C3 6.6 4.6 5 6.5 5H21a9.5 9.5 0 0 1-1.2 3.5H6.5C5.7 8.5 5 9.2 5 10v.5H3V8.5z" fill="#ea4335" />
      <path d="M3 10.5h18.6c.3 1.1.4 2.3.4 3.5H6.5c-.8 0-1.5.7-1.5 1.5H3v-5z" fill="#fbbc04" />
      <path d="M3 14.5h19c-.1 1.6-.6 3.1-1.3 4.5H6.5C4.6 19 3 17.4 3 15.5v-1z" fill="#34a853" />
      <path d="M6.5 12.5H22a13 13 0 0 1-8.4 8.3A3.5 3.5 0 0 0 10 18H6.5a1.5 1.5 0 1 1 0-3v-2.5z" fill="#4285f4" opacity="0.9" />
    </svg>
  );
}

export function WalletButtons({ cardId, className }: { cardId: string; className?: string }) {
  const [os, setOs] = useState<"ios" | "android" | "other">("other");
  const [busy, setBusy] = useState<"apple" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setOs(detectOS()), []);

  async function addApple() {
    setBusy("apple");
    setError(null);
    try {
      const res = await fetch(`/api/wallet/apple/${cardId}`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to generate pass");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "card.pkpass";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function addGoogle() {
    setBusy("google");
    setError(null);
    try {
      const { url } = await api.googleWalletUrl(cardId);
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={addApple}
          disabled={busy !== null}
          className={cn(
            "flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl border px-4 font-semibold transition active:scale-[0.98]",
            os === "ios"
              ? "border-white bg-white text-black ring-2 ring-brand/60"
              : "border-ink-600 bg-black text-white hover:border-ink-400"
          )}
        >
          <AppleWalletIcon />
          {busy === "apple" ? "Generating…" : "Add to Apple Wallet"}
        </button>
        <button
          type="button"
          onClick={addGoogle}
          disabled={busy !== null}
          className={cn(
            "flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl border px-4 font-semibold transition active:scale-[0.98]",
            os === "android"
              ? "border-white bg-white text-black ring-2 ring-brand/60"
              : "border-ink-600 bg-black text-white hover:border-ink-400"
          )}
        >
          <GoogleWalletIcon />
          {busy === "google" ? "Preparing…" : "Add to Google Wallet"}
        </button>
      </div>
      {error && (
        <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13px] leading-relaxed text-amber-200">
          {error}
        </p>
      )}
    </div>
  );
}
