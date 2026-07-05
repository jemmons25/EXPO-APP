"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, Smartphone, Wallet, Zap } from "lucide-react";
import type { CardData } from "@/lib/card-types";
import { DEFAULT_VISIBLE_FIELDS } from "@/lib/card-types";
import { CardPreview } from "@/components/card-preview";

const baseDemo: CardData = {
  id: "demo",
  slug: "janedoe",
  label: null,
  fullName: "Jane Doe",
  jobTitle: "Product Designer",
  company: "Acme",
  email: "jane@acme.com",
  phone: "+1 (555) 010-0134",
  website: "https://janedoe.com",
  linkedin: "https://linkedin.com/in/janedoe",
  twitter: null,
  instagram: null,
  location: "Lisbon, Portugal",
  pronouns: "she/her",
  tagline: "Designing calm, useful products.",
  avatarUrl: null,
  style: "dark",
  bgColor: "#09090b",
  bgColor2: null,
  accentColor: "#22d3ee",
  textColor: "#f4f4f5",
  fontFamily: "Space Grotesk",
  fontSizeScale: "regular",
  layout: "left",
  borderRadius: "rounded",
  shadowStyle: "dramatic",
  iconSet: "minimal",
  bgImageUrl: null,
  bgImageOpacity: 1,
  qrShowOnBack: true,
  qrColor: "#22d3ee",
  qrBgColor: "transparent",
  qrErrorLevel: "M",
  qrStyle: "rounded",
  qrLogoUrl: null,
  qrEmbedLogo: false,
  visibleFields: { ...DEFAULT_VISIBLE_FIELDS, pronouns: true },
  visibility: "public",
  isActive: true,
};

const examples: { name: string; card: CardData }[] = [
  {
    name: "Minimal",
    card: {
      ...baseDemo,
      fullName: "Amara Osei",
      jobTitle: "Architect",
      company: "Studio North",
      style: "minimal",
      bgColor: "#fafafa",
      accentColor: "#18181b",
      textColor: "#18181b",
      fontFamily: "Instrument Serif",
      layout: "centered",
      tagline: "Space, light, and honest materials.",
    },
  },
  {
    name: "Bold",
    card: {
      ...baseDemo,
      fullName: "Marcus Reid",
      jobTitle: "Creative Director",
      company: "Loud & Co",
      style: "bold",
      bgColor: "#18181b",
      accentColor: "#facc15",
      textColor: "#ffffff",
      fontFamily: "Bebas Neue",
      layout: "left",
      tagline: null,
    },
  },
  {
    name: "Gradient",
    card: {
      ...baseDemo,
      fullName: "Priya Nair",
      jobTitle: "Founder",
      company: "Bloom",
      style: "gradient",
      bgColor: "#4f46e5",
      bgColor2: "#ec4899",
      accentColor: "#fef3c7",
      textColor: "#ffffff",
      fontFamily: "Sora",
      layout: "centered",
      borderRadius: "pill",
      tagline: "Growing brands people love.",
    },
  },
  {
    name: "Glass",
    card: {
      ...baseDemo,
      fullName: "Leo Tanaka",
      jobTitle: "Engineer",
      company: "Nimbus",
      style: "glass",
      bgColor: "#312e81",
      bgColor2: "#831843",
      accentColor: "#e0e7ff",
      textColor: "#ffffff",
      fontFamily: "Plus Jakarta Sans",
      layout: "split",
      tagline: null,
    },
  },
];

export function LandingClient({ signedIn }: { signedIn: boolean }) {
  const cta = signedIn ? "/dashboard" : "/sign-in";

  return (
    <main className="overflow-x-clip">
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-ink-800/70 bg-ink-950/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="font-display text-lg font-bold tracking-tight">
            Card<span className="text-brand">Drop</span>
          </span>
          <Link href={cta} className="btn-primary !min-h-[38px] !px-4 !text-[14px]">
            {signedIn ? "Dashboard" : "Sign in"}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:pt-20">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-25"
          style={{ background: "radial-gradient(closest-side, #6366f1, transparent)" }}
        />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Your business card,
              <br />
              <span className="bg-gradient-to-r from-brand-soft via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                two clicks away.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-400"
            >
              Design a beautiful digital card, share it with a QR code, and keep it in Apple Wallet or Google
              Wallet — right where your boarding passes live.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href={signedIn ? "/editor/new" : "/sign-in"} className="btn-primary !min-h-[52px] !px-7 !text-[16px]">
                Create your card — free <ArrowRight size={18} />
              </Link>
              <span className="text-[13px] text-ink-500">No credit card. Under 2 minutes.</span>
            </motion.div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { icon: <Wallet size={18} />, label: "Lives in your wallet" },
                { icon: <QrCode size={18} />, label: "Instant QR sharing" },
                { icon: <Zap size={18} />, label: "Updates in real time" },
              ].map((f) => (
                <div key={f.label} className="text-[13px] text-ink-400">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 text-brand-soft">
                    {f.icon}
                  </div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Floating 3D card */}
          <div className="perspective-1200 relative mx-auto w-full max-w-md">
            <div
              className="pointer-events-none absolute inset-x-8 bottom-0 h-8 rounded-[50%] bg-black/50 blur-xl"
              aria-hidden
            />
            <div className="animate-float preserve-3d">
              <CardPreview card={baseDemo} side="front" baseUrl="https://carddrop.app" />
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="border-t border-ink-800/70 bg-ink-900/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">One card, any personality</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-[15px] text-ink-500">
            Six styles, twelve fonts, and every color you can think of.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {examples.map((example, i) => (
              <motion.div
                key={example.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
              >
                <CardPreview card={example.card} side="front" baseUrl="https://carddrop.app" />
                <p className="mt-3 text-center text-[13px] font-medium uppercase tracking-widest text-ink-500">
                  {example.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WALLET */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            {/* Phone mockup */}
            <div className="mx-auto w-[270px] rounded-[42px] border border-ink-700 bg-ink-900 p-2.5 shadow-2xl">
              <div className="relative overflow-hidden rounded-[34px] bg-ink-950 pb-8 pt-10">
                <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
                {/* Side button hint */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], x: [0, -3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="absolute -right-1 top-20 h-14 w-1.5 rounded-l bg-brand"
                />
                <p className="mb-3 text-center text-[11px] uppercase tracking-widest text-ink-500">
                  Double-click side button
                </p>
                <motion.div
                  initial={{ y: 110, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", damping: 20, delay: 0.25 }}
                  className="mx-4"
                >
                  <CardPreview
                    card={{ ...baseDemo, fontSizeScale: "compact" }}
                    side="front"
                    baseUrl="https://carddrop.app"
                  />
                </motion.div>
                <div className="mx-4 mt-3 rounded-2xl border border-ink-800 bg-ink-900 px-4 py-3">
                  <p className="text-[12px] font-semibold text-ink-200">Wallet</p>
                  <p className="text-[11px] text-ink-500">Jane Doe — Business Card</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/15 text-brand-soft">
              <Smartphone size={22} />
            </div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Always on you. Never printed.</h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-400">
              Add your card to Apple Wallet or Google Wallet once. From then on it&apos;s a double-click away —
              flash the QR code, they scan, done. Update your details anytime and every card you&apos;ve ever
              shared stays current.
            </p>
            <Link href={signedIn ? "/editor/new" : "/sign-in"} className="btn-secondary mt-7">
              Get started free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-800/70 py-10 text-center text-[13px] text-ink-600">
        <p>
          Card<span className="text-brand">Drop</span> — digital business cards that live in your wallet.
        </p>
      </footer>
    </main>
  );
}
