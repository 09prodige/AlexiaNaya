'use client';

import { useEffect, useState } from 'react';

const DECO_IMAGES = ['', '1', '2', '4', '5', '6', '7', '8'].map(n => `/assets/pinterest${n}.jpg`);

export default function FloatingDeco() {
  const [mounted, setMounted] = useState(false);
  const [positions, setPositions] = useState<{ top: string; left: string; width: string; duration: string; delay: string; rotation: string; zIndex: number }[]>([]);

  useEffect(() => {
    // Generate random positions once on client to avoid hydration mismatch
    const pos = DECO_IMAGES.map(() => ({
      top: `${Math.random() * 80 + 5}%`,
      left: `${Math.random() * 80 + 5}%`,
      width: `${Math.random() * 200 + 100}px`,
      duration: `${Math.random() * 15 + 25}s`,
      delay: `-${Math.random() * 20}s`, // Negative delay so they start immediately at different phases
      rotation: `${Math.random() * 360}deg`,
      zIndex: Math.random() > 0.5 ? 30 : 0
    }));
    setPositions(pos);
    setMounted(true);
  }, []);

  if (!mounted || positions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
      {DECO_IMAGES.map((src, i) => (
        <div
          key={i}
          className="absolute mix-blend-screen invert opacity-30 transition-opacity duration-1000"
          style={{
            top: positions[i].top,
            left: positions[i].left,
            width: positions[i].width,
            animation: `float-deco ${positions[i].duration} ease-in-out infinite alternate`,
            animationDelay: positions[i].delay,
            transform: `rotate(${positions[i].rotation})`,
            zIndex: positions[i].zIndex
          }}
        >
          <img src={src} alt="Deco Pinterest" className="w-full h-auto object-contain" />
        </div>
      ))}
    </div>
  );
}
