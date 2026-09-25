import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, X, Sparkles } from 'lucide-react';

export default function QrGeneratorModal({ isOpen, onClose, onSendToScanner }) {
  const [text, setText] = useState('https://mit.edu/cybersecurity');
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!text.trim()) return;
    QRCode.toDataURL(text, {
      width: 280,
      margin: 2,
      color: {
        dark: '#030712',
        light: '#ffffff'
      }
    }).then(setQrUrl).catch(console.error);
  }, [text]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `qr-shield-custom-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          paddingBottom: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={20} color="#00f2fe" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              QR Code Generator Tool
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '16px' }}>
          Generate a custom test QR code on screen to scan directly with your mobile phone camera or test in the scanner:
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
            Enter Content / URL / UPI String:
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: '100%',
              background: '#020617',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          />
        </div>

        {/* QR Display */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px',
          width: '240px',
          height: '240px',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          {qrUrl ? (
            <img src={qrUrl} alt="Generated QR" style={{ width: '100%', height: '100%' }} />
          ) : (
            <span style={{ color: '#000' }}>Rendering...</span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={handleDownload}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          >
            <Download size={14} />
            <span>Download PNG</span>
          </button>

          <button
            onClick={() => {
              onSendToScanner(text);
              onClose();
            }}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            <Sparkles size={14} />
            <span>Send to Scanner</span>
          </button>
        </div>
      </div>
    </div>
  );
}
