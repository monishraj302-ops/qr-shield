import React from 'react';
import { Lock, EyeOff, ShieldCheck, Key, FileCheck, Server, AlertTriangle } from 'lucide-react';

export default function PrivacySecurity() {
  const policies = [
    {
      icon: <EyeOff size={22} color="#00f2fe" />,
      title: 'Zero Automated Navigation',
      desc: 'QR content is treated strictly as untrusted input. The browser will NEVER navigate to, pre-fetch, or execute a scanned link automatically.'
    },
    {
      icon: <Lock size={22} color="#10b981" />,
      title: 'No Sensitive Credential Storage',
      desc: 'UPI PINs, passwords, OTPs, recovery tokens, and credit card numbers are strictly stripped and never saved to browser storage or external logs.'
    },
    {
      icon: <ShieldCheck size={22} color="#38bdf8" />,
      title: 'Explicit Camera Consent',
      desc: 'Camera video streams remain 100% on-device in browser memory. Video frames are analyzed via client-side canvas without remote stream uploads.'
    },
    {
      icon: <Server size={22} color="#f59e0b" />,
      title: 'Transparent Threat Intel',
      desc: 'Third-party APIs (VirusTotal, Safe Browsing) only receive domains when explicitly enabled in backend configurations. We never claim an API was called when running in heuristic mode.'
    },
    {
      icon: <Key size={22} color="#818cf8" />,
      title: 'API Key Security & Backend Proxying',
      desc: 'In production deployments, third-party threat API keys are held securely in environment variables on the backend server—never leaked to client bundles.'
    },
    {
      icon: <FileCheck size={22} color="#ec4899" />,
      title: 'Payload Sanitization & XSS Defense',
      desc: 'All decoded QR text, URL query strings, and payloads are sanitized before DOM rendering to prevent stored or reflected Cross-Site Scripting (XSS).'
    }
  ];

  return (
    <section id="privacy" style={{ padding: '60px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
            CYBER RESILIENCE POLICY
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
            Privacy & Trust Architecture
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
            Security software must hold itself to the highest standards of transparency and user privacy.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {policies.map((p, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '26px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {p.icon}
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
