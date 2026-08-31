import BlinkLogo from '@/components/BlinkLogo';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black pt-32 pb-24 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        
        {/* Title */}
        <header className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-none">
            Contact
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            Une idée, une collaboration ou un projet ? Écrivez-nous.
          </p>
        </header>

        {/* Contact details & Social links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-black/10 pt-12">
          
          {/* Direct Info */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 block mb-2">
                Email
              </span>
              <a 
                href="mailto:contact@alexiadoliveira.com" 
                className="text-xl md:text-3xl font-medium tracking-tight hover:opacity-60 transition-opacity underline decoration-1 underline-offset-4"
              >
                contact@alexiadoliveira.com
              </a>
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 block mb-2">
                Localisation
              </span>
              <p className="text-lg md:text-xl font-light text-gray-800">
                Paris / France — Disponible à l'international
              </p>
            </div>
          </div>

          {/* Social Links (Instagram / Facebook requested here) */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 block mb-4">
                Réseaux Sociaux
              </span>
              <div className="flex flex-col gap-3 text-lg md:text-2xl font-medium tracking-wide">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:translate-x-2 transition-transform duration-300 flex items-center gap-3 w-fit"
                >
                  <span className="text-gray-400 text-sm">↗</span> INSTAGRAM
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:translate-x-2 transition-transform duration-300 flex items-center gap-3 w-fit"
                >
                  <span className="text-gray-400 text-sm">↗</span> FACEBOOK
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Visual Touch */}
        <div className="flex justify-center pt-8 border-t border-black/5">
          <BlinkLogo className="w-32 h-32 md:w-48 md:h-48" />
        </div>

      </div>
    </main>
  );
}
