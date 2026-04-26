import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, ChevronDown } from 'lucide-react';
import HeroVideoMontage from './HeroVideoMontage';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for different layers
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.5]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 0.4]);
  
  const textY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const subTextY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Cinematic Background Video Montage */}
      <motion.div 
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0"
      >
        <HeroVideoMontage />
      </motion.div>

      {/* Background Cinematic Gradient Overlay - Adjusted for video */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white z-10" />
      
      {/* Big Bold Typography */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.div 
          style={{ y: textY, opacity }} 
          className="flex flex-col items-center"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-gold font-syne font-bold tracking-[0.6em] uppercase text-xs md:text-sm mb-6"
          >
            Established 2003
          </motion.span>
          
          <h1 className="flex flex-col items-center text-center">
            <motion.span 
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[15vw] md:text-[11vw] leading-none text-navy tracking-tighter"
            >
              SUSHMA
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[15vw] md:text-[11vw] leading-none text-gold tracking-tighter -mt-[2vw] md:-mt-[1vw]"
            >
              DIGITALS
            </motion.span>
          </h1>
          
          <motion.p 
            style={{ y: subTextY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-serif italic text-navy/60 text-center max-w-2xl mt-12 text-xl md:text-2xl font-light tracking-wide px-4"
          >
            "Preserving visual legacies through the lens of two decades."
          </motion.p>
        </motion.div>

      </div>

      {/* Scroll Indicator - Anchored to screen bottom, not text container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 z-30"
      >
        <span className="text-navy/30 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em]">Scroll to Discover</span>
        <div className="w-px h-10 md:h-16 bg-gradient-to-b from-gold via-gold/50 to-transparent" />
      </motion.div>

      {/* Decorative Floating Stats */}
      <motion.div 
        style={{ y: statsY, opacity }}
        className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 hidden lg:flex flex-col gap-12 z-20"
      >
        <div className="flex flex-col items-start border-l border-gold/30 pl-6 py-2">
          <span className="text-gold font-display text-5xl">21+</span>
          <span className="text-navy/40 text-[10px] font-bold uppercase tracking-widest">Years of Art</span>
        </div>
        <div className="flex flex-col items-start border-l border-gold/30 pl-6 py-2">
          <span className="text-gold font-display text-5xl">10K+</span>
          <span className="text-navy/40 text-[10px] font-bold uppercase tracking-widest">Captured Stories</span>
        </div>
      </motion.div>

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}
