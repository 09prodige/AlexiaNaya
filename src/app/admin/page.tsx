'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DISCIPLINES } from '@/lib/disciplines';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface PortfolioItem {
  id: string;
  title: string | null;
  category_id: string;
  image_url: string;
  type: 'image' | 'video';
  sort_order: number | null;
  created_at: string;
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  category: string;
  timeline: string;
  budget: string | null;
  details: string;
  is_read: boolean;
  created_at: string;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// ─── Dialog System ────────────────────────────────────────────────────────────
type DialogConfig = {
  type: 'prompt' | 'confirm' | 'transfer';
  title: string;
  message?: string;
  defaultValue?: string;
  resolve: (val: any) => void;
} | null;

interface DialogHelpers {
  confirm: (title: string, message?: string) => Promise<boolean>;
  prompt: (title: string, defaultValue?: string) => Promise<string|null>;
  transfer: (title: string) => Promise<string|null>;
}

function DialogContainer({ dialog, onClose }: { dialog: DialogConfig, onClose: () => void }) {
  const [value, setValue] = useState('');
  
  useEffect(() => {
    if (dialog?.type === 'prompt' || dialog?.type === 'transfer') {
      setValue(dialog.defaultValue || '');
    }
  }, [dialog]);

  if (!dialog) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dialog.type === 'confirm') dialog.resolve(true);
    else dialog.resolve(value || null);
    onClose();
  };

  const handleCancel = () => {
    if (dialog.type === 'confirm') dialog.resolve(false);
    else dialog.resolve(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="font-['Anton'] text-2xl text-white uppercase mb-4">{dialog.title}</h3>
        {dialog.message && <p className="text-white/70 text-sm whitespace-pre-wrap mb-6">{dialog.message}</p>}
        
        <form onSubmit={handleSubmit}>
          {dialog.type === 'prompt' && (
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="w-full p-4 bg-black text-white border border-white/20 rounded-xl mb-6 text-sm outline-none focus:border-white transition-colors"
              autoFocus
            />
          )}
          
          {dialog.type === 'transfer' && (
            <select
              value={value}
              onChange={e => setValue(e.target.value)}
              className="w-full p-4 bg-black text-white border border-white/20 rounded-xl mb-6 text-sm outline-none focus:border-white appearance-none transition-colors"
              required
            >
              <option value="" disabled>Choisir une rubrique</option>
              {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleCancel} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors">
              Annuler
            </button>
            <button type="submit" className="px-6 py-3 rounded-xl bg-white hover:bg-gray-200 text-black text-xs font-bold uppercase tracking-widest transition-colors">
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    if (data.session) {
      onLogin(data.session.access_token);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] p-8 rounded-2xl max-w-sm w-full border border-white/10 shadow-2xl"
      >
        <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-2">Espace privé</p>
        <h1 className="font-['Anton'] text-5xl text-white mb-8 uppercase">Admin</h1>
        
        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
        
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-4 bg-black text-white border border-white/20 rounded-xl focus:border-white outline-none transition-colors mb-4 text-sm"
          required
        />
        <input
          type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
          placeholder="Mot de passe"
          className="w-full p-4 bg-black text-white border border-white/20 rounded-xl focus:border-white outline-none transition-colors mb-4 text-sm"
          required
        />
        <button disabled={loading} type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-100 transition-colors rounded-xl text-sm disabled:opacity-50">
          {loading ? 'Connexion...' : 'Entrer →'}
        </button>
      </form>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ token }: { token: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState(DISCIPLINES[0].id);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFiles(prev => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setStatus('uploading'); setError(''); setProgress(0);

    let done = 0;
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', category);
      fd.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/upload', { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd 
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Erreur upload');
        setStatus('error'); return;
      }
      done++;
      setProgress(Math.round((done / files.length) * 100));
    }

    setStatus('success'); setFiles([]);
    setTimeout(() => setStatus('idle'), 3000);
  };

  const disc = DISCIPLINES.find(d => d.id === category);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
      <h2 className="font-['Anton'] text-2xl text-white uppercase mb-6">Ajouter des projets</h2>

      {/* Category picker */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DISCIPLINES.map(d => (
          <button
            key={d.id}
            onClick={() => setCategory(d.id)}
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border"
            style={{
              backgroundColor: category === d.id ? d.color : 'transparent',
              color: category === d.id ? d.textColor : 'rgba(255,255,255,0.5)',
              borderColor: category === d.id ? d.color : 'rgba(255,255,255,0.1)',
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
        style={{ borderColor: dragging ? (disc?.color || 'white') : 'rgba(255,255,255,0.15)' }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <p className="text-white/30 text-sm">Glisse tes fichiers ici ou <span className="text-white underline">clique pour choisir</span></p>
        <p className="text-white/20 text-xs mt-1">Images et vidéos acceptées</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-lg">
              <span className="text-white/50 text-xs flex-1 truncate">{f.name}</span>
              <span className="text-white/30 text-xs">{(f.size / 1024 / 1024).toFixed(1)} Mo</span>
              <button onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 transition-colors text-xs">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      {status === 'uploading' && (
        <div className="mt-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-white/40 text-xs mt-1 text-right">{progress}%</p>
        </div>
      )}

      {status === 'success' && <p className="mt-4 text-green-400 text-sm">✓ {files.length === 0 ? 'Upload réussi !' : ''} Toutes les images ont été ajoutées.</p>}
      {status === 'error' && <p className="mt-4 text-red-400 text-sm">✕ {error}</p>}

      <button
        onClick={handleUpload}
        disabled={!files.length || status === 'uploading'}
        className="w-full mt-6 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        {status === 'uploading' ? `Envoi... ${progress}%` : `Mettre en ligne (${files.length} fichier${files.length > 1 ? 's' : ''})`}
      </button>
    </div>
  );
}

// ─── Gallery Manager ──────────────────────────────────────────────────────────
function GalleryManager({ token, dialogs }: { token: string, dialogs: DialogHelpers }) {
  const [category, setCategory] = useState(DISCIPLINES[0].id);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [customCatNames, setCustomCatNames] = useState<Record<string, string>>({});

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number, item: PortfolioItem | null }>({ visible: false, x: 0, y: 0, item: null });

  // Modals
  const [editingCatName, setEditingCatName] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/items?category=${category}`);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [category]);

  const fetchCatNames = useCallback(async () => {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const data = await res.json();
      const map: Record<string, string> = {};
      data.forEach((c: any) => { map[c.id] = c.label; });
      setCustomCatNames(map);
    }
  }, []);

  useEffect(() => { 
    fetchItems(); 
    fetchCatNames();
    
    // Close context menu on click anywhere
    const closeMenu = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [fetchItems, fetchCatNames]);

  const handleDragSort = async () => {
    if (dragItem.current === null || dragOver.current === null) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOver.current, 0, moved);
    const updated = reordered.map((item, idx) => ({ ...item, sort_order: idx }));
    setItems(updated);
    dragItem.current = null; dragOver.current = null;

    await fetch('/api/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'reorder', items: updated.map(i => ({ id: i.id, sort_order: i.sort_order })) }),
    });
  };

  const handleContextMenu = (e: React.MouseEvent, item: PortfolioItem) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item });
  };

  const handleDelete = async (id: string) => {
    const ok = await dialogs.confirm('Supprimer l\'image', 'Voulez-vous supprimer cette image définitivement ?');
    if (!ok) return;
    await fetch('/api/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleRenameItem = async (item: PortfolioItem) => {
    const newTitle = await dialogs.prompt('Nouveau titre pour cette image :', item.title || '');
    if (!newTitle) return;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, title: newTitle } : i));
    await fetch('/api/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'update', id: item.id, title: newTitle }),
    });
  };

  const handleTransfer = async (item: PortfolioItem) => {
    const destCatId = await dialogs.transfer('Transférer vers quelle rubrique ?');
    if (!destCatId) return;
    
    setItems(prev => prev.filter(i => i.id !== item.id));
    await fetch('/api/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'update', id: item.id, category_id: destCatId }),
    });
  };

  const handleRenameCategory = async () => {
    const currentName = customCatNames[category] || DISCIPLINES.find(d => d.id === category)?.label;
    const newName = await dialogs.prompt('Nouveau titre pour cette rubrique :', currentName);
    if (!newName) return;
    setCustomCatNames(prev => ({ ...prev, [category]: newName }));
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id: category, label: newName }),
    });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="font-['Anton'] text-2xl text-white uppercase flex flex-wrap items-center gap-4">
          Gérer : {customCatNames[category] || DISCIPLINES.find(d => d.id === category)?.label}
          <button onClick={handleRenameCategory} className="text-xs uppercase tracking-widest text-white/40 hover:text-white border border-white/20 px-3 py-1 rounded-full transition-colors font-sans">
            ✏️ Renommer
          </button>
        </h2>
        <button onClick={fetchItems} className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors">↺ Rafraîchir</button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DISCIPLINES.map(d => {
          const label = customCatNames[d.id] || d.label;
          return (
            <button
              key={d.id}
              onClick={() => setCategory(d.id)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border"
              style={{
                backgroundColor: category === d.id ? d.color : 'transparent',
                color: category === d.id ? d.textColor : 'rgba(255,255,255,0.5)',
                borderColor: category === d.id ? d.color : 'rgba(255,255,255,0.1)',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {loading && <p className="text-white/30 text-sm text-center py-12">Chargement...</p>}

      {!loading && items.length === 0 && (
        <p className="text-white/20 text-sm text-center py-12">Aucune image dans cette catégorie.<br/>(Seules les images uploadées via l'admin apparaissent ici)</p>
      )}

      {!loading && items.length > 0 && (
        <>
          <p className="text-white/30 text-xs mb-4">
            {items.length} image{items.length > 1 ? 's' : ''} — <span className="text-white/20">Glisse pour réordonner • Clic droit pour les options</span>
          </p>
          {/* Masonry Layout matching production */}
          <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3 pb-24">
            {items.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => { dragItem.current = idx; }}
                onDragEnter={() => { dragOver.current = idx; }}
                onDragEnd={handleDragSort}
                onDragOver={(e) => e.preventDefault()}
                onContextMenu={(e) => handleContextMenu(e, item)}
                className="break-inside-avoid relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden mb-3 bg-black/40"
              >
                {item.type === 'video' ? (
                  <div className="w-full aspect-video flex flex-col items-center justify-center bg-black/60">
                    <span className="text-white/30 text-2xl">▶</span>
                  </div>
                ) : (
                  <img src={item.image_url} alt={item.title || ''} className="w-full h-auto object-cover" loading="lazy" />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {item.title && <p className="text-white text-[10px] font-bold uppercase truncate">{item.title}</p>}
                </div>

                {/* Sort handle indicator */}
                <div className="absolute top-2 left-2 text-white/50 text-sm drop-shadow-md pointer-events-none">⠿</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Custom Context Menu */}
      {contextMenu.visible && contextMenu.item && (
        <div 
          className="fixed z-50 bg-[#222] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1 min-w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-[10px] uppercase text-white/40 truncate">{contextMenu.item.title || 'Sans titre'}</p>
          </div>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
            onClick={() => { handleRenameItem(contextMenu.item!); setContextMenu({ visible: false, x:0, y:0, item:null }); }}
          >
            ✏️ Renommer
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
            onClick={() => { handleTransfer(contextMenu.item!); setContextMenu({ visible: false, x:0, y:0, item:null }); }}
          >
            ↗️ Transférer à...
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
            onClick={() => { handleDelete(contextMenu.item!.id); setContextMenu({ visible: false, x:0, y:0, item:null }); }}
          >
            🗑️ Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Quotes Manager ─────────────────────────────────────────────────────────────
function QuotesManager({ token, dialogs }: { token: string, dialogs: DialogHelpers }) {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<QuoteRequest | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/quote', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setQuotes(await res.json());
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const handleMarkAsRead = async (id: string, is_read: boolean) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, is_read } : q));
    await fetch('/api/quote', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id, is_read })
    });
  };

  const handleDelete = async (id: string) => {
    const ok = await dialogs.confirm('Supprimer la demande', 'Voulez-vous supprimer cette demande de devis définitivement ?');
    if (!ok) return;
    setQuotes(prev => prev.filter(q => q.id !== id));
    if (selected?.id === id) setSelected(null);
    await fetch('/api/quote', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row gap-6 min-h-[500px]">
      {/* List */}
      <div className="w-full md:w-1/3 border-r border-white/10 pr-0 md:pr-6 flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['Anton'] text-2xl text-white uppercase">Devis</h2>
          <button onClick={fetchQuotes} className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors">↺</button>
        </div>
        
        {loading && <p className="text-white/30 text-sm">Chargement...</p>}
        {!loading && quotes.length === 0 && <p className="text-white/30 text-sm">Aucune demande reçue.</p>}
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {quotes.map(q => (
            <div 
              key={q.id}
              onClick={() => { setSelected(q); if (!q.is_read) handleMarkAsRead(q.id, true); }}
              className={`p-4 rounded-xl cursor-pointer transition-colors border ${selected?.id === q.id ? 'bg-white/10 border-white/20' : 'bg-black/30 border-transparent hover:bg-black/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className={`text-sm truncate pr-2 ${q.is_read ? 'text-white/60' : 'text-white font-bold'}`}>{q.name}</p>
                {!q.is_read && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />}
              </div>
              <p className="text-xs text-white/40 uppercase tracking-widest truncate">{q.category}</p>
              <p className="text-[10px] text-white/30 mt-2">{new Date(q.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="w-full md:w-2/3 flex flex-col h-[500px] overflow-y-auto">
        {selected ? (
          <div className="bg-black/30 p-6 rounded-xl border border-white/5 h-full relative">
            <div className="absolute top-6 right-6 flex gap-4">
              <button onClick={() => handleMarkAsRead(selected.id, !selected.is_read)} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                {selected.is_read ? 'Marquer non lu' : 'Marquer lu'}
              </button>
              <button onClick={() => handleDelete(selected.id)} className="text-xs uppercase tracking-widest text-red-500/50 hover:text-red-400 transition-colors">
                Supprimer
              </button>
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#E34040] mb-2">{selected.category}</p>
            <h3 className="font-['Anton'] text-3xl uppercase mb-1">{selected.name}</h3>
            <a href={`mailto:${selected.email}`} className="text-white/50 text-sm hover:text-white transition-colors mb-8 inline-block">{selected.email}</a>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black/50 p-4 rounded-lg">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Délai</p>
                <p className="text-sm">{selected.timeline}</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Budget</p>
                <p className="text-sm">{selected.budget || 'Non spécifié'}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">Détails du projet</p>
              <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{selected.details}</p>
            </div>
            
            <a href={`mailto:${selected.email}?subject=RE: Demande de devis - ${selected.category}`} className="mt-8 inline-block bg-white text-black font-bold uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors text-xs">
              Répondre par email
            </a>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/20 uppercase tracking-[0.2em] text-xs">
            Sélectionnez une demande
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [tab, setTab] = useState<'upload' | 'manage' | 'quotes'>('upload');
  
  const [dialog, setDialog] = useState<DialogConfig>(null);

  const dialogs: DialogHelpers = {
    confirm: (title, message) => new Promise(resolve => setDialog({ type: 'confirm', title, message, resolve })),
    prompt: (title, defaultValue = '') => new Promise(resolve => setDialog({ type: 'prompt', title, defaultValue, resolve })),
    transfer: (title) => new Promise(resolve => setDialog({ type: 'transfer', title, resolve })),
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setToken('');
  };

  useEffect(() => {
    // Mark preloader as seen so navigating to Home skips the video
    sessionStorage.setItem('preloader_seen', 'true');

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setToken(session.access_token);
      setIsCheckingAuth(false);
    });

    // Listen for auth changes (like token refresh or logout in another tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || '');
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isCheckingAuth) return <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center text-xs uppercase tracking-widest text-white/30">Vérification de la session...</div>;
  if (!token) return <LoginScreen onLogin={setToken} />;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-1">Espace admin</p>
            <h1 className="font-['Anton'] text-4xl md:text-6xl uppercase">Alexia Naya</h1>
          </div>
          <button onClick={handleLogout} className="text-white/30 hover:text-white text-xs uppercase tracking-widest transition-colors">
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(['upload', 'manage', 'quotes'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap"
              style={{
                backgroundColor: tab === t ? 'white' : 'transparent',
                color: tab === t ? 'black' : 'rgba(255,255,255,0.4)',
                border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {t === 'upload' && '+ Ajouter'}
              {t === 'manage' && '⠿ Gérer'}
              {t === 'quotes' && '✉️ Devis'}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'upload' && <UploadZone token={token} />}
        {tab === 'manage' && <GalleryManager token={token} dialogs={dialogs} />}
        {tab === 'quotes' && <QuotesManager token={token} dialogs={dialogs} />}
        
      </div>

      <DialogContainer dialog={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}
