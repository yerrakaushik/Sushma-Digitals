import React from 'react';
import { Calendar } from 'lucide-react';

const BADGE_COLORS = {
  'Wedding Anniversary': 'bg-pink-100 text-pink-700',
  'Birthday':            'bg-purple-100 text-purple-700',
  'Half Saree':          'bg-orange-100 text-orange-700',
  'Dhoti':               'bg-blue-100 text-blue-700',
  'Other':               'bg-gray-100 text-gray-600',
};

export default function UpcomingWishes({ wishes }) {
  if (!wishes?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-navy text-sm flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gold" /> Upcoming (next 7 days)
      </h3>
      <div className="space-y-2">
        {wishes.map(w => {
          const badge = BADGE_COLORS[w.wish_type] || BADGE_COLORS['Other'];
          const d = new Date(w.wish_date);
          return (
            <div key={w.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-gold/10 text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${badge}`}>{w.wish_type}</span>
                <span className="font-medium text-navy truncate">{w.client_name}</span>
              </div>
              <span className="text-navy/40 text-xs shrink-0">
                {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
