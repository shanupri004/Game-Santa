"use client";

import { useRouter } from "next/navigation";
import { EntryPassScreen } from "@/components/entry-pass-screen";
import { Snowfall } from "@/components/snowfall";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-linear-to-b from-red-950 via-green-950 to-red-950 overflow-hidden">
      <Snowfall />
      <EntryPassScreen onSuccess={() => router.push("/level-1")} />
    </main>
  );
}
