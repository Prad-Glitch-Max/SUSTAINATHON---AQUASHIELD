import React, { useState, useEffect } from 'react';
import { Droplets, Volume2, VolumeX, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Header({ activeScenario, phase }) {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(sound.muted);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const isNominal = phase === 'NOMINAL' || phase === 'RESOLVED';

  return (
    <header className="glass-panel" style={{
      padding: '12px 24px',
      margin: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      borderBottom: isNominal ? '1px solid rgba(0,242,254,0.2)' : '1px solid rgba(255,42,95,0.4)'
    }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: isNominal 
            ? 'linear-gradient(135deg, rgba(0,242,254,0.2), rgba(16,185,129,0.2))' 
            : 'linear-gradient(135deg, rgba(255,42,95,0.25), rgba(245,158,11,0.25))',
          border: isNominal ? '1px solid #00f2fe' : '1px solid #ff2a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isNominal ? <Droplets size={22} color="#00f2fe" /> : <AlertTriangle size={22} color="#ff2a5f" />}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="font-display" style={{ fontSize: '1.2rem', letterSpacing: '0.06em', fontWeight: 800, color: '#f1f5f9' }}>
              AQUASHIELD CPS
            </h1>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              SMART WATER SECURITY
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Finding and fixing cyber attacks on clean water plants • <strong style={{ color: '#10b981' }}>UN Clean Water SDG 6</strong>
          </p>
        </div>
      </div>

      {/* Right side: Plant Status & Sound Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Plant Status Indicator */}
        <div className="glass-panel" style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '20px',
          border: isNominal ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,42,95,0.7)',
          background: isNominal ? 'rgba(16,185,129,0.08)' : 'rgba(255,42,95,0.12)'
        }}>
          <span style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: isNominal ? '#10b981' : '#ff2a5f',
            boxShadow: isNominal ? '0 0 8px #10b981' : '0 0 10px #ff2a5f'
          }} />
          <div className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: isNominal ? '#34d399' : '#fb7185' }}>
            {phase === 'NOMINAL' && 'PLANT NORMAL: ALL SAFE'}
            {phase === 'ATTACK_ACTIVE' && 'ALARM! ATTACK IN PROGRESS'}
            {phase === 'LOCALIZED' && `ROOT CAUSE: ${activeScenario.layerName || 'IDENTIFIED'}`}
            {phase === 'RESOLVED' && 'FIXED: CLEAN WATER FLOWING'}
          </div>
        </div>

        {/* Live Clock */}
        <div className="font-mono" style={{ fontSize: '0.85rem', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {timeStr}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: '8px',
            padding: '7px 9px',
            cursor: 'pointer',
            color: isMuted ? '#64748b' : '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
        >
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      </div>
    </header>
  );
}
