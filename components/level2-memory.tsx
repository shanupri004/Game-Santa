"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Level2MemoryProps {
  requiredPassword: string;
  onComplete: (password: string) => void;
}

const ROUNDS = [
  {
    round: 1,
    images: ["/images/Mem1.jpg", "/images/Mem2.jpg", "/images/Mem3.jpg"],
  },
  {
    round: 2,
    images: [
      "/images/Mem4.jpg",
      "/images/Mem5.jpg",
      "/images/Mem6.jpg",
      "/images/Mem7.jpg",
    ],
  },
  {
    round: 3,
    images: [
      "/images/Flip1.jpg",
      "/images/Flip2.jpg",
      "/images/Flip3.jpg",
      "/images/Flip4.jpg",
      "/images/Flip5.jpg",
    ],
  },
];

const NEXT_PLACE_NAME = "4040";

export function Level2Memory({
  requiredPassword,
  onComplete,
}: Level2MemoryProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showImages, setShowImages] = useState(true);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [roundComplete, setRoundComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  // ✅ NEW STATE (LOGIC ONLY)
  const [gameStarted, setGameStarted] = useState(false);

  const currentImages = ROUNDS[currentRound]?.images || [];

  const flipSound = useRef<HTMLAudioElement | null>(null);
  const matchSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);
  const winnigSound = useRef<HTMLAudioElement | null>(null);
  const Buttonclick = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    flipSound.current = new Audio("/sounds/flip.mp3");
    flipSound.current.volume = 0.4;

    matchSound.current = new Audio("/sounds/match.mp3");
    matchSound.current.volume = 0.6;

    wrongSound.current = new Audio("/sounds/wrong.mp3");
    wrongSound.current.volume = 0.6;

    winnigSound.current = new Audio("/sounds/winning.wav");
    winnigSound.current.volume = 0.6;

    Buttonclick.current = new Audio("/sounds/buttonClick.mp3");
    Buttonclick.current.volume = 0.8;
    Buttonclick.current.preload = "auto";
  }, []);

  useEffect(() => {
    if (hasAccess && showImages) {
      setShuffledImages(currentImages);
    }
  }, [hasAccess, currentRound, showImages]);

  // ✅ TIMER STARTS ONLY AFTER RULES CONTINUE CLICK
  useEffect(() => {
    if (!hasAccess || !showImages || roundComplete || !gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowImages(false);
          const shuffled = [...currentImages].sort(() => Math.random() - 0.5);
          setShuffledImages(shuffled);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasAccess, showImages, roundComplete, gameStarted, currentImages]);

  const handlePasswordSubmit = () => {
    if (passwordInput.toLowerCase() === requiredPassword.toLowerCase()) {
      matchSound.current?.play().catch(() => {});
      setHasAccess(true);
      setShowRules(true);
      setPasswordError(false);
    } else {
      wrongSound.current?.play().catch(() => {});
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 600);
    }
  };

  const handleImageClick = (shuffledIndex: number) => {
    if (showImages) return;

    if (userOrder.includes(shuffledIndex)) {
      flipSound.current?.play().catch(() => {});
      setUserOrder(userOrder.filter((i) => i !== shuffledIndex));
      return;
    }

    flipSound.current?.play().catch(() => {});
    setUserOrder([...userOrder, shuffledIndex]);
  };

  const handleSubmitOrder = () => {
    const userSelectedImages = userOrder.map((index) => shuffledImages[index]);

    const isCorrect =
      JSON.stringify(userSelectedImages) === JSON.stringify(currentImages);

    if (isCorrect) {
      matchSound.current?.play().catch(() => {});
      setRoundComplete(true);
      setError("");

      setTimeout(() => {
        if (currentRound < ROUNDS.length - 1) {
          setCurrentRound(currentRound + 1);
          setTimeLeft(10);
          setShowImages(true);
          setUserOrder([]);
          setRoundComplete(false);
          setGameStarted(true); // 🔥 restart timer
        } else {
          setAllComplete(true);
        }
      }, 2000);
    } else {
      wrongSound.current?.play().catch(() => {});
      setError("❌");
      setUserOrder([]);
      setTimeout(() => setError(""), 2000);
    }
  };

  useEffect(() => {
    if (allComplete) {
      winnigSound.current?.play().catch(() => {});
    }
  }, [allComplete]);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-red-950 via-green-950 to-black">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div
            className={`bg-white/10 backdrop-blur-lg p-8 rounded-2xl border-2 border-red-300/30 shadow-2xl ${
              passwordError ? "animate-shake" : ""
            }`}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-white animate-glow">
                  ஒரு கனவு யோசனையாகப் பிறந்த நாள்…
                </h2>{" "}
                <br />
                <br />
                <p className="text-red-200">
                  நீங்கள் ஊழியன் மட்டுமல்ல, உங்கள் எண்ணங்களின் உரிமையாளர்
                  என்றும் உங்கள் பாதையை நீங்களே உருவாக்க முடியும் என்றும்
                  முதன்முதலில் உணர்ந்த அந்த நாளை நினைவுகூருங்கள்…
                </p>
                <Input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  placeholder="*********"
                  className="text-center bg-white/20 border-red-300/50 text-white placeholder:text-red-200/50 focus:ring-2 focus:ring-red-400 focus:scale-105 transition-all"
                />
                {passwordError && (
                  <p className="text-red-300 text-sm text-center animate-fade-in">
                    ❌ கதவு இன்னும் திறக்கப்படவில்லை… மீண்டும் முயற்சிக்கவும்
                  </p>
                )}
              </div>

              <button
                onClick={handlePasswordSubmit}
                className="w-full bg-linear-to-r from-red-500 to-green-600 hover:from-red-500 hover:to-green-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-red-500/50">
                🔐 நிலை 2-ஐ திறக்கவும்
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showRules) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-red-950 via-green-950 to-black">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg p-10 rounded-2xl border-2 border-yellow-400/40 shadow-2xl animate-scale-in space-y-6">
          <h2 className="text-4xl font-bold text-yellow-300 text-center animate-glow">
            📘 Level 2 – விளையாட்டு விதிமுறைகள்
          </h2>

          <ul className="space-y-4 text-white text-lg leading-relaxed">
            <li>
              🧠 <b>முதலில்</b> படங்களின் வரிசையை கவனமாக நினைவில்
              வைத்துக்கொள்ளுங்கள்.
            </li>
            <li>⏱️ நேரம் முடிந்ததும், படங்கள் கலக்கப்படும்.</li>
            <li>🖱️ சரியான வரிசையில் படங்களை கிளிக் செய்ய வேண்டும்.</li>
            <li>❌ தவறான வரிசை — மீண்டும் முயற்சி.</li>
            <li>
              ✅ மூன்று சுற்றங்களையும் வென்றால் அடுத்த நிலைக்கான ரகசியம்
              கிடைக்கும்.
            </li>
          </ul>

          <div className="text-center pt-6">
            <Button
              onClick={() => {
                Buttonclick.current?.play().catch(() => {});
                setShowRules(false);
                setGameStarted(true); // ✅ TIMER STARTS HERE
                setTimeLeft(10);
                setShowImages(true);
              }}
              className="bg-linear-to-r from-green-600 to-red-600 hover:from-green-500 hover:to-red-500 text-white font-bold text-lg px-10 py-6 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-lg">
              🎮 விளையாட்டை தொடங்கு
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (allComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-red-950 via-green-950 to-black">
        <div className="w-full max-w-2xl space-y-8 animate-scale-in">
          <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl border-2 border-yellow-400/50 shadow-2xl text-center space-y-6">
            <div className="text-6xl animate-bounce-slow">🎊</div>
            <h3 className="text-3xl font-bold text-yellow-300 animate-glow">
              Level 3-க்கு செல்ல
            </h3>

            <Button
              onClick={() => {
                Buttonclick.current?.play().catch(() => {});
                onComplete(NEXT_PLACE_NAME);
              }}
              className="mt-4 bg-linear-to-r from-yellow-500 to-red-500 hover:from-yellow-400 hover:to-red-400 text-white font-bold text-lg px-8 py-6 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-lg">
              👉 தொடரவும்
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-red-950 via-green-950 to-black">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        <div className="text-center space-y-2"></div>

        {showImages && (
          <div className="text-center">
            <div className="inline-block bg-yellow-500/20 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-yellow-400/50 animate-pulse-slow">
              <div className="text-5xl font-bold text-yellow-300">
                {timeLeft}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {(showImages ? currentImages : shuffledImages).map((image, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className={`relative aspect-square rounded-xl overflow-hidden border-4 transform transition-all duration-500 ${
                showImages
                  ? "border-yellow-400/50 shadow-lg shadow-yellow-500/20 animate-scale-in"
                  : userOrder.includes(index)
                  ? "border-green-400 shadow-lg shadow-green-500/50 scale-95"
                  : "border-red-300/30 hover:border-red-400 hover:scale-105 cursor-pointer"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}>
              <img
                src={image || "/placeholder.svg"}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {userOrder.includes(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 backdrop-blur-sm">
                  <div className="text-6xl font-bold text-white animate-scale-in">
                    {userOrder.indexOf(index) + 1}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showImages && !roundComplete && (
          <div className="text-center space-y-4">
            {error && (
              <p className="text-red-300 font-semibold animate-shake">
                {error}
              </p>
            )}
            {userOrder.length === currentImages.length && (
              <Button
                onClick={handleSubmitOrder}
                className="bg-linear-to-r from-green-600 to-red-600 hover:from-green-500 hover:to-red-600 text-white font-bold text-lg px-12 py-6 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-lg animate-pulse-slow">
                ✓ Submit Order
              </Button>
            )}
          </div>
        )}

        {roundComplete && (
          <div className="text-center space-y-4 animate-scale-in">
            <div className="text-5xl animate-bounce-slow">✅</div>
          </div>
        )}
      </div>
    </div>
  );
}
