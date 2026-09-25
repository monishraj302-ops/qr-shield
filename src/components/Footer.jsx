import React from 'react';
import { Shield, Code2, Heart, ExternalLink, Lock } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(56, 189, 248, 0.2)',
      background: 'rgba(3, 7, 18, 0.95)',
      padding: '48px 0 32px',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '36px'
        }}>
          {/* Brand & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid #00f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={18} color="#00f2fe" />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#ffffff'
              }}>
                QR<span style={{ color: '#00f2fe' }}>SHIELD</span>
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 600 }}>
              Scan Before You Trust.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Explainable QR Code Security & Threat Intelligence Engine.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <button
              onClick={() => onNavigate('privacy')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.88rem' }}
              onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('security')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.88rem' }}
              onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              Security
            </button>
            <button
              onClick={() => onNavigate('about')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.88rem' }}
              onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              About
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.88rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#00f2fe'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              <Code2 size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} QR Shield. Built for College Mini-Hackathon 2026.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={12} color="#10b981" />
            <span>Client-side heuristics with explainable risk scoring</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
