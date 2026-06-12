import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, RefreshCw, Smartphone } from 'lucide-react';

export default function WhatsAppTab() {
  const [status, setStatus] = useState({ connected: false, qr: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      // Assuming Node service runs on port 3001 locally, or use env variable
      const NODE_SERVICE_URL = import.meta.env.VITE_WHATSAPP_SERVICE_URL || 'http://localhost:3001';
      const response = await fetch(`${NODE_SERVICE_URL}/status`);
      if (!response.ok) throw new Error('Failed to fetch status');
      
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError('Could not connect to WhatsApp Service. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 10 seconds to get the latest QR or connection status
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-6">Loading WhatsApp status...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Smartphone className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Automation</h2>
        
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg my-4">
            {error}
          </div>
        ) : status.connected ? (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Connected</h3>
            <p className="text-gray-600">
              Your WhatsApp account is successfully linked. Wishes will be sent automatically to your clients at 9:00 AM every day.
            </p>
          </div>
        ) : (
          <div className="py-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Link Your WhatsApp</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              1. Open WhatsApp on your phone.<br/>
              2. Tap Menu or Settings and select <b>Linked Devices</b>.<br/>
              3. Tap on <b>Link a Device</b>.<br/>
              4. Point your phone to this screen to capture the code.
            </p>
            
            {status.qr ? (
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg inline-block mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <QRCodeSVG value={status.qr} size={256} />
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  QR Code refreshes automatically
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">Generating QR Code...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
