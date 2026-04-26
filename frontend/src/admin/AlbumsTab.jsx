import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload, Image, ChevronDown, ChevronRight } from 'lucide-react';
import { albumsApi } from '../services/api';

export default function AlbumsTab({ toast }) {
  const [albums, setAlbums]       = useState([]);
  const [newName, setNewName]     = useState('');
  const [newDesc, setNewDesc]     = useState('');
  const [creating, setCreating]   = useState(false);
  const [expanded, setExpanded]   = useState({});
  const [photos, setPhotos]       = useState({});   // { albumId: [...] }
  const [uploading, setUploading] = useState({});   // { albumId: bool }
  const [pendingUpload, setPendingUpload] = useState(null); // { albumId, file, url }
  const [position, setPosition]   = useState(50); // Vertical focus
  const fileRefs = useRef({});

  const loadAlbums = () =>
    albumsApi.list().then(setAlbums).catch(() => {});

  useEffect(() => { loadAlbums(); }, []);

  const loadPhotos = async (albumId) => {
    try {
      const data = await albumsApi.listPhotos(albumId);
      setPhotos(p => ({ ...p, [albumId]: data }));
    } catch (e) {
      toast('Failed to load photos', 'error');
    }
  };

  const toggleAlbum = (albumId) => {
    const next = !expanded[albumId];
    setExpanded(e => ({ ...e, [albumId]: next }));
    if (next && !photos[albumId]) loadPhotos(albumId);
  };

  const handleCreateAlbum = async () => {
    if (!newName.trim()) { toast('Album name is required', 'error'); return; }
    setCreating(true);
    try {
      await albumsApi.create({ name: newName.trim(), description: newDesc.trim() });
      setNewName(''); setNewDesc('');
      loadAlbums();
      toast('Album created!', 'success');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAlbum = async (id, name) => {
    if (!confirm(`Delete album "${name}" and all its photos?`)) return;
    try {
      await albumsApi.delete(id);
      setAlbums(a => a.filter(x => x.id !== id));
      toast('Album deleted', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const handleUploadPhoto = async (albumId, file) => {
    if (!file) return;
    setUploading(u => ({ ...u, [albumId]: true }));
    const fd = new FormData();
    fd.append('photo', file);
    fd.append('caption', '');
    try {
      await albumsApi.uploadPhoto(albumId, fd);
      await loadPhotos(albumId);
      // Update cover if needed
      loadAlbums();
      toast('Photo uploaded!', 'success');
      setPendingUpload(null);
    } catch (e) {
      toast(e.message || 'Upload failed', 'error');
    } finally {
      setUploading(u => ({ ...u, [albumId]: false }));
      if (fileRefs.current[albumId]) fileRefs.current[albumId].value = '';
    }
  };

  const handleDeletePhoto = async (albumId, photoId) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await albumsApi.deletePhoto(albumId, photoId);
      setPhotos(p => ({ ...p, [albumId]: p[albumId].filter(x => x.id !== photoId) }));
      toast('Photo deleted', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const inputCls = 'px-4 py-3 rounded-xl border border-navy/10 bg-white text-sm text-navy placeholder-navy/40 focus:outline-none focus:border-gold/40 transition-all';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-navy font-semibold mb-1">Design Albums</h2>
        <p className="text-navy/50 text-sm">Upload your design photos into albums. Clients can view them but cannot download or save.</p>
      </div>

      {/* Create album */}
      <div className="bg-cream border border-gold/15 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-navy text-sm">Create New Album</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className={inputCls} placeholder="Album name *" value={newName}
            onChange={e => setNewName(e.target.value)} />
          <input className={inputCls} placeholder="Description (optional)" value={newDesc}
            onChange={e => setNewDesc(e.target.value)} />
        </div>
        <button
          onClick={handleCreateAlbum}
          disabled={creating}
          className="inline-flex items-center gap-2 px-6 py-3 btn-gold rounded-full text-sm disabled:opacity-60"
        >
          {creating
            ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            : <Plus className="w-4 h-4" />}
          Create Album
        </button>
      </div>

      {/* Albums list */}
      {albums.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gold/20 bg-cream p-10 text-center">
          <Image className="w-10 h-10 text-navy/20 mx-auto mb-3" />
          <p className="text-navy/40 text-sm">No albums yet — create your first one above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {albums.map(album => (
            <div key={album.id} className="bg-white rounded-2xl border border-gold/10 overflow-hidden">
              {/* Album header */}
              <div className="flex items-center gap-3 p-4">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 select-none pointer-events-none"
                    draggable={false} onContextMenu={e => e.preventDefault()} />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Image className="w-5 h-5 text-gold/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm">{album.name}</p>
                  {album.description && <p className="text-navy/40 text-xs truncate">{album.description}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleAlbum(album.id)}
                    className="p-2 text-navy/40 hover:text-navy transition-colors"
                  >
                    {expanded[album.id]
                      ? <ChevronDown className="w-4 h-4" />
                      : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(album.id, album.name)}
                    className="p-2 text-navy/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded photos */}
              {expanded[album.id] && (
                <div className="border-t border-gold/8 p-4 space-y-4">
                  {/* Upload button with Preview */}
                  <div className="bg-cream/40 rounded-2xl p-4 border border-gold/10">
                    <input
                      ref={el => fileRefs.current[album.id] = el}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setPendingUpload({ albumId: album.id, file, url: URL.createObjectURL(file) });
                        }
                      }}
                    />
                    
                    {pendingUpload?.albumId === album.id ? (
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-gold/30 bg-white shadow-md relative group shrink-0">
                          <img 
                            src={pendingUpload.url} 
                            alt="preview" 
                            className="w-full h-full object-cover" 
                            style={{ objectPosition: `50% ${position}%` }}
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-navy mb-2">Adjust Vertical Focus</p>
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUploadPhoto(album.id, pendingUpload.file)}
                              disabled={uploading[album.id]}
                              className="px-6 py-2 bg-navy text-gold rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm hover:bg-navy-dark transition-all disabled:opacity-50"
                            >
                              {uploading[album.id] ? 'Uploading...' : 'Confirm & Save'}
                            </button>
                            <button
                              onClick={() => { setPendingUpload(null); setPosition(50); }}
                              className="px-6 py-2 border border-navy/10 text-navy/50 rounded-full text-[10px] font-bold uppercase tracking-wider hover:text-red-500 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileRefs.current[album.id]?.click()}
                        disabled={uploading[album.id]}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gold/25 text-navy/60 rounded-full text-xs font-semibold hover:border-gold/50 hover:text-navy transition-all shadow-sm"
                      >
                        {uploading[album.id]
                          ? <span className="w-3 h-3 border border-navy/30 border-t-navy rounded-full animate-spin" />
                          : <Upload className="w-3.5 h-3.5 text-gold" />}
                        Choose Photo to Preview
                      </button>
                    )}
                  </div>

                  {/* Photo grid */}
                  {(photos[album.id] || []).length === 0 ? (
                    <p className="text-navy/35 text-xs text-center py-4">No photos yet</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {(photos[album.id] || []).map(photo => (
                        <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden border border-gold/10">
                          <img
                            src={photo.url}
                            alt={photo.caption || ''}
                            className="w-full h-full object-cover select-none pointer-events-none"
                            draggable={false}
                            onContextMenu={e => e.preventDefault()}
                          />
                          <div className="absolute inset-0 bg-navy/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => handleDeletePhoto(album.id, photo.id)}
                              className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
