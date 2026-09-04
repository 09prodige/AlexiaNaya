'use client';

import ShooterGame from './arcade/ShooterGame';
import CleanerGame from './arcade/CleanerGame';
import BottleFlip from './arcade/BottleFlip';
import { motion } from 'framer-motion';

export default function ArcadeSection() {
  return (
    <section className="relative w-full min-h-screen bg-[#050505] pt-32 pb-32 overflow-hidden border-t border-red-900/30">
      {/* Background Noise/Texture Simulation */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-24 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-['Anton'] text-7xl md:text-9xl text-white tracking-tighter leading-none mb-4"
          >
            PLAY
            <br />
            <span className="text-red-600">HARD.</span>
          </motion.h2>
          <p className="text-white/40 uppercase tracking-widest text-sm md:text-base max-w-xl">
            Plonge dans le chaos. Tire, nettoie, lance.
          </p>
        </div>

        {/* Games Grid/Layout */}
        <div className="flex flex-col gap-12 md:gap-24">
          
          {/* Shooter (Full width) */}
          <div className="w-full">
            <ShooterGame />
          </div>

          {/* Cleaner & Bottle Flip (Side by Side on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            <CleanerGame />
            <BottleFlip />
          </div>

        </div>

      </div>
    </section>
  );
}
