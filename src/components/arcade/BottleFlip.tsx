'use client';

import { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';

export default function BottleFlip() {
  const [status, setStatus] = useState<'idle' | 'flipping' | 'landed' | 'failed'>('idle');
  const controls = useAnimation();

  const handleDragEnd = async (e: any, info: PanInfo) => {
    if (status === 'flipping') return;
    
    // Swipe up
    if (info.velocity.y < -300) {
      setStatus('flipping');
      
      const velocity = Math.abs(info.velocity.y);
      const rotations = Math.floor(velocity / 300); // 1 rotation per 300px/s velocity
      const targetRotation = Math.max(1, rotations) * 360;
      
      const height = Math.min(velocity * 0.4, 300); // How high it goes

      // Animate up and spin
      await controls.start({
        y: -height,
        rotate: targetRotation / 2,
        transition: { duration: 0.35, ease: "easeOut" }
      });

      // Animate down and finish spin
      await controls.start({
        y: 0,
        rotate: targetRotation,
        transition: { duration: 0.35, ease: "easeIn" }
      });

      // Simple success check (70% success if you flick hard enough)
      if (Math.random() > 0.3) {
        setStatus('landed'); // Success
      } else {
        // Fail
        await controls.start({
          rotate: targetRotation + (Math.random() > 0.5 ? 90 : -90),
          y: 40, // Falls over
          transition: { type: "spring", stiffness: 200, damping: 10 }
        });
        setStatus('failed');
      }
    } else {
      // Return to original position if swipe was too weak
      controls.start({ x: 0, y: 0, rotate: 0 });
    }
  };

  const reset = () => {
    setStatus('idle');
    controls.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.3 } });
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-t from-[#050505] to-[#111111] flex flex-col items-center justify-end pb-12 overflow-hidden rounded-xl border border-white/5 group">
      
      <div className="absolute top-12 text-center w-full z-20">
        <h2 className="font-['Anton'] text-5xl text-white tracking-widest mb-4 opacity-30 group-hover:opacity-100 transition-opacity">BOTTLE FLIP</h2>
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase">
          {status === 'idle' && "Glisse la bouteille vers le haut"}
          {status === 'flipping' && "..."}
          {status === 'landed' && <span className="text-green-500 font-bold">PERFECT!</span>}
          {status === 'failed' && <span className="text-red-500 font-bold">RATE.</span>}
        </p>
      </div>

      {status !== 'idle' && status !== 'flipping' && (
        <button 
          onClick={reset}
          className="absolute top-32 px-8 py-3 border border-white/20 text-white text-xs tracking-widest uppercase rounded hover:bg-white hover:text-black transition-colors z-20"
        >
          Rejouer
        </button>
      )}

      {/* Ground Line */}
      <div className="absolute bottom-[3rem] w-3/4 max-w-sm h-px bg-white/10" />

      {/* Bottle */}
      <motion.div
        drag={status === 'idle'}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ originY: 1 }} // Rotate around the bottom center
        className="relative z-10 cursor-grab active:cursor-grabbing"
      >
        <img 
          src="/assets/bouteille.png" 
          alt="Bouteille" 
          className="w-24 h-auto drop-shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all"
          draggable="false"
        />
      </motion.div>
    </div>
  );
}
