import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroVideoMontage() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the hero video from the backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/hero`)
      .then(res => res.json())
      .then(data => {
        if (data.video_url) {
          setVideoUrl(data.video_url);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch hero video:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  // If no video is uploaded yet, show a clean dark background with a noise texture
  if (!videoUrl) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#050505]">
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
      
      {/* Darkening overlay for text readability */}
      <div className="absolute inset-0 bg-navy/10 z-10" />
    </div>
  );
}
