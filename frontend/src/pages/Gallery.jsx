import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Gallery Page — fetches photos from /api/gallery.
 * Falls back to Unsplash placeholders if backend is offline.
 */
const CATEGORIES = ['All', 'Wedding', 'Pre-Wedding', 'Birthday', 'Half Saree', 'Dhoti'];

const FALLBACK_PHOTOS = [
  { id: 1, category: 'Half Saree', url: '/GAN00022.JPG', alt: 'Traditional Half Saree Ceremony' },
  { id: 2, category: 'Half Saree', url: '/GAN00130.JPG', alt: 'Candid Portrait' },
  { id: 3, category: 'Wedding', url: '/LUCK9338.JPG', alt: 'Wedding Couple' },
  { id: 4, category: 'Wedding', url: '/LUCK9386.JPG', alt: 'Wedding Grandeur' },
  { id: 5, category: 'Wedding', url: '/LUCK9497.JPG', alt: 'Bridal Portrait' },
  { id: 6, category: 'Pre-Wedding', url: '/006A8218.JPG', alt: 'Outdoor Couple Session' },
  { id: 7, category: 'Wedding', url: '/LUCK9782.JPG', alt: 'Wedding Ceremony' },
  { id: 8, category: 'Wedding', url: '/LUCK9783.JPG', alt: 'Grand Wedding Event' },
  { id: 9, category: 'Wedding', url: '/006A7583.JPG', alt: 'Cinematic Wedding' },
  { id: 10, category: 'Dhoti', url: '/GAN00083.JPG', alt: 'Dhoti Ceremony' },
  { id: 11, category: 'Birthday', url: '/GAN00103.JPG', alt: 'Birthday Celebration' },
  { id: 12, category: 'Half Saree', url: '/GAN00146.JPG', alt: 'Traditional Portrait' },
  { id: 13, category: 'Wedding', url: '/GAN00189.JPG', alt: 'Mandap Decoration' },
  { id: 14, category: 'Pre-Wedding', url: '/006A8237.JPG', alt: 'Romantic Pre-wedding' },
];

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/gallery`)
      .then((r) => r.json())
      .then((data) => {
        const dbPhotos = Array.isArray(data) ? data : [];
        // Merge DB photos with fallback photos, avoiding duplicates by URL
        const merged = [...dbPhotos];
        FALLBACK_PHOTOS.forEach(fb => {
          if (!merged.find(m => m.url === fb.url)) {
            merged.push(fb);
          }
        });
        setPhotos(merged);
      })
      .catch(() => setPhotos(FALLBACK_PHOTOS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <div className="font-sans bg-cream min-h-screen">
      {/* ─── Page Header ─── */}
      <div className="bg-navy-dark pt-52 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-56 bg-gold/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-10 h-px bg-gold/50" />
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Our Portfolio</p>
            <span className="block w-10 h-px bg-gold/50" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-4">Gallery</h1>
          <p className="text-white/45 max-w-xl mx-auto text-base leading-relaxed">
            Every image here is a story — of love, laughter, and life's most beautiful moments.
          </p>
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      <section className="sticky top-28 z-30 bg-[#FCFAF6]/90 backdrop-blur-md border-b border-gold/10 py-6 shadow-sm">
        <div className="flex overflow-x-auto justify-center gap-2 px-6 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`gallery-filter-${cat.toLowerCase().replace(' ', '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeCategory === cat
                  ? 'bg-navy text-gold border border-gold/40 shadow-md'
                  : 'bg-cream text-navy/60 border border-navy/10 hover:border-gold/30 hover:text-navy'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Photo Grid ─── */}
      <section className="py-12 px-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                className="aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-gold-sm hover:scale-[1.02] transition-all duration-300 group relative"
                onClick={() => setLightbox(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-all duration-300 rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-navy/80 to-transparent">
                  <p className="text-white text-sm font-serif font-bold mb-1">
                    {photo.category}
                  </p>
                  <p className="text-white/70 text-xs truncate">
                    {photo.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Instagram Follow CTA ─── */}
      <section className="py-16 px-6">
        <div
          className="max-w-3xl mx-auto rounded-3xl overflow-hidden relative text-center"
          style={{
            background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
            padding: '3px',
          }}
        >
          <div className="bg-navy-dark rounded-3xl px-8 py-12">
            {/* Instagram icon */}
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}>
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </div>
            <p className="text-white/50 text-xs font-semibold tracking-[0.3em] uppercase mb-3">Love what you see?</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-3">
              Follow Us on Instagram
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Get daily behind-the-scenes, sneak peeks, and our latest work. New stories posted every week!
            </p>
            <a
              href="https://www.instagram.com/sushmadigital?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              id="gallery-instagram-follow"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              Follow @sushmadigital
            </a>
          </div>
        </div>
      </section>

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-navy-dark/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 text-white/60 hover:text-gold transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-gold/15"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
            {lightbox.alt}
          </p>
        </div>
      )}
    </div>
  );
}
