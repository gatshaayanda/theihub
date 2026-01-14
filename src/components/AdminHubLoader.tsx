// src/components/AdminHubLoader.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminHubLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 900);
    const hide = setTimeout(() => setVisible(false), 1400);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading iHub"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-[500ms] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(37,99,235,0.35), rgba(11,15,25,1) 55%, rgba(7,10,18,1) 100%)",
        backgroundSize: "200% 200%",
        animation: "bgFlow 7s cubic-bezier(0.45,0,0.25,1) infinite",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Orb + Circuit Ring */}
      <div className="relative h-28 w-28 mb-6">
        {/* Soft reflection */}
        <div className="absolute inset-0 opacity-20 blur-md scale-y-[-1] translate-y-10">
          <svg viewBox="0 0 64 64" className="h-full w-full">
            <circle cx="32" cy="32" r="18" fill="var(--brand-primary)" />
          </svg>
        </div>

        {/* Main emblem */}
        <svg
          viewBox="0 0 64 64"
          width="112"
          height="112"
          className="animate-float drop-glow"
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9">
                <animate
                  attributeName="offset"
                  values="0;0.35;0"
                  dur="6.5s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="70%" stopColor="#2563eb" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0b1220" stopOpacity="1" />
            </radialGradient>

            <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Outer ring */}
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="url(#ring)"
            strokeWidth="2"
            strokeDasharray="7 5"
            className="spin-slow"
          />

          {/* Inner orb */}
          <circle cx="32" cy="32" r="16" fill="url(#hubGlow)" />

          {/* Tiny “circuit” nodes */}
          <circle cx="12" cy="24" r="2" fill="#60a5fa" opacity="0.9" />
          <circle cx="52" cy="18" r="2" fill="#a855f7" opacity="0.9" />
          <circle cx="54" cy="46" r="2" fill="#34d399" opacity="0.9" />
          <circle cx="16" cy="50" r="2" fill="#60a5fa" opacity="0.9" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="text-[--foreground] tracking-tight text-[1.6rem] font-extrabold fade-in-text">
        iHub
      </div>

      {/* Tagline */}
      <div className="text-sm mt-2 text-[--muted] tracking-wide fade-in-delayed">
        Tech • Gadgets • Phones • Laptops
      </div>

      {/* Progress shimmer bar */}
      <div
        className="w-52 h-1.5 bg-white/10 overflow-hidden rounded-full mt-8"
        aria-hidden="true"
      >
        <span
          className="block h-full w-1/3 shimmer"
          style={{
            background:
              "linear-gradient(90deg, rgba(96,165,250,0.9), rgba(168,85,247,0.9), rgba(52,211,153,0.9))",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(30%);
          }
          100% {
            transform: translateX(150%);
          }
        }
        .shimmer {
          animation: shimmer 1.9s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float {
          animation: float 4.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .spin-slow {
          transform-origin: 32px 32px;
          animation: spin 7.5s linear infinite;
        }

        @keyframes bgFlow {
          0%,
          100% {
            background-position: 50% 50%;
          }
          50% {
            background-position: 60% 58%;
          }
        }

        .drop-glow {
          filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.28))
            drop-shadow(0 0 18px rgba(168, 85, 247, 0.18))
            drop-shadow(0 0 22px rgba(52, 211, 153, 0.12));
          transition: filter 1s ease;
        }

        @keyframes fadeInText {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-text {
          opacity: 0;
          animation: fadeInText 0.7s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }
        .fade-in-delayed {
          opacity: 0;
          animation: fadeInText 0.7s cubic-bezier(0.45, 0, 0.25, 1) 0.2s
            forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
