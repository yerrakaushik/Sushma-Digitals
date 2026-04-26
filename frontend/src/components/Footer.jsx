import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component — Premium dark navy with gold accents.
 * Real contact: +91 98665 98393
 * Instagram: @sushmadigital
 * YouTube: @Sushmadigitals
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white pt-16 pb-8 border-t border-navy/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* ─── Brand ─── */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src="/SUSHMA9999.png" alt="Sushma Digitals" className="w-12 h-12 object-contain" />
              <div>
                <span className="font-serif text-lg font-semibold text-white tracking-tight">Sushma <span className="text-gold">Digitals</span></span>
                <span className="block text-gold text-[10px] tracking-[0.2em] uppercase font-bold">Studio</span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Capturing your most precious moments with artistry and heart. Every frame tells your story.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/sushmadigital?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center hover:border-gold/60 hover:bg-gold/10 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 text-white/60 group-hover:text-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Sushmadigitals"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center hover:border-gold/60 hover:bg-gold/10 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 text-white/60 group-hover:text-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/919866598393"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center hover:border-gold/60 hover:bg-gold/10 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 text-white/60 group-hover:text-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ─── Quick Links ─── */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-5">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/videos', label: 'Videos' },
                { to: '/book-now', label: 'Book Now' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/45 hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Services ─── */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-5">Our Services</h3>
            <ul className="space-y-2.5 text-sm text-white/45">
              <li>Wedding Photography</li>
              <li>Pre-Wedding Shoots</li>
              <li>Birthday Events</li>
              <li>Half Saree Functions</li>
              <li>Dhoti Functions</li>
              <li>Baby Shower & Naming</li>
            </ul>
          </div>

          {/* ─── Contact ─── */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+919866598393" className="text-white/70 hover:text-gold transition-colors">
                    +91 98665 98393
                  </a>
                  <p className="text-white/30 text-xs mt-0.5">Mon–Sun · 9 AM – 8 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                <a
                  href="https://www.instagram.com/sushmadigital?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  @sushmadigital
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-white/45">Pippara, Andhra Pradesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="pt-6 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/25">
          <span>© {year} Sushma Digitals Studio. All rights reserved.</span>
          <span>Made with ❤️ for every precious moment</span>
        </div>
      </div>
    </footer>
  );
}
