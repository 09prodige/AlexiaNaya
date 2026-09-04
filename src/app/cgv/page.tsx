import { TransitionLink } from '@/components/PageTransition';

export default function CGVPage() {
  return (
    <main className="min-h-screen relative pt-32 pb-24 px-6 md:px-12 selection:bg-white selection:text-black">
      
      {/* Huge Watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1] opacity-[0.03]">
        <h1 className="font-['Anton'] text-[25vw] leading-none uppercase text-white whitespace-nowrap">
          ALEXIA NAYA
        </h1>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-12 relative z-10">
        
        <header className="border-b border-white/10 pb-8">
          <TransitionLink href="/" className="inline-block text-white/50 hover:text-white uppercase tracking-widest text-xs mb-8 transition-colors">
            ← Retour à l'accueil
          </TransitionLink>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none mb-4">
            Conditions Générales de Vente (CGV)
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-white/40">
            Dernière mise à jour : 2026
          </p>
        </header>

        <div className="space-y-10 text-white/70 leading-relaxed font-light text-base md:text-lg">
          
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              1. Objet & Champs d'application
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des prestations de création graphique, direction artistique, photographie, illustration et production vidéo proposées par Alexia Naya (Alexia D'Oliveira Studio) à ses clients professionnels et particuliers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              2. Commandes & Devis
            </h2>
            <p>
              Toute prestation fait l’objet d’un devis préalable valable 30 jours à compter de sa date d’émission. La commande est définitivement validée après réception du devis signé portant la mention « Bon pour accord », accompagné du versement d’un acompte de 30%.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              3. Droits d'Auteur & Propriété Intellectuelle
            </h2>
            <p>
              Conformément au Code de la Propriété Intellectuelle (article L. 122-4), les créations visuelles (illustrations, affiches, photographies, éléments de branding) restent la propriété artistique exclusive d’Alexia Naya. Les droits d'exploitation et de diffusion cédés au client sont spécifiquement détaillés sur la facture finale (durée, zone géographique, supports).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              4. Modalités de Paiement
            </h2>
            <p>
              Le solde des prestations est payable à réception de la facture finale. En cas de retard de paiement, des pénalités équivalentes à trois fois le taux d'intérêt légal en vigueur seront appliquées automatiquement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              5. Annulation & Modification
            </h2>
            <p>
              En cas d'annulation de la commande par le client après sa validation, l'acompte versé reste acquis à Alexia Naya Studio au titre des recherches créatives engagées.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
