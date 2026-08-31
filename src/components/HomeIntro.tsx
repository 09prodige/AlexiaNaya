'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HomeIntro() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (titleRef.current && descRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );
      gsap.fromTo(
        descRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.4 }
      );
    }
  }, []);

  return (
    <header className="mb-20 mt-8 md:mt-16 w-full">
      <h1 ref={titleRef} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] uppercase break-words">
        ALEXIA<br/>D'OLIVEIRA
      </h1>
      <p ref={descRef} className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-500 max-w-2xl font-light leading-relaxed">
        Graphic design studio specialized in art direction, photography and illustration.
      </p>
    </header>
  );
}
