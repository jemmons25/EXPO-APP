import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl font-bold text-ink-700">404</p>
      <h1 className="text-xl font-semibold">This card doesn&apos;t exist</h1>
      <p className="max-w-xs text-[14px] text-ink-500">
        The link may be wrong, or the owner may have made their card private.
      </p>
      <Link href="/" className="btn-primary mt-2">
        Go home
      </Link>
    </main>
  );
}
