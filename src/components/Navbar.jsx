import React, { useState } from 'react';
import { Shield, ShieldAlert, QrCode, Menu, X, ExternalLink, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onScanClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'scanner', label: 'Scanner' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'security', label: 'Security' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'History' },
    { id: 'demo', label: 'Demo Cases' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(3, 7, 18, 0.85)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)'
          }}>
            <Shield size={24} color="#00f2fe" />
            <div style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                QR<span style={{ color: '#00f2fe' }}>SHIELD</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>v1.0 Hackathon</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.04em' }}>
              EXPLAINABLE QR SECURITY
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              style={{
                background: activeTab === item.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === item.id ? '#38bdf8' : '#94a3b8',
                fontWeight: activeTab === item.id ? '600' : '500'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onScanClick}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            <QrCode size={17} />
            <span>Scan QR</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="nav-mobile-btn btn-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid var(--border-cyan)',
              background: 'transparent',
              color: '#f8fafc',
              cursor: 'pointer'
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(3, 7, 18, 0.98)',
          borderBottom: '1px solid var(--border-cyan)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                background: activeTab === item.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: activeTab === item.id ? '#00f2fe' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
