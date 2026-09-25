import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, AlertTriangle, ShieldAlert, Play, QrCode, 
  ExternalLink, Check, Copy, Sparkles, Download 
} from 'lucide-react';

const DEMO_CASES = [
  {
    id: 'demo-1',
    level: 'LOW RISK',
    badgeClass: 'badge-low',
    score: 0,
    title: 'Demo 1: Normal Institutional Website',
    url: 'https://mit.edu/cybersecurity/research-lab',
    expectedVerdict: '🟢 LOW RISK (0 / 100)',
    description: 'Legitimate higher-education domain using standard HTTPS, clean root domain, no credential lures, and compliant RFC structure.',
    indicators: ['✓ HTTPS Transport Encryption', '✓ Standard Registered Domain (.edu)', '✓ Clean URL Syntax']
  },
  {
    id: 'demo-2',
    level: 'MEDIUM RISK',
    badgeClass: 'badge-med',
    score: 45,
    title: 'Demo 2: Suspicious-Looking Test URL',
    url: 'http://account-service-update.xyz?redirect=http://external.com',
    expectedVerdict: '🟡 MEDIUM RISK (45 / 100)',
    description: 'Simulates common warning signs: unencrypted HTTP protocol, high-abuse .xyz TLD, and an open redirect parameter that bounces users.',
    indicators: ['⚠ Plain HTTP (Unencrypted)', '⚠ High-Risk Disposable TLD (.xyz)', '⚠ Potential Open Redirection (?redirect=)']
  },
  {
    id: 'demo-3',
    level: 'HIGH RISK',
    badgeClass: 'badge-high',
    score: 85,
    title: 'Demo 3: Controlled Phishing Brand Impersonation',
    url: 'http://secure-paypal-login-verify.top/account/auth/signin?token=928374',
    expectedVerdict: '🔴 HIGH RISK (85 / 100)',
    description: 'Controlled mock phishing lure imitating PayPal. Domain contains "paypal" but root domain is "secure-paypal-login-verify.top" on high-abuse .top TLD.',
    indicators: ['❌ Severe Brand Mismatch (PayPal)', '❌ Multiple Phishing Keywords ("login", "verify")', '⚠ High-Risk TLD (.top)', '⚠ Plain HTTP']
  }
];

export default function DemoMode({ onSelectDemo }) {
  const [qrImages, setQrImages] = useState({});

  useEffect(() => {
    // Generate QR images for all 3 demo cases
    DEMO_CASES.forEach(async (demo) => {
      try {
        const dataUrl = await QRCode.toDataURL(demo.url, {
          width: 220,
          margin: 2,
          color: {
            dark: '#030712',
            light: '#ffffff'
          }
        });
        setQrImages(prev => ({ ...prev, [demo.id]: dataUrl }));
      } catch (err) {
        console.error('Failed to generate demo QR code:', err);
      }
    });
  }, []);

  return (
    <section id="demo" style={{ padding: '60px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-cyan">
              <Sparkles size={13} />
              HACKATHON DEMONSTRATION SUITE
            </span>
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
            Pre-Built Demonstration Cases
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
            Safe, controlled test benchmarks crafted specifically for hackathon evaluation. Scan with your camera or click to run instant analysis.
          </p>
          <div style={{ marginTop: '12px' }}>
            <span style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              DEMO / TEST DATA ONLY — NO LIVE MALICIOUS ASSETS
            </span>
          </div>
        </div>

        {/* 3 Demo Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '26px'
        }}>
          {DEMO_CASES.map((demo) => (
            <div
              key={demo.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '20px'
              }}
            >
              <div>
                {/* Header Tag */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px'
                }}>
                  <span className={`badge ${demo.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                    {demo.level}
                  </span>
                  <span className="mono" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Score: {demo.score}/100
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                  {demo.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
                  {demo.description}
                </p>

                {/* Generated QR Code for Physical Camera Scanning */}
                <div style={{
                  background: '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                }}>
                  {qrImages[demo.id] ? (
                    <img 
                      src={qrImages[demo.id]} 
                      alt={`QR Code for ${demo.title}`} 
                      style={{ width: '160px', height: '160px', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030712' }}>
                      Generating QR...
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '14px' }}>
                  Tip: Point phone camera or laptop camera at this QR code!
                </div>

                {/* Simulated Target URL snippet */}
                <div style={{
                  background: '#020617',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: '#38bdf8',
                  wordBreak: 'break-all',
                  marginBottom: '16px'
                }}>
                  {demo.url}
                </div>

                {/* Expected Indicators */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    KEY INDICATORS:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {demo.indicators.map((ind, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                        {ind}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectDemo(demo.url)}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}
              >
                <Play size={16} />
                <span>Test This Case in Scanner</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
