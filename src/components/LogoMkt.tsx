'use client';

type Props = React.SVGProps<SVGSVGElement>;

/**
 * LogoScents — full Scents & Suites wordmark (refined for brand harmony)
 * Matches updated Loader + LogoMark styling:
 * - Dual-depth gold gradient (radial + linear blend)
 * - Slow shimmer highlight (~8s cycle)
 * - Soft breathing motion on droplet
 * - Warm halo glow for quiet depth
 * - Elegant text fade-in synced to easing curve
 */
export default function LogoScents(props: Props) {
  return (
    <svg
      viewBox="0 0 380 64"
      role="img"
      aria-label="Scents & Suites Logo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`logo-fade ${props.className || ''}`}
    >
      <defs>
        {/* Base gold gradient for both droplet + text */}
        <radialGradient id="baseGold" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFE6A3" />
          <stop offset="45%" stopColor="#D6B678" />
          <stop offset="100%" stopColor="#4C1F26" />
        </radialGradient>

        {/* Moving shimmer highlight */}
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.9)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <mask id="shineMask">
          <rect width="380" height="64" fill="url(#shine)" />
        </mask>
      </defs>

      {/* Droplet mark (now same timing as standalone mark) */}
      <g transform="translate(38,32)" className="float drop-glow">
        <path
          d="M0 -30 C-6 -20 -16 -8 -16 4c0 8.8 7.2 16 16 16s16-7.2 16-16c0-12 -10-24 -16-34Z"
          fill="url(#baseGold)"
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M0 -30 C-6 -20 -16 -8 -16 4c0 8.8 7.2 16 16 16s16-7.2 16-16c0-12 -10-24 -16-34Z"
          fill="url(#shine)"
          mask="url(#shineMask)"
          opacity="0.6"
        />
      </g>

      {/* Wordmark */}
      <text
        x="90"
        y="42"
        fill="url(#baseGold)"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight="600"
        fontSize="26"
        letterSpacing="5"
        className="tracking-text"
      >
        SCENTS & SUITES
      </text>

      <style jsx>{`
        /* Breathing float motion (matches LogoMark + Loader) */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .float {
          animation: float 5.5s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        /* Subtle golden glow halo */
        .drop-glow {
          filter: drop-shadow(0 0 10px rgba(184,155,89,0.45))
                  drop-shadow(0 0 20px rgba(214,182,120,0.25));
          transition: filter 0.8s ease;
        }
        .drop-glow:hover {
          filter: drop-shadow(0 0 16px rgba(214,182,120,0.8))
                  drop-shadow(0 0 28px rgba(184,155,89,0.5));
        }

        /* Wordmark reveal with elegant tracking ease */
        @keyframes textReveal {
          0% {
            opacity: 0;
            letter-spacing: 0.6em;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.25em;
            transform: translateY(0);
          }
        }
        .tracking-text {
          animation: textReveal 1.8s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }

        /* Whole logo fade-in on mount */
        @keyframes fadeInLogo {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .logo-fade {
          animation: fadeInLogo 1s ease-in forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </svg>
  );
}
