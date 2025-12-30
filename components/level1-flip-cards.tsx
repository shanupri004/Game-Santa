"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Level1FlipCardsProps {
  onComplete: (password: string) => void;
}

const CARDS = [
  { id: 1, image: "/images/Flip1.jpg", pairId: 1 },
  { id: 2, image: "/images/Flip1.jpg", pairId: 1 },
  { id: 3, image: "/images/Flip2.jpg", pairId: 2 },
  { id: 4, image: "/images/Flip2.jpg", pairId: 2 },
  { id: 5, image: "/images/Flip3.jpg", pairId: 3 },
  { id: 6, image: "/images/Flip3.jpg", pairId: 3 },
  { id: 7, image: "/images/Flip4.jpg", pairId: 4 },
  { id: 8, image: "/images/Flip4.jpg", pairId: 4 },
  { id: 9, image: "/images/Flip5.jpg", pairId: 5 },
  { id: 10, image: "/images/Flip5.jpg", pairId: 5 },
  { id: 11, image: "/images/Flip6.jpg", pairId: 6 },
  { id: 12, image: "/images/Flip6.jpg", pairId: 6 },
];



function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Level1FlipCards({ onComplete }: Level1FlipCardsProps) {
  const [showRules, setShowRules] = useState(true);
  const [cards] = useState(() => shuffleArray(CARDS));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔊 sounds
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const matchSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);
  const winningSound = useRef<HTMLAudioElement | null>(null);
  const Buttonclick = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    flipSound.current = new Audio("/sounds/flip.mp3");
    flipSound.current.volume = 0.4;

    matchSound.current = new Audio("/sounds/match.mp3");
    matchSound.current.volume = 0.6;

    wrongSound.current = new Audio("/sounds/wrong.mp3");
    wrongSound.current.volume = 0.6;

    winningSound.current = new Audio("/sounds/winning.wav");
    winningSound.current.volume = 0.6;

    Buttonclick.current = new Audio("/sounds/buttonClick.mp3");
    Buttonclick.current.volume = 0.6;
  }, []);

  const handleFlip = (id: number) => {
    if (isChecking || flipped.includes(id) || matched.includes(id)) return;

    flipSound.current?.play().catch(() => {});
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);

      const [a, b] = newFlipped;
      const cardA = cards.find((c) => c.id === a);
      const cardB = cards.find((c) => c.id === b);

      if (cardA?.pairId === cardB?.pairId) {
        setTimeout(() => {
          matchSound.current?.play().catch(() => {});
          setMatched((prev) => [...prev, a, b]);
          setFlipped([]);
          setIsChecking(false);
        }, 600);
      } else {
        setTimeout(() => {
          wrongSound.current?.play().catch(() => {});
          setFlipped([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length) {
      winningSound.current?.play().catch(() => {});
      setTimeout(() => setShowSuccess(true), 500);
    }
  }, [matched, cards.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-red-950 via-green-950 to-black">
      <div className="w-full max-w-4xl space-y-10">
        {/* 📜 RULE BOOK */}
        {showRules ? (
          <div className="text-center space-y-8 bg-black/50 backdrop-blur-md p-10 rounded-3xl border border-red-500/40 shadow-2xl">
            <div className="text-6xl">📜</div>

            <h2 className="text-4xl font-bold text-red-400 tracking-wide">
              Level 1 – விளையாட்டு விதிமுறைகள்
            </h2>

            <ul className="text-left max-w-xl mx-auto space-y-4 text-green-200 text-lg">
              <li>🎴 ஒரே நேரத்தில் 2 அட்டைகள் மட்டும் திறக்கலாம்</li>
              <li>🔍 ஒரே படத்தை கொண்ட ஜோடியை கண்டுபிடிக்கவும்</li>
              <li>❌ தவறான ஜோடி மீண்டும் மூடப்படும்</li>
              <li>✅ சரியான ஜோடி நிரந்தரமாக திறந்திருக்கும்</li>
            </ul>

            <button
              onClick={() => {
                Buttonclick.current?.play().catch(() => {});
                setShowRules(false);
              }}
              className="bg-linear-to-r from-red-600 to-green-600 hover:opacity-90 text-white text-lg px-10 py-6 rounded-xl shadow-lg">
              🎮 விளையாட்டை தொடங்கு
            </button>
          </div>
        ) : !showSuccess ? (
          <>
            {/* HEADER */}
            <div className="text-center space-y-3">
              <div className="text-xl font-semibold text-yellow-300">
                ✨ இதுவரை நீங்கள் வெற்றிகரமாக பொருத்திய ஜோடிகள்:{" "}
                {matched.length / 2} / {cards.length / 2}
              </div>
            </div>

            {/* GAME GRID */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {cards.map((card) => {
                const isFlipped =
                  flipped.includes(card.id) || matched.includes(card.id);

                return (
                  <div
                    key={card.id}
                    onClick={() => handleFlip(card.id)}
                    className={`relative aspect-square cursor-pointer rounded-2xl transform-style-3d transition-transform duration-700 shadow-2xl ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}>
                    {/* BACK */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl bg-linear-to-br from-red-700 to-green-700 flex items-center justify-center text-4xl shadow-inner">
                      🎄
                    </div>

                    {/* FRONT */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-4 border-green-400/60">
                      <img
                        src={card.image}
                        className="w-full h-full object-cover"
                      />
                      {matched.includes(card.id) && (
                        <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center text-5xl text-white">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* 🎉 SUCCESS */
          <div className="text-center space-y-6 bg-black/40 backdrop-blur-md p-10 rounded-3xl border-2 border-green-500/50 shadow-2xl">
            <div className="text-6xl">🎉</div>

            <div className="text-3xl font-bold text-green-400">
              Level 2-க்கு செல்ல
            </div>

            <button
              onClick={() => {
                Buttonclick.current?.play().catch(() => {});
                onComplete("592024");
              }}
              className="bg-linear-to-r from-red-600 to-green-600 hover:opacity-90 text-white text-lg px-8 py-6 rounded-xl shadow-lg">
              👉 தொடரவும்
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
