import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Info, 
  ExternalLink, Copy, Check, Download, ArrowLeft, AlertOctagon, HelpCircle 
} from 'lucide-react';

export default function SecurityReportModal({ result, onClose, onScanAnother }) {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const {
    riskScore,
    riskLevel,
    color,
    destination,
    domain,
    findings = [],
    explanation,
    threatIntel,
    disclaimer
  } = result;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      case 'danger':
        return <XCircle size={18} color="#ef4444" />;
      default:
        return <Info size={18} color="#38bdf8" />;
    }
  };

  const getRiskBadgeClass = () => {
    if (color === 'red' || riskScore >= 60) return 'badge-high';
    if (color === 'yellow' || riskScore >= 30) return 'badge-med';
    return 'badge-low';
  };

  const getRiskMeterStroke = () => {
    if (color === 'red' || riskScore >= 60) return '#ef4444';
    if (color === 'yellow' || riskScore >= 30) return '#f59e0b';
    return '#10b981';
  };

  const circumference = 2 * Math.PI * 58;
  const strokeOffset = circumference - (riskScore / 100) * circumference;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(destination);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportReport = () => {
    const reportData = {
      product: 'QR Shield Security Audit Report',
      timestamp: new Date().toISOString(),
      destination,
      domain,
      riskScore,
      riskLevel,
      explanation,
      findings,
      threatIntel
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-shield-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenLinkAnyway = () => {
    setShowWarningModal(false);
    onClose();
    window.open(destination, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px', padding: '32px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>AUDIT VERDICT</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
              QR SECURITY ANALYSIS
            </h3>
          </div>

          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            Close
          </button>
        </div>

        {/* Top Summary Card: Score Meter + Verdict */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Circular Animated Meter */}
          <div className="risk-meter-container">
            <svg width="160" height="160" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="58"
                className="risk-circle-bg"
              />
              <circle
                cx="70"
                cy="70"
                r="58"
                className="risk-circle-fill"
                stroke={getRiskMeterStroke()}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                RISK SCORE
              </span>
              <span style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: getRiskMeterStroke(),
                lineHeight: 1
              }}>
                {riskScore}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                / 100
              </span>
            </div>
          </div>

          {/* Verdict Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className={`badge ${getRiskBadgeClass()}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {riskLevel === 'HIGH RISK' && '🔴 '}
                {riskLevel === 'MEDIUM RISK' && '🟡 '}
                {riskLevel === 'LOW RISK' && '🟢 '}
                {riskLevel}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '4px' }}>
              TARGET DESTINATION:
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.92rem',
              color: '#38bdf8',
              background: '#020617',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              wordBreak: 'break-all',
              marginBottom: '10px'
            }}>
              {destination}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Host: <strong style={{ color: '#cbd5e1' }}>{domain}</strong>
            </div>
          </div>
        </div>

        {/* Explainable Reasoning Section: "Why was this flagged?" */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.65)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            color: '#f8fafc',
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            <HelpCircle size={18} color="#00f2fe" />
            <span>Why was this flagged?</span>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {explanation}
          </p>
        </div>

        {/* Security Checks Table */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#f8fafc',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Detected Security Indicators ({findings.length})</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {findings.map((f, idx) => (
              <div
                key={f.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ marginTop: '2px' }}>{getStatusIcon(f.status)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '3px'
                  }}>
                    <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{f.title}</strong>
                    {f.points > 0 && (
                      <span className="mono" style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                        +{f.points} pts
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    {f.description}
                  </div>
                </div>
              </div>
            ))}

            {/* Threat Intel Row */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: '10px',
              padding: '12px 14px'
            }}>
              <div style={{ marginTop: '2px' }}><Info size={18} color="#38bdf8" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                  Threat Intelligence Status
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  {threatIntel?.message || 'Reputation data unavailable (Heuristic Analysis Mode).'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div style={{
          fontSize: '0.78rem',
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '24px',
          fontStyle: 'italic'
        }}>
          "{disclaimer || 'This score represents detected security indicators and is not a guarantee that a website is safe or malicious.'}"
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(56, 189, 248, 0.2)',
          paddingTop: '20px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { onClose(); onScanAnother(); }}
              className="btn btn-secondary"
              style={{ fontSize: '0.88rem', padding: '10px 18px' }}
            >
              Scan Another QR
            </button>
            <button
              onClick={handleExportReport}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '10px 14px' }}
            >
              <Download size={15} />
              <span>Export Audit</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '10px 14px' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            {result.isValidUrl && (
              <button
                onClick={() => {
                  if (riskScore >= 30) {
                    setShowWarningModal(true);
                  } else {
                    handleOpenLinkAnyway();
                  }
                }}
                className={`btn ${riskScore >= 60 ? 'btn-danger' : 'btn-primary'}`}
                style={{ fontSize: '0.88rem', padding: '10px 20px' }}
              >
                <span>Open Link Anyway</span>
                <ExternalLink size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION WARNING MODAL (REQUIRED FOR SUSPICIOUS LINKS) */}
      {showWarningModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '28px', border: '1px solid #ef4444' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              color: '#ef4444'
            }}>
              <AlertOctagon size={32} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Security Warning
              </h3>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
              This destination contains suspicious indicators (Risk Score: <strong style={{ color: '#ef4444' }}>{riskScore}/100</strong>). Do you still want to continue?
            </p>

            <div style={{
              background: '#020617',
              padding: '12px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#f87171',
              wordBreak: 'break-all',
              marginBottom: '20px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {destination}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowWarningModal(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 18px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleOpenLinkAnyway}
                className="btn btn-danger"
                style={{ padding: '8px 20px' }}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
