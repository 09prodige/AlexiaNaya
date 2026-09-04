'use client';

import { useEffect, useState } from 'react';

import PixelReveal from './PixelReveal';

interface HeroTitleProps {
  onScrollReady?: () => void;
}

export default function HeroTitle({ onScrollReady }: HeroTitleProps) {
  const [phase, setPhase] = useState<'hidden' | 'glitching' | 'settled'>('hidden');

  useEffect(() => {
    // Start glitch animation shortly after mount
    const t1 = setTimeout(() => setPhase('glitching'), 200);
    // Settle after glitch phase
    const t2 = setTimeout(() => {
      setPhase('settled');
      onScrollReady?.();
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onScrollReady]);

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden"
      aria-label="Alexia Naya — Portfolio"
    >
      {/* Animated Pixel Reveal Background */}
      <div className="absolute inset-0 z-0">
        <PixelReveal 
          src="/assets/Photographies/Photos/IMG_8679.jpg" 
          alt="Hero Background"
          gridSize={16}
          className="w-full h-full opacity-60"
        />
      </div>

      {/* Main glitch title */}
      <div className="relative select-none px-4 text-center z-10 mix-blend-difference">
        <h1
          className="hero-title font-['Anton'] text-white uppercase leading-none tracking-tight"
          style={{
            fontSize: 'clamp(4rem, 18vw, 18rem)',
            lineHeight: 0.9,
            animation:
              phase === 'glitching'
                ? 'glitch-reveal 1.8s ease-out forwards'
                : phase === 'hidden'
                ? 'none'
                : 'none',
            opacity: phase === 'hidden' ? 0 : 1,
          }}
          data-text="ALEXIA NAYA"
        >
          <GlitchText text="ALEXIA NAYA" active={phase === 'glitching'} />
        </h1>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40"
        style={{
          opacity: phase === 'settled' ? 1 : 0,
          transition: 'opacity 0.8s ease',
          animation: phase === 'settled' ? 'fade-up 0.8s ease forwards' : 'none',
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          style={{ animation: 'scroll-bounce 1.5s ease-in-out infinite' }}
        >
          <path d="M8 0v20M1 13l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

/* ── Glitch text: duplicates chars with random displace for effect ── */
function GlitchText({ text, active }: { text: string; active: boolean }) {
  const [glitchChar, setGlitchChar] = useState<number | null>(null);
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&*';

  useEffect(() => {
    if (!active) { setGlitchChar(null); return; }
    let frame = 0;
    const interval = setInterval(() => {
      setGlitchChar(Math.floor(Math.random() * text.length));
      frame++;
      if (frame > 30) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [active, text]);

  return (
    <>
      {/* Glitch pseudo-layers */}
      {active && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-['Anton'] uppercase leading-none"
            style={{
              fontSize: 'inherit',
              color: '#ff0044',
              animation: 'glitch-clip-1 0.4s infinite linear',
              pointerEvents: 'none',
            }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-['Anton'] uppercase leading-none"
            style={{
              fontSize: 'inherit',
              color: '#00ffff',
              animation: 'glitch-clip-2 0.5s infinite linear',
              pointerEvents: 'none',
            }}
          >
            {text}
          </span>
        </>
      )}
      {/* Real text with optional single-char scramble and hover fx */}
      <span className="relative flex justify-center flex-wrap">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block transition-all duration-200 ease-out hover:scale-125 hover:-translate-y-4 hover:text-[#ff0044] hover:skew-x-[-10deg] cursor-default"
          >
            {char === ' ' ? '\u00A0' : (
              active && glitchChar === i
                ? CHARS[Math.floor(Math.random() * CHARS.length)]
                : char
            )}
          </span>
        ))}
      </span>
    </>
  );
}
