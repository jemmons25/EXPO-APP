import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { SignInForm } from "./sign-in-form";

export const metadata = { title: "Sign in" };

export default async function SignInPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="mb-8 font-display text-2xl font-bold tracking-tight">
        Card<span className="text-brand">Drop</span>
      </Link>
      <Suspense>
        <SignInForm googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)} />
      </Suspense>
      <p className="mt-8 max-w-xs text-center text-[13px] leading-relaxed text-ink-500">
        No passwords. We&apos;ll email you a magic link that signs you in instantly.
      </p>
    </main>
  );
}
