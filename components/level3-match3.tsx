"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Level3BalloonGameProps {
  requiredPassword: string;
  onComplete: () => void;
}

const TARGET_IMAGES = [
  "/images/Flip1.jpg",
  "/images/Flip2.jpg",
  "/images/Flip3.jpg",
  "/images/Flip4.jpg",
  "/images/Flip5.jpg",
  "/images/Flip6.jpg",
  "/images/Mem1.jpg",
  "/images/Mem2.jpg",
  "/images/Mem3.jpg",
  "/images/Mem4.jpg",
];

const WIN_SCORE = 20;
const BALLOON_SPEED = 1;

type Balloon = {
  id: number;
  img: string;
  top: number;
  left: number;
  popping?: boolean;
  escaping?: boolean;
};

type Shard = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
};

export function Level3Match3({
  requiredPassword,
  onComplete,
}: Level3BalloonGameProps) {
  const createShards = (x: number, y: number) => {
    const pieces: Shard[] = [];

    for (let i = 0; i < 10; i++) {
      pieces.push({
        id: `${Date.now()}-${i}`,
        x,
        y,
        dx: (Math.random() - 0.5) * 120,
        dy: (Math.random() - 0.5) * 120,
        rotate: Math.random() * 360,
      });
    }

    setShards((prev) => [...prev, ...pieces]);

    setTimeout(() => {
      setShards((prev) => prev.slice(pieces.length));
    }, 900);
  };

  /* 🔐 PASSWORD */
  const [hasAccess, setHasAccess] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  /* 📘 RULE BOOK */
  const [showRules, setShowRules] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  /* 🎮 GAME */
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState<string>("");

  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [shards, setShards] = useState<Shard[]>([]);

  const usedTargetsRef = useRef<string[]>([]);

  /* 🔊 SOUNDS */
  const popSound = useRef<HTMLAudioElement | null>(null);
  const airSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const matchSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);
  const Buttonclick = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSound.current = new Audio("/sounds/ballonpop.mp3");
    airSound.current = new Audio("/sounds/ballon_realese.mp3");

    winSound.current = new Audio("/sounds/winning.wav");
    matchSound.current = new Audio("/sounds/match.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");

    Buttonclick.current = new Audio("/sounds/buttonClick.mp3");
    Buttonclick.current.volume = 0.8;
  }, []);

  /* 🎯 INITIAL TARGET */
  useEffect(() => {
    if (target) return;
    const first =
      TARGET_IMAGES[Math.floor(Math.random() * TARGET_IMAGES.length)];
    usedTargetsRef.current.push(first);
    setTarget(first);
  }, [target]);

  /* 🔐 PASSWORD */
  const handlePasswordSubmit = () => {
    if (passwordInput === "4040") {
      matchSound.current?.play().catch(() => {});
      setHasAccess(true);
    } else {
      wrongSound.current?.play().catch(() => {});
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 600);
    }
  };

  /* 🎯 CHANGE TARGET */
  const changeTarget = () => {
    let available = TARGET_IMAGES.filter(
      (img) => !usedTargetsRef.current.includes(img)
    );

    if (available.length === 0) {
      usedTargetsRef.current = [];
      available = [...TARGET_IMAGES];
    }

    const next = available[Math.floor(Math.random() * available.length)];
    usedTargetsRef.current.push(next);
    setTarget(next);
  };

  /* 🎈 RANDOM BALLOONS (AFTER CONTINUE) */
  useEffect(() => {
    if (!hasAccess || !gameStarted) return;

    const spawn = setInterval(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          img: TARGET_IMAGES[Math.floor(Math.random() * TARGET_IMAGES.length)],
          top: -15,
          left: Math.random() * 85,
        },
      ]);
    }, 900);

    return () => clearInterval(spawn);
  }, [hasAccess, gameStarted]);

  /* 🎯 TARGET BALLOON */
  useEffect(() => {
    if (!hasAccess || !gameStarted || !target) return;

    const targetSpawn = setInterval(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          img: target,
          top: -15,
          left: Math.random() * 85,
        },
      ]);
    }, 5000);

    return () => clearInterval(targetSpawn);
  }, [hasAccess, gameStarted, target]);

  /* ⬇ FALL */
  useEffect(() => {
    if (!hasAccess || !gameStarted) return;

    const fall = setInterval(() => {
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, top: b.top + BALLOON_SPEED }))
          .filter((b) => b.top < 110)
      );
    }, 50);

    return () => clearInterval(fall);
  }, [hasAccess, gameStarted]);

  /* 🔫 CLICK */
  const shootBalloon = (b: Balloon, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 🔥 trigger pop animation
    setBalloons((prev) =>
      prev.map((balloon) =>
        balloon.id === b.id ? { ...balloon, popping: true } : balloon
      )
    );

    // 💥 glass shards
    createShards(x, y);

    if (b.img === target) {
      popSound.current?.play();
      setScore((s) => {
        const ns = s + 2;
        if (ns >= WIN_SCORE) {
          winSound.current?.play().catch(() => {});
          setTimeout(onComplete, 900);
        }
        return ns;
      });
      changeTarget();
    } else {
      airSound.current?.play();
    }

    // 🧹 remove balloon AFTER animation
    setTimeout(() => {
      setBalloons((prev) => prev.filter((x) => x.id !== b.id));
    }, 220);
  };

  /* 🔐 PASSWORD SCREEN */
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-950 via-green-950 to-black">
        <div className="w-96 bg-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-6">
          <h2 className="text-4xl font-bold text-white text-center">
            Solve the Code
          </h2>

          <pre className="text-red-200 text-sm bg-black/40 p-4 rounded-xl">
            {`let a = [1, 2, 3];
let b = a.push(4);
let x = a.length * 10;
let y = b * 10;

console.log("" + x + y);`}
          </pre>

          <Input
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="🔢 4-digit code"
            className="text-center bg-white/20 text-white"
          />

          {passwordError && (
            <p className="text-red-300 text-center text-sm">
              ❌ மீண்டும் முயற்சிக்கவும்
            </p>
          )}

          <button
            onClick={handlePasswordSubmit}
            className="w-full bg-linear-to-r from-red-500 to-green-600 py-5 rounded-xl text-white font-bold">
            🔓 நிலை 3-ஐ திறக்கவும்
          </button>
        </div>
      </div>
    );
  }

  /* 📘 RULE BOOK */
  if (showRules) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-950 via-green-950 to-black">
        <div className="max-w-xl bg-white/10 p-10 rounded-3xl space-y-6 text-white">
          <h2 className="text-4xl text-yellow-300 font-bold text-center">
            📘 விளையாட்டு விதிமுறைகள்
          </h2>

          <ul className="space-y-4 text-lg">
            <li>🎯 மேலே காட்டப்படும் படத்தை கவனிக்கவும்</li>
            <li>🎈 அதே படமுள்ள பலூனை மட்டும் உடைக்கவும்</li>
            <li>❌ தவறான பலூன் — மதிப்பெண் கிடையாது</li>
            <li>🏆 20 மதிப்பெண் பெற்றால் வெற்றி</li>
          </ul>

          <div className="text-center pt-6">
            <Button
              onClick={() => {
                Buttonclick.current?.play().catch(() => {});
                setShowRules(false);
                setGameStarted(true); // ✅ BALLOONS START FALLING
              }}
              className="bg-linear-to-r from-green-600 to-red-600 hover:from-green-500 hover:to-red-500 text-white font-bold text-lg px-10 py-6 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-lg">
              🎮 விளையாட்டை தொடங்கு
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* 🎮 GAME UI */
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-red-950 via-green-950 to-black">
      <p className="text-center text-yellow-300 mt-4">
        Score: {score} / {WIN_SCORE}
      </p>

      {/* 🎯 TARGET */}
      <div className="flex justify-center my-6">
        <div className="bg-black/40 p-4 rounded-xl border-4 border-yellow-400">
          {target && <img src={target} className="w-32 h-32 object-contain" />}
        </div>
      </div>

      {/* 🎈 BALLOONS */}
      {balloons.map((b) => (
        <button
          key={b.id}
          onClick={(e) => shootBalloon(b, e)}
          className={`absolute transition-transform duration-300
          ${b.popping ? "balloon-pop" : ""}
          ${b.escaping ? "balloon-escape" : "hover:scale-110"}
        `}
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            animation: "float 4s ease-in-out infinite",
          }}>
          <div className="glass-balloon">
            <img src={b.img} draggable={false} />
          </div>
        </button>
      ))}

      {/* 💥 GLASS SHARDS */}
      {shards.map((s) => (
        <span
          key={s.id}
          className="glass-shard"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            transform: `translate(${s.dx}px, ${s.dy}px) rotate(${s.rotate}deg)`,
          }}
        />
      ))}

      {/* 🎨 INLINE ANIMATIONS */}
      <style jsx>{`
        .glass-balloon {
          width: 120px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0.15),
            rgba(0, 0, 0, 0.25)
          );
          backdrop-filter: blur(6px);
          box-shadow: inset -6px -10px 20px rgba(0, 0, 0, 0.35),
            0 12px 30px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .glass-balloon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
        }

        /* 💥 POP */
        .balloon-pop {
          animation: pop 0.22s ease-out forwards;
        }

        @keyframes pop {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.3);
          }
          70% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        /* 🏃 RELEASE / ESCAPE */
        .balloon-escape {
          animation: escape 0.6s ease-in forwards;
        }

        @keyframes escape {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          40% {
            transform: scale(0.95) rotate(5deg);
          }
          100% {
            transform: translateY(-180px) rotate(25deg) scale(0.8);
            opacity: 0;
          }
        }

        /* ✨ GLASS SHARDS */
        .glass-shard {
          position: fixed;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 2px;
          pointer-events: none;
          animation: shard-fade 0.9s forwards;
        }

        @keyframes shard-fade {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translateY(25px);
          }
        }
      `}</style>
    </div>
  );
}
