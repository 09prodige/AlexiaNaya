'use client';

import { useState, useEffect } from 'react';
import BlinkLogo from './BlinkLogo';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 700);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFDFD] transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Responsive logo size for Mobile & PC */}
      <BlinkLogo className="w-56 h-56 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px]" />
      <p className="mt-8 text-xs sm:text-base uppercase tracking-[0.4em] font-light text-gray-400 animate-pulse">
        Alexia D'Oliveira
      </p>
    </div>
  );
}
