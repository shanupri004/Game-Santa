"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface EntryPassScreenProps {
  onSuccess: () => void;
}

export function EntryPassScreen({ onSuccess }: EntryPassScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const CORRECT_CODE = "771997"; // Mock entry code

  const flipSound = useRef<HTMLAudioElement | null>(null);
  const matchSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);
  const winningSound = useRef<HTMLAudioElement | null>(null);
  const Button = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    flipSound.current = new Audio("/sounds/flip.mp3");
    flipSound.current.volume = 0.4;

    matchSound.current = new Audio("/sounds/match.mp3");
    matchSound.current.volume = 0.6;

    wrongSound.current = new Audio("/sounds/wrong.mp3");
    wrongSound.current.volume = 0.6;

    winningSound.current = new Audio("/sounds/winning.wav");
    winningSound.current.volume = 0.6;

    Button.current = new Audio("/sounds/buttonClick.mp3");
    Button.current.volume = 0.6;
  }, []);

  const handleSubmit = () => {
    if (code === CORRECT_CODE) {
      matchSound.current?.play().catch(() => {});
      setError(false);
      onSuccess();
    } else {
      wrongSound.current?.play().catch(() => {});
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white animate-glow text-balance">
            🎅 ரகசிய பரிசு பயணம் 🎄
          </h1>
          <p className="text-xl text-red-200 animate-pulse-slow text-pretty">
            பயணத்தின் முடிவில் உங்களுக்கு ஒரு இனிய ஆச்சரியம் ✨
          </p>
        </div>

        <div
          className={`bg-white/10 backdrop-blur-lg p-8 rounded-2xl border-2 border-red-300/30 shadow-2xl transform transition-all duration-300 ${
            error ? "animate-shake" : ""
          }`}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-white font-medium text-lg">
                இது உங்களைப் பற்றிய ஒரு சிறிய ரகசியம்… <br />
                உங்களுக்கே உரித்தான ஒன்று. நீங்கள் முதன்முறையாக இந்த உலகத்தை
                கண்ட அந்த நாளை எண்ணாகக் கூறினால், கதவு மெதுவாக திறக்கும்.
              </label>{" "}
              <br />
              <br />
              <Input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="****"
                className="text-center text-2xl tracking-widest bg-white/20 border-red-300/50 text-white placeholder:text-red-200/50 focus:ring-2 focus:ring-red-400 focus:scale-105 transition-all"
              />
              {error && (
                <p className="text-red-300 text-sm text-center animate-fade-in">
                  ❌ கதவு இன்னும் திறக்கப்படவில்லை… மீண்டும் முயற்சிக்கவும்
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-linear-to-r from-red-500 to-green-600 hover:from-red-500 hover:to-green-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-red-500/50">
              🎁 மாயப் பயணத்தில் நுழையுங்கள்
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
