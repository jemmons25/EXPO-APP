"use client";

import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="label-base">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-ink-500">{hint}</p>}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("input-base", props.className)} />;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
}) {
  return (
    <div className="flex gap-1 rounded-xl border border-ink-700 bg-ink-900 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn("seg-btn", value === opt.value && "seg-btn-active")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-brand" : "bg-ink-700"
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all",
          checked ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  swatches,
  allowNone,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  swatches: string[];
  allowNone?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <label className="label-base">{label}</label>
      <div className="flex flex-wrap items-center gap-1.5">
        {swatches.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => onChange(c)}
            className={cn(
              "h-7 w-7 rounded-lg border transition hover:scale-110",
              value?.toLowerCase() === c.toLowerCase()
                ? "border-white ring-2 ring-brand"
                : "border-white/15"
            )}
            style={{ background: c }}
          />
        ))}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-7 items-center gap-1.5 rounded-lg border border-ink-600 px-2 text-[12px] text-ink-300 hover:border-ink-500"
        >
          <span
            className="h-4 w-4 rounded border border-white/20"
            style={{
              background:
                value ??
                "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
            }}
          />
          Custom
        </button>
        {allowNone && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={cn(
              "h-7 rounded-lg border px-2 text-[12px]",
              value === null ? "border-brand text-brand" : "border-ink-600 text-ink-400"
            )}
          >
            None
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 rounded-2xl border border-ink-700 bg-ink-900 p-3 shadow-2xl"
          >
            <HexColorPicker color={value ?? "#6366f1"} onChange={onChange} />
            <input
              className="input-base mt-2 !min-h-0 !py-1.5 text-center text-[13px]"
              value={value ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
              }}
              placeholder="#6366f1"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
