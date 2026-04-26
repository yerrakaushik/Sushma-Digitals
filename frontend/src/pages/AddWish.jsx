import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle } from 'lucide-react';
import { wishesApi } from '../services/api';

const WISH_TYPES = ['Birthday', 'Wedding Anniversary', 'Half Saree', 'Dhoti', 'Other'];

const TEMPLATES = {
  'Birthday': (name) =>
    `Happy Birthday ${name}!\nWishing you a wonderful day and a fantastic year ahead!\n- Sushma Digitals Studio`,
  'Wedding Anniversary': (name, spouse) =>
    `Happy Anniversary ${name}${spouse ? ` & ${spouse}` : ''}!\nWishing you both a beautiful year ahead filled with love and joy. Here's a special memory from your big day!\n- Sushma Digitals Studio`,
  'Half Saree': (name) =>
    `Warm wishes to ${name} on this beautiful Half Saree ceremony! May this special day be filled with wonderful memories.\n- Sushma Digitals Studio`,
  'Dhoti': (name) =>
    `Warm wishes to ${name} on this special Dhoti ceremony! Wishing you a day full of joy and blessings.\n- Sushma Digitals Studio`,
  'Other': (name) =>
    `Warm wishes to ${name} on this special occasion! May this day be filled with beautiful memories.\n- Sushma Digitals Studio`,
};

const inputCls = 'w-full px-4 py-3 rounded-xl border border-navy/10 bg-white text-sm text-navy placeholder-navy/40 focus:outline-none focus:border-gold/40 transition-all';

export default function AddWish() {
  const navigate = useNavigate();
  const fileRef  = useRef();

  const [form, setForm] = useState({
    client_name: '', spouse_name: '', whatsapp_number: '',
    wish_type: 'Birthday', wish_date: '', wish_message: '',
  });
  const [mediaFile, setMediaFile]   = useState(null);
  const [preview, setPreview]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  // Auto-fill message when type or name changes
  useEffect(() => {
    if (form.client_name) {
      const tpl = TEMPLATES[form.wish_type] || TEMPLATES['Other'];
      setForm(f => ({ ...f, wish_message: tpl(f.client_name, f.spouse_name) }));
    }
  }, [form.wish_type, form.client_name, form.spouse_name]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setMediaFile(null);
    setPreview(null);
    fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.client_name || !form.whatsapp_number || !form.wish_date) {
      setError('Client name, WhatsApp number, and wish date are required.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (mediaFile) fd.append('media', mediaFile);
      await wishesApi.create(fd);
      setSuccess(true);
      setTimeout(() => navigate('/admin/wishes'), 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <p className="font-semibold text-navy text-lg">Wish saved!</p>
        <p className="text-navy/50 text-sm">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="font-serif text-xl text-navy font-semibold">Add New Wish</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client name */}
        <input
          className={inputCls}
          placeholder="Client Name *"
          value={form.client_name}
          onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
        />

        {/* Wish type */}
        <select
          className={inputCls}
          value={form.wish_type}
          onChange={e => setForm(f => ({ ...f, wish_type: e.target.value }))}
        >
          {WISH_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>

        {/* Spouse name — only for anniversary */}
        {form.wish_type === 'Wedding Anniversary' && (
          <input
            className={inputCls}
            placeholder="Spouse Name (optional)"
            value={form.spouse_name}
            onChange={e => setForm(f => ({ ...f, spouse_name: e.target.value }))}
          />
        )}

        {/* WhatsApp number */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-navy/50 font-medium">+91</span>
          <input
            className={inputCls + ' pl-12'}
            placeholder="WhatsApp number (without +91) *"
            value={form.whatsapp_number}
            onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
            type="tel"
          />
        </div>

        {/* Wish date */}
        <div>
          <label className="text-xs text-navy/50 mb-1 block">Wish Date *</label>
          <input
            type="date"
            className={inputCls}
            value={form.wish_date}
            onChange={e => setForm(f => ({ ...f, wish_date: e.target.value }))}
          />
        </div>

        {/* Wish message */}
        <div>
          <label className="text-xs text-navy/50 mb-1 block">Wish Message (auto-filled, editable)</label>
          <textarea
            rows={5}
            className={inputCls + ' resize-none'}
            value={form.wish_message}
            onChange={e => setForm(f => ({ ...f, wish_message: e.target.value }))}
            placeholder="Message will auto-fill when you enter client name and type"
          />
        </div>

        {/* Media upload */}
        <div>
          <label className="text-xs text-navy/50 mb-1.5 block">Photo / Video (optional)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleFile}
          />
          {!preview ? (
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gold/25 rounded-xl text-sm text-navy/50 hover:border-gold/50 hover:text-navy transition-all w-full justify-center"
            >
              <Upload className="w-4 h-4" /> Choose photo or video
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-gold/20">
              {mediaFile?.type?.startsWith('video') ? (
                <video src={preview} className="w-full max-h-48 object-cover" controls />
              ) : (
                <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
              )}
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 btn-gold rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving
            ? <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            : 'Save Wish'}
        </button>
      </form>
    </div>
  );
}
