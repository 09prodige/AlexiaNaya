'use client';

import { useState, useRef } from 'react';
import { TransitionLink } from './PageTransition';


const MENU_ITEMS = [
  { label: 'BRANDING',     href: '/?category=branding', isCard: true },
  { label: 'DA PHOTO',     href: '/?category=da-photo', isCard: true },
  { label: 'ILLUSTRATION', href: '/?category=illustration', isCard: true },
  { label: 'ÉDITION',      href: '/?category=edition', isCard: true },
  { label: 'VIDÉO',        href: '/?category=video', isCard: true },
  { label: 'POCHETTE',     href: '/?category=pochette', isCard: true },
  { label: 'À PROPOS',     href: '/about', isCard: false },
  { label: 'CONTACT',      href: '/contact', isCard: false },
  { label: 'CGV',          href: '/cgv', isCard: false },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDragging = useRef(false);
  const startY = useRef(0);

  const close = () => setIsOpen(false);

  const navigate = (idx: number) => {
    setActiveIdx(idx);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      setActiveIdx((i) => Math.min(i + 1, MENU_ITEMS.length - 1));
    } else {
      setActiveIdx((i) => Math.max(i - 1, 0));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = startY.current - e.clientY;
    if (Math.abs(delta) > 40) {
      setActiveIdx((i) =>
        delta > 0
          ? Math.min(i + 1, MENU_ITEMS.length - 1)
          : Math.max(i - 1, 0)
      );
      startY.current = e.clientY;
    }
  };

  const handlePointerUp = () => { isDragging.current = false; };

  return (
    <>
      {/* ── Fixed top bar ───────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center px-6 py-5 md:px-10 md:py-7">
          <TransitionLink
            href="/"
            className="text-white text-xs md:text-sm font-medium tracking-[0.25em] uppercase hover:opacity-60 transition-opacity"
          >
            Alexia Naya
          </TransitionLink>
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-xs md:text-sm font-medium tracking-[0.25em] uppercase hover:opacity-60 transition-opacity"
            aria-label="Ouvrir le menu"
          >
            MENU
          </button>
        </div>
      </header>

      {/* ── Fullscreen slot-machine menu ────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[150] bg-[#111111] flex flex-col"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Close button */}
          <div className="flex justify-between items-center px-6 py-5 md:px-10 md:py-7">
            <span className="text-white/30 text-xs uppercase tracking-widest">Menu</span>
            <button
              onClick={close}
              className="text-white text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
              aria-label="Fermer le menu"
            >
              FERMER ✕
            </button>
          </div>

          {/* Slot machine list */}
          <div className="flex-1 relative w-full overflow-hidden select-none flex justify-center">
            <div className="relative w-full max-w-2xl h-full px-12">
              {MENU_ITEMS.map((item, idx) => {
                const distance = idx - activeIdx;
                const isActive = distance === 0;
                const fontSize = isActive
                  ? 'clamp(2.5rem, 7vw, 6rem)'
                  : `clamp(${1.2 - Math.min(Math.abs(distance) * 0.15, 0.6)}rem, ${5 - Math.abs(distance) * 0.8}vw, ${4 - Math.abs(distance) * 0.6}rem)`;
                const opacity = isActive ? 1 : Math.max(0.15, 0.55 - Math.abs(distance) * 0.12);
                // The vertical spacing gets tighter for items further away
                const spacing = 80 - Math.abs(distance) * 5;
                const yOffset = distance * spacing;

                return (
                  <div
                    key={item.label}
                    className="absolute left-12 right-12 cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      top: '50%',
                      transform: `translateY(calc(-50% + ${yOffset}px))`,
                      opacity,
                      zIndex: isActive ? 10 : 1,
                    }}
                    onClick={() => {
                      if (isActive) {
                        close();
                        if (!item.isCard) {
                          // navigation handled by TransitionLink below
                        }
                      } else {
                        navigate(idx);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4 py-1">
                      {/* Arrow indicator for active item */}
                      <span
                        className="font-['Anton'] text-white transition-all duration-300"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
                          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                        }}
                      >
                        →
                      </span>

                      <span className="transition-all duration-500" style={{ fontSize }}>
                        <TransitionLink
                          href={item.href}
                          onClick={close}
                          className="font-['Anton'] text-white uppercase leading-none hover:no-underline"
                        >
                          {item.label}
                        </TransitionLink>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="px-10 pb-8 text-white/20 text-xs uppercase tracking-widest">
            Scroll ou glisser pour naviguer · Entrer pour sélectionner
          </div>
        </div>
      )}
    </>
  );
}

