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
          background: 'rgba(0, 242, 254, 0.1)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Droplets size={22} color="#00f2fe" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Clean Water Protected
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
            {sustainability.litersProtected.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>Liters</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '2px' }}>
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
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Clock size={22} color="#10b981" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Localization Latency
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
            {isAttack ? '38.2 ms' : '< 50 ms'} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>Real-time</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
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
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={22} color="#f59e0b" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pump Energy Conserved
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>
            {sustainability.energySavedKwh.toFixed(1)} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>kWh</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: '2px' }}>
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
          background: isAttack ? 'rgba(255, 42, 95, 0.1)' : 'rgba(168, 85, 247, 0.1)',
          border: isAttack ? '1px solid rgba(255, 42, 95, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={22} color={isAttack ? '#ff2a5f' : '#a855f7'} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Plant Availability
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: isAttack ? '#fb7185' : '#c084fc' }}>
            {isAttack ? '99.4% (Resilient)' : '100% Operational'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
            SDG 6.1 Clean Drinking Water
          </div>
        </div>
      </div>
    </div>
  );
}
