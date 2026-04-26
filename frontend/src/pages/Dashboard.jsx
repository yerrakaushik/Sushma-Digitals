import React, { useState, useEffect } from 'react';
import { wishesApi } from '../services/api';
import TodayWishBanner from '../components/TodayWishBanner';
import WishCard from '../components/WishCard';
import UpcomingWishes from '../components/UpcomingWishes';

export default function Dashboard() {
  const [todayWishes, setTodayWishes]       = useState([]);
  const [upcomingWishes, setUpcomingWishes] = useState([]);
  const [loading, setLoading]               = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [today, upcoming] = await Promise.all([
        wishesApi.today(),
        wishesApi.upcoming(),
      ]);
      setTodayWishes(today);
      // Upcoming excludes today
      const todayStr = new Date().toISOString().slice(0, 10);
      setUpcomingWishes(upcoming.filter(w => w.wish_date !== todayStr));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSent = (id) => {
    setTodayWishes(prev => prev.filter(w => w.id !== id));
  };

  const handleDelete = (id) => {
    setTodayWishes(prev => prev.filter(w => w.id !== id));
    setUpcomingWishes(prev => prev.filter(w => w.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TodayWishBanner count={todayWishes.length} />

      {todayWishes.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl text-navy font-semibold">Today's Wishes</h2>
          {todayWishes.map(w => (
            <WishCard key={w.id} wish={w} onSent={handleSent} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {todayWishes.length === 0 && (
        <div className="text-center py-10 text-navy/40 text-sm">
          No wishes to send today 🎉
        </div>
      )}

      <UpcomingWishes wishes={upcomingWishes} />
    </div>
  );
}
