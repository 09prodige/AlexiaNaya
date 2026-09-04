'use client';

import { useState } from 'react';
import { DISCIPLINES } from '@/lib/disciplines';

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="w-full min-h-screen bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 flex flex-col justify-center border-t border-white/10">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
        
        {/* Left Column: Infos & Socials */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="font-['Anton'] text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-8 text-[#E34040]">
              Travaillons<br />Ensemble
            </h2>
            <p className="text-white/60 text-sm md:text-base max-w-md leading-relaxed mb-12">
              Un projet de branding, une séance photo ou une direction artistique complète ? Parlez-moi de votre vision et je reviendrai vers vous avec une proposition sur mesure.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-3">Email</p>
                <a href="mailto:nayadoliv03@gmail.com" className="group flex items-center gap-3 text-base md:text-xl font-bold hover:text-[#E34040] transition-colors break-all">
                  <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#E34040]/10 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  nayadoliv03@gmail.com
                </a>
              </div>
              <div>
                <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-3">Réseaux Sociaux & Contact</p>
                <div className="flex flex-col gap-4">
                  <a href="https://wa.me/33758500648" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white hover:text-[#E34040] uppercase text-sm tracking-widest font-bold transition-colors w-fit">
                    <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#E34040]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    </div>
                    WhatsApp
                  </a>
                  <a href="https://www.instagram.com/alexiadoliveira?igsi=MTBscjh0cTlkYXdmdQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white hover:text-[#E34040] uppercase text-sm tracking-widest font-bold transition-colors w-fit">
                    <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#E34040]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </div>
                    Instagram
                  </a>
                  <a href="http://www.tiktok.com/@alexianaya31" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white hover:text-[#E34040] uppercase text-sm tracking-widest font-bold transition-colors w-fit">
                    <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#E34040]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                    </div>
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quote Form */}
        <div className="bg-[#1a1a1a] p-8 md:p-10 rounded-3xl border border-white/10">
          <h3 className="font-['Anton'] text-3xl uppercase mb-6">Demander un devis</h3>
          
          {status === 'success' ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-3xl mb-4">✓</div>
              <h4 className="text-2xl font-bold mb-2">Demande envoyée !</h4>
              <p className="text-white/50">Je reviens vers vous dans les plus brefs délais.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-xs uppercase tracking-widest border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all">
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Nom / Entreprise</label>
                  <input required type="text" id="name" name="name" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#E34040] outline-none transition-colors" placeholder="Votre nom" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Email</label>
                  <input required type="email" id="email" name="email" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#E34040] outline-none transition-colors" placeholder="vous@exemple.com" />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Type de projet</label>
                <select required id="category" name="category" defaultValue="" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#E34040] outline-none transition-colors text-white">
                  <option value="" disabled>Sélectionnez une catégorie...</option>
                  {DISCIPLINES.map(d => (
                    <option key={d.id} value={d.label}>{d.label}</option>
                  ))}
                  <option value="Autre">Autre projet créatif</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="timeline" className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Délai souhaité</label>
                  <select required id="timeline" name="timeline" defaultValue="Normal (1 mois)" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#E34040] outline-none transition-colors text-white">
                    <option value="Urgent (Moins de 2 semaines)">Urgent (&lt; 2 semaines)</option>
                    <option value="Normal (1 mois)">Normal (~1 mois)</option>
                    <option value="Flexible (+ de 2 mois)">Flexible (+ de 2 mois)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Budget (Optionnel)</label>
                  <input type="text" id="budget" name="budget" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#E34040] outline-none transition-colors" placeholder="Ex: 500€ - 1500€" />
                </div>
              </div>

              <div>
                <label htmlFor="details" className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Détails du projet</label>
                <textarea required id="details" name="details" rows={4} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#E34040] outline-none transition-colors resize-none" placeholder="Décrivez votre vision, vos besoins, le contexte..."></textarea>
              </div>

              {status === 'error' && <p className="text-red-400 text-sm">✕ Une erreur est survenue, veuillez réessayer.</p>}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[#E34040] hover:text-white transition-all disabled:opacity-50 text-sm"
              >
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
