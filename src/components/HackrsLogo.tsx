import React from 'react';

interface HackrsLogoProps {
  size?: number;
  rotation?: number;
  className?: string;
}

export default function HackrsLogo({ size = 120, rotation = -12, className = '' }: HackrsLogoProps) {
  return (
    <div
      className={`relative select-none pointer-events-none transition-all duration-300 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6))',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Metallic Silver Gradient */}
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#A3A3A3" />
            <stop offset="50%" stopColor="#D4D4D4" />
            <stop offset="75%" stopColor="#525252" />
            <stop offset="100%" stopColor="#E5E5E5" />
          </linearGradient>

          {/* Dark Brushed Carbon Fiber Gradient */}
          <radialGradient id="darkCarbon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Glossy Overlay */}
          <linearGradient id="glossHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="40.1%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Subtle Grid Pattern for Sticker Texture */}
          <pattern id="stickerGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="none" />
            <circle cx="3" cy="3" r="1" fill="#475569" fillOpacity="0.25" />
          </pattern>
        </defs>

        {/* Outer Silver Bevel Edge */}
        <circle cx="100" cy="100" r="94" fill="url(#silverGradient)" stroke="#1E293B" strokeWidth="1" />

        {/* Outer Rim Dark Border */}
        <circle cx="100" cy="100" r="88" fill="#090D16" />

        {/* Inner Silver Rim */}
        <circle cx="100" cy="100" r="84" fill="none" stroke="url(#silverGradient)" strokeWidth="3" />

        {/* Carbon Textured Center Dial */}
        <circle cx="100" cy="100" r="81" fill="url(#darkCarbon)" />
        <circle cx="100" cy="100" r="81" fill="url(#stickerGrid)" />

        {/* Decorative Dial Ticks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <line
              key={i}
              x1="100"
              y1="24"
              x2="100"
              y2="28"
              transform={`rotate(${angle} 100 100)`}
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          );
        })}

        {/* Minimalist Tech Symbol / Cursor */}
        <path
          d="M100 45 L100 70"
          stroke="#38BDF8"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px #0EA5E9)' }}
        />
        <circle
          cx="100"
          cy="40"
          r="4.5"
          fill="#38BDF8"
          style={{ filter: 'drop-shadow(0 0 4px #0EA5E9)' }}
        />

        {/* "HACKRS" Typography */}
        <text
          x="100"
          y="125"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="4"
          style={{ letterSpacing: '4px' }}
        >
          HACKRS
        </text>

        {/* Mini Subtext */}
        <text
          x="100"
          y="145"
          textAnchor="middle"
          fill="#64748B"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="8"
          letterSpacing="2"
        >
          SECURE PROTOCOL
        </text>

        {/* Circuit Line Accents */}
        <path d="M50 100 H150" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M100 50 V150" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

        {/* Gloss Overlay */}
        <circle cx="100" cy="100" r="81" fill="url(#glossHighlight)" pointerEvents="none" />
      </svg>
    </div>
  );
}
