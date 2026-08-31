'use client';

import { useState } from 'react';
import Link from 'next/link';
import BlinkLogo from './BlinkLogo';

interface PageTransitionProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function TransitionLink({ href, className = '', children, onClick }: PageTransitionProps) {
  const [transitioning, setTransitioning] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    if (window.location.pathname === href) return;

    e.preventDefault();
    setTransitioning(true);

    setTimeout(() => {
      window.location.href = href;
    }, 600);
  };

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>

      {transitioning && (
        <div className="fixed inset-0 z-[250] bg-[#FDFDFD] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <BlinkLogo className="w-48 h-48 sm:w-64 sm:h-64" />
        </div>
      )}
    </>
  );
}
