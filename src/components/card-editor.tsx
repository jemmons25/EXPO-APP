"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CloudUpload,
  ImagePlus,
  Loader2,
  RefreshCw,
  Share2,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import type { CardData, CardStyle } from "@/lib/card-types";
import {
  ACCENT_SWATCHES,
  CARD_FONTS,
  CARD_STYLES,
  STYLE_PRESETS,
  SWATCHES,
} from "@/lib/card-types";
import { api } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import { CardPreview } from "@/components/card-preview";
import { ColorField, Field, Segmented, TextInput, Toggle } from "@/components/controls";
import { QrCode } from "@/components/qr-code";
import { ShareSheet, useCardUrl, CopyLinkButton } from "@/components/share-sheet";
import { WalletButtons } from "@/components/wallet-buttons";

type Tab = "info" | "design" | "qr" | "share";
type SaveState = "saved" | "saving" | "error";

export function CardEditor({ initial }: { initial: CardData }) {
  const router = useRouter();
  const [card, setCard] = useState<CardData>(initial);
  const [tab, setTab] = useState<Tab>("info");
  const [flipped, setFlipped] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const pendingRef = useRef<Partial<CardData>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    const patch = pendingRef.current;
    if (Object.keys(patch).length === 0) return;
    pendingRef.current = {};
    setSaveState("saving");
    try {
      const { card: saved } = await api.updateCard(initial.id, patch);
      setCard((current) => ({ ...current, slug: saved.slug }));
      setSaveState("saved");
      setSaveError(null);
    } catch (e) {
      setSaveState("error");
      setSaveError(e instanceof Error ? e.message : "Save failed");
      // Re-queue so the next edit retries.
      pendingRef.current = { ...patch, ...pendingRef.current };
    }
  }, [initial.id]);

  const update = useCallback(
    (patch: Partial<CardData>) => {
      setCard((current) => ({ ...current, ...patch }));
      pendingRef.current = { ...pendingRef.current, ...patch };
      setSaveState("saving");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, 700);
    },
    [flush]
  );

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const applyStyle = useCallback(
    (style: CardStyle) => {
      update({ style, ...STYLE_PRESETS[style] });
    },
    [update]
  );

  async function upload(kind: "avatar" | "bg" | "qrlogo", file: File | undefined) {
    if (!file) return;
    setSaveState("saving");
    try {
      const { url } = await api.uploadImage(initial.id, file, kind);
      const key = kind === "avatar" ? "avatarUrl" : kind === "bg" ? "bgImageUrl" : "qrLogoUrl";
      setCard((current) => ({ ...current, [key]: url }));
      setSaveState("saved");
    } catch (e) {
      setSaveState("error");
      setSaveError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function deleteCard() {
    if (!window.confirm("Delete this card? This can't be undone.")) return;
    await api.deleteCard(initial.id);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-dvh bg-ink-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
          <Link href="/dashboard" className="btn-ghost !min-h-[38px] !px-2.5">
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[13px] text-ink-400">
            {saveState === "saving" && (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            )}
            {saveState === "saved" && (
              <>
                <Check size={14} className="text-emerald-400" /> Saved
              </>
            )}
            {saveState === "error" && <span className="text-amber-400">{saveError ?? "Save failed"}</span>}
          </div>
          <button type="button" className="btn-primary !min-h-[38px] !px-4" onClick={() => setShareOpen(true)}>
            <Share2 size={16} />
            Share
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)] lg:py-8">
        {/* PREVIEW — top on mobile, right on desktop */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <CardPreview
              card={card}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              className="mx-auto max-w-xl"
            />
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="btn-ghost mx-auto mt-3 flex !min-h-[38px] text-[13px]"
            >
              <RefreshCw size={14} />
              {flipped ? "Show front" : "Show back"} — or tap the card
            </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="order-2 lg:order-1">
          <div className="mb-5 flex gap-1 rounded-2xl border border-ink-800 bg-ink-900 p-1">
            {(
              [
                ["info", "Info"],
                ["design", "Design"],
                ["qr", "QR"],
                ["share", "Wallet"],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id);
                  setFlipped(id === "qr" && card.qrShowOnBack);
                }}
                className={cn(
                  "min-h-[42px] flex-1 rounded-xl text-[14px] font-semibold transition",
                  tab === id ? "bg-ink-700 text-white shadow" : "text-ink-400 hover:text-ink-200"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className="space-y-5 pb-28 lg:pb-10"
            >
              {tab === "info" && <InfoTab card={card} update={update} upload={upload} />}
              {tab === "design" && (
                <DesignTab card={card} update={update} upload={upload} applyStyle={applyStyle} />
              )}
              {tab === "qr" && <QrTab card={card} update={update} upload={upload} />}
              {tab === "share" && (
                <ShareTab card={card} update={update} onDelete={deleteCard} onOpenSheet={() => setShareOpen(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ShareSheet card={card} open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

/* ------------------------------- INFO TAB ------------------------------- */

function InfoTab({
  card,
  update,
  upload,
}: {
  card: CardData;
  update: (p: Partial<CardData>) => void;
  upload: (kind: "avatar" | "bg" | "qrlogo", file: File | undefined) => void;
}) {
  const set = (key: keyof CardData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    update({ [key]: e.target.value } as Partial<CardData>);

  const toggleField = (key: keyof CardData["visibleFields"]) => (value: boolean) =>
    update({ visibleFields: { ...card.visibleFields, [key]: value } });

  return (
    <>
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <label className="group relative cursor-pointer">
          {card.avatarUrl ? (
            <img src={card.avatarUrl} alt="Avatar" className="h-20 w-20 rounded-full border-2 border-ink-600 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-ink-600 text-ink-500">
              <UserIcon size={26} />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition group-hover:opacity-100">
            <CloudUpload size={20} className="text-white" />
          </div>
          <input
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(e) => upload("avatar", e.target.files?.[0])}
          />
        </label>
        <div className="flex-1">
          <p className="text-[14px] font-medium">Profile photo</p>
          <p className="text-[12px] text-ink-500">JPG, PNG, WebP or HEIC. Cropped to a circle.</p>
          {card.avatarUrl && (
            <button type="button" className="mt-1 text-[12px] text-rose-400 hover:underline" onClick={() => update({ avatarUrl: null })}>
              Remove photo
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <TextInput value={card.fullName} onChange={set("fullName")} placeholder="Jane Doe" maxLength={80} />
        </Field>
        <Field label="Pronouns">
          <div className="flex items-center gap-2.5">
            <TextInput value={card.pronouns ?? ""} onChange={set("pronouns")} placeholder="she/her" />
            <Toggle checked={card.visibleFields.pronouns} onChange={toggleField("pronouns")} label="Show pronouns" />
          </div>
        </Field>
        <Field label="Job title">
          <TextInput value={card.jobTitle ?? ""} onChange={set("jobTitle")} placeholder="Product Designer" />
        </Field>
        <Field label="Company">
          <TextInput value={card.company ?? ""} onChange={set("company")} placeholder="Acme Inc." />
        </Field>
      </div>

      <Field label={`Tagline · ${(card.tagline ?? "").length}/120`}>
        <TextInput
          value={card.tagline ?? ""}
          onChange={set("tagline")}
          maxLength={120}
          placeholder="Building delightful products, one pixel at a time."
        />
      </Field>

      <div className="space-y-3 rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <p className="label-base !mb-0">Contact & social — toggle what shows on the card</p>
        {(
          [
            ["email", "Email", "jane@acme.com"],
            ["phone", "Phone", "+1 (555) 010-0134"],
            ["website", "Website", "https://janedoe.com"],
            ["location", "Location", "Lisbon, Portugal"],
            ["linkedin", "LinkedIn", "https://linkedin.com/in/janedoe"],
            ["twitter", "Twitter / X", "https://x.com/janedoe"],
            ["instagram", "Instagram", "https://instagram.com/janedoe"],
          ] as [keyof CardData["visibleFields"] & keyof CardData, string, string][]
        ).map(([key, label, placeholder]) => (
          <div key={key} className="flex items-center gap-2.5">
            <div className="w-20 shrink-0 text-[13px] font-medium text-ink-300">{label}</div>
            <TextInput
              value={(card[key] as string | null) ?? ""}
              onChange={(e) => update({ [key]: e.target.value } as Partial<CardData>)}
              placeholder={placeholder}
              className="!min-h-[40px] !py-2"
            />
            <Toggle checked={card.visibleFields[key]} onChange={toggleField(key)} label={`Show ${label}`} />
          </div>
        ))}
      </div>

      <Field label="Card label (only you see this)">
        <TextInput value={card.label ?? ""} onChange={set("label")} placeholder="Personal / Work at Acme" maxLength={60} />
      </Field>
    </>
  );
}

/* ------------------------------ DESIGN TAB ------------------------------ */

function DesignTab({
  card,
  update,
  upload,
  applyStyle,
}: {
  card: CardData;
  update: (p: Partial<CardData>) => void;
  upload: (kind: "avatar" | "bg" | "qrlogo", file: File | undefined) => void;
  applyStyle: (s: CardStyle) => void;
}) {
  return (
    <>
      <Field label="Card style">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CARD_STYLES.map((s) => {
            const preset = STYLE_PRESETS[s.id];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => applyStyle(s.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition",
                  card.style === s.id ? "border-brand ring-2 ring-brand/30" : "border-ink-700 hover:border-ink-500"
                )}
              >
                <div
                  className="mb-2 h-9 w-full rounded-lg border border-white/10"
                  style={{
                    background: preset.bgColor2
                      ? `linear-gradient(135deg, ${preset.bgColor}, ${preset.bgColor2})`
                      : preset.bgColor,
                  }}
                >
                  <div className="ml-2 mt-2 h-1.5 w-8 rounded-full" style={{ background: preset.accentColor }} />
                </div>
                <p className="text-[13px] font-semibold">{s.name}</p>
                <p className="text-[11px] text-ink-500">{s.blurb}</p>
              </button>
            );
          })}
        </div>
      </Field>

      <ColorField label="Background color" value={card.bgColor} onChange={(v) => v && update({ bgColor: v })} swatches={SWATCHES} />
      <ColorField
        label="Gradient second stop"
        value={card.bgColor2}
        onChange={(v) => update({ bgColor2: v })}
        swatches={SWATCHES}
        allowNone
      />
      <ColorField label="Accent color" value={card.accentColor} onChange={(v) => v && update({ accentColor: v })} swatches={ACCENT_SWATCHES} />
      <ColorField label="Text color" value={card.textColor} onChange={(v) => v && update({ textColor: v })} swatches={["#ffffff", "#f4f4f5", "#d4d4d8", "#18181b", "#0f172a", "#fef3c7"]} />

      {/* Background image */}
      <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="label-base !mb-0">Background image</p>
          <label className="btn-secondary !min-h-[38px] cursor-pointer !px-3 !text-[13px]">
            <ImagePlus size={15} /> {card.bgImageUrl ? "Replace" : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => upload("bg", e.target.files?.[0])} />
          </label>
        </div>
        {card.bgImageUrl && (
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center gap-3">
              <img src={card.bgImageUrl} alt="" className="h-12 w-20 rounded-lg object-cover" />
              <button type="button" className="text-[12px] text-rose-400 hover:underline" onClick={() => update({ bgImageUrl: null })}>
                Remove
              </button>
            </div>
            <Field label={`Opacity · ${Math.round(card.bgImageOpacity * 100)}%`}>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={card.bgImageOpacity}
                onChange={(e) => update({ bgImageOpacity: Number(e.target.value) })}
                className="w-full accent-brand"
              />
            </Field>
          </div>
        )}
      </div>

      <Field label="Font family">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CARD_FONTS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => update({ fontFamily: font })}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left transition min-h-[44px]",
                card.fontFamily === font ? "border-brand ring-2 ring-brand/30" : "border-ink-700 hover:border-ink-500"
              )}
            >
              <span className="block truncate text-[15px]" style={{ fontFamily: `'${font}'` }}>
                {font}
              </span>
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Font size">
          <Segmented
            value={card.fontSizeScale}
            onChange={(v) => update({ fontSizeScale: v })}
            options={[
              { value: "compact", label: "Compact" },
              { value: "regular", label: "Regular" },
              { value: "large", label: "Large" },
            ]}
          />
        </Field>
        <Field label="Layout">
          <Segmented
            value={card.layout}
            onChange={(v) => update({ layout: v })}
            options={[
              { value: "centered", label: "Centered" },
              { value: "left", label: "Left" },
              { value: "split", label: "Split" },
            ]}
          />
        </Field>
        <Field label="Corners">
          <Segmented
            value={card.borderRadius}
            onChange={(v) => update({ borderRadius: v })}
            options={[
              { value: "sharp", label: "Sharp" },
              { value: "rounded", label: "Rounded" },
              { value: "pill", label: "Pill" },
            ]}
          />
        </Field>
        <Field label="Shadow">
          <Segmented
            value={card.shadowStyle}
            onChange={(v) => update({ shadowStyle: v })}
            options={[
              { value: "none", label: "None" },
              { value: "soft", label: "Soft" },
              { value: "dramatic", label: "Dramatic" },
            ]}
          />
        </Field>
      </div>

      <Field label="Icon set">
        <Segmented
          value={card.iconSet}
          onChange={(v) => update({ iconSet: v })}
          options={[
            { value: "minimal", label: "Minimal" },
            { value: "filled", label: "Filled" },
            { value: "rounded", label: "Rounded" },
            { value: "phosphor", label: "Phosphor" },
          ]}
        />
      </Field>
    </>
  );
}

/* -------------------------------- QR TAB -------------------------------- */

function QrTab({
  card,
  update,
  upload,
}: {
  card: CardData;
  update: (p: Partial<CardData>) => void;
  upload: (kind: "avatar" | "bg" | "qrlogo", file: File | undefined) => void;
}) {
  const url = useCardUrl(card);

  return (
    <>
      <div className="flex items-center justify-between rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <div>
          <p className="text-[14px] font-medium">Show QR on card back</p>
          <p className="text-[12px] text-ink-500">Tap the card preview to flip it</p>
        </div>
        <Toggle checked={card.qrShowOnBack} onChange={(v) => update({ qrShowOnBack: v })} />
      </div>

      {/* Live preview */}
      <div className="flex justify-center rounded-2xl border border-ink-800 bg-[repeating-conic-gradient(#1c1c21_0%_25%,#16161a_0%_50%)] bg-[length:20px_20px] p-6">
        <QrCode
          data={`${url}?src=qr`}
          color={card.qrColor}
          bgColor={card.qrBgColor}
          errorLevel={card.qrErrorLevel}
          style={card.qrStyle}
          logoHref={card.qrEmbedLogo ? card.qrLogoUrl ?? card.avatarUrl : null}
          size={480}
          className="w-52 [&>svg]:h-auto [&>svg]:w-full"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <ColorField label="QR color" value={card.qrColor} onChange={(v) => v && update({ qrColor: v })} swatches={ACCENT_SWATCHES} />
        </div>
        <button type="button" className="btn-secondary !min-h-[38px] !px-3 !text-[13px]" onClick={() => update({ qrColor: card.accentColor })}>
          Match accent
        </button>
      </div>

      <Field label="QR background">
        <Segmented
          value={card.qrBgColor === "transparent" ? "transparent" : "filled"}
          onChange={(v) => update({ qrBgColor: v === "transparent" ? "transparent" : "#ffffff" })}
          options={[
            { value: "transparent", label: "Transparent" },
            { value: "filled", label: "Filled" },
          ]}
        />
      </Field>
      {card.qrBgColor !== "transparent" && (
        <ColorField label="QR background color" value={card.qrBgColor} onChange={(v) => v && update({ qrBgColor: v })} swatches={["#ffffff", "#f4f4f5", "#fef3c7", "#0f0f10", "#111827", "#1a1a2e"]} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Corner style">
          <Segmented
            value={card.qrStyle}
            onChange={(v) => update({ qrStyle: v })}
            options={[
              { value: "square", label: "Square" },
              { value: "rounded", label: "Rounded" },
              { value: "dots", label: "Dots" },
            ]}
          />
        </Field>
        <Field label="Error correction" hint="Higher = more damage-resistant, denser code. Use Q/H with a logo.">
          <Segmented
            value={card.qrErrorLevel}
            onChange={(v) => update({ qrErrorLevel: v })}
            options={[
              { value: "L", label: "L" },
              { value: "M", label: "M" },
              { value: "Q", label: "Q" },
              { value: "H", label: "H" },
            ]}
          />
        </Field>
      </div>

      <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[14px] font-medium">Center logo</p>
            <p className="text-[12px] text-ink-500">Embeds your avatar (or a custom logo) in the middle</p>
          </div>
          <Toggle
            checked={card.qrEmbedLogo}
            onChange={(v) => update({ qrEmbedLogo: v, ...(v && card.qrErrorLevel === "L" ? { qrErrorLevel: "Q" as const } : {}) })}
          />
        </div>
        {card.qrEmbedLogo && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={card.qrLogoUrl ?? card.avatarUrl ?? ""}
              alt=""
              className="h-11 w-11 rounded-lg border border-ink-600 object-cover"
            />
            <label className="btn-secondary !min-h-[38px] cursor-pointer !px-3 !text-[13px]">
              <ImagePlus size={15} /> Custom logo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => upload("qrlogo", e.target.files?.[0])} />
            </label>
            {card.qrLogoUrl && (
              <button type="button" className="text-[12px] text-rose-400 hover:underline" onClick={() => update({ qrLogoUrl: null })}>
                Use avatar instead
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2.5">
        <a className="btn-secondary flex-1" href={`/api/qr/${card.id}?format=png`} download>
          Download PNG
        </a>
        <a className="btn-secondary flex-1" href={`/api/qr/${card.id}?format=svg`} download>
          Download SVG
        </a>
      </div>
    </>
  );
}

/* ------------------------------- SHARE TAB ------------------------------ */

function ShareTab({
  card,
  update,
  onDelete,
  onOpenSheet,
}: {
  card: CardData;
  update: (p: Partial<CardData> & { slug?: string }) => void;
  onDelete: () => void;
  onOpenSheet: () => void;
}) {
  const url = useCardUrl(card);
  const [slugDraft, setSlugDraft] = useState(card.slug);
  useEffect(() => setSlugDraft(card.slug), [card.slug]);

  return (
    <>
      <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <p className="label-base">Your public link</p>
        <div className="flex items-center gap-2">
          <div className="flex min-h-[44px] flex-1 items-center overflow-hidden rounded-xl border border-ink-700 bg-ink-850 px-3.5">
            <span className="shrink-0 text-[14px] text-ink-500">{url.replace(/^https?:\/\//, "").split("/u/")[0]}/u/</span>
            <input
              className="w-full bg-transparent py-2.5 text-[14px] text-ink-100 outline-none"
              value={slugDraft}
              onChange={(e) => setSlugDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              onBlur={() => slugDraft !== card.slug && slugDraft.length >= 3 && update({ slug: slugDraft })}
            />
          </div>
          <CopyLinkButton url={url} className="btn-secondary !px-3.5" />
        </div>
      </div>

      <Field label="Who can see this card">
        <Segmented
          value={card.visibility}
          onChange={(v) => update({ visibility: v })}
          options={[
            { value: "public", label: "Public" },
            { value: "link-only", label: "Link only" },
            { value: "private", label: "Private" },
          ]}
        />
      </Field>

      <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <p className="label-base !mb-3">Add to your phone&apos;s wallet</p>
        <WalletButtons cardId={card.id} />
        <p className="mt-3 text-[12px] leading-relaxed text-ink-500">
          On iPhone, your card lives in the Wallet app — double-click the side button to bring it up. On Android
          it&apos;s available in Google Wallet.
        </p>
      </div>

      <button type="button" className="btn-secondary w-full" onClick={onOpenSheet}>
        <Share2 size={16} /> Open share sheet
      </button>

      <a className="btn-secondary w-full" href={`/api/vcf/${card.id}`} download>
        Download contact file (.vcf)
      </a>

      <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4">
        <p className="mb-2 text-[13px] font-medium text-rose-300">Danger zone</p>
        <button type="button" className="btn-secondary !border-rose-800 !text-rose-300 hover:!bg-rose-950/40" onClick={onDelete}>
          <Trash2 size={15} /> Delete this card
        </button>
      </div>
    </>
  );
}
