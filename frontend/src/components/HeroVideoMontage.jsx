import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroVideoMontage() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [slideshow, setSlideshow] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [canPlay, setCanPlay]     = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // 1. Try to load from Local Cache immediately for instant "felt" speed
    const cachedUrl = localStorage.getItem('hero_video_cache');
    if (cachedUrl) {
      setVideoUrl(cachedUrl);
      setLoading(false);
    }

    // 2. Fetch latest in background
    fetch(`${apiUrl}/api/hero`)
      .then(res => res.json())
      .then(data => {
        if (data.video_url) {
          setVideoUrl(data.video_url);
          localStorage.setItem('hero_video_cache', data.video_url);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch slideshow
    fetch(`${apiUrl}/api/hero/slideshow`)
      .then(res => res.json())
      .then(data => setSlideshow(Array.isArray(data) ? data : []))
      .catch(() => {});
    
    // Delay video start
    const timer = setTimeout(() => setCanPlay(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Cycle slideshow
  useEffect(() => {
    if (!videoUrl && slideshow.length > 1) {
      const interval = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % slideshow.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [videoUrl, slideshow.length]);

  if (loading) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  // If no video, show slideshow (or black fallback)
  if (!videoUrl) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden">
        <AnimatePresence mode="wait">
          {slideshow.length > 0 ? (
            <motion.img
              key={slideshow[slideIndex]?.id || slideIndex}
              src={slideshow[slideIndex]?.url}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {(videoUrl && canPlay) && (
          <motion.div
            key={videoUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Darkening overlay for text readability */}
      <div className="absolute inset-0 bg-navy/10 z-10" />
    </div>
  );
}
