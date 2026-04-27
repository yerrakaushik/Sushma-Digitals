import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Image, Youtube, LogOut,
  Upload, Trash2, Plus, CheckCircle, AlertCircle,
  Video, Edit2, Users, Send, Phone, Calendar, FolderOpen, Sparkles, ChevronRight
} from 'lucide-react';
import AlbumsTab from './AlbumsTab';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PHOTO_CATEGORIES = ['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Half Saree', 'Dhoti', 'Baby Shower'];

// ─── Shared helpers ──────────────────────────────────────────────────────────
function authHeaders() {
  const token = sessionStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed bottom-8 right-8 z-[999] flex items-center gap-4 px-6 py-5 rounded-[2rem] shadow-2xl ${
        type === 'success' ? 'bg-[#0B0D11] text-white border border-gold/30' : 'bg-red-500 text-white'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-gold/10' : 'bg-white/20'}`}>
        {type === 'success' ? <CheckCircle className="w-5 h-5 text-gold" /> : <AlertCircle className="w-5 h-5 text-white" />}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Notification</p>
        <p className="text-sm font-bold tracking-tight">{msg}</p>
      </div>
    </motion.div>
  );
}

// ─── Tab: Hero Video ─────────────────────────────────────────────────────────
function HeroTab({ toast }) {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const fileRef = useRef();
  const [slideshow, setSlideshow] = useState([]);
  const [uploadingSlide, setUploadingSlide] = useState(false);
  const slideRef = useRef();

  const [isPreviewing, setIsPreviewing] = useState(false);

  const loadAll = () => {
    fetch(`${API_BASE}/api/hero`).then(r => r.json()).then(d => setCurrentUrl(d.video_url));
    fetch(`${API_BASE}/api/hero/slideshow`).then(r => r.json()).then(d => setSlideshow(Array.isArray(d) ? d : []));
  };
  useEffect(() => { loadAll(); }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Warn if over 100MB
    if (file.size > 100 * 1024 * 1024) {
      if (!confirm("This video is very large (over 100MB). It may take several minutes to upload depending on your internet speed. Continue?")) {
        fileRef.current.value = '';
        return;
      }
    }

    setUploading(true);
    setProgress(0);

    const fd = new FormData();
    fd.append('video', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/api/admin/hero`, true);
    
    const token = sessionStorage.getItem('admin_token');
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      fileRef.current.value = '';
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setCurrentUrl(data.video_url);
        toast('Hero video updated!', 'success');
      } else {
        toast('Upload failed. Try a smaller or shorter video.', 'error');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      fileRef.current.value = '';
      toast('Network error. Check your connection.', 'error');
    };

    xhr.send(fd);
  };

  const handleUploadSlide = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingSlide(true);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/hero/slideshow`, {
        method: 'POST', headers: authHeaders(), body: fd,
      });
      if (res.ok) { loadAll(); toast('Slideshow image added!', 'success'); }
    } finally { setUploadingSlide(false); slideRef.current.value = ''; }
  };

  const handleDeleteSlide = async (id) => {
    if (!confirm('Remove this image from slideshow?')) return;
    await fetch(`${API_BASE}/api/admin/hero/slideshow/${id}`, { method: 'DELETE', headers: authHeaders() });
    loadAll();
  };

  const handleClear = async () => {
    if (!confirm('Remove hero video?')) return;
    try {
      await fetch(`${API_BASE}/api/admin/hero`, { method: 'DELETE', headers: authHeaders() });
      setCurrentUrl(null);
      toast('Hero video removed', 'success');
    } catch { toast('Failed', 'error'); }
  };

  return (
    <div className="space-y-16">
      {/* Cinematic Video Section */}
      <section className="bg-white border border-gold/15 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <h3 className="font-serif text-2xl font-bold text-navy mb-2">Cinematic Background</h3>
        <p className="text-navy/40 text-sm max-w-xl mb-10 leading-relaxed">
          The hero video sets the soul of your website. Upload a short, high-quality montage to instantly wow your visitors.
        </p>

        {currentUrl ? (
          <div className="relative rounded-[2rem] overflow-hidden border border-gold/20 shadow-2xl group bg-navy">
            {isPreviewing ? (
              <video src={currentUrl} autoPlay loop muted className="w-full aspect-video object-cover" />
            ) : (
              <div className="w-full aspect-video flex flex-col items-center justify-center bg-navy/50 backdrop-blur-sm">
                 <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Video className="w-8 h-8 text-gold" />
                 </div>
                 <button 
                  onClick={() => setIsPreviewing(true)}
                  className="px-8 py-3 bg-gold text-navy rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                 >
                    Play Preview
                 </button>
              </div>
            )}
            <div className="absolute top-6 right-6 flex gap-3">
              {isPreviewing && (
                <button 
                  onClick={() => setIsPreviewing(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold shadow-xl backdrop-blur-md transition-all"
                >
                  Stop Preview
                </button>
              )}
              <button 
                onClick={handleClear}
                className="px-6 py-3 bg-red-500/90 hover:bg-red-500 text-white rounded-full text-xs font-bold shadow-xl backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Remove Video
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gold/20 rounded-[2.5rem] bg-gold/5">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-gold" />
            </div>
            <p className="font-serif text-xl font-bold text-navy">No video active</p>
            <p className="text-navy/40 text-sm mt-1">Website is currently using fallback slideshow</p>
          </div>
        )}

        <div className="mt-10 pt-10 border-t border-navy/5 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
            <button 
              onClick={() => fileRef.current.click()} disabled={uploading}
              className="px-10 py-4 btn-gold rounded-full font-bold text-sm shadow-gold-sm flex items-center gap-3 disabled:opacity-50 transition-transform active:scale-95"
            >
              {uploading ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? `Uploading ${progress}%` : 'Choose Cinematic Reel'}
            </button>
            <div className="text-right">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/30 mb-1">Performance Tip</p>
               <p className="text-xs font-bold text-navy/60">Use compressed MP4 for faster uploads</p>
            </div>
          </div>

          {uploading && (
            <div className="w-full space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gold">
                <span>Sending to Legacy Storage</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-navy/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-gold/60 to-gold shadow-[0_0_10px_rgba(201,168,76,0.3)]"
                />
              </div>
              <p className="text-[9px] text-navy/30 italic">Processing will begin automatically at 100%...</p>
            </div>
          )}
        </div>
      </section>

      {/* Fallback Slideshow Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy">Fallback Slideshow</h3>
            <p className="text-navy/40 text-sm">Images shown when no cinematic video is active.</p>
          </div>
          <input ref={slideRef} type="file" accept="image/*" className="hidden" onChange={handleUploadSlide} />
          <button 
            onClick={() => slideRef.current.click()} disabled={uploadingSlide}
            className="px-8 py-3 bg-navy text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl flex items-center gap-2"
          >
            {uploadingSlide ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Image
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.isArray(slideshow) && slideshow.map(img => (
            <div key={img.id} className="relative aspect-square rounded-[2rem] overflow-hidden border border-gold/10 group bg-white shadow-sm">
              <img src={img.url} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDeleteSlide(img.id)}
                  className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {slideshow.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-navy/5 rounded-[2.5rem] bg-cream/10">
               <p className="text-navy/20 italic text-sm">No slideshow images added. Using static black fallback.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Gallery ────────────────────────────────────────────────────────────
function GalleryTab({ toast }) {
  const [photos, setPhotos]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm]           = useState({ alt: '', category: 'Wedding' });
  const [preview, setPreview]     = useState(null);
  const [fit, setFit]             = useState('cover'); 
  const [position, setPosition]   = useState(50);
  const fileRef = useRef();

  const load = () => fetch(`${API_BASE}/api/gallery`).then(r => r.json()).then(d => setPhotos(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setPosition(50);
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
    try {
      const res = await fetch(`${API_BASE}/api/admin/gallery`, {
        method: 'POST', headers: authHeaders(), body: fd,
      });
      if (res.ok) { 
        load(); toast('Photo uploaded!', 'success'); 
        setForm({ alt: '', category: 'Wedding' }); setPreview(null);
      } else toast('Upload failed', 'error');
    } catch { toast('Connection failed', 'error'); }
    finally { setUploading(false); fileRef.current.value = ''; }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await fetch(`${API_BASE}/api/admin/gallery/${id}`, { method: 'DELETE', headers: authHeaders() });
      setPhotos(photos.filter(p => p.id !== id));
      toast('Photo deleted', 'success');
    } catch { toast('Delete failed', 'error'); }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white border border-gold/15 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-navy mb-6">Add New Masterpiece</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest ml-1">Short Description</label>
              <input
                type="text" placeholder="e.g. Cinematic Wedding Moment"
                value={form.alt} onChange={(e) => setForm(f => ({ ...f, alt: e.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none focus:border-gold/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest ml-1">Collection</label>
              <select
                value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none focus:border-gold/40 transition-all cursor-pointer appearance-none"
              >
                {PHOTO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            {!preview ? (
              <button 
                onClick={() => fileRef.current.click()}
                className="w-full py-12 border-2 border-dashed border-gold/20 rounded-[2rem] bg-gold/5 flex flex-col items-center justify-center gap-3 group hover:border-gold/50 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Plus className="w-8 h-8 text-gold" />
                </div>
                <p className="text-sm font-bold text-navy">Browse High-Res Photo</p>
              </button>
            ) : (
              <button 
                onClick={handleUpload} disabled={uploading}
                className="w-full py-5 btn-gold rounded-full font-bold text-sm shadow-gold-sm flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {uploading ? <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Processing Image...' : 'Publish to Gallery'}
              </button>
            )}
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest ml-1">Public Preview</label>
             <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-navy/5 border border-navy/5 relative shadow-inner">
                {preview ? (
                   <img src={preview} className="w-full h-full object-cover" alt="" />
                ) : (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-navy/10">
                      <Image className="w-16 h-16 mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Ready for Selection</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map(p => (
          <div key={p.id} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-sm bg-navy/5">
            <img src={p.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button 
              onClick={() => handleDelete(p.id)}
              className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-[10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">{p.category}</p>
              <p className="text-xs text-white font-medium truncate">{p.alt || 'Untitled Masterpiece'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Services ───────────────────────────────────────────────────────────
function ServicesTab({ toast }) {
  const [services, setServices] = useState({});
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [newCat, setNewCat]     = useState('');
  const [form, setForm]         = useState({ service_id: '', name: '', price: 'Enquire', note: '' });
  const [covers, setCovers]     = useState({}); // { service_id: url }
  const [editingPkg, setEditingPkg] = useState(null);
  const fileRef = useRef();
  const [activeCatForImage, setActiveCatForImage] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [svcRes, galleryRes] = await Promise.all([
        fetch(`${API_BASE}/api/services`).then(r => r.json()),
        fetch(`${API_BASE}/api/gallery?category=SERVICE_COVER`).then(r => r.json())
      ]);
      setServices(svcRes);
      
      const coverMap = {};
      (galleryRes || []).forEach(p => {
        const sid = p.alt.replace('SERVICE_COVER_', '');
        coverMap[sid] = p.url;
      });
      setCovers(coverMap);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleSaveEdit = async () => {
    if (!editingPkg) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/services/${editingPkg.id}`, {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingPkg.name,
          price: editingPkg.price,
          note: editingPkg.note
        })
      });
      if (res.ok) {
        toast('Package updated!', 'success');
        setEditingPkg(null);
        load();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = async () => {
    if (!form.service_id || !form.name) return toast('Category and Name required', 'error');
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/services`, {
        method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      if (res.ok) { toast('Package added!', 'success'); setForm({ ...form, name: '', note: '' }); load(); }
    } finally { setAdding(false); }
  };

  const handleAddCategory = () => {
    if (!newCat) return;
    setForm({ ...form, service_id: newCat });
    setNewCat('');
    toast(`Category "${newCat}" ready. Add a package to save it.`, 'success');
  };

  const handleDeletePackage = async (sid, name) => {
    if (!confirm(`Delete package "${name}"?`)) return;
    await fetch(`${API_BASE}/api/admin/services/${sid}?package=${encodeURIComponent(name)}`, {
      method: 'DELETE', headers: authHeaders()
    });
    load();
  };

  const handleDeleteCategory = async (sid) => {
    if (!confirm(`Delete ENTIRE category "${sid}" and all its packages?`)) return;
    await fetch(`${API_BASE}/api/admin/services/${sid}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  const handleUploadCover = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeCatForImage) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('photo', file);
    fd.append('category', 'SERVICE_COVER');
    fd.append('alt', `SERVICE_COVER_${activeCatForImage}`);
    
    try {
      // First delete existing cover if any
      const existing = (await fetch(`${API_BASE}/api/gallery?category=SERVICE_COVER`).then(r => r.json()))
        .find(p => p.alt === `SERVICE_COVER_${activeCatForImage}`);
      
      if (existing) {
        await fetch(`${API_BASE}/api/admin/gallery/${existing.id}`, { method: 'DELETE', headers: authHeaders() });
      }

      await fetch(`${API_BASE}/api/admin/gallery`, { method: 'POST', headers: authHeaders(), body: fd });
      toast('Category cover updated!', 'success');
      load();
    } finally { setLoading(false); setActiveCatForImage(null); }
  };

  const sids = [...new Set([...Object.keys(services), form.service_id])].filter(Boolean);

  if (loading && Object.keys(services).length === 0) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-16 pb-20">
      {/* Configuration Header */}
      <div className="bg-white border border-gold/15 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <h3 className="font-serif text-2xl font-bold text-navy mb-8">Manage Service Catalogue</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Add Category */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Create New Category</label>
            <div className="flex gap-2">
              <input 
                type="text" placeholder="e.g. Newborn, Fashion, Event" value={newCat} onChange={e => setNewCat(e.target.value)}
                className="flex-1 px-6 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none"
              />
              <button onClick={handleAddCategory} className="px-6 py-4 bg-navy text-gold rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">Add</button>
            </div>
          </div>

          {/* Add Package */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Quick Add Package</label>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})} className="px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none">
                <option value="">Select Category...</option>
                {sids.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="text" placeholder="Package Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none" />
              <input type="text" placeholder="Price Note" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none" />
              <input type="text" placeholder="Tagline/Note" value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none" />
            </div>
            <button onClick={handleAddPackage} disabled={adding} className="w-full py-4 btn-gold rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-gold-sm transition-all active:scale-95">
              {adding ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
              Save Package to {form.service_id || '...'}
            </button>
          </div>
        </div>
      </div>

      {/* Services Display */}
      <div className="space-y-20">
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleUploadCover} />
        {Object.entries(services).map(([sid, pkgs]) => (
          <div key={sid} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-navy/5 pb-6">
              <div className="flex items-center gap-6">
                 {/* Category Image Cover */}
                 <div className="relative group cursor-pointer" onClick={() => { setActiveCatForImage(sid); fileRef.current.click(); }}>
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-navy/5 border border-gold/20 shadow-inner flex items-center justify-center">
                       {covers[sid] ? (
                         <img src={covers[sid]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                       ) : (
                         <Image className="w-6 h-6 text-gold/30" />
                       )}
                    </div>
                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[2rem] transition-opacity">
                       <Upload className="w-4 h-4 text-white" />
                    </div>
                 </div>
                 <div>
                    <h4 className="font-serif text-3xl text-navy font-bold capitalize flex items-center gap-3">
                      {sid}
                    </h4>
                    <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mt-1">Service Category</p>
                 </div>
              </div>
              <button onClick={() => handleDeleteCategory(sid)} className="px-6 py-3 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">
                 Delete Entire Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pkgs.map(p => {
                const isEditing = editingPkg?.id === p.id;
                return (
                  <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-gold/10 hover:border-gold/30 transition-all group relative shadow-sm">
                     <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] mb-4">Package</p>
                     
                     {isEditing ? (
                       <div className="space-y-4">
                         <input 
                           className="w-full px-4 py-2 rounded-xl border border-navy/10 text-sm font-serif font-bold" 
                           value={editingPkg.name} 
                           onChange={e => setEditingPkg({...editingPkg, name: e.target.value})} 
                         />
                         <input 
                           className="w-full px-4 py-2 rounded-xl border border-navy/10 text-sm font-bold text-gold" 
                           value={editingPkg.price} 
                           onChange={e => setEditingPkg({...editingPkg, price: e.target.value})} 
                         />
                         <textarea 
                           className="w-full px-4 py-2 rounded-xl border border-navy/10 text-xs italic text-navy/50" 
                           value={editingPkg.note} 
                           onChange={e => setEditingPkg({...editingPkg, note: e.target.value})} 
                         />
                         <div className="flex gap-2">
                           <button onClick={handleSaveEdit} className="flex-1 py-2 bg-navy text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">Save</button>
                           <button onClick={() => setEditingPkg(null)} className="flex-1 py-2 border border-navy/10 rounded-lg text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                         </div>
                       </div>
                     ) : (
                       <>
                         <p className="font-serif text-2xl font-bold text-navy mb-1">{p.name}</p>
                         <p className="text-gold font-bold text-sm mb-6">{p.price}</p>
                         <div className="h-px bg-navy/5 w-12 mb-6" />
                         <p className="text-xs text-navy/50 leading-relaxed italic">"{p.note}"</p>
                         
                         <div className="absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => setEditingPkg(p)} className="p-3 text-gold/60 hover:bg-gold/5 rounded-2xl hover:text-gold transition-colors">
                               <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeletePackage(sid, p.name)} className="p-3 text-red-300 hover:bg-red-50 rounded-2xl hover:text-red-500 transition-colors">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                       </>
                     )}
                  </div>
                );
              })}
              <button onClick={() => setForm({...form, service_id: sid})} className="border-2 border-dashed border-gold/10 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-3 text-navy/20 hover:border-gold/50 hover:text-gold transition-all">
                 <Plus className="w-8 h-8" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Add Package</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Videos ─────────────────────────────────────────────────────────────
function VideosTab({ toast }) {
  const [videos, setVideos] = useState([]);
  const [adding, setAdding]   = useState(false);
  const [form, setForm]       = useState({ title: '', youtube_id: '', category: 'Wedding' });

  const load = () => fetch(`${API_BASE}/api/videos`).then(r => r.json()).then(d => setVideos(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.youtube_id) return toast('YouTube ID required', 'error');
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/videos`, {
        method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      if (res.ok) { toast('Video added!'); setForm({ ...form, title: '', youtube_id: '' }); load(); }
    } finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete video?')) return;
    await fetch(`${API_BASE}/api/admin/videos/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  return (
    <div className="space-y-10">
      <div className="bg-white border border-gold/15 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-navy mb-6">Feature YouTube Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input type="text" placeholder="Video Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none" />
          <input type="text" placeholder="YouTube ID" value={form.youtube_id} onChange={e => setForm({...form, youtube_id: e.target.value})} className="px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none" />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-5 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none">
            {PHOTO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={handleAdd} disabled={adding} className="px-8 py-4 btn-gold rounded-full text-sm flex items-center gap-2">
          {adding ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => (
          <div key={v.id} className="bg-white rounded-[2rem] overflow-hidden border border-gold/10 shadow-sm group">
            <div className="aspect-video relative overflow-hidden bg-navy">
              <img src={`https://img.youtube.com/vi/${v.youtube_id}/maxresdefault.jpg`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt="" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Youtube className="w-6 h-6 text-white" />
                 </div>
              </div>
              <button onClick={() => handleDelete(v.id)} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">{v.category}</p>
              <p className="font-bold text-navy truncate">{v.title || 'Untitled Work'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Clients ────────────────────────────────────────────────────────────
// ─── Tab: Clients ────────────────────────────────────────────────────────────
function ClientsTab({ toast }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ client_name: '', whatsapp_number: '', wish_date: '' });

  const load = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/admin/clients`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { 
        setClients(Array.isArray(d) ? d : []); 
        setLoading(false); 
      })
      .catch(() => {
        setClients([]);
        setLoading(false);
      });
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.client_name || !form.whatsapp_number) return toast('Name and Phone are required', 'error');
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/api/wishes`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast('Client registered successfully!', 'success');
        setForm({ client_name: '', whatsapp_number: '', wish_date: '' });
        load();
      } else toast('Failed to register', 'error');
    } finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete client entry?')) return;
    await fetch(`${API_BASE}/api/admin/clients/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  if (loading) return <div className="p-20 text-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-12 pb-20">
       <div className="bg-white border border-gold/15 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <h3 className="font-serif text-2xl font-bold text-navy mb-2">Register New Client</h3>
          <p className="text-navy/40 text-sm mb-10 max-w-xl">Add clients manually to the registry. They will receive automated anniversary/birthday wishes if a date is provided.</p>
          
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" placeholder="e.g. Rajesh Kumar"
                  value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none focus:border-gold/30"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest ml-1">WhatsApp Number</label>
                <input 
                  type="text" placeholder="919876543210"
                  value={form.whatsapp_number} onChange={e => setForm({...form, whatsapp_number: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none focus:border-gold/30"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest ml-1">Special Date (Optional)</label>
                <input 
                  type="date"
                  value={form.wish_date} onChange={e => setForm({...form, wish_date: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-navy/5 bg-cream/30 text-sm focus:outline-none focus:border-gold/30"
                />
             </div>
             <div className="md:col-span-3 flex justify-end mt-4">
                <button 
                  type="submit" disabled={adding}
                  className="px-12 py-4 btn-gold rounded-full font-bold text-sm shadow-gold-sm flex items-center gap-3 active:scale-95 transition-transform"
                >
                   {adding ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                   Add to Registry
                </button>
             </div>
          </form>
       </div>

       <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="font-serif text-2xl font-bold text-navy">Customer Database</h3>
             <div className="px-6 py-2.5 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">{clients.length} Active Profiles</div>
          </div>

          <div className="bg-white border border-gold/15 rounded-[2.5rem] overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-gold/5 border-b border-gold/10 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                   <tr>
                      <th className="p-8">Client Name</th>
                      <th className="p-8">Contact</th>
                      <th className="p-8">Anniversary / B'day</th>
                      <th className="p-8 text-right">Settings</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                   {Array.isArray(clients) && clients.map(c => (
                      <tr key={c.id} className="hover:bg-cream/10 group transition-colors">
                         <td className="p-8 font-bold text-navy flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-[10px]">{c.client_name.substring(0,2).toUpperCase()}</div>
                            {c.client_name}
                         </td>
                         <td className="p-8">
                            <div className="flex items-center gap-2 text-navy/60">
                               <Phone className="w-3 h-3" /> {c.whatsapp_number}
                            </div>
                         </td>
                         <td className="p-8 text-navy/60">
                            {c.wish_date ? (
                               <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3" /> {new Date(c.wish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                               </div>
                            ) : '—'}
                         </td>
                         <td className="p-8 text-right">
                            <button onClick={() => handleDelete(c.id)} className="p-3 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-xl">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {clients.length === 0 && <div className="p-20 text-center text-navy/20 italic">No registered clients yet</div>}
          </div>
       </div>
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────────────────────
const TABS = [
  { id: 'hero',    label: 'Hero Video',   icon: Video, desc: 'Manage landing video' },
  { id: 'gallery', label: 'Gallery',       icon: Image, desc: 'Public photo stream' },
  { id: 'services',label: 'Services',      icon: Sparkles, desc: 'Packages & Pricing' },
  { id: 'videos',  label: 'Videos',        icon: Youtube, desc: 'YouTube Showcase' },
  { id: 'albums',  label: 'Design Albums', icon: FolderOpen, desc: 'Client portfolios' },
  { id: 'clients', label: 'Clients & Wishes', icon: Users, desc: 'Auto-greetings' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="fixed inset-0 bg-[#FDFCF9] flex flex-col md:flex-row font-sans text-navy overflow-hidden">
      {/* ─── Sidebar ─── */}
      <aside className="w-full md:w-80 bg-[#0B0D11] text-white flex flex-col shrink-0 z-50 h-full">
        <div className="p-10 border-b border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shadow-inner">
              <Camera className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold leading-none tracking-tight">Sushma</h1>
              <span className="text-[10px] text-gold/60 font-bold uppercase tracking-[0.2em] mt-1 block">Studio Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {TABS.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full group flex items-center gap-5 px-5 py-5 rounded-3xl transition-all duration-500 relative overflow-hidden ${
                activeTab === id
                  ? 'bg-gold text-navy shadow-2xl shadow-gold/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-500 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <div className="text-left">
                <p className="text-sm font-bold tracking-wide leading-none">{label}</p>
                <p className={`text-[10px] mt-1.5 opacity-60 font-medium ${activeTab === id ? 'text-navy' : 'text-white/40'}`}>
                  {desc}
                </p>
              </div>
              {activeTab === id && (
                <motion.div layoutId="navGlow" className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-500 font-bold text-xs uppercase tracking-[0.2em] group shadow-inner"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main View ─── */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto bg-[#FDFCF9] relative scroll-smooth custom-scrollbar">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-3xl border-b border-navy/5 px-10 py-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-navy capitalize tracking-tight flex items-center gap-3">
              {TABS.find(t => t.id === activeTab)?.label}
              <ChevronRight className="w-5 h-5 text-gold/30" />
            </h2>
            <p className="text-xs text-navy/40 font-bold uppercase tracking-widest mt-1">Management Portal v2.0</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-sm font-bold text-navy">Super Admin</span>
               <span className="text-[10px] text-navy/30 uppercase tracking-widest font-bold">Verified Session</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold shadow-xl border-4 border-white">
              AD
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-10 md:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeTab === 'hero'    && <HeroTab    toast={showToast} />}
              {activeTab === 'gallery' && <GalleryTab  toast={showToast} />}
              {activeTab === 'services' && <ServicesTab toast={showToast} />}
              {activeTab === 'videos'  && <VideosTab   toast={showToast} />}
              {activeTab === 'albums'  && <AlbumsTab   toast={showToast} />}
              {activeTab === 'clients' && <ClientsTab  toast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
