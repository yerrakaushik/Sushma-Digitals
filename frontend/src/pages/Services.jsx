import React, { useState, useEffect } from 'react';
import { CheckCircle, MessageCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { servicesApi } from '../services/api';

const WHATSAPP_NUMBER = '919866598393';

const SERVICES = [
  {
    id: 'wedding',
    icon: '💍',
    title: 'Wedding Photography',
    tagline: 'Your story, forever told.',
    description:
      'From the first look to the last dance — we document every emotion, every laugh, every tear with cinematic artistry. Our experienced team blends seamlessly into your celebration to capture authentic moments.',
    highlights: [
      'Candid & traditional coverage',
      'Experienced team of 2–4 photographers',
      'Full HD video + drone shots',
      'Album design & printing',
      'Online gallery delivery in 3 weeks',
    ],
    heroImage: null,
    refImages: [],
    youtubeId: 'oBxXgyizHrU',
    packages: [
      { name: 'Silver',   note: 'Ideal for intimate ceremonies', features: ['1 photographer', 'Half-day coverage', 'Digital gallery'] },
      { name: 'Gold',     note: 'Full wedding day — most popular ★', features: ['2 photographers', 'Full-day coverage', 'HD video + album'] },
      { name: 'Platinum', note: 'Multi-day luxury coverage', features: ['Full team', 'Multi-day + drone', 'Premium album + film'] },
    ],
  },
  {
    id: 'prewedding',
    icon: '🌅',
    title: 'Pre-Wedding Shoots',
    tagline: 'Love stories deserve a prologue.',
    description:
      'A pre-wedding shoot is your chance to be yourselves before the big day. We scout beautiful locations, plan the perfect lighting, and create a relaxed, fun environment for your couple portraits.',
    highlights: [
      'Multiple location options',
      'Wardrobe & styling guidance',
      'Golden hour & natural light shots',
      'Short video teaser included',
      'Edited photos in 7 days',
    ],
    heroImage: null,
    refImages: [],
    youtubeId: 'dGPjEp_HxaI',
    packages: [
      { name: 'Essentials', note: 'Half-day, single location',        features: ['1 location', '3-hour shoot', 'Edited photos'] },
      { name: 'Signature',  note: 'Full day with multiple looks ★',   features: ['2 locations', 'Full-day shoot', 'Photos + teaser'] },
      { name: 'Cinematic',  note: 'Travel + cinematic video',         features: ['Travel shoots', '4K video film', 'All edits included'] },
    ],
  },
  {
    id: 'halfSaree',
    icon: '🥻',
    title: 'Half Saree Functions',
    tagline: 'A milestone as radiant as she is.',
    description:
      'The Half Saree ceremony is one of the most beautiful rites of passage for a young woman. We capture every ritual, every emotion, and every family moment with warmth, cultural sensitivity, and artistic vision.',
    highlights: [
      'Full ceremony & ritual coverage',
      'Family & portrait sessions',
      'Candid & traditional photography',
      'Short highlight video reel',
      'Beautifully edited gallery',
    ],
    heroImage: null,
    refImages: [],
    youtubeId: 'oJdjE3R-uRs',
    packages: [
      { name: 'Classic',   note: 'Ceremony essentials',          features: ['Photographer', '4-hour coverage', 'Edited gallery'] },
      { name: 'Premium',   note: 'Full function + video ★',      features: ['Photo + video', 'All rituals covered', 'Highlight reel'] },
      { name: 'Royal',     note: 'Grand coverage for big events', features: ['Full team', 'Drone shots', 'Premium film + album'] },
    ],
  },
  {
    id: 'dhoti',
    icon: '🧣',
    title: 'Dhoti Functions',
    tagline: 'Honouring tradition, frame by frame.',
    description:
      'The Dhoti ceremony marks a proud moment in every Telugu family. We bring artistry and respect to every step — from the sacred rituals to the celebratory feasts — preserving this cherished tradition for generations.',
    highlights: [
      'Sacred ritual & ceremony coverage',
      'Boy & family portrait sessions',
      'Candid celebrations captured',
      'Short video highlight film',
      'Quick turnaround editing',
    ],
    heroImage: null,
    refImages: [],
    youtubeId: null,
    packages: [
      { name: 'Classic',  note: 'Ceremony essentials',          features: ['Photographer', '3-hour coverage', 'Photo gallery'] },
      { name: 'Celebrate',note: 'Full function + video ★',      features: ['Photo + video', 'All rituals', 'Highlight reel'] },
      { name: 'Heritage', note: 'Grand family coverage',        features: ['Full team', 'Full-day shoot', 'Film + album'] },
    ],
  },
  {
    id: 'birthday',
    icon: '🎂',
    title: 'Birthday Events',
    tagline: 'Every milestone, magnificently captured.',
    description:
      'Whether it\'s a 1st birthday or a 50th celebration, we bring creativity and warmth to every birthday shoot. Our team works with decorators and event planners to ensure seamless coverage.',
    highlights: [
      'Candid & themed photography',
      'Cake smash sessions for babies',
      'Short highlight video reel',
      'Same-day preview photos',
      'Printed photo books available',
    ],
    heroImage: null,
    refImages: [],
    youtubeId: null,
    packages: [
      { name: 'Joy',         note: '3-hour coverage',             features: ['1 photographer', 'Candid shots', 'Digital gallery'] },
      { name: 'Celebration', note: '6-hour full event ★',         features: ['Photo + video', 'Full event', 'Highlight reel'] },
      { name: 'Grand',       note: 'Photography + cinematic reel',features: ['Full team', 'All-day coverage', 'Premium film'] },
    ],
  },
  {
    id: 'babyshower',
    icon: '🍼',
    title: 'Baby Shower & Naming',
    tagline: 'The sweetest beginnings, beautifully preserved.',
    description:
      'Celebrate new life with photographs that capture the joy, the wonder, and the love surrounding your little one. We specialise in soft, warm, emotive photography for life\'s most precious early moments.',
    highlights: [
      'Soft and emotive lighting setup',
      'Mom, baby & family portraits',
      'Props & setup coordination',
      '100+ edited photos',
      'Gallery ready within 5 days',
    ],
    heroImage: null,
    refImages: [],
    youtubeId: null,
    packages: [
      { name: 'Gentle',   note: '3-hour event coverage',          features: ['Photographer', 'Baby & mom shots', 'Edited gallery'] },
      { name: 'Cherish',  note: '5-hour full event ★',            features: ['Photo + video', 'Full ceremony', 'Highlight reel'] },
      { name: 'Treasure', note: 'Photography + video highlight',  features: ['Full team', 'All-day', 'Premium delivery'] },
    ],
  },
];

function PackageCard({ pkg, serviceTitle }) {
  const isPopular = pkg.name === 'Gold' || pkg.name === 'Signature' || pkg.name === 'Celebration' || pkg.name === 'Premium';
  const msg = encodeURIComponent(
    `Hello! I'm interested in the ${pkg.name} package for ${serviceTitle}. Could you share more details and pricing?`
  );
  return (
    <div className={`relative rounded-3xl p-6 flex flex-col border transition-all duration-300 hover:-translate-y-2 ${
      isPopular
        ? 'bg-navy text-white border-gold/50 shadow-[0_8px_32px_rgba(11,29,58,0.2)]'
        : 'bg-navy/5 border-navy/10 hover:border-gold/30 hover:bg-navy/10'
    }`}>
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold px-4 py-1 rounded-full tracking-wider uppercase shadow-gold-sm">
          Most Popular
        </span>
      )}
      <p className={`font-serif text-xl font-bold mb-1 ${isPopular ? 'text-white' : 'text-navy'}`}>
        {pkg.name}
      </p>
      <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isPopular ? 'text-gold/80' : 'text-gold'}`}>Enquire for Pricing</p>
      <p className={`text-xs mb-6 ${isPopular ? 'text-white/50' : 'text-navy/50'}`}>{pkg.note}</p>
      <ul className="mb-6 space-y-2 flex-1">
        {(pkg.features || []).map((f, i) => (
          <li key={i} className={`flex items-center gap-3 text-sm ${isPopular ? 'text-white/80' : 'text-navy/80'}`}>
            <CheckCircle className="w-4 h-4 shrink-0 text-gold" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto w-full text-center py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
          isPopular
            ? 'bg-white text-navy hover:bg-gold hover:text-white shadow-xl'
            : 'bg-navy text-white hover:bg-gold'
        }`}
      >
        <MessageCircle className="w-4 h-4" />
        Request Quote
      </a>
    </div>
  );
}

function PremiumServiceCard({ svc, index }) {
  const [showPackages, setShowPackages] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div id={`service-${svc.id}`} className="py-20 border-b border-white/5 last:border-0 relative">
      {/* Background Glow */}
      <div className={`absolute top-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none ${isEven ? '-left-20' : '-right-20'}`} />

      <div className={`max-w-7xl mx-auto px-6 flex flex-col gap-16 lg:items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        
        {/* Left Side: Images */}
        <div className="flex-1 w-full relative">
          <div className="aspect-[4/5] md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl relative group bg-navy/5">
            {svc.heroImage ? (
              <img
                src={svc.heroImage}
                alt={svc.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy/10 via-white to-gold/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                <img src="/SUSHMA9999.png" alt="Sushma Digitals" className="w-32 h-32 object-contain opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-5xl mb-4 block filter drop-shadow-lg">{svc.icon}</span>
            </div>
          </div>
          
          {svc.refImages && svc.refImages.length > 0 && (
            <div className={`hidden md:flex gap-4 absolute -bottom-8 ${isEven ? '-right-8' : '-left-8'} z-10 p-4 bg-navy-dark/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl`}>
               {svc.refImages.slice(0, 2).map((src, i) => (
                  <div key={i} className="w-24 h-24 rounded-xl overflow-hidden">
                    <img src={src} alt="Sample" className="w-full h-full object-cover" />
                  </div>
               ))}
            </div>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 w-full relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-navy font-bold mb-3 tracking-tight">{svc.title}</h2>
          <p className="text-gold text-lg italic mb-6 font-serif">{svc.tagline}</p>
          <p className="text-navy/60 text-base leading-relaxed mb-8">{svc.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-10">
             {svc.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-navy/80">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {h}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowPackages(!showPackages)}
            className="group flex items-center gap-3 bg-navy/5 hover:bg-navy/10 border border-navy/10 hover:border-gold/30 px-6 py-4 rounded-2xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-semibold text-navy tracking-wide text-sm">Explore Our Packages</span>
            {showPackages
              ? <ChevronUp className="w-5 h-5 text-navy/40 group-hover:text-gold" />
              : <ChevronDown className="w-5 h-5 text-navy/40 group-hover:text-gold" />}
          </button>
        </div>
      </div>

      {/* Packages Section (Expandable) */}
      <div className={`transition-all duration-500 max-w-7xl mx-auto px-6 ${showPackages ? 'mt-16 opacity-100 max-h-[2000px]' : 'mt-0 opacity-0 max-h-0 overflow-hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {svc.packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} serviceTitle={svc.title} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState(SERVICES);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      servicesApi.list(),
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery?category=SERVICE_COVER`).then(r => r.json())
    ])
      .then(([grouped, covers]) => {
        const coverMap = {};
        (covers || []).forEach(p => {
          const sid = p.alt.replace('SERVICE_COVER_', '');
          coverMap[sid] = p.url;
        });

        setServices(prev => prev.map(s => {
          const apiPackages = grouped[s.id];
          const dynamicCover = coverMap[s.id];
          
          return {
            ...s,
            heroImage: dynamicCover || s.heroImage,
            packages: s.packages.map(p => {
              if (!apiPackages) return p;
              const apiMatch = apiPackages.find(ap => ap.name === p.name);
              return apiMatch ? { ...p, ...apiMatch } : p;
            })
          };
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans bg-cream min-h-screen">
      {/* ─── Premium Hero ─── */}
      <div className="bg-navy-dark pt-52 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-56 bg-gold/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-10 h-px bg-gold/50" />
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Premium Experiences</p>
            <span className="block w-10 h-px bg-gold/50" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-4">
            Our <span className="text-gold">Services</span>
          </h1>
          <p className="text-white/45 max-w-xl mx-auto text-base leading-relaxed">
            Crafting timeless visual stories with elegance, artistry, and an unwavering commitment to perfection.
          </p>
        </div>
      </div>

      {/* ─── Premium Service Cards ─── */}
      <section className="pb-24">
        {services.map((svc, index) => (
          <PremiumServiceCard key={svc.id} svc={svc} index={index} />
        ))}
      </section>

      {/* ─── Grand CTA ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-navy text-white p-12 md:p-20 rounded-[3rem] shadow-2xl">
          <p className="text-gold text-xs tracking-widest uppercase font-semibold mb-4">Let's Create Together</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 font-bold">Ready to tell your story?</h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Every moment is unique. Send us a message, and we'll craft a bespoke package tailored perfectly to your vision.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello! I would like to learn more about your photography packages.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-navy hover:bg-gold hover:text-white rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl"
          >
            <MessageCircle className="w-5 h-5" /> Start the Conversation <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </section>
    </div>
  );
}
