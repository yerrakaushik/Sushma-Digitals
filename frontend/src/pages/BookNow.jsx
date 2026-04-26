import React from 'react';
import { MessageCircle, Phone, Clock, Star } from 'lucide-react';

/**
 * BookNow Page
 * Redirects clients to WhatsApp instead of showing a form.
 * Phone: 9866598393
 */
const WHATSAPP_NUMBER = '919866598393';

const STEPS = [
  {
    icon: <MessageCircle className="w-6 h-6 text-gold" />,
    title: 'Message Us',
    desc: 'Send us a WhatsApp message with your event details.',
  },
  {
    icon: <Phone className="w-6 h-6 text-gold" />,
    title: 'Free Consultation',
    desc: "We'll call you back to understand your vision and suggest the right package.",
  },
  {
    icon: <Clock className="w-6 h-6 text-gold" />,
    title: 'Confirm Your Date',
    desc: "We block your event date once you're happy with the plan.",
  },
  {
    icon: <Star className="w-6 h-6 text-gold" />,
    title: 'We Create Magic',
    desc: 'Sit back and let us capture your most precious moments.',
  },
];

const QUICK_MSGS = [
  { label: 'Wedding Photography', msg: 'Hello! I\'m interested in your Wedding Photography services. Please share more details.' },
  { label: 'Pre-Wedding Shoot',   msg: 'Hello! I\'d like to book a Pre-Wedding Shoot. Could you share availability and pricing?' },
  { label: 'Birthday Event',      msg: 'Hello! I\'m planning a birthday event and need photography. Can you help?' },
  { label: 'Corporate Event',     msg: 'Hello! I need photography for a Corporate Event. Please share your packages.' },
  { label: 'Baby Shower',         msg: 'Hello! I\'m looking for a photographer for a Baby Shower / Naming ceremony.' },
  { label: 'Custom Package',      msg: 'Hello! I have a special event and would like a custom photography package.' },
];

export default function BookNow() {
  return (
    <div className="font-sans bg-cream min-h-screen">
      {/* ─── Header ─── */}
      <div className="bg-navy-dark pt-36 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-56 bg-gold/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-10 h-px bg-gold/50" />
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Get In Touch</p>
            <span className="block w-10 h-px bg-gold/50" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-4">Book Your Date</h1>
          <p className="text-white/45 max-w-xl mx-auto text-base leading-relaxed">
            The fastest way to reach us — chat directly on WhatsApp and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* ─── Primary WhatsApp CTA ─── */}
          <div className="rounded-2xl bg-white border border-gold/25 p-8 md:p-12 text-center premium-card">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-navy font-bold mb-3">Chat on WhatsApp</h2>
            <p className="text-navy/50 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              We typically respond within a few hours. Tell us about your event and we'll take care of the rest.
            </p>
            <a
              id="main-whatsapp-cta"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello! I would like to inquire about your photography services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 btn-gold rounded-full shadow-gold-glow text-base"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Open WhatsApp
            </a>
            <p className="text-navy/35 text-xs mt-5">+91 98665 98393</p>
          </div>

          {/* ─── Quick Message Buttons ─── */}
          <div className="rounded-2xl bg-white border border-gold/20 p-8">
            <h3 className="font-serif text-xl text-navy font-semibold mb-2">Quick Enquiry</h3>
            <p className="text-navy/45 text-sm mb-6">Choose your service and we'll pre-fill the message for you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_MSGS.map(({ label, msg }) => (
                <a
                  key={label}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-navy/8 bg-cream hover:border-gold/40 hover:bg-gold/5 transition-all duration-200 text-sm text-navy/75 font-medium group"
                >
                  <span className="w-2 h-2 rounded-full bg-gold/60 shrink-0 group-hover:bg-gold transition-colors" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ─── How It Works ─── */}
          <div className="rounded-2xl bg-navy border border-gold/15 p-8">
            <h3 className="font-serif text-xl text-white font-semibold mb-6">How It Works</h3>
            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <div key={step.title} className="flex items-start gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px h-8 bg-gold/15 mt-2" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <p className="font-semibold text-white text-sm mb-0.5">{step.title}</p>
                    <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
