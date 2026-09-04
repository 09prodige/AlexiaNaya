'use client';

import { useEffect, useState } from 'react';

// One unique photo per character of "ALEXIA NAYA" (11 chars, including space)
const LETTER_IMAGES: (string | null)[] = [
  '/assets/Photographies/Photos/IMG_8679_.jpg',           // A
  '/assets/Pochettes/Pochettes/JONEZ-POCHETTE.png',       // L
  '/assets/Photographies/Photos/IMG_8236.jpg',            // E
  '/assets/Pochettes/Pochettes/LEAM-ENCORE-V2.png',       // X
  '/assets/Affiche/IMG_3877.png',                         // I
  '/assets/Photographies/Photos/IMG_3019.jpg',            // A
  null,                                                    // (space)
  '/assets/Pochettes/Pochettes/PRODI9E-J9-FACE-A.png',    // N
  '/assets/Photographies/Photos/IMG_4340.jpg',            // A
  '/assets/Affiche/FL-affiche_page-0001.jpg',             // Y
  '/assets/Photographies/Photos/IMG_0237.jpg',            // A
];

const GRID = 7;
const TOTAL = GRID * GRID;

interface HeroTitleProps {
  onScrollReady?: () => void;
}

export default function HeroTitle({ onScrollReady }: HeroTitleProps) {
  const [phase, setPhase] = useState<'hidden' | 'glitching' | 'settled'>('hidden');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('glitching'), 200);
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
      <div className="relative select-none px-4 text-center">
        <h1
          className="hero-title font-['Anton'] text-white uppercase leading-none tracking-tight"
          style={{
            fontSize: 'clamp(4rem, 18vw, 18rem)',
            lineHeight: 0.9,
            animation: phase === 'glitching' ? 'glitch-reveal 1.8s ease-out forwards' : 'none',
            opacity: phase === 'hidden' ? 0 : 1,
          }}
          data-text="ALEXIA NAYA"
        >
          <GlitchText text="ALEXIA NAYA" active={phase === 'glitching'} settled={phase === 'settled'} />
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
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none"
          style={{ animation: 'scroll-bounce 1.5s ease-in-out infinite' }}>
          <path d="M8 0v20M1 13l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

/* ── Per-letter pixel photo component ── */
function LetterPixel({ char, imageSrc, isGlitching, glitchChar, charIndex, CHARS }: {
  char: string;
  imageSrc: string | null;
  isGlitching: boolean;
  glitchChar: number | null;
  charIndex: number;
  CHARS: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!hovered || !imageSrc) { setRevealed(new Set()); return; }
    const interval = setInterval(() => {
      const next = new Set<number>();
      // Random cross-shaped clusters of revealed pixels
      const numClusters = 3 + Math.floor(Math.random() * 4);
      for (let c = 0; c < numClusters; c++) {
        const r = Math.floor(Math.random() * GRID);
        const col = Math.floor(Math.random() * GRID);
        next.add(r * GRID + col);
        if (r > 0) next.add((r - 1) * GRID + col);
        if (r < GRID - 1) next.add((r + 1) * GRID + col);
        if (col > 0) next.add(r * GRID + col - 1);
        if (col < GRID - 1) next.add(r * GRID + col + 1);
      }
      setRevealed(next);
    }, 180);
    return () => clearInterval(interval);
  }, [hovered, imageSrc]);

  if (char === ' ') return <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>;

  const displayChar = isGlitching && glitchChar === charIndex
    ? CHARS[Math.floor(Math.random() * CHARS.length)]
    : char;

  return (
    <span
      className="inline-block relative cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo visible through pixel blocks on hover */}
      {imageSrc && hovered && (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0, pointerEvents: 'none' }}
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID}, 1fr)`,
              gridTemplateRows: `repeat(${GRID}, 1fr)`,
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: '#111111',
                  opacity: revealed.has(i) ? 0 : 1,
                  transition: revealed.has(i) ? 'opacity 0.08s ease-out' : 'opacity 0.35s ease-in',
                }}
              />
            ))}
          </span>
        </>
      )}

      {/* The letter — transparent when image shows, white otherwise */}
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          color: hovered && imageSrc ? 'transparent' : 'white',
          display: 'block',
          transition: 'color 0.05s',
          userSelect: 'none',
        }}
      >
        {displayChar}
      </span>
    </span>
  );
}

/* ── Glitch text wrapper ── */
function GlitchText({ text, active, settled }: { text: string; active: boolean; settled: boolean }) {
  const [glitchChar, setGlitchChar] = useState<number | null>(null);
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

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
      {/* Glitch color layers during intro animation */}
      {active && (
        <>
          <span aria-hidden className="absolute inset-0 flex items-center justify-center font-['Anton'] uppercase leading-none"
            style={{ fontSize: 'inherit', color: '#ff0044', animation: 'glitch-clip-1 0.4s infinite linear', pointerEvents: 'none' }}>
            {text}
          </span>
          <span aria-hidden className="absolute inset-0 flex items-center justify-center font-['Anton'] uppercase leading-none"
            style={{ fontSize: 'inherit', color: '#00ffff', animation: 'glitch-clip-2 0.5s infinite linear', pointerEvents: 'none' }}>
            {text}
          </span>
        </>
      )}

      {/* Per-letter spans — pixel hover only when settled */}
      <span className="relative flex justify-center flex-wrap">
        {text.split('').map((char, i) => (
          <LetterPixel
            key={i}
            char={char}
            imageSrc={settled ? (LETTER_IMAGES[i] ?? null) : null}
            isGlitching={active}
            glitchChar={glitchChar}
            charIndex={i}
            CHARS={CHARS}
          />
        ))}
      </span>
    </>
  );
}
