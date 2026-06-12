import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, CheckCircle2, XCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminWhatsApp() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Try to use the backend URL or fallback to localhost
  const waApiUrl = import.meta.env.VITE_WA_API_URL || 'http://localhost:3001';

  const checkStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${waApiUrl}/status`);
      if (!res.ok) throw new Error('Failed to reach WhatsApp service');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Poll every 5 seconds if not connected
    const interval = setInterval(() => {
      if (!status?.connected) {
        checkStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [status?.connected]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp Status</h1>
          <p className="text-sm text-gray-500">Monitor and connect the studio WhatsApp</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
        >
          <LogOut size={18} className="rotate-180" /> Back to Dashboard
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center space-y-6">
          
          <div className="flex justify-center">
            {loading && !status ? (
              <RefreshCw className="w-12 h-12 text-gray-300 animate-spin" />
            ) : status?.connected ? (
              <div className="bg-green-50 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
            ) : (
              <div className="bg-amber-50 p-4 rounded-full">
                <XCircle className="w-16 h-16 text-amber-500" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {status?.connected ? 'Connected' : 'Disconnected'}
            </h2>
            <p className="text-gray-500 mt-2">
              {status?.connected 
                ? 'WhatsApp is active and ready to send wishes automatically.' 
                : 'Session expired or not linked. Please scan the QR code below.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
              {error}. Ensure the WhatsApp service is running.
            </div>
          )}

          {!status?.connected && status?.qr && (
            <div className="bg-gray-50 p-6 rounded-xl inline-block border border-gray-200">
              <QRCodeSVG value={status.qr} size={200} />
              <p className="text-sm text-gray-500 mt-4">
                Open WhatsApp &rarr; Linked Devices &rarr; Link a Device
              </p>
            </div>
          )}

          <button
            onClick={checkStatus}
            disabled={loading}
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh Status
          </button>
        </div>
      </main>
    </div>
  );
}
