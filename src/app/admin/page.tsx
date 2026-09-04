'use client';

import { useState } from 'react';
import { DISCIPLINES } from '@/lib/disciplines';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(DISCIPLINES[0].id);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // En développement local, on ne vérifie pas pour faciliter la création, 
    // en prod, ça appelera une route sécurisée. Pour l'instant on check si ce n'est pas vide.
    if (password.length > 0) {
      setIsAuthenticated(true);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('password', password); // Basic auth pass-through

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      setStatus('success');
      setFile(null);
      setTitle('');
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-xl max-w-sm w-full border border-white/10">
          <h1 className="font-['Anton'] text-4xl text-white mb-6 uppercase">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full p-3 bg-black text-white border border-white/20 rounded focus:border-white outline-none transition-colors mb-6"
            required
          />
          <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 hover:bg-gray-200 transition-colors rounded">
            Entrer
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-['Anton'] text-5xl uppercase mb-2">Ajouter un projet</h1>
        <p className="text-white/50 mb-12 uppercase tracking-widest text-sm">Base de données Supabase</p>

        {status === 'success' && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded mb-8">
            ✓ Upload réussi et sauvegardé dans la base !
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded mb-8">
            ✕ {errorMessage}
            <br/><span className="text-xs opacity-70">(As-tu bien rempli tes clés dans le fichier .env ?)</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-white/10">
          
          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">Fichier (Image ou Vidéo)</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-black file:font-bold hover:file:bg-gray-200 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">Titre du projet</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Cover Album 2026"
              className="w-full p-3 bg-black text-white border border-white/20 rounded focus:border-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-black text-white border border-white/20 rounded focus:border-white outline-none transition-colors"
            >
              {DISCIPLINES.map(d => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={status === 'uploading' || !file}
            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 mt-4 hover:bg-gray-200 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'uploading' ? 'Envoi en cours...' : 'Sauvegarder et Mettre en ligne'}
          </button>

        </form>
      </div>
    </div>
  );
}
