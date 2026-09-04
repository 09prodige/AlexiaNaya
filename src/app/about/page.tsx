import PixelReveal from '@/components/PixelReveal';

export default function AboutPage() {
  return (
    <main className="min-h-screen relative pt-32 pb-24 px-6 md:px-12 selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start relative z-10">
        
        {/* Left Column - Pixel Reveal Effect */}
        <div className="w-full md:w-5/12 flex justify-center md:justify-start md:sticky top-32">
          {/* We use an arbitrary photo from the Photographies folder to demonstrate the effect */}
          <PixelReveal 
            src="/assets/Photographies/Photos/IMG_8236.jpg" 
            alt="Alexia Naya"
            gridSize={12}
            className="w-full aspect-[3/4] rounded-xl shadow-2xl"
          />
        </div>

        {/* Right Column - Content */}
        <div className="w-full md:w-7/12 flex flex-col gap-10 text-white pt-4">
          <div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-none mb-6">
              À propos
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed">
              Alexia Naya est une directrice artistique, photographe et illustratrice basée en France.
            </p>
          </div>

          <div className="space-y-6 text-white/60 text-base md:text-lg leading-relaxed font-light">
            <p>
              Spécialisée dans la création visuelle pour le secteur musical, l'événementiel culturel et l'édition, son travail s'articule autour d'une esthétique percutante, poétique et engagée.
            </p>
            <p>
              Chaque projet fait l'objet d'une recherche sur-mesure pour créer des identités visuelles fortes, des affiches emblématiques et des séries photographiques immersives.
            </p>
          </div>

          {/* Expertises */}
          <div className="border-t border-white/10 pt-8 mt-4">
            <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-white/40 mb-6">
              Domaines d'intervention
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base font-medium tracking-wide">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Direction Artistique & Branding
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Création d'Affiches & Packagings
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Photographie Studio & Éditorial
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Cover Art & Pochettes d'album
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Illustration sur-mesure
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Production Vidéo & Audiovisuelle
              </li>
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}
