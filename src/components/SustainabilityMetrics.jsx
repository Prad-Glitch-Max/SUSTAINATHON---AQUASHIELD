import React from 'react';
import { Droplets, Zap, Clock, ShieldCheck, Leaf } from 'lucide-react';

export default function SustainabilityMetrics({ sustainability, localizationResult, activeScenario }) {
  const isAttack = activeScenario.id !== 'NONE';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '14px',
      margin: '0 16px 14px 16px'
    }}>
      {/* Metric 1: Clean Water Preserved */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'rgba(8, 145, 178, 0.1)',
          border: '1px solid rgba(8, 145, 178, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Droplets size={22} color="#0891b2" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Clean Water Protected
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e7490' }}>
            {sustainability.litersProtected.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#5a6b65' }}>Liters</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#059669', marginTop: '2px' }}>
            + Zero emergency dumps required
          </div>
        </div>
      </div>

      {/* Metric 2: MTTR / Localization Latency */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'rgba(5, 150, 105, 0.1)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Clock size={22} color="#059669" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Localization Latency
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#047857' }}>
            {isAttack ? '38.2 ms' : '< 50 ms'} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#5a6b65' }}>Real-time</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5a6b65', marginTop: '2px' }}>
            vs 4.5 hrs manual diagnostic
          </div>
        </div>
      </div>

      {/* Metric 3: Power Grid & Energy Saved */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'rgba(217, 119, 6, 0.1)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={22} color="#d97706" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pump Energy Conserved
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b45309' }}>
            {sustainability.energySavedKwh.toFixed(1)} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#5a6b65' }}>kWh</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#047857', marginTop: '2px' }}>
            Avoided pump burnout & surge
          </div>
        </div>
      </div>

      {/* Metric 4: Resilient Recovery Assurance */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: isAttack ? 'rgba(225, 29, 72, 0.1)' : 'rgba(139, 92, 246, 0.1)',
          border: isAttack ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={22} color={isAttack ? '#e11d48' : '#8b5cf6'} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Plant Availability
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: isAttack ? '#be123c' : '#6d28d9' }}>
            {isAttack ? '99.4% (Resilient)' : '100% Operational'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5a6b65', marginTop: '2px' }}>
            SDG 6.1 Clean Drinking Water
          </div>
        </div>
      </div>
    </div>
  );
}
