import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { Star, Heart, Camera, Award, Users, ArrowRight, Send } from 'lucide-react';

const WHATSAPP_NUMBER = '919866598393';
const WHATSAPP_MSG = encodeURIComponent('Hello! I would like to inquire about your photography services.');

// ─── Stats ───
const STATS = [
  { icon: <Camera className="w-7 h-7 text-gold" />, value: '10K+', label: 'Events Covered' },
  { icon: <Users className="w-7 h-7 text-gold" />, value: '300+', label: 'Happy Families' },
  { icon: <Award className="w-7 h-7 text-gold" />, value: '21', label: 'Years Experience' },
  { icon: <Heart className="w-7 h-7 text-gold" />, value: '100%', label: 'Client Satisfaction' },
];

// ─── Reviews ───
const REVIEWS = [
  {
    id: 1, name: 'Priya Sharma', rating: 5,
    text: 'Absolutely stunning photography! They captured our wedding beautifully. Every emotion, every moment was preserved perfectly.',
    avatar: 'PS',
  },
  {
    id: 2, name: 'Rahul & Anjali', rating: 5,
    text: 'Best decision we made! The pre-wedding shoot exceeded all our expectations. Highly recommend Sushma Digitals.',
    avatar: 'RA',
  },
  {
    id: 3, name: 'Meena Krishnan', rating: 5,
    text: 'Wonderful team, professional approach and exceptional results. Our family portraits look like magazine covers!',
    avatar: 'MK',
  },
];

// ─── Service highlights for home ───
const SERVICES_PREVIEW = [
  { icon: '💍', title: 'Wedding Photography', desc: 'Full-day cinematic coverage of your most sacred day.' },
  { icon: '🌅', title: 'Pre-Wedding Shoots', desc: 'Romantic golden-hour stories before the big day.' },
  { icon: '🎂', title: 'Birthday Events', desc: 'Every giggle and surprise captured with joy.' },
  { icon: '🥻', title: 'Half Saree Functions', desc: 'A milestone as radiant as she is — captured with grace.' },
  { icon: '🧣', title: 'Dhoti Functions', desc: 'Honouring tradition and pride, frame by frame.' },
  { icon: '🍼', title: 'Baby Shower & Naming', desc: 'Treasured milestones documented forever.' },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
      ))}
    </div>
  );
}

// ─── Review Form ───
function ReviewForm() {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName]       = useState('');
  const [text, setText]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (text.trim().length < 15) { setError('Please write at least 15 characters.'); return; }
    setError('');
    // In a real app POST to /api/reviews; for now just show success
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Share Your Experience</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-2 gold-accent-line">Add Your Review</h2>
          <p className="text-navy/50 max-w-md mx-auto mt-6 text-sm leading-relaxed">
            Your words mean the world to us — and help other families trust us with their special moments.
          </p>
        </div>

        {submitted ? (
          <div className="premium-card bg-white rounded-3xl p-10 text-center border border-gold/20">
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 fill-gold text-gold" />
            </div>
            <h3 className="font-serif text-2xl text-navy mb-2">Thank You! 🙏</h3>
            <p className="text-navy/55 text-sm">Your review has been received. We truly appreciate your kind words!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="premium-card bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-navy/40 uppercase tracking-[0.15em] mb-3">Your Rating</label>
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star className={`w-8 h-8 transition-colors ${
                      star <= (hovered || rating) ? 'fill-gold text-gold' : 'text-navy/20'
                    }`} />
                  </button>
                ))}
                {(hovered || rating) > 0 && (
                  <span className="ml-2 text-sm text-navy/50 self-center">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][(hovered || rating)]}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="review-name" className="block text-xs font-bold text-navy/40 uppercase tracking-[0.15em] mb-2">Your Name</label>
              <input
                id="review-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya & Karthik"
                className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream text-navy text-sm placeholder-navy/30 focus:outline-none focus:border-gold/60 transition-colors"
              />
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review-text" className="block text-xs font-bold text-navy/40 uppercase tracking-[0.15em] mb-2">Your Review</label>
              <textarea
                id="review-text"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us about your experience with Sushma Digitals..."
                className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream text-navy text-sm placeholder-navy/30 focus:outline-none focus:border-gold/60 transition-colors resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              id="submit-review-btn"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 btn-gold rounded-xl font-semibold shadow-gold-sm text-sm"
            >
              <Send className="w-4 h-4" /> Submit Review
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="font-sans bg-cream">

      {/* Hero */}
      <Hero />

      {/* ─── Stats ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Why Choose Us</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-2 gold-accent-line">
            Excellence in Every Frame
          </h2>
          <p className="text-navy/55 max-w-xl mx-auto mt-6 mb-14 text-base leading-relaxed">
            From intimate moments to grand celebrations, we bring artistry and professionalism to every shoot.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon, value, label }) => (
              <div
                key={label}
                className="premium-card flex flex-col items-center gap-3 p-8 rounded-2xl bg-cream"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-4xl font-bold text-navy font-serif">{value}</span>
                <span className="text-xs text-navy/50 font-medium tracking-wider uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services Preview ─── */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">What We Do</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-2 gold-accent-line">
            Our Services
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mt-6 mb-14">
            Tailored to every kind of celebration — from intimate ceremonies to grand extravaganzas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_PREVIEW.map(({ icon, title, desc }) => (
              <Link
                key={title}
                to="/services"
                className="group flex flex-col items-start gap-4 p-7 rounded-2xl bg-white/5 border border-white/8 hover:border-gold/40 hover:bg-white/8 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center text-xl">
                  {icon}
                </div>
                <div className="text-left">
                  <h3 className="font-serif text-lg text-white font-semibold mb-1 group-hover:text-gold transition-colors">{title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="flex items-center gap-1 text-gold text-xs font-semibold mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
            {/* View all card */}
            <Link
              to="/services"
              className="flex flex-col items-center justify-center gap-3 p-7 rounded-2xl border border-gold/25 hover:border-gold/60 hover:bg-gold/5 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-gold" />
              </div>
              <p className="text-gold font-semibold text-sm">View All Services</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Testimonials</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-2 gold-accent-line">
            What Families Say
          </h2>
          <p className="text-navy/50 max-w-xl mx-auto mt-6 mb-14">
            Real stories from real people who trusted us with their most cherished memories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map(({ id, name, text, avatar }) => (
              <div key={id} className="premium-card bg-cream rounded-2xl p-8 text-left">
                <StarRating />
                <p className="text-navy/65 text-sm mt-5 mb-6 leading-relaxed italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{name}</p>
                    <p className="text-xs text-navy/40 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] inline-block" /> Google Review
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Add Your Review ─── */}
      <ReviewForm />

      {/* ─── CTA Banner ─── */}
      <section className="relative py-24 px-6 overflow-hidden bg-navy-dark text-center">
        {/* Gold glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="block w-16 h-px bg-gold/50 mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
            Ready to Create Magic?
          </h2>
          <p className="text-white/50 mb-10 text-base leading-relaxed max-w-md mx-auto">
            Dates fill up fast — reach out on WhatsApp today for a free consultation.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 btn-gold rounded-full shadow-gold-glow text-base"
          >
            {/* WhatsApp icon */}
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Chat on WhatsApp
          </a>
          <span className="block w-16 h-px bg-gold/50 mx-auto mt-10" />
        </div>
      </section>
    </div>
  );
}
