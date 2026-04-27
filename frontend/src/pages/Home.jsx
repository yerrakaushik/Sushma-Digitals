import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, animate } from 'framer-motion';
import { Star, Send, Camera, Award, Users, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const FEATURED_WORK = [
  {
    title: 'The Eternal Bond',
    category: 'Wedding',
    image: '/LUCK9497.JPG',
    description: 'Capturing the raw, unscripted emotions of a lifetime commitment.'
  },
  {
    title: 'Gilded Milestones',
    category: 'Half Saree',
    image: '/GAN00130.JPG',
    description: 'Celebrating heritage through a contemporary cinematic lens.'
  },
  {
    title: 'Grand Traditions',
    category: 'Wedding',
    image: '/LUCK9386.JPG',
    description: 'Stories whispered in the golden light of anticipation.'
  },
  {
    title: 'Signature Events',
    category: 'Events',
    image: '/006A7583.JPG',
    description: 'Every giggle and surprise, preserved in high fidelity.'
  },
];

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

function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: window.innerWidth > 768 ? "-100px" : "-20px" });
  
  const springValue = useSpring(0, {
    stiffness: 30,
    damping: 15,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(parseInt(value));
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0</span>;
}

function HorizontalGallery() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 25,
    restDelta: 0.001
  });

  const x = useTransform(smoothProgress, [0, 1], ["0%", "-70%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-transparent">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-20 left-10 md:left-20 z-10">
          <span className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Portfolio</span>
          <h2 className="font-display text-7xl md:text-9xl text-navy leading-none tracking-tighter uppercase">
            SIGNATURE <br/> <span className="text-gold italic font-serif lowercase tracking-normal">moments</span>
          </h2>
        </div>
        
        <motion.div style={{ x }} className="flex gap-12 pl-[10%] md:pl-[20%]">
          {FEATURED_WORK.map((work, i) => (
            <motion.div 
              key={i}
              className="group relative h-[65vh] w-[85vw] md:w-[50vw] flex-shrink-0 overflow-hidden rounded-[3rem] bg-navy/5 shadow-2xl"
            >
              <img 
                src={work.image} 
                alt={work.title} 
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 ${
                  work.image === '/LUCK9497.JPG' ? 'object-bottom' : 'object-center'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
              <div className="absolute bottom-12 left-12 right-12 flex flex-col justify-end">
                <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{work.category}</span>
                <h3 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-tighter uppercase">{work.title}</h3>
                <p className="text-white/70 text-base max-w-md font-syne leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                  {work.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="absolute bottom-20 right-10 md:right-20 flex items-center gap-6">
          <div className="w-24 h-px bg-gold/40" />
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">Explore Work</span>
        </div>
      </div>
    </section>
  );
}

function EditorialSection() {
  return (
    <section className="pt-24 md:pt-32 pb-0 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
        <div className="lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-3xl"
          >
            <img 
              src="/GAN00022.JPG" 
              loading="lazy"
              className="w-full h-full object-cover object-[70%_center]"
              alt="Artistic Focus"
            />
            <div className="absolute inset-0 bg-navy/5" />
          </motion.div>
          <motion.div 
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="absolute -right-10 md:-right-20 top-1/2 -translate-y-1/2 bg-[#FCFAF6] p-16 rounded-[3rem] border border-navy/5 shadow-2xl hidden md:block max-w-md"
          >
            <h3 className="font-serif italic text-4xl text-gold mb-8">Our Philosophy</h3>
            <p className="text-navy/60 text-lg leading-relaxed font-light">
              We believe a photograph is more than an image—it's a time capsule. Our approach blends cinematic grandeur with intimate storytelling, ensuring your legacy is preserved with the same emotion you felt in the moment.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-8">Mastery</span>
          <h2 className="font-display text-8xl md:text-9xl text-navy leading-[0.8] tracking-tighter mb-12 uppercase">
            CRAFTING <br/> <span className="text-gold italic font-serif lowercase tracking-normal">timeless</span> <br/> LEGACIES
          </h2>
          <div className="flex flex-col gap-10">
            <div className="flex items-start gap-8">
              <div className="w-px h-16 bg-gold/40 mt-3" />
              <p className="text-navy/50 text-base font-syne tracking-wide leading-relaxed">
                Over two decades of mastering the interplay of light and emotion to create images that don't just look beautiful, but feel alive.
              </p>
            </div>
            <Link 
              to="/services" 
              className="group inline-flex items-center gap-6 text-navy font-bold uppercase tracking-[0.4em] text-[10px] mt-6"
            >
              See our services
              <div className="w-14 h-14 rounded-full border border-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:border-navy transition-all duration-500">
                <ArrowRight className="w-5 h-5 group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    setSubmitted(true);
  };

  return (
    <section className="py-24 px-6 bg-[#FCFAF6] relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <span className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block">Kind Words</span>
          <h2 className="font-display text-7xl md:text-9xl text-navy tracking-tighter uppercase leading-[0.85]">
            BECOME A <br/> <span className="text-gold italic font-serif lowercase tracking-normal">story</span>
          </h2>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-20 text-center border border-navy/5 shadow-2xl"
          >
            <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-10">
              <Heart className="w-10 h-10 fill-gold text-gold" />
            </div>
            <h3 className="font-display text-6xl text-navy mb-4 uppercase tracking-tighter">Thank You</h3>
            <p className="text-navy/50 text-xl font-syne font-light">Your review is part of our legacy now.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-[4rem] p-16 border border-navy/5 shadow-3xl space-y-12">
            <div className="flex flex-col items-center">
              <label className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.4em] mb-8">Your Rating</label>
              <div className="flex gap-4">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-125 p-1"
                  >
                    <Star className={`w-12 h-12 transition-all duration-300 ${
                      star <= (hovered || rating) ? 'fill-gold text-gold shadow-gold-sm scale-110' : 'text-navy/5'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div className="relative">
                <label className="block text-[10px] font-bold text-navy/30 uppercase tracking-[0.3em] mb-4 ml-6">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya & Karthik"
                  className="w-full px-10 py-6 rounded-3xl bg-[#FCFAF6] border border-transparent focus:border-gold/30 text-navy text-lg font-syne outline-none transition-all shadow-inner"
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-navy/30 uppercase tracking-[0.3em] mb-4 ml-6">Your Experience</label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="How was your session?..."
                  className="w-full px-10 py-6 rounded-3xl bg-[#FCFAF6] border border-transparent focus:border-gold/30 text-navy text-lg font-syne outline-none transition-all resize-none shadow-inner"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-7 bg-navy text-white rounded-full font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-gold transition-all duration-500 group shadow-2xl"
            >
              <span className="flex items-center justify-center gap-4">
                Submit Your Story
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative bg-[#FCFAF6]">
      <main className="relative z-10">
        <Hero />

        {/* Philosophy / Story Section */}
        <EditorialSection />

        {/* Stats Section - Reduced gap even further */}
        <section className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {[
              { value: '21', label: 'Years of Excellence', icon: <Award className="w-10 h-10" /> },
              { value: '10000', label: 'Captured Moments', icon: <Camera className="w-10 h-10" />, suffix: "+" },
              { value: '300', label: 'Happy Families', icon: <Users className="w-10 h-10" />, suffix: "+" },
              { value: '100', label: 'Commitment', icon: <Heart className="w-10 h-10" />, suffix: "%" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="text-gold mb-12 w-28 h-28 rounded-[2.5rem] bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:scale-110 transition-transform duration-700">
                  {stat.icon}
                </div>
                <div className="font-display text-8xl md:text-9xl text-navy leading-none mb-6">
                   <Counter value={stat.value} suffix={stat.suffix || ""} />
                </div>
                <div className="text-[12px] text-navy/30 font-bold uppercase tracking-[0.5em] font-syne">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Signature Work - Horizontal Gallery */}
        <HorizontalGallery />

        {/* Reviews Showcase - Reduced gap */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-24">
              <div className="max-w-3xl">
                <span className="text-gold font-bold tracking-[0.5em] uppercase text-[10px] mb-10 block">Testimonials</span>
                <h2 className="font-display text-8xl md:text-[9vw] text-navy leading-[0.8] tracking-tighter uppercase">
                  WHISPERS OF <br/> <span className="text-gold italic font-serif lowercase tracking-normal">gratitude</span>
                </h2>
              </div>
              <p className="text-navy/30 text-xl font-light max-w-xs mb-6 font-syne italic">
                "The words of our clients are the greatest accolades we could ever receive."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {REVIEWS.map((review, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="relative p-16 bg-white rounded-[3rem] border border-navy/5 shadow-sm hover:shadow-2xl transition-all duration-700"
                >
                  <div className="flex gap-2 mb-10">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
                  </div>
                  <p className="text-navy/70 text-2xl font-serif italic leading-relaxed mb-12 font-light">"{review.text}"</p>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center text-gold font-display text-2xl border border-navy/10">
                      {review.avatar}
                    </div>
                    <span className="font-bold text-navy tracking-tight text-lg">{review.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Review Form */}
        <ReviewForm />

        {/* CTA - Restored Camera Icon and "Legacy" phase */}
        <section className="py-80 px-6 text-center relative overflow-hidden bg-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-6xl mx-auto"
          >
            <span className="text-gold font-bold tracking-[0.6em] uppercase text-[10px] mb-12 block">Start your journey</span>
            <h2 className="font-display text-8xl md:text-[13vw] text-navy leading-[0.8] tracking-tighter mb-24 uppercase">
              LET'S FRAME YOUR <br/> <span className="text-gold italic font-serif lowercase tracking-normal">legacy</span>
            </h2>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/919866598393"
              target="_blank"
              rel="noopener noreferrer"
              className="px-20 py-8 bg-navy text-white rounded-full inline-block group hover:bg-gold hover:text-navy transition-all duration-500 shadow-[0_20px_50px_rgba(11,29,58,0.3)] font-bold uppercase tracking-[0.4em] text-xs"
            >
              <span className="flex items-center gap-6">
                Book Your Session
                <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500 text-gold group-hover:text-navy" />
              </span>
            </motion.a>
          </motion.div>
          
          {/* Subtle Abstract Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gold/10 rounded-full blur-[150px] pointer-events-none opacity-40" />
        </section>
      </main>
    </div>
  );
}
