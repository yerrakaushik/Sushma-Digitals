import React, { useState, useEffect } from 'react';
import { ExternalLink, Youtube, Plus, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const YT_CHANNEL = 'https://www.youtube.com/@Sushmadigitals';
const PLAYLIST_ID = 'PLrEnWoR732-BHrPp_Pm8_VleD68f9s14-'; // Sushma Digitals playlist

const FALLBACK_VIDEOS = [
  {
    id: 'v1',
    youtube_id: 'eyCcu1U7Ozo',
    title: 'Prasanth & Priyanka — Wedding Teaser',
    description: 'A cinematic wedding teaser captured in stunning 4K by Sushma Digitals.',
    tag: 'Wedding Film',
  },
  {
    id: 'v2',
    youtube_id: 'fMd2xIC3ElU',
    title: 'Satishvarma & Arthi — Wedding Promo',
    description: 'A beautiful wedding story captured with warmth and artistry.',
    tag: 'Wedding Film',
  },
  {
    id: 'v3',
    youtube_id: 'x2c7JuT5LdM',
    title: 'Satishvarma & Arthi — Pre-Wedding Teaser',
    description: 'Golden hour romance in a stunning pre-wedding teaser.',
    tag: 'Pre-Wedding',
  },
  {
    id: 'v4',
    youtube_id: 'MoyH8SJe2kw',
    title: 'Subash & Divya — Pre-Wedding Teaser',
    description: 'Love in 4K — a dreamy pre-wedding shoot by Sushma Digitals.',
    tag: 'Pre-Wedding',
  },
  {
    id: 'v5',
    youtube_id: '4xIXvhb2ezc',
    title: 'Vyshnavi — Half Saree Function',
    description: 'A radiant Half Saree ceremony beautifully preserved in 4K.',
    tag: 'Half Saree',
  },
  {
    id: 'v6',
    youtube_id: '2Tjd9_HNagg',
    title: 'Karthik — Dhoti Ceremony Highlights',
    description: 'Tradition and pride honoured in every frame.',
    tag: 'Dhoti Function',
  },
  {
    id: 'v7',
    youtube_id: 'noqxX83aFnU',
    title: 'Subramanayam — Haldi Highlights',
    description: 'Joy and colour — a gorgeous Haldi ceremony captured in 4K.',
    tag: 'Haldi',
  },
  {
    id: 'v8',
    youtube_id: 'dNXwTBKXG6U',
    title: 'Kumar & Prasanna — Wedding Promo',
    description: 'Every vow, every emotion — a cinematic wedding promo.',
    tag: 'Wedding Film',
  },
];


export default function YouTubePage() {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/videos`)
      .then((r) => r.json())
      .then((data) => setVideos(Array.isArray(data) && data.length > 0 ? data : FALLBACK_VIDEOS))
      .catch(() => setVideos(FALLBACK_VIDEOS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans bg-cream min-h-screen">
      {/* ─── Page Header ─── */}
      <div className="bg-navy-dark pt-52 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-56 bg-gold/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-10 h-px bg-gold/50" />
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Film & Video</p>
            <span className="block w-10 h-px bg-gold/50" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-4">Our Films</h1>
          <p className="text-white/45 max-w-xl mx-auto text-base leading-relaxed">
            Beyond photographs — we craft cinematic films that transport you back to your most cherished moments.
          </p>
          <a
            href={YT_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-gold text-sm font-semibold hover:text-gold-light transition-colors"
          >
            <Youtube className="w-4 h-4" /> Subscribe on YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ─── Featured Film ─── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-navy mb-2">Featured Film</h2>
            <p className="text-navy/50 text-sm">Watch our latest cinematic masterpiece.</p>
          </div>
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gold/15">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/eyCcu1U7Ozo?autoplay=0&rel=0`}
              title="Sushma Digitals Studio — Featured Film"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ─── Individual Video Cards ─── */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-navy mb-8 text-center">Recent Films</h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.slice(1, 5).map((video) => (
                <div
                  key={video.id}
                  className="rounded-3xl overflow-hidden bg-white border border-gold/15 shadow-sm hover:shadow-gold-sm hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-video w-full bg-navy-light">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.youtube_id}?rel=0`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold mb-3 border border-gold/20">
                      {video.tag}
                    </span>
                    <h3 className="font-serif text-lg text-navy font-semibold mb-2">{video.title}</h3>
                    <p className="text-navy/50 text-sm">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
