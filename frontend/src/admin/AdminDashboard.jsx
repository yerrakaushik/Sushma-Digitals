import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Image, Youtube, LogOut,
  Upload, Trash2, Plus, CheckCircle, AlertCircle,
  Video, Edit2, Users, Send, Phone, Calendar, FolderOpen,
} from 'lucide-react';
import AlbumsTab from './AlbumsTab';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Shared helpers ──────────────────────────────────────────────────────────
function authHeaders() {
  const token = sessionStorage.getItem('admin_token');
  return { Authorization: `Bearer ${token}` };
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-medium transition-all ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {msg}
    </div>
  );
}

// ─── Tab: Hero Video ─────────────────────────────────────────────────────────
function HeroTab({ toast }) {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [uploading, setUploading]   = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    fetch(`${API_BASE}/api/hero`).then(r => r.json()).then(d => setCurrentUrl(d.video_url));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('video', file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/hero`, {
        method: 'POST', headers: authHeaders(), body: fd,
      });
      const data = await res.json();
      if (res.ok) { setCurrentUrl(data.video_url); toast('Hero video updated!', 'success'); }
      else toast(data.error || 'Upload failed', 'error');
    } catch { toast('Upload failed — is the backend running?', 'error'); }
    finally { setUploading(false); fileRef.current.value = ''; }
  };

  const handleClear = async () => {
    if (!confirm('Remove the hero video? The slideshow will be shown instead.')) return;
    try {
      await fetch(`${API_BASE}/api/admin/hero`, { method: 'DELETE', headers: authHeaders() });
      setCurrentUrl(null);
      toast('Hero video cleared — slideshow restored.', 'success');
    } catch { toast('Failed to clear hero video', 'error'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-navy font-semibold mb-1">Hero Video</h2>
        <p className="text-navy/50 text-sm">Upload a short MP4 video (≤60s) to play fullscreen in the hero section. Clear it to revert to the photo slideshow.</p>
      </div>

      {/* Current video preview */}
      {currentUrl ? (
        <div className="rounded-2xl overflow-hidden border border-gold/20 bg-navy-dark relative">
          <video src={currentUrl} controls muted className="w-full max-h-64 object-cover" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={handleClear} className="px-3 py-1.5 bg-red-500/80 text-white text-xs rounded-full flex items-center gap-1 hover:bg-red-600 transition-colors backdrop-blur-sm">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
          <div className="p-3 bg-navy-dark/60 backdrop-blur-sm">
            <p className="text-white/60 text-xs truncate">{currentUrl}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gold/20 bg-cream p-8 text-center">
          <Video className="w-10 h-10 text-navy/25 mx-auto mb-3" />
          <p className="text-navy/50 text-sm">No video set — photo slideshow is active</p>
        </div>
      )}

      {/* Upload button */}
      <div>
        <input ref={fileRef} type="file" accept=".mp4,.webm,.mov" className="hidden" onChange={handleUpload} />
        <button
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 btn-gold rounded-full text-sm shadow-gold-sm disabled:opacity-60"
        >
          {uploading
            ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload New Video'}
        </button>
        <p className="text-navy/35 text-xs mt-2">Accepted: .mp4, .webm, .mov</p>
      </div>
    </div>
  );
}

// ─── Tab: Gallery ────────────────────────────────────────────────────────────
const PHOTO_CATEGORIES = ['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate'];

function GalleryTab({ toast }) {
  const [photos, setPhotos]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm]           = useState({ alt: '', category: 'Wedding' });
  const [preview, setPreview]     = useState(null);
  const [fit, setFit]             = useState('cover'); 
  const [position, setPosition]   = useState(50);
  const fileRef = useRef();

  const load = () => fetch(`${API_BASE}/api/gallery`).then(r => r.json()).then(setPhotos).catch(() => {});
  useEffect(() => { load(); }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setPosition(50); // Reset position
    }
  };

  const handleUpload = async () => {
    const file = fileRef.current.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('photo', file);
    fd.append('alt', form.alt || file.name);
    fd.append('category', form.category);
    // We could save 'position' in a field if the table had it, 
    // but for now this helps them decide if it fits or if they should re-crop.
    try {
      const res = await fetch(`${API_BASE}/api/admin/gallery`, {
        method: 'POST', headers: authHeaders(), body: fd,
      });
      const data = await res.json();
      if (res.ok) { 
        load(); 
        toast('Photo uploaded!', 'success'); 
        setForm({ alt: '', category: 'Wedding' }); 
        setPreview(null);
      }
      else toast(data.error || 'Upload failed', 'error');
    } catch { toast('Upload failed — is backend running?', 'error'); }
    finally { setUploading(false); fileRef.current.value = ''; }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    await fetch(`${API_BASE}/api/admin/gallery/${id}`, { method: 'DELETE', headers: authHeaders() });
    setPhotos(photos.filter(p => p.id !== id));
    toast('Photo deleted', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-navy font-semibold mb-1">Gallery</h2>
        <p className="text-navy/50 text-sm">Upload photos that appear in the public Gallery page. Tag each with a category for filtering.</p>
      </div>

      {/* Upload form with Preview */}
      <div className="bg-white border border-gold/15 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gold/10 bg-cream/50 flex items-center justify-between">
          <h3 className="font-serif font-bold text-navy">Upload New Photo</h3>
          {preview && (
             <button onClick={() => { setPreview(null); fileRef.current.value=''; }} className="text-xs text-red-500 hover:underline">Clear</button>
          )}
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1.5 block">Description</label>
              <input
                type="text"
                placeholder="e.g. Wedding Ceremony at Mandap"
                value={form.alt}
                onChange={(e) => setForm(f => ({ ...f, alt: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-navy/10 bg-cream/30 text-sm text-navy focus:outline-none focus:border-gold/40 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-navy/10 bg-cream/30 text-sm text-navy focus:outline-none focus:border-gold/40 transition-all appearance-none cursor-pointer"
              >
                {PHOTO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1.5 block">How it fits (Arrangement)</label>
              <div className="flex gap-2">
                {['cover', 'contain'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFit(f)}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all ${
                      fit === f ? 'bg-navy text-gold border-gold/30 shadow-md' : 'bg-white text-navy/40 border-navy/5 hover:border-gold/20'
                    }`}
                  >
                    {f === 'cover' ? 'Fill Frame' : 'Show Full Image'}
                  </button>
                ))}
              </div>
            </div>
            
            {fit === 'cover' && (
              <div>
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1.5 block">Vertical Focus (Arrangement)</label>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-navy/30">Top</span>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={position} 
                    onChange={(e) => setPosition(parseInt(e.target.value))}
                    className="flex-1 accent-gold h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-navy/30">Bottom</span>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              {!preview ? (
                <button
                  onClick={() => fileRef.current.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-gold/20 rounded-2xl bg-cream/20 hover:bg-gold/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-navy">Select a Photo</p>
                    <p className="text-[10px] text-navy/40">JPG, PNG, or WebP</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full py-4 btn-gold rounded-xl font-bold text-sm shadow-gold-sm flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {uploading ? <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
                  {uploading ? 'Processing...' : 'Confirm & Upload'}
                </button>
              )}
            </div>
          </div>

          {/* Right: Preview Window */}
          <div>
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1.5 block">Live Preview (As seen in Gallery)</label>
            <div className="aspect-[4/5] rounded-2xl bg-cream border-2 border-navy/5 overflow-hidden relative shadow-inner">
              {preview ? (
                <img 
                  src={preview} 
                  alt="preview" 
                  className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`} 
                  style={fit === 'cover' ? { objectPosition: `50% ${position}%` } : {}}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-navy/15">
                  <Image className="w-12 h-12 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Image Selected</p>
                </div>
              )}
              {/* Fake Gallery Label for real feel */}
              {preview && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy/80 to-transparent">
                  <p className="text-white text-xs font-serif font-bold">{form.category}</p>
                  <p className="text-white/70 text-[10px] truncate">{form.alt || 'No description set'}</p>
                </div>
              )}
            </div>
            <p className="text-[10px] text-navy/40 text-center mt-3 italic">This is exactly how it will appear in your public gallery.</p>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gold/20 bg-cream p-10 text-center">
          <Image className="w-10 h-10 text-navy/20 mx-auto mb-3" />
          <p className="text-navy/40 text-sm">No photos yet — upload your first one above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative rounded-xl overflow-hidden border border-gold/10 bg-cream">
              <img src={p.url} alt={p.alt} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="px-2 py-1.5 bg-white/80">
                <p className="text-[10px] text-navy/60 truncate">{p.alt || p.category}</p>
                <span className="inline-block px-1.5 py-0.5 bg-gold/15 text-gold text-[9px] rounded-full">{p.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: YouTube Videos ──────────────────────────────────────────────────────
function VideosTab({ toast }) {
  const [videos, setVideos]   = useState([]);
  const [form, setForm]       = useState({ youtube_id: '', title: '', description: '', tag: 'Wedding Film' });
  const [saving, setSaving]   = useState(false);
  const VIDEO_TAGS = ['Wedding Film', 'Pre-Wedding', 'Birthday', 'Corporate', 'Highlights'];

  const load = () => fetch(`${API_BASE}/api/videos`).then(r => r.json()).then(setVideos).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.youtube_id.trim()) { toast('YouTube ID is required', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/videos`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { load(); toast('Video added!', 'success'); setForm({ youtube_id: '', title: '', description: '', tag: 'Wedding Film' }); }
      else toast(data.error || 'Failed to add video', 'error');
    } catch { toast('Failed — is backend running?', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this video?')) return;
    await fetch(`${API_BASE}/api/admin/videos/${id}`, { method: 'DELETE', headers: authHeaders() });
    setVideos(videos.filter(v => v.id !== id));
    toast('Video removed', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-navy font-semibold mb-1">Videos</h2>
        <p className="text-navy/50 text-sm">Manage YouTube video IDs shown on the Videos page. Paste just the video ID (e.g. <code className="bg-gold/10 px-1 rounded text-gold">dQw4w9WgXcQ</code> from youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>).</p>
      </div>

      {/* Add form */}
      <div className="bg-cream border border-gold/15 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-navy text-sm">Add a Video</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="YouTube Video ID *" value={form.youtube_id}
            onChange={e => setForm(f => ({ ...f, youtube_id: e.target.value }))}
            className="px-4 py-3 rounded-xl border border-navy/10 bg-white text-sm text-navy/80 focus:outline-none focus:border-gold/40 transition-all" />
          <input type="text" placeholder="Title" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="px-4 py-3 rounded-xl border border-navy/10 bg-white text-sm text-navy/80 focus:outline-none focus:border-gold/40 transition-all" />
          <input type="text" placeholder="Short description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="px-4 py-3 rounded-xl border border-navy/10 bg-white text-sm text-navy/80 focus:outline-none focus:border-gold/40 transition-all" />
          <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
            className="px-4 py-3 rounded-xl border border-navy/10 bg-white text-sm text-navy/80 focus:outline-none focus:border-gold/40 transition-all">
            {VIDEO_TAGS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={handleAdd} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 btn-gold rounded-full text-sm disabled:opacity-60">
          {saving ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Video
        </button>
      </div>

      {/* Video list */}
      {videos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gold/20 bg-cream p-10 text-center">
          <Youtube className="w-10 h-10 text-navy/20 mx-auto mb-3" />
          <p className="text-navy/40 text-sm">No videos added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gold/10 hover:border-gold/30 transition-all">
              <img
                src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                alt={v.title}
                className="w-24 h-16 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy text-sm truncate">{v.title || v.youtube_id}</p>
                <p className="text-navy/45 text-xs truncate">{v.description}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-gold/10 text-gold text-[10px] rounded-full border border-gold/20">{v.tag}</span>
              </div>
              <button onClick={() => handleDelete(v.id)} className="p-2 text-navy/30 hover:text-red-500 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── Tab: Clients & Wish Automation ─────────────────────────────────────────────
function ClientsTab({ toast }) {
  const EMPTY = { name: '', phone: '', birthday: '', anniversary: '', notes: '' };
  const [clients, setClients]     = useState([]);
  const [form, setForm]           = useState(EMPTY);
  const [editing, setEditing]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [testing, setTesting]     = useState(null);
  // Per-client media upload state
  const [mediaUploading, setMediaUploading] = useState({}); // { clientId: true }
  const mediaInputRef = useRef({});
  const [mediaFile, setMediaFile] = useState(null); // File selected in the add/edit form
  const addFormMediaRef = useRef();

  const load = () =>
    fetch(`${API_BASE}/api/admin/clients`, { headers: authHeaders() })
      .then(r => r.json()).then(setClients).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.phone) { toast('Name and phone are required', 'error'); return; }
    setSaving(true);
    try {
      const url    = editing ? `${API_BASE}/api/admin/clients/${editing}` : `${API_BASE}/api/admin/clients`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        let uploadOk = true;
        if (mediaFile) {
          uploadOk = await handleMediaUpload(data.id, mediaFile, true);
        } else {
          load();
        }
        
        toast(editing ? 'Client updated!' : (mediaFile && uploadOk ? 'Client & media added!' : 'Client added!'), 'success');
        setForm(EMPTY); setEditing(null); setMediaFile(null);
      } else toast(data.error || 'Failed', 'error');
    } catch { toast('Failed — is backend running?', 'error'); }
    finally { setSaving(false); }
  };

  const handleEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name, phone: c.phone, birthday: c.birthday || '', anniversary: c.anniversary || '', notes: c.notes || '' });
    setMediaFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    await fetch(`${API_BASE}/api/admin/clients/${id}`, { method: 'DELETE', headers: authHeaders() });
    setClients(clients.filter(c => c.id !== id));
    toast('Client deleted', 'success');
  };

  const handleMediaUpload = async (clientId, file, quiet = false) => {
    if (!file) return false;
    setMediaUploading(m => ({ ...m, [clientId]: true }));
    const fd = new FormData();
    fd.append('media', file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/clients/${clientId}/media`, {
        method: 'POST', headers: authHeaders(), body: fd,
      });
      const data = await res.json();
      if (res.ok) { 
        load(); 
        if (!quiet) toast('Wish media uploaded!', 'success'); 
        return true; 
      }
      if (!quiet) toast(data.error || 'Upload failed', 'error'); 
      return false;
    } catch { 
      if (!quiet) toast('Upload failed', 'error'); 
      return false; 
    }
    finally { setMediaUploading(m => ({ ...m, [clientId]: false })); }
  };

  const handleTest = async (id, type) => {
    setTesting(id + type);
    try {
      const res = await fetch(`${API_BASE}/api/admin/clients/test/${id}`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      toast(data.message || (data.ok ? 'Sent!' : 'Failed'), data.ok ? 'success' : 'error');
    } catch { toast('Send failed', 'error'); }
    finally { setTesting(null); }
  };

  const inputCls = 'px-4 py-3 rounded-xl border border-navy/10 bg-white text-sm text-navy placeholder-navy/40 focus:outline-none focus:border-gold/40 transition-all';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-navy font-semibold mb-1">Clients & Wish Automation</h2>
        <p className="text-navy/50 text-sm">Add clients with their birthday/anniversary. The system sends a personalised WhatsApp message with your photo/video every year at 9 AM automatically.</p>
      </div>

      {/* Add / Edit form */}
      <div className="bg-cream border border-gold/15 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-navy text-sm">{editing ? '✏️ Edit Client' : '+ Add New Client'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className={inputCls} placeholder="Full Name *" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className={inputCls} placeholder="Phone number (e.g. 9866598393) *" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <div>
            <label className="text-xs text-navy/50 mb-1 block">Birthday</label>
            <input type="date" className={inputCls + ' w-full'} value={form.birthday}
              onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-navy/50 mb-1 block">Anniversary</label>
            <input type="date" className={inputCls + ' w-full'} value={form.anniversary}
              onChange={e => setForm(f => ({ ...f, anniversary: e.target.value }))} />
          </div>
          <input className={inputCls + ' sm:col-span-2'} placeholder="Notes (optional — e.g. preferred package, event type)" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          
          {/* Wish media direct select */}
          <div className="sm:col-span-2">
            <label className="text-xs text-navy/50 mb-1.5 block">Wish Photo / Video (Optional)</label>
            <div className="flex items-center gap-3">
              <input
                ref={addFormMediaRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={e => setMediaFile(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => addFormMediaRef.current?.click()}
                className="px-4 py-2 text-xs border border-navy/15 text-navy/60 bg-white rounded-lg hover:border-gold/50 hover:text-navy transition-all"
              >
                <Upload className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                {mediaFile ? mediaFile.name : 'Select File from Computer'}
              </button>
              {mediaFile && (
                <button type="button" onClick={() => setMediaFile(null)} className="text-xs text-red-400 hover:text-red-500 underline underline-offset-2">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 btn-gold rounded-full text-sm disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
            {editing ? 'Update Client' : 'Add Client'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY); setMediaFile(null); }}
              className="px-6 py-3 border border-navy/15 text-navy/60 text-sm rounded-full hover:text-navy transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Clients list */}
      {clients.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gold/20 bg-cream p-10 text-center">
          <Users className="w-10 h-10 text-navy/20 mx-auto mb-3" />
          <p className="text-navy/40 text-sm">No clients yet — add your first client above</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-navy/40 font-medium">{clients.length} client{clients.length !== 1 ? 's' : ''} registered</p>
          {clients.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gold/10 overflow-hidden hover:border-gold/25 transition-all">
              <div className="flex items-start gap-4 p-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 font-serif text-gold font-bold text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm">{c.name}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-navy/50"><Phone className="w-3 h-3" /> {c.phone}</span>
                    {c.birthday    && <span className="flex items-center gap-1 text-xs text-navy/50"><Calendar className="w-3 h-3" /> 🎂 {c.birthday}</span>}
                    {c.anniversary && <span className="flex items-center gap-1 text-xs text-navy/50"><Calendar className="w-3 h-3" /> 💍 {c.anniversary}</span>}
                  </div>
                  {c.notes && <p className="text-xs text-navy/35 mt-1 italic">{c.notes}</p>}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {c.birthday && (
                    <button onClick={() => handleTest(c.id, 'birthday')} disabled={!!testing}
                      title="Send test birthday wish now"
                      className="p-2 text-navy/30 hover:text-gold transition-colors flex flex-col items-center gap-0.5">
                      {testing === c.id + 'birthday'
                        ? <span className="w-3 h-3 border border-gold/40 border-t-gold rounded-full animate-spin" />
                        : <Send className="w-3.5 h-3.5" />}
                      <span className="text-[9px]">🎂</span>
                    </button>
                  )}
                  {c.anniversary && (
                    <button onClick={() => handleTest(c.id, 'anniversary')} disabled={!!testing}
                      title="Send test anniversary wish now"
                      className="p-2 text-navy/30 hover:text-gold transition-colors flex flex-col items-center gap-0.5">
                      {testing === c.id + 'anniversary'
                        ? <span className="w-3 h-3 border border-gold/40 border-t-gold rounded-full animate-spin" />
                        : <Send className="w-3.5 h-3.5" />}
                      <span className="text-[9px]">💍</span>
                    </button>
                  )}
                  <button onClick={() => handleEdit(c)} className="p-2 text-navy/30 hover:text-gold transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-navy/30 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Wish media section */}
              <div className="px-4 pb-4 border-t border-gold/8 pt-3">
                <p className="text-[10px] text-navy/40 font-semibold uppercase tracking-wide mb-2">Wish Photo / Video</p>
                <div className="flex items-center gap-3">
                  {/* Preview */}
                  {c.wish_media_url ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gold/15 shrink-0 bg-cream flex items-center justify-center">
                      {c.wish_media_url.match(/\.(mp4|webm|mov)$/i)
                        ? <video src={c.wish_media_url} className="w-full h-full object-cover" muted />
                        : <img src={c.wish_media_url} alt="wish" className="w-full h-full object-cover" />}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gold/20 bg-cream flex items-center justify-center shrink-0">
                      <Image className="w-5 h-5 text-navy/20" />
                    </div>
                  )}
                  {/* Upload button */}
                  <div>
                    <input
                      ref={el => mediaInputRef.current[c.id] = el}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={e => handleMediaUpload(c.id, e.target.files[0])}
                    />
                    <button
                      onClick={() => mediaInputRef.current[c.id]?.click()}
                      disabled={mediaUploading[c.id]}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs border border-gold/25 text-navy/60 rounded-full hover:border-gold/50 hover:text-navy transition-all disabled:opacity-50"
                    >
                      {mediaUploading[c.id]
                        ? <span className="w-3 h-3 border border-navy/30 border-t-navy rounded-full animate-spin" />
                        : <Upload className="w-3 h-3" />}
                      {c.wish_media_url ? 'Change Media' : 'Upload Photo / Video'}
                    </button>
                    <p className="text-[10px] text-navy/30 mt-1">Sent with every birthday & anniversary wish</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CallMeBot setup info */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <p className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wide">📱 CallMeBot Setup (Free)</p>
        <p className="text-green-800/70 text-xs leading-relaxed">
          Add these to <code className="bg-white px-1 rounded border border-green-200">backend/.env</code> to activate automatic admin notifications:
          <br /><strong>CALLMEBOT_PHONE</strong> · <strong>CALLMEBOT_APIKEY</strong> · <strong>ADMIN_WHATSAPP</strong>
          <br /><span className="text-green-700/50">Setup guide: callmebot.com/blog/free-api-whatsapp-messages/</span>
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'hero',    label: 'Hero Video',   icon: Video },
  { id: 'gallery', label: 'Gallery',       icon: Image },
  { id: 'videos',  label: 'Videos',        icon: Youtube },
  { id: 'albums',  label: 'Design Albums', icon: FolderOpen },
  { id: 'clients', label: 'Clients & Wishes', icon: Users },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [toast, setToast]         = useState(null); // { msg, type }

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* ─── Topbar ─── */}
      <header className="bg-navy-dark border-b border-gold/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center">
            <Camera className="w-4 h-4 text-gold" />
          </div>
          <div>
            <span className="font-serif text-white text-sm font-semibold">Sushma Digitals</span>
            <span className="block text-gold text-[9px] tracking-[0.2em] uppercase">Admin Panel</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 text-xs transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* ─── Sidebar ─── */}
          <aside className="w-52 shrink-0 hidden md:block">
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-navy text-gold border border-gold/25'
                      : 'text-navy/60 hover:bg-white hover:text-navy hover:border-gold/15 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* ─── Mobile tab bar ─── */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-4 w-full no-scrollbar">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === id ? 'bg-navy text-gold border border-gold/25' : 'bg-white text-navy/60 border border-navy/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* ─── Content ─── */}
          <main className="flex-1 min-w-0">
            {activeTab === 'hero'    && <HeroTab    toast={showToast} />}
            {activeTab === 'gallery' && <GalleryTab  toast={showToast} />}
            {activeTab === 'videos'  && <VideosTab   toast={showToast} />}
            {activeTab === 'albums'  && <AlbumsTab   toast={showToast} />}
            {activeTab === 'clients' && <ClientsTab  toast={showToast} />}
          </main>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
