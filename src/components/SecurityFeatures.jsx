import React from 'react';
import { 
  ShieldAlert, Globe, Search, Database, Gauge, AlertCircle, 
  Lock, CheckCircle2, ShieldCheck, Cpu 
} from 'lucide-react';

export default function SecurityFeatures() {
  const features = [
    {
      icon: <ShieldAlert size={24} color="#ef4444" />,
      title: '🔐 Phishing Detection',
      tag: 'Target Defense',
      desc: 'Detects brand impersonation, spoofed login forms, urgency trigger keywords ("verify", "suspended"), and credential harvesting traps.'
    },
    {
      icon: <Globe size={24} color="#00f2fe" />,
      title: '🌐 URL Analysis',
      tag: 'Protocol & Syntax',
      desc: 'Validates RFC syntax, checks for unencrypted HTTP connections, detects open redirect parameters (?redirect=), and flags embedded credentials.'
    },
    {
      icon: <Search size={24} color="#38bdf8" />,
      title: '🔎 Domain Analysis',
      tag: 'Heuristics',
      desc: 'Inspects high-abuse disposable TLDs (.xyz, .top, .tk), identifies raw numeric IP addresses, calculates lexical entropy, and spots Punycode attacks.'
    },
    {
      icon: <Database size={24} color="#a855f7" />,
      title: '🛡️ Threat Intelligence',
      tag: 'Architecture Ready',
      desc: 'Transparently labels reputation status. Architecture supports API hookup (VirusTotal / Safe Browsing) without fabricating fake results.'
    },
    {
      icon: <Gauge size={24} color="#f59e0b" />,
      title: '📊 Risk Scoring',
      tag: 'Normalized 0-100',
      desc: 'Combines multiple weighted heuristics into an intuitive score (0-29 Low Risk 🟢, 30-59 Medium Risk 🟡, 60-100 High Risk 🔴).'
    },
    {
      icon: <AlertCircle size={24} color="#10b981" />,
      title: '⚠️ Explainable Warnings',
      tag: 'No Black Box',
      desc: 'Never just "Safe" or "Dangerous". Detailed breakdown explains why each indicator was flagged and what threat vector it corresponds to.'
    }
  ];

  return (
    <section id="security" style={{ padding: '60px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
            DEFENSE IN DEPTH
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
            Security Features & Heuristic Engine
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
            Built specifically to uncover malicious deception techniques before your browser renders untrusted content.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '28px',
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
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {feat.icon}
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                    {feat.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                  {feat.desc}
                </p>
              </div>

              <div style={{
                marginTop: '18px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: '#38bdf8'
              }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Active in QR Shield Engine</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
