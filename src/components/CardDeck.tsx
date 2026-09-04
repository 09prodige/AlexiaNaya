'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DISCIPLINES } from '@/lib/disciplines';

import { CategoryData } from '@/lib/getPortfolio';

interface CardDeckProps {
  categories: CategoryData[];
  onOpenDiscipline: (cat: CategoryData) => void;
}

const CARD_ROTATIONS = [-18, -9, -1, 7, 15, 23];
const CARD_TRANSLATE_Y = [8, 4, 0, 4, 8, 14];

export default function CardDeck({ categories, onOpenDiscipline }: CardDeckProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [randomImages, setRandomImages] = useState<{url: string, type: 'image'|'video'}[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    // Gather all items to pick random ones for the bottom gallery
    const allItems = categories.flatMap(c => c.items).filter(i => i.type === 'image');
    // Shuffle and pick 16
    const shuffled = [...allItems].sort(() => 0.5 - Math.random()).slice(0, 16);
    setRandomImages(shuffled);
    return () => clearTimeout(t);
  }, [categories]);

  return (
    <section
      id="cards"
      className="relative w-full flex flex-col items-center justify-start bg-transparent pt-32 pb-16"
    >
      {/* Section label */}
      <p
        className="mb-12 text-white/30 text-xs uppercase tracking-[0.4em] font-medium"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        Choisissez une discipline
      </p>

      {/* Card fan — fixed height container so it never overlaps what's below */}
      <div className="w-full flex justify-center mb-8 sm:mb-12 md:mb-20">
        <div 
          className="relative flex items-end justify-center origin-bottom scale-[0.55] sm:scale-[0.75] md:scale-100" 
          style={{ height: 420, width: '100%', perspective: '1200px' }}
        >
        {DISCIPLINES.map((discipline, idx) => {
          const cat = categories.find((c) => c.disciplineId === discipline.id);
          const isHovered = hoveredIdx === idx;
          const rotation = isHovered ? 0 : CARD_ROTATIONS[idx];
          const translateY = isHovered ? -40 : CARD_TRANSLATE_Y[idx];
          const zIndex = isHovered ? 20 : 10 - Math.abs(idx - 2.5);
          const delay = entered ? idx * 80 : 0;
          
          // Card dimensions
          const cWidth = 260;
          const cHeight = 380;

          return (
            <div
              key={discipline.id}
              className="card-scene absolute cursor-pointer"
              style={{
                width: cWidth,
                height: cHeight,
                left: '50%',
                marginLeft: -(cWidth / 2),
                transform: `translateX(${(idx - 2.5) * 110}px) rotate(${rotation}deg) translateY(${translateY}px)`,
                zIndex,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s',
                opacity: entered ? 1 : 0,
                transitionDelay: `${delay}ms`,
                transformOrigin: 'bottom center',
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => cat && onOpenDiscipline(cat)}
              role="button"
              tabIndex={0}
              aria-label={`Ouvrir ${discipline.label}`}
              onKeyDown={(e) => e.key === 'Enter' && cat && onOpenDiscipline(cat)}
            >
              <div className="card-inner w-full h-full rounded-xl shadow-2xl">
                {/* RECTO — logo card with colored background */}
                <div className="card-face rounded-xl overflow-hidden">
                  <Image
                    src={discipline.cardImage}
                    alt={discipline.label}
                    fill
                    className="object-cover"
                    sizes="260px"
                  />
                </div>

                {/* VERSO — discipline name on colored background */}
                <div
                  className="card-face card-back rounded-xl flex flex-col items-center justify-center gap-4 px-4"
                  style={{ backgroundColor: discipline.color }}
                >
                  <Image
                    src={discipline.logoImage}
                    alt={discipline.label}
                    width={120}
                    height={120}
                    className="object-contain opacity-60"
                  />
                  <span
                    className="font-['Anton'] uppercase text-center leading-tight"
                    style={{
                      fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
                      color: discipline.textColor,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {discipline.label}
                  </span>
                  {cat && cat.items.length > 0 && (
                    <span
                      className="text-xs uppercase tracking-widest opacity-50"
                      style={{ color: discipline.textColor }}
                    >
                      {cat.items.length} travaux
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Random Infinite Marquee Gallery */}
      {randomImages.length > 0 && (
        <div className="w-full mt-auto opacity-70 hover:opacity-100 transition-opacity duration-500">
          <p className="text-center text-white/30 text-xs uppercase tracking-[0.4em] font-medium mb-8">
            Aperçu
          </p>
          <div className="relative flex overflow-x-hidden w-full group">
            <div className="animate-marquee flex whitespace-nowrap gap-4 items-center group-hover:[animation-play-state:paused]">
              {randomImages.map((img, i) => (
                <div key={i} className="relative w-48 h-64 md:w-64 md:h-80 flex-shrink-0 rounded overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {randomImages.map((img, i) => (
                <div key={`dup-${i}`} className="relative w-48 h-64 md:w-64 md:h-80 flex-shrink-0 rounded overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
