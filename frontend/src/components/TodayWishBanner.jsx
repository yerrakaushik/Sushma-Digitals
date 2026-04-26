import React from 'react';
import { Bell } from 'lucide-react';

export default function TodayWishBanner({ count }) {
  if (!count) return null;
  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-800 font-semibold text-sm shadow-sm">
      <Bell className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
      You have {count} wish{count !== 1 ? 'es' : ''} to send today!
    </div>
  );
}
