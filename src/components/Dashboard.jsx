import React from 'react';
import { 
  BarChart3, ShieldCheck, ShieldAlert, AlertTriangle, Activity, 
  ExternalLink, ArrowUpRight, Clock, Eye 
} from 'lucide-react';

export default function Dashboard({ stats, onViewDetails, onScanNow }) {
  const { totalScans = 0, lowRisk = 0, mediumRisk = 0, highRisk = 0, recentScans = [] } = stats;

  const lowPercent = totalScans ? Math.round((lowRisk / totalScans) * 100) : 0;
  const medPercent = totalScans ? Math.round((mediumRisk / totalScans) * 100) : 0;
  const highPercent = totalScans ? Math.round((highRisk / totalScans) * 100) : 0;

  return (
    <section id="dashboard" style={{ padding: '60px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              SECURITY METRICS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Cyber Threat Dashboard
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Real-time telemetry and risk distribution of scanned QR targets.
            </p>
          </div>

          <button
            onClick={onScanNow}
            className="btn btn-primary"
            style={{ fontSize: '0.88rem', padding: '10px 20px' }}
          >
            <span>Scan New QR</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid-cards" style={{ marginBottom: '28px' }}>
          {/* Card 1: Total Scans */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>TOTAL SCANS</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Activity size={18} color="#38bdf8" />
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
              {totalScans}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
              Isolated in client sandbox
            </div>
          </div>

          {/* Card 2: Low Risk */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>LOW RISK (0-29)</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#10b981" />
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
              {lowRisk}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
              {lowPercent}% of total inspections
            </div>
          </div>

          {/* Card 3: Medium Risk */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>MEDIUM RISK (30-59)</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={18} color="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
              {mediumRisk}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
              {medPercent}% with warning indicators
            </div>
          </div>

          {/* Card 4: High Risk */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>HIGH RISK (60-100)</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={18} color="#ef4444" />
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>
              {highRisk}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
              {highPercent}% blocked phishing / spoof
            </div>
          </div>
        </div>

        {/* Visual Risk Distribution Chart */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              Risk Distribution Breakdown
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Based on {totalScans} verified records
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div style={{
            height: '14px',
            borderRadius: '7px',
            background: 'rgba(15, 23, 42, 0.9)',
            display: 'flex',
            overflow: 'hidden',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            marginBottom: '16px'
          }}>
            <div style={{ width: `${lowPercent}%`, background: '#10b981', transition: 'width 0.4s ease' }} title={`Low Risk: ${lowPercent}%`} />
            <div style={{ width: `${medPercent}%`, background: '#f59e0b', transition: 'width 0.4s ease' }} title={`Medium Risk: ${medPercent}%`} />
            <div style={{ width: `${highPercent}%`, background: '#ef4444', transition: 'width 0.4s ease' }} title={`High Risk: ${highPercent}%`} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ color: '#cbd5e1' }}>Low Risk: <strong>{lowPercent}%</strong> ({lowRisk})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ color: '#cbd5e1' }}>Medium Risk: <strong>{medPercent}%</strong> ({mediumRisk})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ color: '#cbd5e1' }}>High Risk: <strong>{highPercent}%</strong> ({highRisk})</span>
            </div>
          </div>
        </div>

        {/* Recent Scans Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
            Recent Scan Telemetry
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <th style={{ padding: '12px 14px' }}>DATE / TIME</th>
                  <th style={{ padding: '12px 14px' }}>DOMAIN / TARGET</th>
                  <th style={{ padding: '12px 14px' }}>RISK LEVEL</th>
                  <th style={{ padding: '12px 14px' }}>SCORE</th>
                  <th style={{ padding: '12px 14px' }}>PRIMARY FINDING</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      No scan history logged yet. Scan a QR code above to start tracking.
                    </td>
                  </tr>
                ) : (
                  recentScans.map((scan) => (
                    <tr 
                      key={scan.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
                        fontSize: '0.86rem',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={13} color="#64748b" />
                          <span>{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#f8fafc' }}>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {scan.domain}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${
                          scan.riskLevel === 'HIGH RISK' ? 'badge-high' :
                          scan.riskLevel === 'MEDIUM RISK' ? 'badge-med' : 'badge-low'
                        }`} style={{ fontSize: '0.7rem' }}>
                          {scan.riskLevel}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="mono" style={{
                          fontWeight: 700,
                          color: scan.riskScore >= 60 ? '#ef4444' : scan.riskScore >= 30 ? '#f59e0b' : '#10b981'
                        }}>
                          {scan.riskScore}/100
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8', maxWidth: '240px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {scan.primaryWarning}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          onClick={() => onViewDetails(scan.fullResult || scan)}
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
