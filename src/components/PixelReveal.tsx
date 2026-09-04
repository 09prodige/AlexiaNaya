'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PixelRevealProps {
  src: string;
  alt?: string;
  gridSize?: number; // e.g. 12 for 12x12
  tintColor?: string; // e.g. '#ff0000' for a red tint, or transparent
  className?: string;
}

export default function PixelReveal({
  src,
  alt = 'Image',
  gridSize = 10,
  tintColor = 'rgba(227, 64, 64, 0.4)', // Default red tint like DA PHOTO
  className = '',
}: PixelRevealProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const totalBlocks = gridSize * gridSize;

  useEffect(() => {
    // Every X ms, pick new random blocks to reveal
    const interval = setInterval(() => {
      const newRevealed = new Set<number>();
      
      // Create cross shapes
      const numCrosses = Math.max(2, Math.floor(gridSize / 3));
      for (let i = 0; i < numCrosses; i++) {
        const centerRow = Math.floor(Math.random() * gridSize);
        const centerCol = Math.floor(Math.random() * gridSize);
        
        // Add center
        newRevealed.add(centerRow * gridSize + centerCol);
        // Add neighbors to form crosses
        if (centerRow > 0) newRevealed.add((centerRow - 1) * gridSize + centerCol);
        if (centerRow < gridSize - 1) newRevealed.add((centerRow + 1) * gridSize + centerCol);
        if (centerCol > 0) newRevealed.add(centerRow * gridSize + (centerCol - 1));
        if (centerCol < gridSize - 1) newRevealed.add(centerRow * gridSize + (centerCol + 1));
        
        // Sometime add corners for a bigger blob
        if (Math.random() > 0.5) {
          if (centerRow > 0 && centerCol > 0) newRevealed.add((centerRow - 1) * gridSize + (centerCol - 1));
          if (centerRow < gridSize - 1 && centerCol < gridSize - 1) newRevealed.add((centerRow + 1) * gridSize + (centerCol + 1));
        }
      }
      
      setRevealed(newRevealed);
    }, 450);

    return () => clearInterval(interval);
  }, [gridSize]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover grayscale"
        />
        {/* Optional Tint Overlay */}
        {tintColor !== 'transparent' && (
          <div
            className="absolute inset-0 mix-blend-multiply opacity-80"
            style={{ backgroundColor: tintColor }}
          />
        )}
      </div>

      {/* Grid of covering blocks */}
      <div
        className="absolute inset-0 z-10 grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {Array.from({ length: totalBlocks }).map((_, i) => {
          const isRevealed = revealed.has(i);
          return (
            <div
              key={i}
              className="w-full h-full bg-[#111111]"
              style={{
                opacity: isRevealed ? 0 : 1,
                // Fast transition for a blocky/pixelated feel
                transition: isRevealed ? 'opacity 0.1s ease-out' : 'opacity 0.4s ease-in',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
