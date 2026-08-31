'use client';

import { useState, useEffect } from 'react';
import BlinkLogo from './BlinkLogo';
import ImageCarousel3D from './ImageCarousel3D';

export interface ProjectCardProps {
  title: string;
  category: string;
  imageUrl: string;
  width?: string;
  items?: {
    title: string;
    type: 'image' | 'video';
    url: string;
  }[];
}

export default function ProjectCard({ 
  title, 
  category, 
  imageUrl, 
  width = '100%',
  items = []
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState(true);

  const displayItems = items.length > 0 ? items : [{ title, type: 'image' as const, url: imageUrl }];
  const coverIsVideo = ['.mp4', '.mov', '.webm'].some(ext => imageUrl.toLowerCase().endsWith(ext));

  useEffect(() => {
    if (isOpen) {
      setModalLoading(true);
      const timer = setTimeout(() => {
        setModalLoading(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`group cursor-pointer flex flex-col gap-3 w-full ${width}`}
      >
        {/* Cover thumbnail */}
        <div className="relative w-full overflow-hidden bg-gray-100/50 rounded min-h-[200px] flex items-center justify-center">
          {coverIsVideo ? (
            <video
              src={imageUrl}
              preload="metadata"
              muted
              playsInline
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            />
          )}
        </div>
        <div className="flex justify-between items-baseline px-1 pt-1">
          <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-black group-hover:translate-x-1 transition-transform duration-300">
            {title}
          </h3>
        </div>
      </div>

      {/* Modal View */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          {/* Header */}
          <div className="sticky top-0 z-20 flex justify-between items-center px-6 py-6 md:px-12 bg-black/80 backdrop-blur-md border-b border-white/10 text-white">
            <div>
              <h2 className="text-xl md:text-3xl font-bold tracking-tight">{title}</h2>
              <p className="text-xs uppercase tracking-widest text-gray-400">{category} — {displayItems.length} fichier(s)</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs md:text-sm uppercase tracking-widest px-5 py-2.5 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all font-medium"
            >
              Fermer ✕
            </button>
          </div>

          {/* Modal Global Loading Screen */}
          {modalLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
              <BlinkLogo size={180} />
              <p className="text-xs uppercase tracking-[0.3em] font-light text-gray-400 animate-pulse">
                Chargement...
              </p>
            </div>
          ) : (
            /* Organic Masonry Layout using CSS Columns */
            <div className="container mx-auto px-4 md:px-8 py-12">
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {displayItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCarouselIndex(idx)}
                    className="break-inside-avoid flex flex-col gap-2 group bg-neutral-950/60 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-full overflow-hidden rounded bg-neutral-900 flex items-center justify-center min-h-[140px]">
                      {item.type === 'video' ? (
                        <div className="relative w-full flex items-center justify-center">
                          <video
                            src={item.url}
                            playsInline
                            preload="metadata"
                            muted
                            className="w-full h-auto object-contain rounded pointer-events-none"
                          />
                          {/* Play overlay button for video cards */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg pl-1">
                              ▶
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-auto object-contain rounded group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3D Spiral Carousel Mode when clicked */}
      {carouselIndex !== null && (
        <ImageCarousel3D
          items={displayItems}
          initialIndex={carouselIndex}
          onClose={() => setCarouselIndex(null)}
        />
      )}
    </>
  );
}
