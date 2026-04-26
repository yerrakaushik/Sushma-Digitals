/**
 * Public Designs / Album page
 * Users can VIEW photos but cannot save or download them.
 * Right-click, drag, long-press are all blocked.
 */
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { albumsApi } from '../services/api';

// Image protection is now handled globally in App.jsx
function useProtectImages() {}

function Lightbox({ photos, index, onClose }) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(c + 1, photos.length - 1));
      if (e.key === 'ArrowLeft')  setCurrent(c => Math.max(c - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [photos.length, onClose]);

  const photo = photos[current];

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent(c => c - 1); }}
          className="absolute left-4 p-2 text-white/60 hover:text-white transition-colors z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      <img
        src={photo.url}
        alt={photo.caption || ''}
        className="max-h-[90vh] max-w-[90vw] object-contain select-none pointer-events-none"
        draggable={false}
        onContextMenu={e => e.preventDefault()}
        onClick={e => e.stopPropagation()}
      />

      {current < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent(c => c + 1); }}
          className="absolute right-4 p-2 text-white/60 hover:text-white transition-colors z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {photo.caption && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center px-4">
          {photo.caption}
        </p>
      )}

      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/20 text-xs">
        {current + 1} / {photos.length}
      </p>
    </div>
  );
}

function AlbumGrid({ album }) {
  const [photos, setPhotos]     = useState([]);
  const [open, setOpen]         = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const load = async () => {
    try {
      const data = await albumsApi.listPhotos(album.id);
      setPhotos(data);
    } catch (e) {
      console.error(e);
    }
  };

  const toggle = () => {
    if (!open) load();
    setOpen(o => !o);
  };

  return (
    <div className="space-y-4">
      {/* Album header */}
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gold/15 hover:border-gold/35 transition-all text-left group"
      >
        {album.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0 select-none pointer-events-none"
            draggable={false}
            onContextMenu={e => e.preventDefault()}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gold/10 shrink-0 flex items-center justify-center">
            <span className="text-2xl">📸</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-navy">{album.name}</p>
          {album.description && <p className="text-navy/50 text-sm truncate">{album.description}</p>}
        </div>
        <ChevronRight className={`w-5 h-5 text-navy/30 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {/* Photos grid */}
      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pl-2">
          {photos.length === 0 && (
            <p className="col-span-full text-navy/40 text-sm text-center py-6">No photos in this album yet.</p>
          )}
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setLightbox(idx)}
              className="group relative aspect-square rounded-xl overflow-hidden border border-gold/10 bg-cream focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              <img
                src={photo.url}
                alt={photo.caption || album.name}
                className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                draggable={false}
                onContextMenu={e => e.preventDefault()}
              />
              {/* Watermark overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy/20">
                <span className="text-white/40 text-xs font-semibold tracking-widest rotate-[-30deg] select-none">
                  Sushma Digitals
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {lightbox !== null && (
        <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

export default function Designs() {
  useProtectImages();
  const [albums, setAlbums]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    albumsApi.list()
      .then(setAlbums)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-48 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl text-navy">Our Designs</h1>
          <p className="text-navy/50 max-w-xl mx-auto">Browse through our work. All images are protected and for viewing only.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 text-navy/40">No albums yet. Check back soon!</div>
        ) : (
          <div className="space-y-4">
            {albums.map(album => <AlbumGrid key={album.id} album={album} />)}
          </div>
        )}
      </div>
    </div>
  );
}
