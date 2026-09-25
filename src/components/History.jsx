import React, { useState } from 'react';
import { 
  History as HistoryIcon, Trash2, Eye, Search, Filter, AlertTriangle, 
  CheckCircle2, ShieldAlert, Lock, ArrowDownAZ 
} from 'lucide-react';

export default function History({ history, onDelete, onClearAll, onViewDetails }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL' | 'LOW' | 'MED' | 'HIGH'

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      (item.domain && item.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.contentSnippet && item.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.qrType && item.qrType.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterRisk === 'LOW') return item.riskScore < 30;
    if (filterRisk === 'MED') return item.riskScore >= 30 && item.riskScore < 60;
    if (filterRisk === 'HIGH') return item.riskScore >= 60;
    return true;
  });

  return (
    <section id="history" style={{ padding: '60px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              LOCAL STORAGE AUDIT TRAIL
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Scan History & Logs
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Stored purely within your local browser storage. No credentials, OTPs, or private keys are ever retained.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="btn btn-outline"
              style={{ fontSize: '0.82rem', padding: '8px 16px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 size={15} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Filters & Search Toolbar */}
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#020617',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              padding: '8px 14px',
              flex: '1',
              minWidth: '240px'
            }}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search domains, URLs, or payload types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
            </div>

            {/* Risk Category Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Risk Filter:</span>
              {['ALL', 'LOW', 'MED', 'HIGH'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterRisk(level)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: filterRisk === level ? 'var(--accent-blue)' : 'rgba(148, 163, 184, 0.2)',
                    background: filterRisk === level ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: filterRisk === level ? '#38bdf8' : '#94a3b8'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Records List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredHistory.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
              <HistoryIcon size={36} color="#475569" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '6px' }}>
                No scan records found matching your criteria.
              </p>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Scan a new QR code or reset the search filter.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1', minWidth: '260px' }}>
                  {/* Risk Badge Icon */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: item.riskScore >= 60 ? 'rgba(239, 68, 68, 0.15)' :
                                item.riskScore >= 30 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                    border: `1px solid ${
                      item.riskScore >= 60 ? '#ef4444' :
                      item.riskScore >= 30 ? '#f59e0b' : '#10b981'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: item.riskScore >= 60 ? '#ef4444' :
                           item.riskScore >= 30 ? '#f59e0b' : '#10b981'
                  }}>
                    {item.riskScore}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#f8fafc' }}>
                        {item.domain}
                      </span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                        {item.qrType}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '440px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.contentSnippet}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                      {new Date(item.timestamp).toLocaleString()} • {item.primaryWarning}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onViewDetails(item.fullResult || item)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    <Eye size={14} />
                    <span>View Audit</span>
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="btn btn-outline"
                    style={{ padding: '6px 10px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.25)' }}
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
