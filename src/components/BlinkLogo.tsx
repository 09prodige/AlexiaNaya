'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BlinkLogoProps {
  size?: number; // fallback numeric size in pixels
  className?: string;
  autoBlink?: boolean;
}

export default function BlinkLogo({ size, className = 'w-44 h-44 md:w-80 md:h-80', autoBlink = true }: BlinkLogoProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!autoBlink) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const delay = Math.random() * 3000 + 2500;
      timeoutId = setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsOpen(true);
          scheduleNextBlink();
        }, 180);
      }, delay);
    };

    scheduleNextBlink();

    return () => clearTimeout(timeoutId);
  }, [autoBlink]);

  const styleObj = size ? { width: size, height: size } : {};

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`} 
      style={styleObj}
    >
      {/* Eye Open Image */}
      <Image
        src="/assets/Affiche/ANIMAT LOGO ALEXIA NAYA .png"
        alt="Logo Alexia D'Oliveira - Oeil Ouvert"
        fill
        priority
        className={`object-contain transition-opacity duration-100 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        sizes="(max-width: 768px) 50vw, 33vw"
      />

      {/* Eye Closed Image */}
      <Image
        src="/assets/Affiche/ANIMAT LOGO ALEXIA NAYA_Générique-03.png"
        alt="Logo Alexia D'Oliveira - Oeil Ferme"
        fill
        priority
        className={`object-contain transition-opacity duration-100 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </div>
  );
}
