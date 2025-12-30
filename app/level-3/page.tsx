"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Level3Match3 } from "@/components/level3-match3";

export default function Level3Page() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("level2Password");
    if (!saved) {
      router.replace("/");
    } else {
      setPassword(saved);
    }
  }, [router]);

  if (!password) return null;

  return (
    <Level3Match3
      requiredPassword={password}
      onComplete={() => router.push("/final")}
    />
  );
}
