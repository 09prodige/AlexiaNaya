'use client';

import { TransitionLink } from './PageTransition';

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/10 bg-[#FDFDFD] text-black py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-[0.2em] font-medium text-gray-500">
        <div>
          © {new Date().getFullYear()} Alexia D'Oliveira Studio. Tous droits réservés.
        </div>
        <div className="flex gap-8 items-center">
          <TransitionLink href="/about" className="hover:text-black transition-colors">
            À propos
          </TransitionLink>
          <TransitionLink href="/contact" className="hover:text-black transition-colors">
            Contact
          </TransitionLink>
          <TransitionLink href="/cgv" className="hover:text-black transition-colors">
            CGV
          </TransitionLink>
        </div>
      </div>
    </footer>
  );
}
