'use client';

type Props = React.SVGProps<SVGSVGElement>;

/**
 * LogoScentsMark — Scents & Suites perfume droplet
 * Enhanced for luxury identity:
 * - Dual-layer gold gradient for natural light diffusion
 * - Whisper-slow shimmer sweep every 8s
 * - Gentle breathing pulse tied to loader’s curve
 * - Subtle white edge halo for depth
 */
export default function LogoScentsMark(props: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Scents & Suites Mark"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`drop-pulse ${props.className || ''}`}
    >
      <defs>
        {/* Base gold gradient */}
        <radialGradient id="baseGold" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFE6A3" />
          <stop offset="45%" stopColor="#D6B678" />
          <stop offset="100%" stopColor="#4C1F26" />
        </radialGradient>

        {/* Soft shimmer highlight */}
        <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.9)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Blend shimmer mask */}
        <mask id="sweepMask">
          <rect width="64" height="64" fill="url(#sweep)" />
        </mask>
      </defs>

      {/* Depth shadow */}
      <path
        d="M32 2C26 12 16 24 16 36c0 8.8 7.2 16 16 16s16-7.2 16-16c0-12-10-24-16-34Z"
        fill="#000"
        opacity="0.18"
      />

      {/* Primary gold droplet */}
      <g mask="url(#sweepMask)">
        <path
          d="M32 2C26 12 16 24 16 36c0 8.8 7.2 16 16 16s16-7.2 16-16c0-12-10-24-16-34Z"
          fill="url(#baseGold)"
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </g>

      {/* Inner halo rim for light depth */}
      <path
        d="M32 2C26 12 16 24 16 36c0 8.8 7.2 16 16 16s16-7.2 16-16c0-12-10-24-16-34Z"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
      />

      <style jsx>{`
        /* Gentle breathing pulse, synced to loader easing */
        @keyframes pulseSoft {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 6px rgba(184,155,89,0.45))
                    drop-shadow(0 0 12px rgba(214,182,120,0.3));
          }
          50% {
            transform: scale(1.035);
            filter: drop-shadow(0 0 12px rgba(214,182,120,0.7))
                    drop-shadow(0 0 22px rgba(184,155,89,0.4));
          }
        }
        .drop-pulse {
          animation: pulseSoft 5.5s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
          transition: filter 0.8s ease;
        }
        .drop-pulse:hover {
          filter: drop-shadow(0 0 16px rgba(214,182,120,0.8))
                  drop-shadow(0 0 28px rgba(184,155,89,0.5));
        }
      `}</style>
    </svg>
  );
}
