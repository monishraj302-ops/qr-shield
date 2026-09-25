import React from 'react';
import { Camera, Binary, SearchCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'SCAN',
      icon: <Camera size={26} color="#00f2fe" />,
      desc: 'Point your camera at any physical QR barcode or upload an image file (PNG, JPG, WEBP).',
      detail: 'Frames are grabbed on-device without streaming video to external servers.'
    },
    {
      num: '02',
      title: 'DECODE',
      icon: <Binary size={26} color="#38bdf8" />,
      desc: 'Extract and isolate the raw payload safely without triggering automatic web navigation.',
      detail: 'Eliminates drive-by downloads and browser zero-day exploit execution.'
    },
    {
      num: '03',
      title: 'ANALYZE',
      icon: <SearchCheck size={26} color="#818cf8" />,
      desc: 'Heuristic engine inspects domain structure, TLD abuse, brand mismatches, and URL obfuscation.',
      detail: 'Evaluates RFC conformance, IP hosts, homograph attacks, and credential lure keywords.'
    },
    {
      num: '04',
      title: 'DECIDE',
      icon: <ShieldAlert size={26} color="#10b981" />,
      desc: 'Review the explainable risk score (0-100) and plain-language indicators before proceeding.',
      detail: 'Empowers you with explainable cybersecurity awareness: Scan before you trust.'
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '60px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
            OPERATIONAL LIFECYCLE
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
            How QR Shield Protects You
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
            Traditional smartphone cameras blindly navigate to scanned URLs. QR Shield introduces an essential security inspection checkpoint.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass-panel"
              style={{
                padding: '30px 24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {step.icon}
                  </div>
                  <span className="mono" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.15)' }}>
                    {step.num}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px' }}>
                  {step.desc}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                paddingTop: '12px',
                fontSize: '0.78rem',
                color: '#94a3b8'
              }}>
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
