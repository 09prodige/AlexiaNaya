'use client';

import { useState, useEffect } from 'react';
import Preloader from '@/components/Preloader';
import HeroTitle from '@/components/HeroTitle';
import CardDeck from '@/components/CardDeck';
import ArcadeSection from '@/components/ArcadeSection';
import DisciplineModal from '@/components/DisciplineModal';
import FloatingDeco from '@/components/FloatingDeco';
import { CategoryData } from '@/lib/getPortfolio';

interface HomeClientProps {
  categories: CategoryData[];
}

export default function HomeClient({ categories }: HomeClientProps) {
  const [phase, setPhase] = useState<'preloader' | 'content'>('preloader');
  const [openCategory, setOpenCategory] = useState<CategoryData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && phase === 'content') {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) {
        const cat = categories.find(c => c.disciplineId.toLowerCase() === catParam.toLowerCase());
        if (cat) {
          setOpenCategory(cat);
          // Remove param so it doesn't stay in URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  }, [phase, categories]);

  return (
    <main className="bg-[#111111] min-h-screen overflow-x-hidden relative">
      {/* ① Video preloader */}
      {phase === 'preloader' && (
        <Preloader onComplete={() => setPhase('content')} />
      )}

      {/* ② Hero title + ③ Card deck + ④ Arcade */}
      {phase === 'content' && (
        <>
          <FloatingDeco />
          <HeroTitle />
          <CardDeck
            categories={categories}
            onOpenDiscipline={(cat) => setOpenCategory(cat)}
          />
          <ArcadeSection />
        </>
      )}

      {/* ④ Discipline modal overlay */}
      {openCategory && (
        <DisciplineModal
          category={openCategory}
          onClose={() => setOpenCategory(null)}
        />
      )}
    </main>
  );
}
