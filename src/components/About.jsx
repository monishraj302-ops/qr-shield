import React, { useState } from 'react';
import { Shield, Award, Users, Code2, Edit2, Check, Sparkles } from 'lucide-react';

export default function About() {
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState('CyberSentinels');
  const [members, setMembers] = useState([
    { name: 'Aditya Sharma', role: 'Security Heuristics & Engine' },
    { name: 'Kavya Patel', role: 'Frontend & UI/UX Design' },
    { name: 'Rahul Verma', role: 'Camera & QR Decoder Pipeline' },
    { name: 'Sneha Nair', role: 'Threat Research & Testing' }
  ]);

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  return (
    <section id="about" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
            HACKATHON PRESENTATION
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
            About QR Shield
          </h2>
          <p style={{
            color: '#38bdf8',
            maxWidth: '680px',
            margin: '0 auto 16px',
            fontSize: '1.1rem',
            fontWeight: 600,
            fontFamily: 'var(--font-display)'
          }}>
            “QR Shield is a cybersecurity awareness and risk-analysis tool that helps users inspect QR destinations before opening them.”
          </p>
        </div>

        {/* Hackathon Project Showcase Card */}
        <div className="glass-panel" style={{
          maxWidth: '840px',
          margin: '0 auto',
          padding: '36px',
          borderRadius: '24px',
          position: 'relative'
        }}>
          {/* Header Badge */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
            paddingBottom: '20px',
            marginBottom: '26px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Award size={20} color="#fbbf24" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  College Mini-Hackathon 2026
                </span>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    style={{
                      background: '#020617',
                      border: '1px solid #00f2fe',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      fontWeight: 800
                    }}
                  />
                </div>
              ) : (
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                  Team: <span style={{ color: '#00f2fe' }}>{teamName}</span>
                </h3>
              )}
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {isEditing ? <Check size={14} color="#10b981" /> : <Edit2 size={14} />}
              <span>{isEditing ? 'Save Team Details' : 'Edit Team Names'}</span>
            </button>
          </div>

          {/* Mission & Purpose */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
              Project Problem Statement & Motivation
            </h4>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '12px' }}>
              With the explosion of contactless QR payments, smart menus, and digital check-ins, "Quishing" (QR code phishing) has grown over 587% annually. Because humans cannot visually read the encoded matrix pixels, attackers paste malicious stickers over legitimate QR codes in restaurants, parking meters, and public kiosks.
            </p>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              QR Shield addresses this attack vector by acting as a zero-trust intermediate gatekeeper that isolates the decoded content, inspects the payload with 12 explainable heuristics, and gives users full situational awareness before interacting.
            </p>
          </div>

          {/* Team Members Grid */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#38bdf8" />
              <span>Project Contributors & Roles</span>
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px'
            }}>
              {members.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    borderRadius: '12px',
                    padding: '14px 16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(0, 242, 254, 0.15)',
                      border: '1px solid rgba(0, 242, 254, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#00f2fe'
                    }}>
                      {idx + 1}
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        style={{
                          background: '#020617',
                          border: '1px solid #38bdf8',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          width: '100%'
                        }}
                      />
                    ) : (
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                        {member.name}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                      style={{
                        background: '#020617',
                        border: '1px solid #64748b',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#94a3b8',
                        fontSize: '0.78rem',
                        width: '100%'
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                      {member.role}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
