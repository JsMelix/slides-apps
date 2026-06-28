import React from 'react';
import { Slide, EditorSettings } from '../types';
import NeonIcon from './NeonIcon';
import HackrsLogo from './HackrsLogo';

interface SlideCardProps {
  slide: Slide;
  settings: EditorSettings;
  className?: string;
  id?: string;
}

export default function SlideCard({ slide, settings, className = '', id }: SlideCardProps) {
  const { aspectRatio, showGridLines, showStarryDots, showSticker, stickerRotation, stickerSize } = settings;

  // Determine size based on aspect ratio
  let widthClass = 'w-[600px]';
  let heightClass = 'h-[600px]';

  if (aspectRatio === '16:9') {
    widthClass = 'w-[960px]';
    heightClass = 'h-[540px]';
  } else if (aspectRatio === '4:5') {
    widthClass = 'w-[540px]';
    heightClass = 'h-[675px]';
  }

  // Accent styles mapping
  const accentStyles: Record<string, {
    glow: string;
    text: string;
    border: string;
    bg: string;
    accent: string;
    badge: string;
  }> = {
    cyan: {
      glow: 'shadow-[0_0_50px_rgba(34,211,238,0.15)]',
      text: 'text-cyan-300',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-500/5',
      accent: '#22d3ee',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    emerald: {
      glow: 'shadow-[0_0_50px_rgba(52,211,153,0.15)]',
      text: 'text-emerald-300',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/5',
      accent: '#34d399',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    purple: {
      glow: 'shadow-[0_0_50px_rgba(192,132,252,0.15)]',
      text: 'text-purple-300',
      border: 'border-purple-500/20',
      bg: 'bg-purple-500/5',
      accent: '#c084fc',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    amber: {
      glow: 'shadow-[0_0_50px_rgba(251,191,36,0.15)]',
      text: 'text-amber-300',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/5',
      accent: '#fbbf24',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    crimson: {
      glow: 'shadow-[0_0_50px_rgba(248,113,113,0.15)]',
      text: 'text-red-300',
      border: 'border-red-500/20',
      bg: 'bg-red-500/5',
      accent: '#f87171',
      badge: 'bg-red-500/10 text-red-400 border-red-500/20'
    }
  };

  const activeAccent = accentStyles[slide.accentColor || 'cyan'];

  return (
    <div
      id={id}
      className={`relative shrink-0 flex flex-col justify-between overflow-hidden bg-[#050811] border-2 border-slate-800/80 rounded-3xl p-10 select-none text-slate-100 ${widthClass} ${heightClass} ${activeAccent.glow} ${className}`}
      style={{
        boxShadow: settings.glowIntensity === 'high' 
          ? `0 0 60px -10px ${activeAccent.accent}20, inset 0 0 30px ${activeAccent.accent}03`
          : settings.glowIntensity === 'medium'
          ? `0 0 30px -10px ${activeAccent.accent}12, inset 0 0 15px ${activeAccent.accent}01`
          : 'none',
      }}
    >
      {/* Dynamic Grid Background Overlay */}
      {showGridLines && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-color-dodge">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Cyber Circuit Lines & Starry Nodes (like attached image background) */}
      {showStarryDots && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.14] overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Glowing connection lines */}
            <line x1="10%" y1="18%" x2="40%" y2="18%" stroke={activeAccent.accent} strokeWidth="1" strokeDasharray="5,5" />
            <line x1="40%" y1="18%" x2="50%" y2="40%" stroke={activeAccent.accent} strokeWidth="1" />
            <line x1="50%" y1="40%" x2="85%" y2="40%" stroke="#c084fc" strokeWidth="1.2" />
            <line x1="85%" y1="40%" x2="90%" y2="70%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3" />

            <line x1="15%" y1="82%" x2="30%" y2="65%" stroke="#10b981" strokeWidth="1" />
            <line x1="30%" y1="65%" x2="60%" y2="85%" stroke="#3b82f6" strokeWidth="1" />

            {/* Glowing tech dots */}
            <circle cx="10%" cy="18%" r="3.5" fill={activeAccent.accent} className="animate-pulse" />
            <circle cx="40%" cy="18%" r="2.5" fill={activeAccent.accent} />
            <circle cx="50%" cy="40%" r="4" fill="#c084fc" />
            <circle cx="85%" cy="40%" r="2.5" fill="#c084fc" />
            <circle cx="90%" cy="70%" r="3.5" fill="#22d3ee" className="animate-pulse" />
            <circle cx="15%" cy="82%" r="3" fill="#10b981" />
            <circle cx="30%" cy="65%" r="4" fill="#3b82f6" />
            <circle cx="60%" cy="85%" r="2.5" fill="#f59e0b" />
          </svg>
        </div>
      )}

      {/* Corner Technical Labels */}
      <div className="absolute top-4 left-6 flex items-center space-x-2 text-[9px] font-mono tracking-widest text-slate-500 uppercase select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
        <span>HACKRS STUDIO // MULTIPAGE SLIDES</span>
      </div>
      <div className="absolute top-4 right-6 text-[9px] font-mono tracking-widest text-slate-500 uppercase select-none pointer-events-none">
        <span>X402_SPEC_REV_1.2</span>
      </div>

      <div className="absolute bottom-4 left-6 text-[9px] font-mono tracking-widest text-slate-600 uppercase select-none pointer-events-none">
        <span>SLIDE {slide.id.length < 2 ? `0${slide.id}` : slide.id} // DECK_v1.2</span>
      </div>

      {/* Slide Content Layout */}
      <div className="relative z-10 flex flex-col justify-between h-full pt-4">
        {aspectRatio === '16:9' ? (
          /* Landscape 16:9 widescreen: Professional 2-Column Bento Layout */
          <div className="grid grid-cols-12 gap-8 items-center flex-1 my-auto">
            {/* Left side: Main text */}
            <div className="col-span-7 flex flex-col justify-center space-y-4">
              {slide.tagline && (
                <div className="inline-flex">
                  <span className={`px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase rounded-md border ${activeAccent.badge}`}>
                    {slide.tagline}
                  </span>
                </div>
              )}
              <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.1] tracking-tight text-white font-display">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`text-sm font-semibold mt-1 tracking-wide ${activeAccent.text}`}>
                  {slide.subtitle}
                </p>
              )}
              <div className="h-[2px] w-12 bg-slate-800 my-2" />
              <p className="text-sm md:text-base leading-relaxed text-slate-300 font-light pr-4">
                {slide.description}
              </p>
            </div>

            {/* Right side: Key Bullet Points wrapped in premium cards */}
            <div className="col-span-5 flex flex-col justify-center space-y-3">
              {slide.keyPoints && slide.keyPoints.length > 0 ? (
                slide.keyPoints.map((point, index) => (
                  <div 
                    key={index} 
                    className="bg-[#0b0f19]/70 border border-slate-900 rounded-xl p-3.5 flex items-start space-x-3 backdrop-blur-md hover:border-slate-800 transition-all duration-300 shadow-md group"
                  >
                    <span 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
                      style={{ color: activeAccent.accent }}
                    >
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                    <span className="text-xs md:text-sm text-slate-200 font-medium leading-snug group-hover:text-white transition-colors">
                      {point}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 font-mono italic">No se han definido puntos clave.</div>
              )}
            </div>
          </div>
        ) : (
          /* Square 1:1 or Portrait 4:5: Optimized clean vertical layout */
          <div className="flex-1 flex flex-col justify-between my-2">
            <div>
              {slide.tagline && (
                <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 mb-2.5 uppercase flex items-center">
                  <span className="w-1.5 h-3.5 mr-2 bg-gradient-to-b inline-block rounded-sm" style={{ backgroundColor: activeAccent.accent }}></span>
                  {slide.tagline}
                </div>
              )}
              <h2 className="text-2xl md:text-3.5xl font-extrabold leading-[1.15] tracking-tight text-white font-display">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`text-xs md:text-sm font-semibold mt-1.5 tracking-wide ${activeAccent.text}`}>
                  {slide.subtitle}
                </p>
              )}
              <p className="text-sm leading-relaxed text-slate-300 font-light mt-4">
                {slide.description}
              </p>
            </div>

            {/* Key Bullet Points organized vertically as elegant rows */}
            <div className="my-5 space-y-2.5">
              {slide.keyPoints && slide.keyPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="bg-[#0b0f19]/70 border border-slate-900 rounded-xl p-3 flex items-start space-x-3 backdrop-blur-md hover:border-slate-800 transition-all duration-300"
                >
                  <span 
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850"
                    style={{ color: activeAccent.accent }}
                  >
                    &gt;
                  </span>
                  <span className="text-xs md:text-sm text-slate-200 font-medium">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide Footer with Glowing Icon & Metadata */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-900/60">
          {/* Glowing Illustration / Icon representation */}
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl border ${activeAccent.border} ${activeAccent.bg} shadow-lg relative overflow-hidden backdrop-blur-md`}>
              {/* Radial gradient background to enhance glow inside container */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-900/40 to-transparent pointer-events-none" />
              <NeonIcon name={slide.iconName} color={slide.accentColor || 'cyan'} size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">NETWORK INTEGRITY</span>
              <span className="text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ONLINE / SECURE
              </span>
            </div>
          </div>

          {/* Spacer to avoid overlapping HACKRS sticker */}
          <div className="w-32 h-16 shrink-0" />
        </div>
      </div>

      {/* Floating HACKRS Logo Sticker - positioned exactly like the attached image! */}
      {showSticker && (
        <div className="absolute bottom-6 right-6 z-20 hover:scale-105 active:scale-95 transition-transform duration-200">
          <HackrsLogo size={stickerSize} rotation={stickerRotation} />
        </div>
      )}
    </div>
  );
}

