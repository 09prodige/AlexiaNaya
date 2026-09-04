'use client';

import { TransitionLink } from './PageTransition';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#111111] text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-[0.2em] font-medium text-white/40">
        <div>
          © {new Date().getFullYear()} Alexia D'Oliveira Studio. Tous droits réservés.
        </div>
        <div className="flex gap-8 items-center">
          <TransitionLink href="/about" className="hover:text-white transition-colors">
            À propos
          </TransitionLink>
          <TransitionLink href="/contact" className="hover:text-white transition-colors">
            Contact
          </TransitionLink>
          <TransitionLink href="/cgv" className="hover:text-white transition-colors">
            CGV
          </TransitionLink>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.25em] text-white/20">
        Développé par Jérémie AKWE
      </div>
    </footer>
  );
}
