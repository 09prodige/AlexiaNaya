'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BackgroundLogo() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const delay = Math.random() * 3500 + 3000;
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
  }, []);

  return (
    <div className="fixed inset-0 z-[0] pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.035]">
      <div className="relative w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] transform scale-125 md:scale-110">
        {/* Eye Open Image Watermark */}
        <Image
          src="/assets/Affiche/ANIMAT LOGO ALEXIA NAYA .png"
          alt="Watermark Logo Open"
          fill
          priority
          className={`object-contain transition-opacity duration-150 grayscale ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="100vw"
        />

        {/* Eye Closed Image Watermark */}
        <Image
          src="/assets/Affiche/ANIMAT LOGO ALEXIA NAYA_Générique-03.png"
          alt="Watermark Logo Closed"
          fill
          priority
          className={`object-contain transition-opacity duration-150 grayscale ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="100vw"
        />
      </div>
    </div>
  );
}
