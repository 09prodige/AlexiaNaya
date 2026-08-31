import BlinkLogo from '@/components/BlinkLogo';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black pt-32 pb-24 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        
        {/* Left Column - Large Animated Logo */}
        <div className="w-full md:w-5/12 flex justify-center md:justify-start sticky top-36">
          <BlinkLogo className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96" />
        </div>

        {/* Right Column - Content */}
        <div className="w-full md:w-7/12 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-none mb-6">
              À propos
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed">
              Alexia D'Oliveira est une directrice artistique, photographe et illustratrice basée en France.
            </p>
          </div>

          <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed font-light">
            <p>
              Spécialisée dans la création visuelle pour le secteur musical, l'événementiel culturel et l'édition, son travail s'articule autour d'une esthétique percutante, poétique et engagée.
            </p>
            <p>
              Chaque projet fait l'objet d'une recherche sur-mesure pour créer des identités visuelles fortes, des affiches emblématiques et des séries photographiques immersives.
            </p>
          </div>

          {/* Expertises */}
          <div className="border-t border-black/10 pt-8 mt-4">
            <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 mb-6">
              Domaines d'intervention
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base font-medium tracking-wide">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Direction Artistique & Branding
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Création d'Affiches & Packagings
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Photographie Studio & Éditorial
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Cover Art & Pochettes d'album
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Illustration sur-mesure
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Production Vidéo & Audiovisuelle
              </li>
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}
