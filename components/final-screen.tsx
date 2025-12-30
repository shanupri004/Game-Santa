"use client";
import { useRef, useEffect } from "react";

export function FinalScreen() {
  const winnigSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    winnigSound.current = new Audio("/sounds/winning-celebration.mp3");
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-red-950 via-green-950 to-black">
      <div className="w-full max-w-3xl space-y-8 animate-scale-in">
        <div className="bg-linear-to-br from-red-600/20 via-green-600/20 to-yellow-600/20 backdrop-blur-lg p-12 md:p-16 rounded-3xl border-4 border-yellow-400/50 shadow-2xl text-center space-y-8">
          <div className="text-8xl animate-bounce-slow">🎁</div>

          <h1 className="text-5xl md:text-6xl font-bold text-white animate-glow text-balance">
            வாழ்த்துகள்! 🎉
          </h1>

          <div className="space-y-4 text-lg md:text-xl text-red-100 text-pretty">
            <p className="animate-fade-in">
              நீங்கள் இந்த சிறிய ரகசியப் பயணத்தை அழகாக முடித்திருக்கிறீர்கள்…
            </p>

            <p className="animate-fade-in" style={{ animationDelay: "600ms" }}>
              இந்த ஆண்டு, வெற்றி உங்கள் பாதையைத் திறக்கட்டும், மகிழ்ச்சி உங்கள்
              நிழலாக தொடரட்டும், அனைத்து தடைகளும் அகன்றுபோகட்டும் ✨
            </p>
          </div>

          <div className="my-8 h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent animate-pulse-slow" />

          <div className="space-y-4 text-xl md:text-2xl font-semibold text-yellow-300 text-pretty">
            <p className="animate-fade-in" style={{ animationDelay: "900ms" }}>
              புத்தாண்டு நல்வாழ்த்துகள் அண்ணா 🌸 மகிழ்ச்சியும், அமைதியும்,
            </p>
            <p className="animate-fade-in" style={{ animationDelay: "1200ms" }}>
              வெற்றியும் நிறைந்த ஆண்டு ஆகட்டும் 🥂✨
            </p>
          </div>

          <div className="pt-8 text-red-200 text-lg animate-pulse-slow">
            யானை முகம் கொண்ட தெய்வத்தின் பெயரை சுமக்கும் நபரிடம், உங்கள் பரிசு
            உங்களை எதிர்பார்க்கிறது.
          </div>
        </div>
      </div>
    </div>
  );
}
