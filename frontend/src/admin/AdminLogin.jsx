import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'sushma2024admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (pin === ADMIN_SECRET) {
        sessionStorage.setItem('admin_token', pin);
        navigate('/admin');
      } else {
        setError('Incorrect password. Please try again.');
        setPin('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated subtle gold glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-16 h-16 rounded-full bg-navy/8 border border-navy/15 flex items-center justify-center mx-auto mb-4"
          >
            <Camera className="w-8 h-8 text-navy" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-serif text-2xl text-navy font-bold mb-1"
          >
            Sushma Digitals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-gold text-xs tracking-[0.2em] uppercase font-semibold"
          >
            Admin Panel
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white border border-gold/20 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-gold" />
            <h2 className="text-navy font-semibold text-sm">Enter Admin Password</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                id="admin-password"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(''); }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-cream border border-navy/15 text-navy placeholder-navy/40 text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/25 transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-gold transition-colors"
                onClick={() => setShowPin(!showPin)}
                tabIndex={-1}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="admin-login-btn"
              type="submit"
              disabled={loading || !pin}
              className="w-full py-3.5 btn-gold rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-gold-sm"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                : 'Sign In'}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-navy/30 text-xs text-center mt-6"
        >
          Sushma Digitals Studio · Admin Access Only
        </motion.p>
      </motion.div>
    </div>
  );
}
