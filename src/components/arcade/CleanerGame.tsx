'use client';

import { useState, useRef } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';

// Trash items can just be simple emoji or basic CSS shapes for a grunge look
const TRASH_ITEMS = [
  { id: 1, type: 'crumpled-paper', x: -100, y: 150 },
  { id: 2, type: 'bottle', x: 120, y: 180 },
  { id: 3, type: 'can', x: 50, y: 80 },
  { id: 4, type: 'crumpled-paper', x: -150, y: 50 },
  { id: 5, type: 'can', x: -40, y: 200 },
];

export default function CleanerGame() {
  const [items, setItems] = useState(TRASH_ITEMS);
  const [inBucket, setInBucket] = useState<number[]>([]);
  const [spilled, setSpilled] = useState(false);
  const bucketControls = useAnimation();
  const bucketRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = async (e: any, info: PanInfo, id: number) => {
    if (spilled) return;

    if (!bucketRef.current) return;
    const bucketRect = bucketRef.current.getBoundingClientRect();
    
    // Check if pointer is inside bucket
    if (
      info.point.x > bucketRect.left &&
      info.point.x < bucketRect.right &&
      info.point.y > bucketRect.top &&
      info.point.y < bucketRect.bottom
    ) {
      setInBucket(prev => {
        const next = [...prev, id];
        
        // If all items are in, trigger spill after a small delay
        if (next.length === TRASH_ITEMS.length) {
          setTimeout(triggerSpill, 1000);
        }
        
        // Wobble the bucket slightly
        bucketControls.start({
          rotate: [0, -10, 10, -5, 5, 0],
          transition: { duration: 0.4 }
        });
        
        return next;
      });
    }
  };

  const triggerSpill = async () => {
    setSpilled(true);
    
    // Animate bucket falling over
    await bucketControls.start({
      rotate: 110,
      y: 80,
      transition: { type: "spring", stiffness: 200, damping: 12 }
    });

    // Reset items out of bucket (spill them out)
    setInBucket([]);
    
    // Allow reset
    setTimeout(() => {
      setSpilled(false);
      bucketControls.start({ rotate: 0, y: 0, transition: { duration: 0.5 } });
    }, 2000);
  };

  return (
    <div className="relative w-full h-[600px] bg-zinc-900 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 group">
      
      <div className="absolute top-8 text-center w-full z-0 pointer-events-none">
        <h2 className="font-['Anton'] text-4xl text-zinc-700 tracking-wider mb-2 group-hover:text-zinc-500 transition-colors">CLEAN UP</h2>
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          {inBucket.length === TRASH_ITEMS.length ? "..." : "Ramasse les déchets"}
        </p>
      </div>

      {/* Bucket */}
      <motion.div
        ref={bucketRef}
        animate={bucketControls}
        style={{ originY: 1, originX: 0.5 }}
        className="absolute bottom-20 w-32 h-40 bg-zinc-800 border-4 border-zinc-700 rounded-b-xl rounded-t-sm flex items-center justify-center shadow-2xl z-20"
      >
        <div className="absolute -top-4 w-36 h-8 border-4 border-zinc-700 rounded-[50%] bg-zinc-900" />
        <span className="font-['Anton'] text-zinc-700 text-2xl -rotate-90 opacity-50 select-none">TRASH</span>
      </motion.div>

      {/* Trash Items */}
      {items.map((item) => (
        <motion.div
          key={item.id}
          drag={!spilled && !inBucket.includes(item.id)}
          dragElastic={0.1}
          onDragEnd={(e, info) => handleDragEnd(e, info, item.id)}
          initial={{ x: item.x, y: item.y }}
          animate={{
            x: inBucket.includes(item.id) ? (Math.random() * 20 - 10) : (spilled ? (item.x * (Math.random() * 2 + 1)) : item.x),
            y: inBucket.includes(item.id) ? 200 : (spilled ? 250 : item.y),
            scale: inBucket.includes(item.id) ? 0 : 1,
            rotate: inBucket.includes(item.id) ? 180 : 0,
            opacity: inBucket.includes(item.id) ? 0 : 1
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className={`absolute w-12 h-12 cursor-grab active:cursor-grabbing z-30 flex items-center justify-center text-3xl`}
          style={{ touchAction: "none" }}
        >
          {item.type === 'crumpled-paper' && '📄'}
          {item.type === 'bottle' && '🍾'}
          {item.type === 'can' && '🥫'}
        </motion.div>
      ))}

      {/* Ground */}
      <div className="absolute bottom-16 w-full h-px bg-zinc-800" />
    </div>
  );
}
