'use client';

import { useState, useRef, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnd = () => {
    if (fading) return;
    setFading(true);
    sessionStorage.setItem('preloader_seen', 'true');
    setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 800);
  };

  // Safety fallback & Session check
  useEffect(() => {
    if (sessionStorage.getItem('preloader_seen') || window.innerWidth < 768) {
      setVisible(false);
      onComplete();
      return;
    }
    
    setShowVideo(true);
    const timer = setTimeout(handleEnd, 12000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black transition-opacity duration-700 ease-in-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={handleEnd}
    >
      {showVideo && (
        <>
          <video
            ref={videoRef}
            src="/assets/BOUCLE TEMPORELLE_Naya.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleEnd}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Skip hint */}
          <span className="absolute bottom-8 right-8 text-white/40 text-xs uppercase tracking-widest select-none">
            Cliquer pour passer
          </span>
        </>
      )}
    </div>
  );
}

