import ProjectCard from '@/components/ProjectCard';
import HomeIntro from '@/components/HomeIntro';
import { getCategoriesData, CategoryData } from '@/lib/getPortfolio';

export default function Home() {
  const categories: CategoryData[] = getCategoriesData();

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black pt-24 pb-32 selection:bg-black selection:text-white">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header / Intro section with GSAP reveal animation */}
        <HomeIntro />

        {/* Organic Masonry Layout */}
        <div className="columns-1 md:columns-2 gap-8 md:gap-12 w-full space-y-12">
          {categories.map((cat) => (
            <div key={cat.id} className="break-inside-avoid">
              <ProjectCard 
                title={cat.title} 
                category={cat.categoryName} 
                imageUrl={cat.coverImage}
                items={cat.items}
              />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
