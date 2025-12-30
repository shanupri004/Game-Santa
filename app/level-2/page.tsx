"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Level2Memory } from "@/components/level2-memory";

export default function Level2Page() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("level1Password");
    if (!saved) {
      router.replace("/");
    } else {
      setPassword(saved);
    }
  }, [router]);

  if (!password) return null;

  return (
    <Level2Memory
      requiredPassword={password}
      onComplete={(nextPassword) => {
        sessionStorage.setItem("level2Password", nextPassword);
        router.push("/level-3");
      }}
    />
  );
}
