export default function CGVPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black pt-32 pb-24 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        <header className="border-b border-black/10 pb-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none mb-4">
            Conditions Générales de Vente (CGV)
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-gray-400">
            Dernière mise à jour : 2026
          </p>
        </header>

        <div className="space-y-10 text-gray-700 leading-relaxed font-light text-base md:text-lg">
          
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">
              1. Objet & Champs d'application
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des prestations de création graphique, direction artistique, photographie, illustration et production vidéo proposées par Alexia D'Oliveira Studio à ses clients professionnels et particuliers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">
              2. Commandes & Devis
            </h2>
            <p>
              Toute prestation fait l’objet d’un devis préalable valable 30 jours à compter de sa date d’émission. La commande est définitivement validée après réception du devis signé portant la mention « Bon pour accord », accompagné du versement d’un acompte de 30%.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">
              3. Droits d'Auteur & Propriété Intellectuelle
            </h2>
            <p>
              Conformément au Code de la Propriété Intellectuelle (article L. 122-4), les créations visuelles (illustrations, affiches, photographies, éléments de branding) restent la propriété artistique exclusive d’Alexia D’Oliveira. Les droits d'exploitation et de diffusion cédés au client sont spécifiquement détaillés sur la facture finale (durée, zone géographique, supports).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">
              4. Modalités de Paiement
            </h2>
            <p>
              Le solde des prestations est payable à réception de la facture finale. En cas de retard de paiement, des pénalités équivalentes à trois fois le taux d'intérêt légal en vigueur seront appliquées automatiquement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">
              5. Annulation & Modification
            </h2>
            <p>
              En cas d'annulation de la commande par le client après sa validation, l'acompte versé reste acquis à Alexia D'Oliveira Studio au titre des recherches créatives engagées.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
