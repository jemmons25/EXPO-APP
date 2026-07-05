"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/client-api";

export default function NewCardPage() {
  const router = useRouter();
  const startedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    api
      .createCard()
      .then(({ card }) => router.replace(`/editor/${card.id}`))
      .catch((e) => {
        if (e instanceof Error && e.message.includes("Unauthorized")) {
          router.replace("/sign-in");
        } else {
          setError(e instanceof Error ? e.message : "Failed to create card");
        }
      });
  }, [router]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 text-ink-400">
      {error ? (
        <p className="text-amber-400">{error}</p>
      ) : (
        <>
          <Loader2 size={28} className="animate-spin text-brand" />
          Setting up your new card…
        </>
      )}
    </main>
  );
}
