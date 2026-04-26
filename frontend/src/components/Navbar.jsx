import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/designs', label: 'Designs' },
  { to: '/videos', label: 'Videos' },
];

const WHATSAPP_NUMBER = '919866598393';
const WHATSAPP_MSG = encodeURIComponent('Hello! I would like to inquire about your photography services.');

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  // Pages where the background is naturally dark (videos, gallery, designs)
  const isDarkThemedPage = ['/videos', '/gallery', '/designs'].includes(location.pathname);
  // Pages where we want the navbar to be ultra-clean/transparent initially
  const isLightThemedPage = ['/', '/services'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <header
      className="absolute top-0 left-0 right-0 z-[100] py-10 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative w-16 h-16 flex items-center justify-center transition-all duration-500">
              <motion.img 
                src="/SUSHMA9999.png" 
                alt="Sushma Digitals Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-2xl md:text-3xl leading-none tracking-tight transition-colors duration-500 ${isDarkThemedPage ? 'text-white' : 'text-navy'}`}>
                Sushma <span className="text-gold">Digitals</span>
              </span>
              <span className={`text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-bold font-syne transition-colors duration-500 ${isDarkThemedPage ? 'text-white/40' : 'text-navy/30'}`}>Est. 2003</span>
            </div>
          </Link>

          {/* Navigation - Direct Names + Boxed Inquiry */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-14">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`text-[11px] font-bold uppercase tracking-[0.5em] transition-all duration-300 relative group font-syne ${
                    isActive 
                      ? 'text-gold' 
                      : isDarkThemedPage ? 'text-white/70 hover:text-white' : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  {label}
                  <span className={`absolute -bottom-2 left-0 h-[1.5px] bg-gold transition-all duration-500 ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`} />
                </Link>
              );
            })}

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all duration-500"
            >
              Inquiry
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-3 transition-colors ${!isDarkThemedPage ? 'text-navy' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                  <X className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                  <Menu className="w-7 h-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown - Clean List */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gold/10 overflow-hidden md:hidden z-[101]"
          >
            <div className="p-10 flex flex-col items-center gap-8">
              {NAV_LINKS.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`font-display text-4xl uppercase tracking-tighter transition-all duration-300 ${
                      isActive ? 'text-gold' : 'text-navy/40'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-4xl uppercase tracking-tighter text-navy/40 hover:text-gold transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Inquiry
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
