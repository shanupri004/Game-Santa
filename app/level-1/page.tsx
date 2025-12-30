"use client";

import { useRouter } from "next/navigation";
import { Level1FlipCards } from "@/components/level1-flip-cards";

export default function Level1Page() {
  const router = useRouter();

  return (
    <Level1FlipCards
      onComplete={(password) => {
        sessionStorage.setItem("level1Password", password);
        router.push("/level-2");
      }}
    />
  );
}
