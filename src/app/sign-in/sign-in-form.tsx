"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { api } from "@/lib/client-api";

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    params.get("error") === "expired"
      ? "That link expired — request a new one."
      : params.get("error") === "google"
        ? "Google sign-in failed. Try the magic link instead."
        : null
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await api.magicLink(email);
      setState("sent");
      if (res.devUrl) setDevUrl(res.devUrl);
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-sm rounded-3xl p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15">
          <Mail className="text-brand-soft" size={26} />
        </div>
        <h1 className="text-xl font-semibold">Check your inbox</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-400">
          We sent a sign-in link to <span className="text-ink-200">{email}</span>. It expires in 15 minutes.
        </p>
        {devUrl && (
          <a
            href={devUrl}
            className="btn-primary mt-5 w-full"
            title="Shown because email isn't configured on this server"
          >
            <Sparkles size={16} /> Open magic link (dev)
          </a>
        )}
        <button type="button" className="btn-ghost mt-3 w-full" onClick={() => setState("idle")}>
          Use a different email
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full max-w-sm rounded-3xl p-8">
      <h1 className="text-xl font-semibold">Welcome</h1>
      <p className="mt-1 text-[14px] text-ink-400">Sign in or create your account.</p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input-base"
        />
        <button type="submit" disabled={state === "sending"} className="btn-primary w-full">
          {state === "sending" ? <Loader2 size={17} className="animate-spin" /> : <Mail size={17} />}
          Email me a magic link
        </button>
      </form>

      {googleEnabled && (
        <>
          <div className="my-5 flex items-center gap-3 text-[12px] uppercase tracking-widest text-ink-600">
            <div className="h-px flex-1 bg-ink-700" /> or <div className="h-px flex-1 bg-ink-700" />
          </div>
          <a href="/api/auth/google" className="btn-secondary w-full">
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8z" />
              <path fill="#34A853" d="M12 24c3.2 0 6-1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8H1.2v3A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6v-3H1.2a12 12 0 0 0 0 10.7l4.1-3.1z" />
              <path fill="#EA4335" d="M12 4.7c1.8 0 3.4.6 4.6 1.8L20.1 3A12 12 0 0 0 1.2 6.6l4.1 3.1A7.2 7.2 0 0 1 12 4.7z" />
            </svg>
            Continue with Google
          </a>
        </>
      )}

      {error && <p className="mt-4 text-center text-[13px] text-amber-400">{error}</p>}
    </motion.div>
  );
}
