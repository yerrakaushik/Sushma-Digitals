import React, { useState } from 'react';
import { Send, CheckCircle, Trash2, Video, Image } from 'lucide-react';
import { wishesApi } from '../services/api';

const BADGE_COLORS = {
  'Wedding Anniversary': 'bg-pink-100 text-pink-700',
  'Birthday':            'bg-purple-100 text-purple-700',
  'Half Saree':          'bg-orange-100 text-orange-700',
  'Dhoti':               'bg-blue-100 text-blue-700',
  'Other':               'bg-gray-100 text-gray-600',
};

export default function WishCard({ wish, onSent, onDelete }) {
  const [sent, setSent]       = useState(wish.is_sent);
  const [marking, setMarking] = useState(false);
  const [clicked, setClicked] = useState(false);

  const waLink = `https://wa.me/${wish.whatsapp_number}?text=${encodeURIComponent(wish.wish_message)}`;

  const handleMarkSent = async () => {
    setMarking(true);
    try {
      await wishesApi.markSent(wish.id);
      setSent(true);
      onSent?.(wish.id);
    } catch (e) {
      alert('Failed to mark as sent: ' + e.message);
    } finally {
      setMarking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete wish for ${wish.client_name}?`)) return;
    try {
      await wishesApi.delete(wish.id);
      onDelete?.(wish.id);
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const isVideo = wish.media_type === 'video';
  const badgeCls = BADGE_COLORS[wish.wish_type] || BADGE_COLORS['Other'];

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      sent ? 'opacity-50 border-gray-200 bg-gray-50' : 'border-gold/20 bg-white shadow-sm hover:shadow-md'
    }`}>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-navy text-base">{wish.client_name}
              {wish.spouse_name && <span className="text-navy/50"> & {wish.spouse_name}</span>}
            </p>
            <p className="text-xs text-navy/40 mt-0.5">{wish.whatsapp_number}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeCls}`}>
              {wish.wish_type}
            </span>
            <button onClick={handleDelete} className="p-1.5 text-navy/25 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-navy/50">
          📅 {new Date(wish.wish_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* Media preview */}
        {wish.media_url && (
          <div className="rounded-xl overflow-hidden border border-gold/10 bg-cream">
            {isVideo ? (
              <div className="relative">
                <video
                  src={wish.media_url}
                  className="w-full max-h-48 object-cover"
                  controls
                  controlsList="nodownload"
                  onContextMenu={e => e.preventDefault()}
                />
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-navy/5">
                  <Video className="w-3 h-3 text-navy/40" />
                  <span className="text-[10px] text-navy/40">Attach this video manually in WhatsApp after sending</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={wish.media_url}
                  alt="Wish media"
                  className="w-full max-h-48 object-cover select-none pointer-events-none"
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                />
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-navy/5">
                  <Image className="w-3 h-3 text-navy/40" />
                  <span className="text-[10px] text-navy/40">Attach this photo manually in WhatsApp after sending</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        <div className="bg-cream rounded-xl p-3 border border-gold/10">
          <p className="text-xs text-navy/60 whitespace-pre-line leading-relaxed">{wish.wish_message}</p>
        </div>

        {/* Actions */}
        {!sent ? (
          <div className="flex gap-2 flex-wrap">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setClicked(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Send on WhatsApp
            </a>
            {clicked && (
              <button
                onClick={handleMarkSent}
                disabled={marking}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-sm font-semibold rounded-full hover:bg-navy-light transition-colors disabled:opacity-60"
              >
                {marking
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <CheckCircle className="w-4 h-4" />}
                Mark as Sent
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Sent
          </div>
        )}
      </div>
    </div>
  );
}
