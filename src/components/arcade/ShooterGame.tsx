'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Splatter {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}

interface Target {
  id: number;
  x: number;
  y: number;
  src: string;
  speed: number;
}

const TARGET_IMAGES = [
  '/assets/db3cc121dd9c577e3a3590496bf36911-removebg-preview.png', // biche (deer)
  '/assets/ecbb9a83e0e5e7c244c69ec4a8bdf789-removebg-preview.png', // target silhouette
  '/assets/image-removebg-preview (4).png', // bullseye
];

const SPLATTER_COLORS = ['#ff0044', '#8a0303', '#cc0000', '#ff3366', '#ff00ff'];

export default function ShooterGame() {
  const [splatters, setSplatters] = useState<Splatter[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spawn targets randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (targets.length > 5) return; // Max 5 targets at a time
      
      const newTarget: Target = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        src: TARGET_IMAGES[Math.floor(Math.random() * TARGET_IMAGES.length)],
        speed: Math.random() * 2 + 1,
      };
      setTargets(prev => [...prev, newTarget]);
    }, 1500);

    return () => clearInterval(interval);
  }, [targets.length]);

  const handleShoot = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add splatter
    const newSplatter: Splatter = {
      id: Date.now(),
      x,
      y,
      size: Math.random() * 80 + 40,
      rotation: Math.random() * 360,
      color: SPLATTER_COLORS[Math.floor(Math.random() * SPLATTER_COLORS.length)],
    };
    setSplatters(prev => [...prev, newSplatter]);
  };

  const handleTargetHit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent duplicate splatter from container click
    setTargets(prev => prev.filter(t => t.id !== id));
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add bigger splatter for hit
    const newSplatter: Splatter = {
      id: Date.now(),
      x,
      y,
      size: Math.random() * 120 + 80,
      rotation: Math.random() * 360,
      color: '#ff0000', // pure red for hits
    };
    setSplatters(prev => [...prev, newSplatter]);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] bg-[#0a0a0a] overflow-hidden border-4 border-red-600/30 cursor-crosshair group rounded-xl"
      onClick={handleShoot}
      style={{
        backgroundImage: `url('/assets/lahaine.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none transition-colors group-hover:bg-black/30 duration-500" />
      
      <div className="absolute top-4 left-4 text-red-600 font-['Anton'] text-3xl tracking-widest pointer-events-none opacity-50 z-10">
        SHOOTING RANGE
      </div>

      {/* Splatters */}
      {splatters.map(splat => (
        <div
          key={splat.id}
          className="absolute pointer-events-none mix-blend-screen"
          style={{
            left: splat.x,
            top: splat.y,
            width: splat.size,
            height: splat.size,
            backgroundColor: splat.color,
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', // Organic blob shape
            transform: `translate(-50%, -50%) rotate(${splat.rotation}deg)`,
            filter: 'blur(2px)',
            opacity: 0.8,
            transition: 'opacity 3s ease-out',
          }}
        />
      ))}

      {/* Targets */}
      {targets.map(target => (
        <button
          key={target.id}
          onClick={(e) => handleTargetHit(e, target.id)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: '120px',
            height: '120px',
            animation: `float-deco ${target.speed}s ease-in-out infinite alternate`,
          }}
        >
          <img src={target.src} alt="Target" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
        </button>
      ))}

      {/* Custom Crosshair visually follows cursor? Or just rely on native cursor-crosshair. Native is smoother. */}
    </div>
  );
}
