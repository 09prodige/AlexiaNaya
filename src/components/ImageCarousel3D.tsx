'use client';

import { useState, useEffect, useRef } from 'react';
import BlinkLogo from './BlinkLogo';

interface Item {
  title: string;
  type: 'image' | 'video';
  url: string;
}

interface ImageCarousel3DProps {
  items: Item[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageCarousel3D({ items, initialIndex, onClose }: ImageCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeItem = items[activeIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* Header controls */}
      <div className="z-30 flex justify-between items-center px-6 py-6 md:px-12 bg-gradient-to-b from-black/80 to-transparent text-white">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xs md:text-sm uppercase tracking-widest px-5 py-2.5 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all font-medium"
        >
          Fermer ✕
        </button>
      </div>

      {/* 3D Carousel Stage */}
      <div className="relative flex-1 flex items-center justify-center perspective-[1200px] overflow-hidden py-6">
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
          {items.map((item, idx) => {
            let offset = idx - activeIndex;
            if (offset > items.length / 2) offset -= items.length;
            if (offset < -items.length / 2) offset += items.length;

            const absOffset = Math.abs(offset);
            const isVisible = absOffset <= 3; // Keep memory lean

            if (!isVisible) return null;

            const translateX = offset * 280;
            const translateZ = -absOffset * 220;
            const rotateY = offset * -25;
            const scale = Math.max(0.4, 1 - absOffset * 0.15);
            const opacity = Math.max(0, 1 - absOffset * 0.25);
            const isCenter = offset === 0;

            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                  isCenter ? 'z-30 pointer-events-auto' : 'z-10'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                }}
              >
                <div 
                  className={`relative max-w-[85vw] max-h-[70vh] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    isCenter ? 'ring-2 ring-white/40 shadow-white/10' : 'filter brightness-50 hover:brightness-90'
                  }`}
                >
                  {item.type === 'video' ? (
                    isCenter ? (
                      /* Play full video only when active in center to avoid memory overflow */
                      <video
                        src={item.url}
                        controls
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="max-h-[70vh] w-auto object-contain rounded-xl"
                      />
                    ) : (
                      /* Lightweight thumbnail for side videos */
                      <div className="relative max-h-[70vh] flex items-center justify-center bg-neutral-900 min-w-[260px] min-h-[260px]">
                        <video
                          src={item.url}
                          preload="metadata"
                          muted
                          className="max-h-[70vh] w-auto object-contain rounded-xl pointer-events-none"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center pl-1 text-xs">
                            ▶
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      className="max-h-[70vh] w-auto object-contain rounded-xl"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="z-30 flex flex-col items-center gap-4 pb-8 pt-4 w-full text-white">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/25 bg-black/40 backdrop-blur-md rounded-full hover:border-white hover:bg-white/20 transition-all text-xs uppercase tracking-widest"
          >
            ← Précédent
          </button>

          <span className="text-xs uppercase font-mono tracking-widest text-gray-300 min-w-[70px] text-center">
            {activeIndex + 1} / {items.length}
          </span>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/25 bg-black/40 backdrop-blur-md rounded-full hover:border-white hover:bg-white/20 transition-all text-xs uppercase tracking-widest"
          >
            Suivant →
          </button>
        </div>

        {/* Dynamic Dot Indicators */}
        <div className="flex gap-1.5 items-center justify-center max-w-md overflow-x-auto px-4 py-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
