import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const MILESTONES = [
  {
    year: "2003",
    title: "The Genesis",
    desc: "Started with a passion for capturing the raw emotions of Pippara. In the era of film, we learned the true value of every shot.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
  },
  {
    year: "2010",
    title: "The Digital Shift",
    desc: "Embracing the digital revolution. We expanded our horizons, bringing crisp clarity and vibrant colors to every celebration.",
    image: "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=800&auto=format&fit=crop"
  },
  {
    year: "2018",
    title: "Cinematic Excellence",
    desc: "Redefining storytelling with cinematic wedding films and advanced lighting techniques. Your life, shot like a movie.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
  },
  {
    year: "2024",
    title: "The AI Era & Beyond",
    desc: "Merging 21 years of traditional wisdom with cutting-edge technology. Delivering timeless legacies that live forever.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
  }
];

function Milestone({ milestone, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -50 : 50, 0]);

  return (
    <div ref={ref} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 py-32 px-6 relative`}>
      {/* Milestone Image */}
      <motion.div style={{ opacity, scale, x }} className="w-full md:w-1/2">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gold/10 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="parallax-wrap aspect-[4/3]">
            <img 
              src={milestone.image} 
              alt={milestone.title} 
              className="parallax-img rounded-[2rem] grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
          <div className="absolute -top-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} bg-gold text-black font-display text-4xl px-6 py-2 rounded-2xl shadow-2xl z-30">
            {milestone.year}
          </div>
        </div>
      </motion.div>
      
      {/* Milestone Content */}
      <motion.div style={{ opacity }} className="w-full md:w-1/2 space-y-8">
        <div className="space-y-4">
          <span className="text-gold/50 font-syne font-bold uppercase tracking-[0.3em] text-xs">Chapter {index + 1}</span>
          <h3 className="font-display text-6xl md:text-8xl text-white tracking-tighter uppercase leading-[0.85]">
            {milestone.title}
          </h3>
        </div>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed font-light font-syne max-w-lg">
          {milestone.desc}
        </p>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          className="h-1 bg-gold/40 rounded-full" 
        />
      </motion.div>

      {/* Central Connector Dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <motion.div 
          style={{ scale: opacity }}
          className="w-4 h-4 bg-gold rounded-full shadow-[0_0_20px_rgba(201,168,76,0.8)]"
        />
      </div>
    </div>
  );
}

export default function StoryTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="bg-obsidian relative z-20 py-40 overflow-hidden">
      {/* Central Time Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block -translate-x-1/2">
        <motion.div 
          style={{ height: useTransform(pathLength, [0, 1], ["0%", "100%"]) }}
          className="w-full bg-gradient-to-b from-gold via-gold to-transparent origin-top"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-40 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-gold font-bold tracking-[0.5em] uppercase text-[10px] mb-6"
          >
            The Evolution
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-[12vw] md:text-9xl text-white leading-none tracking-tighter"
          >
            TWO DECADES OF <br/> <span className="text-gold italic font-serif lowercase tracking-normal">moments</span>
          </motion.h2>
        </div>
        
        <div className="relative">
          {MILESTONES.map((m, i) => (
            <Milestone key={m.year} milestone={m} index={i} />
          ))}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
