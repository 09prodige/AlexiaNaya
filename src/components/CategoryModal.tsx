'use client';

import { useState } from 'react';
import Image from 'next/image';
import BlinkLogo from './BlinkLogo';

export interface CategoryItem {
  id: string;
  title: string;
  category: 'Affiche' | 'Illustration' | 'Photographie' | 'Pochette' | 'Vidéo';
  coverImage: string;
  count: number;
  items: {
    title: string;
    type: 'image' | 'video';
    url: string;
  }[];
}

interface CategoryModalProps {
  category: CategoryItem | null;
  onClose: () => void;
}

export default function CategoryModal({ category, onClose }: CategoryModalProps) {
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});

  if (!category) return null;

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 flex justify-between items-center px-6 py-6 md:px-12 bg-black/80 backdrop-blur-md border-b border-white/10 text-white">
        <div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight">{category.title}</h2>
          <p className="text-xs uppercase tracking-widest text-gray-400">{category.category} — {category.count} travaux</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs md:text-sm uppercase tracking-widest px-5 py-2.5 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all font-medium"
        >
          Fermer ✕
        </button>
      </div>

      {/* Grid Content */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.items.map((item, index) => (
            <div key={index} className="flex flex-col gap-3 group">
              <div className="relative w-full aspect-[3/4] bg-neutral-900 overflow-hidden rounded">
                {!loadedImages[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
                    <BlinkLogo size={56} />
                  </div>
                )}
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onLoadedData={() => handleImageLoad(index)}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    onLoad={() => handleImageLoad(index)}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      loadedImages[index] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>
              <p className="text-sm font-medium text-gray-300 tracking-wide px-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
