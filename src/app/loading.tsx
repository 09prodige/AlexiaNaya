import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[300] bg-[#111111] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <Image 
          src="/assets/LOGO ALEXIA NAYA-04.png" 
          alt="Chargement..." 
          width={250} 
          height={100}
          className="object-contain invert mix-blend-screen" 
          priority
        />
        <div className="mt-8 text-white/30 text-xs uppercase tracking-[0.4em] font-['Anton'] animate-bounce">
          Chargement...
        </div>
      </div>
    </div>
  );
}
