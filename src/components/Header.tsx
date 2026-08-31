'use client';

import { useState } from 'react';
import Link from 'next/link';
import BlinkLogo from './BlinkLogo';
import { TransitionLink } from './PageTransition';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Bar with MENU Button */}
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white">
        <div className="flex justify-between items-center p-6 md:px-12 md:py-8 text-sm md:text-base font-medium tracking-widest uppercase">
          <TransitionLink href="/" className="hover:opacity-70 transition-opacity">
            Alexia D'Oliveira
          </TransitionLink>
          <button 
            onClick={() => setIsOpen(true)}
            className="hover:opacity-70 transition-opacity tracking-[0.2em] font-medium"
          >
            MENU
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FDFDFD] text-black flex flex-col items-center justify-between py-8 px-6 md:py-12 animate-in fade-in duration-300 overflow-y-auto">
          
          {/* Top Bar inside Menu */}
          <div className="w-full flex justify-between items-center max-w-7xl px-2">
            <span className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-black">
              MENU
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs md:text-sm font-medium tracking-widest uppercase hover:opacity-50 transition-opacity border border-black/20 rounded-full px-4 py-1.5"
            >
              FERMER ✕
            </button>
          </div>

          {/* Center Logo with Responsive Proportions */}
          <div className="my-auto flex flex-col items-center gap-6 py-4">
            <BlinkLogo className="w-28 h-28 sm:w-44 sm:h-44 md:w-56 md:h-56" />

            {/* Menu Links with hover scale effect */}
            <nav className="flex flex-col items-center gap-4 sm:gap-6 mt-4">
              <TransitionLink 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="text-xl sm:text-3xl md:text-5xl font-bold tracking-[0.25em] uppercase hover:scale-105 hover:opacity-70 transition-all duration-300"
              >
                WORK
              </TransitionLink>
              <TransitionLink 
                href="/about" 
                onClick={() => setIsOpen(false)}
                className="text-xl sm:text-3xl md:text-5xl font-bold tracking-[0.25em] uppercase hover:scale-105 hover:opacity-70 transition-all duration-300"
              >
                ABOUT
              </TransitionLink>
              <TransitionLink 
                href="/contact" 
                onClick={() => setIsOpen(false)}
                className="text-xl sm:text-3xl md:text-5xl font-bold tracking-[0.25em] uppercase hover:scale-105 hover:opacity-70 transition-all duration-300"
              >
                CONTACT
              </TransitionLink>
              <TransitionLink 
                href="/cgv" 
                onClick={() => setIsOpen(false)}
                className="text-xl sm:text-3xl md:text-5xl font-bold tracking-[0.25em] uppercase hover:scale-105 hover:opacity-70 transition-all duration-300"
              >
                CGV
              </TransitionLink>
            </nav>
          </div>

          {/* Footer inside Overlay Menu */}
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gray-400">
            Alexia D'Oliveira Studio
          </div>
        </div>
      )}
    </>
  );
}
