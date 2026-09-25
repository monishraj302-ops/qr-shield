import React from 'react';
import { Camera, Upload, ShieldCheck, ArrowRight, Zap, Eye, Lock, AlertTriangle } from 'lucide-react';

export default function Hero({ onOpenScanner, onOpenUpload, onOpenDemo }) {
  return (
    <section id="home" style={{ position: 'relative', padding: '60px 0 50px', overflow: 'hidden' }}>
      {/* Background cyber glow spots */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 80%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Column: Headlines & Call to Actions */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span className="badge badge-cyan">
                <Zap size={13} />
                COLLEGE MINI-HACKATHON CYBERSECURITY PROJECT
              </span>
            </div>

            <h1 className="hero-title" style={{
              fontSize: '3.4rem',
              fontWeight: 900,
              lineHeight: 1.08,
              marginBottom: '16px'
            }}>
              Scan Before <br />
              <span className="gradient-text">You Trust.</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#38bdf8',
              marginBottom: '12px',
              fontFamily: 'var(--font-display)'
            }}>
              Analyze QR destinations before you open them.
            </p>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              marginBottom: '32px',
              maxWidth: '540px',
              lineHeight: 1.65
            }}>
              QR Shield helps you inspect QR destinations for suspicious links, phishing indicators and unusual URL patterns before you visit them.
            </p>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '40px'
            }}>
              <button 
                onClick={onOpenScanner}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1.02rem' }}
              >
                <Camera size={20} />
                <span>Scan QR Code</span>
              </button>

              <button 
                onClick={onOpenUpload}
                className="btn btn-secondary"
                style={{ padding: '14px 26px', fontSize: '1.02rem' }}
              >
                <Upload size={19} />
                <span>Upload QR Image</span>
              </button>

              <button 
                onClick={onOpenDemo}
                className="btn btn-outline"
                style={{ padding: '14px 22px', fontSize: '0.95rem' }}
              >
                <span>Try Demo Cases</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Highlights pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <Lock size={15} color="#10b981" />
                <span>Zero Auto-Navigation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <Eye size={15} color="#38bdf8" />
                <span>Explainable Risk Logic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <AlertTriangle size={15} color="#f59e0b" />
                <span>Phishing & Spoof Detection</span>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic Cyber QR Visualization */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              padding: '28px',
              borderRadius: '24px',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 242, 254, 0.15)',
              overflow: 'hidden'
            }}>
              {/* Header badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
                paddingBottom: '12px'
              }}>
                <span className="mono" style={{ fontSize: '0.78rem', color: '#00f2fe' }}>
                  // LIVE HUD SENSOR
                </span>
                <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                  SHIELD ACTIVE
                </span>
              </div>

              {/* Graphic container with scanning line */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                background: 'radial-gradient(circle, #0c1833 0%, #030712 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* Decorative Grid Lines */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                  opacity: 0.7
                }} />

                {/* Laser scan bar */}
                <div className="laser-line" />

                {/* Corner crosshairs */}
                <div className="corner-bracket corner-tl" />
                <div className="corner-bracket corner-tr" />
                <div className="corner-bracket corner-bl" />
                <div className="corner-bracket corner-br" />

                {/* Cyber QR SVG Icon */}
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                  <rect width="5" height="5" x="3" y="3" rx="1" fill="rgba(0, 242, 254, 0.15)" />
                  <rect width="5" height="5" x="16" y="3" rx="1" fill="rgba(0, 242, 254, 0.15)" />
                  <rect width="5" height="5" x="3" y="16" rx="1" fill="rgba(0, 242, 254, 0.15)" />
                  <path d="M21 16h-3a2 2 0 0 0-2 2v3" stroke="#00f2fe" strokeWidth="1.5" />
                  <path d="M21 21v.01" stroke="#00f2fe" strokeWidth="2" />
                  <path d="M12 7v3a2 2 0 0 1-2 2H7" stroke="#00f2fe" strokeWidth="1.5" />
                  <path d="M3 12h.01" stroke="#00f2fe" strokeWidth="2" />
                  <path d="M12 3h.01" stroke="#00f2fe" strokeWidth="2" />
                  <path d="M12 16v.01" stroke="#00f2fe" strokeWidth="2" />
                  <path d="M16 12h1" stroke="#00f2fe" strokeWidth="2" />
                  <path d="M21 12v.01" stroke="#00f2fe" strokeWidth="2" />
                  <path d="M12 21v-1" stroke="#00f2fe" strokeWidth="2" />
                </svg>

                {/* Center shield icon */}
                <div style={{
                  position: 'absolute',
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(3, 7, 18, 0.9)',
                  border: '2px solid #00f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px #00f2fe',
                  zIndex: 5
                }}>
                  <ShieldCheck size={26} color="#00f2fe" />
                </div>
              </div>

              {/* Status bar */}
              <div style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: '#94a3b8'
              }}>
                <span className="mono">SCANNER_READY</span>
                <span style={{ color: '#00f2fe' }}>HEURISTIC ENGINE V1.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow Ribbon: SCAN → DECODE → ANALYZE → DECIDE */}
        <div style={{ marginTop: '64px' }}>
          <div className="glass-panel" style={{
            padding: '24px 28px',
            background: 'rgba(11, 17, 32, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              {[
                { step: '01', title: 'SCAN', desc: 'Camera or file upload' },
                { step: '02', title: 'DECODE', desc: 'Extract payload safely' },
                { step: '03', title: 'ANALYZE', desc: 'Inspect domain & structure' },
                { step: '04', title: 'DECIDE', desc: 'Review explainable risk' }
              ].map((item, idx, arr) => (
                <React.Fragment key={item.step}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1', minWidth: '180px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(0, 242, 254, 0.1)',
                      border: '1px solid rgba(0, 242, 254, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#00f2fe'
                    }}>
                      {item.step}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: '0.05em',
                        color: '#f8fafc'
                      }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="nav-desktop" style={{ color: 'rgba(56, 189, 248, 0.4)', fontSize: '1.2rem' }}>
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
