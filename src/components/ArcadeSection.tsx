'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DbItem {
  title: string;
  type: 'image' | 'video';
  url: string;
}

interface ArcadeItem {
  src: string;
  title: string;
  artist: string;
  type: 'image' | 'video';
}

const POCHETTES: ArcadeItem[] = [
  { src: '/assets/Pochettes/Pochettes/JONEZ-POCHETTE.png',        title: 'Jonez',           artist: 'Alexia Naya', type: 'image' },
  { src: '/assets/Pochettes/Pochettes/LEAM-ENCORE-V2.png',        title: 'Encore',          artist: 'LEAM',        type: 'image' },
  { src: '/assets/Pochettes/Pochettes/PRODI9E-J9-FACE-A.png',     title: 'J-09 Face A',     artist: 'PRODI9E',     type: 'image' },
  { src: '/assets/Pochettes/Pochettes/PATEK---ROLLIE---CCICO-FINAL-2.png', title: 'Patek & Rollie', artist: 'CCICO', type: 'image' },
  { src: '/assets/Pochettes/Pochettes/JONEZZZ.png',               title: 'JONEZZZ',         artist: 'Alexia Naya', type: 'image' },
  { src: '/assets/Pochettes/Pochettes/MAKE-MORE-ZFN.jpg',         title: 'Make More',       artist: 'ZFN',         type: 'image' },
  { src: '/assets/Pochettes/Pochettes/41a4dd4b-614d-4765-8ae8-66d2597df403_rw_1920.png', title: 'Cover Art', artist: 'Studio', type: 'image' },
  { src: '/assets/Pochettes/Pochettes/371c7066-7f39-4846-b50f-4cae944d4088_rw_1920.jpg', title: 'Artwork', artist: 'Studio', type: 'image' },
];

function isValidTitle(title: string | null | undefined): boolean {
  if (!title) return false;
  if (title.trim() === '') return false;
  // Exclude raw filenames with extensions
  if (/\.(jpg|jpeg|png|webp|avif|gif|mp4|webm|mov)$/i.test(title)) return false;
  // Exclude UUID-based filenames
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/i.test(title)) return false;
  return true;
}

export default function ArcadeSection({ dbItems = [] }: { dbItems?: DbItem[] }) {
  // Extract valid items from DB
  const validDbItems: ArcadeItem[] = dbItems
    .filter(item => isValidTitle(item.title) && item.url)
    .map(item => ({
      src: item.url,
      title: item.title || '',
      artist: 'Alexia Naya',
      type: item.type
    }));

  const items = validDbItems.length > 0 ? validDbItems : POCHETTES;

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Vinyl spin animation
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const spin = (time: number) => {
      if (lastTimeRef.current) {
        const delta = time - lastTimeRef.current;
        setRotation((r) => r + delta * 0.06); // ~21.6 RPM
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying]);

  const current = items[activeIdx];
  const prev = () => { setActiveIdx((i) => (i - 1 + items.length) % items.length); lastTimeRef.current = 0; };
  const next = () => { setActiveIdx((i) => (i + 1) % items.length); lastTimeRef.current = 0; };

  if (!current) return null;

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0a] pt-24 pb-32 overflow-hidden border-t border-white/5">

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <p className="text-white/30 uppercase tracking-[0.4em] text-xs mb-4">Cover Art & Direction Artistique</p>
          <h2 className="font-['Anton'] text-6xl md:text-8xl text-white tracking-tighter leading-none">
            QUELQUES<br />
            <span className="text-white/20">POCHETTES</span>
          </h2>
        </motion.div>

        {/* Main Player */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

          {/* Vinyl Record */}
          <div className="relative flex-shrink-0">
            {/* Outer vinyl ring */}
            <div
              className="relative w-72 h-72 md:w-96 md:h-96 rounded-full"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Vinyl grooves */}
              <div className="absolute inset-0 rounded-full bg-[#111]"
                style={{ boxShadow: 'inset 0 0 0 4px #222, inset 0 0 0 12px #111, inset 0 0 0 16px #1a1a1a, inset 0 0 0 28px #111, inset 0 0 0 32px #1a1a1a, inset 0 0 0 44px #111' }}
              />
              {/* Cover art in the center hole */}
              <div className="absolute inset-0 m-auto w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <AnimatePresence mode="wait">
                  {current.type === 'video' ? (
                    <motion.video
                      key={activeIdx}
                      src={current.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.img
                      key={activeIdx}
                      src={current.src}
                      alt={current.title}
                      className="w-full h-full object-cover text-transparent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </div>
              {/* Center dot */}
              <div className="absolute w-3 h-3 rounded-full bg-white/80 z-10" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            </div>

            {/* Tonearm */}
            <div
              className="absolute w-1 h-28 md:h-36 rounded-full pointer-events-none z-20"
              style={{
                background: 'linear-gradient(to bottom, #888, #555)',
                top: '0px',
                right: '-20px',
                transformOrigin: 'top center',
                transform: `rotate(${isPlaying ? 25 : 15}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <div className="w-3 h-3 rounded-full bg-white/60 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Info Panel */}
          <div className="flex flex-col gap-8 text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-white/30 uppercase tracking-widest text-xs mb-2">{current.artist}</p>
                <h3 className="font-['Anton'] text-4xl md:text-6xl text-white leading-none tracking-tight mb-6">
                  {current.title}
                </h3>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all"
              >
                ←
              </button>

              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all font-['Anton'] text-xl"
                style={{ backgroundColor: isPlaying ? 'white' : 'transparent', color: isPlaying ? '#111' : 'white', border: isPlaying ? 'none' : '2px solid rgba(255,255,255,0.4)' }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all"
              >
                →
              </button>
            </div>

            {/* Track count */}
            <p className="text-white/20 text-xs uppercase tracking-widest">
              {activeIdx + 1} / {items.length}
            </p>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="mt-20 flex gap-3 overflow-x-auto pb-4 scrollbar-none justify-center flex-wrap">
          {items.map((p, i) => (
            <button
              key={i}
              onClick={() => { setActiveIdx(i); lastTimeRef.current = 0; }}
              className="relative w-14 h-14 md:w-16 md:h-16 rounded overflow-hidden flex-shrink-0 transition-all duration-300 bg-[#111]"
              style={{ opacity: i === activeIdx ? 1 : 0.35, transform: i === activeIdx ? 'scale(1.15)' : 'scale(1)', outline: i === activeIdx ? '2px solid white' : 'none', outlineOffset: '2px' }}
            >
              {p.type === 'video' ? (
                <video src={p.src} className="w-full h-full object-cover" />
              ) : (
                <img src={p.src} alt={p.title} className="w-full h-full object-cover text-transparent" />
              )}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
