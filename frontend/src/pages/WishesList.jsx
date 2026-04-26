import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { wishesApi } from '../services/api';
import WishCard from '../components/WishCard';

const FILTERS = [
  { label: 'All',     value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Sent',    value: 'sent' },
];

export default function WishesList() {
  const [wishes, setWishes]   = useState([]);
  const [filter, setFilter]   = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await wishesApi.list(filter);
      setWishes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSent = (id) => {
    setWishes(prev => prev.map(w => w.id === id ? { ...w, is_sent: true } : w));
  };

  const handleDelete = (id) => {
    setWishes(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-xl text-navy font-semibold">All Wishes</h2>
        <Link
          to="/admin/wishes/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 btn-gold rounded-full text-sm"
        >
          <Plus className="w-4 h-4" /> Add Wish
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-navy text-white'
                : 'bg-cream border border-navy/10 text-navy/60 hover:border-navy/30'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : wishes.length === 0 ? (
        <div className="text-center py-16 text-navy/40 text-sm">
          No wishes found.{' '}
          <Link to="/admin/wishes/add" className="text-gold underline underline-offset-2">Add one</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wishes.map(w => (
            <WishCard key={w.id} wish={w} onSent={handleSent} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
