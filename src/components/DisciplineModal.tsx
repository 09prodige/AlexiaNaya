'use client';

import { useEffect, useState, useCallback } from 'react';
import { CategoryData } from '@/lib/getPortfolio';

interface DisciplineModalProps {
  category: CategoryData;
  onClose: () => void;
}

export default function DisciplineModal({ category, onClose }: DisciplineModalProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIdx !== null) setLightboxIdx(null);
        else onClose();
      }
      if (e.key === 'ArrowRight' && lightboxIdx !== null) {
        setLightboxIdx((i) => (i! + 1) % category.items.length);
      }
      if (e.key === 'ArrowLeft' && lightboxIdx !== null) {
        setLightboxIdx((i) => (i! - 1 + category.items.length) % category.items.length);
      }
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, lightboxIdx, category.items.length]);

  const textColor = category.textColor;
  const bgColor = category.color;
  const hasItems = category.items.length > 0;

  const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const goNext = useCallback(() =>
    setLightboxIdx((i) => (i! + 1) % category.items.length), [category.items.length]);
  const goPrev = useCallback(() =>
    setLightboxIdx((i) => (i! - 1 + category.items.length) % category.items.length), [category.items.length]);

  const currentItem = lightboxIdx !== null ? category.items[lightboxIdx] : null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex flex-col" style={{ backgroundColor: bgColor }}>

      {/* Sticky header */}
      <div
        className="flex-none z-20 flex justify-between items-center px-6 py-5 md:px-10 md:py-6 border-b"
        style={{ color: textColor, borderColor: `${textColor}20` }}
      >
        <div>
          <h2
            className="font-['Anton'] uppercase text-3xl md:text-5xl leading-none"
            style={{ color: textColor }}
          >
            {category.title}
          </h2>
          {hasItems && (
            <p className="text-xs mt-1 opacity-50 uppercase tracking-widest" style={{ color: textColor }}>
              {category.items.length} travaux
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-widest px-5 py-2.5 border rounded-full transition-all font-medium hover:opacity-70"
          style={{ borderColor: `${textColor}40`, color: textColor }}
          aria-label="Fermer"
        >
          Fermer ✕
        </button>
      </div>

      {/* Masonry gallery grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 min-h-[50vh]">
            <p className="uppercase tracking-[0.4em] text-sm opacity-40" style={{ color: textColor }}>
              Bientôt disponible
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
            {category.items.map((item, idx) => (
              <div
                key={idx}
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg group relative mb-3"
                onClick={() => openLightbox(idx)}
              >
                {item.type === 'video' ? (
                  // Static placeholder — don't load video here, too heavy
                  <div
                    className="relative w-full aspect-video flex flex-col items-center justify-center gap-3"
                    style={{ backgroundColor: `${textColor}10` }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center border-2 group-hover:scale-110 transition-transform"
                      style={{ borderColor: `${textColor}60`, backgroundColor: `${textColor}10` }}
                    >
                      <span className="text-2xl ml-1" style={{ color: textColor }}>▶</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest opacity-40" style={{ color: textColor }}>
                      {item.title || 'Vidéo'}
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title || `Travail ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                  style={{ background: `linear-gradient(to top, ${bgColor}cc, transparent)` }}
                >
                  <span className="text-xs uppercase tracking-widest opacity-80" style={{ color: textColor }}>
                    Voir →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && currentItem && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-6 text-white/60 hover:text-white text-xs uppercase tracking-widest z-10"
            onClick={closeLightbox}
          >
            Fermer ✕
          </button>
          <div className="absolute top-5 left-6 text-white/40 text-xs tracking-widest font-['Anton']">
            {lightboxIdx + 1} / {category.items.length}
          </div>
          <button
            className="absolute left-4 md:left-8 text-white/60 hover:text-white text-2xl z-10 p-3 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Précédent"
          >
            ←
          </button>
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === 'video' ? (
              <video
                key={lightboxIdx}
                src={currentItem.url}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              />
            ) : (
              <img
                key={lightboxIdx}
                src={currentItem.url}
                alt={currentItem.title || `Travail ${lightboxIdx + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
          <button
            className="absolute right-4 md:right-8 text-white/60 hover:text-white text-2xl z-10 p-3 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Suivant"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
