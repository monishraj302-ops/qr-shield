import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, RefreshCw, Cpu, Terminal } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Decoding content safely',
  'Validating RFC URL syntax',
  'Analyzing domain & TLD structure',
  'Checking HTTPS transport encryption',
  'Checking suspicious phishing keyword patterns',
  'Checking URL obfuscation & open redirects',
  'Checking brand impersonation & domain mismatch',
  'Querying reputation status (heuristic mode)',
  'Computing explainable risk score (0-100)',
  'Generating plain-language explanation'
];

export default function AnalysisProgressModal({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 450);
          return prev;
        }
      });
    }, 280); // ~2.8 seconds total animated scanning sequence

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.round(((currentStep + 1) / ANALYSIS_STEPS.length) * 100);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px', padding: '32px' }}>
        {/* Terminal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <Cpu size={18} color="#00f2fe" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                QR Shield Security Pipeline
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                HEURISTIC AUDIT IN PROGRESS
              </div>
            </div>
          </div>

          <span className="mono" style={{ fontSize: '0.9rem', color: '#00f2fe', fontWeight: 700 }}>
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '6px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '24px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #00f2fe 0%, #38bdf8 100%)',
            boxShadow: '0 0 12px #00f2fe',
            transition: 'width 0.25s ease-out'
          }} />
        </div>

        {/* Terminal Steps List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '340px',
          overflowY: 'auto',
          paddingRight: '6px'
        }}>
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`terminal-step ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}`}
              >
                <div style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : isCurrent ? (
                    <RefreshCw size={14} color="#00f2fe" className="spin-slow" />
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>{(idx + 1).toString().padStart(2, '0')}</span>
                  )}
                </div>
                <div style={{ flex: 1, fontSize: '0.85rem' }}>
                  {step}
                </div>
                {isDone && (
                  <span style={{ fontSize: '0.72rem', color: '#10b981' }}>OK</span>
                )}
                {isCurrent && (
                  <span style={{ fontSize: '0.72rem', color: '#00f2fe', animation: 'pulseGlow 1.2s infinite' }}>EVALUATING</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div style={{
          marginTop: '20px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.76rem',
          color: '#64748b',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>ISOLATED EXECUTION SANDBOX</span>
          <span>HTTP CLIENT: LOCAL HOST</span>
        </div>
      </div>
    </div>
  );
}
