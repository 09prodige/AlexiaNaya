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

interface CategoryCardProps {
  category: CategoryItem;
  aspectRatio?: string;
  onClick: (cat: CategoryItem) => void;
}

export default function CategoryCard({ category, aspectRatio = 'aspect-[4/5]', onClick }: CategoryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      onClick={() => onClick(category)}
      className="group cursor-pointer flex flex-col gap-3 w-full"
    >
      <div className={`relative w-full overflow-hidden ${aspectRatio} bg-gray-100 rounded-sm`}>
        {/* Loading placeholder with BlinkLogo */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 z-10">
            <BlinkLogo size={48} autoBlink={true} />
          </div>
        )}

        <Image
          src={category.coverImage}
          alt={category.title}
          fill
          onLoad={() => setIsLoaded(true)}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-95"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 text-black px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Explorer ({category.count})
          </span>
        </div>
      </div>

      <div className="flex justify-between items-baseline px-1 pt-1">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black group-hover:translate-x-1 transition-transform duration-300">
          {category.title}
        </h3>
        <span className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-widest">
          {category.category} • {category.count}
        </span>
      </div>
    </div>
  );
}
