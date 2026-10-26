import React from 'react';
import { XCircle, CheckCircle, AlertOctagon, ShieldCheck, ArrowRight, ZapOff, Sparkles } from 'lucide-react';

export default function ComparisonView({ activeScenario, localizationResult }) {
  const isAttack = activeScenario.id !== 'NONE';

  return (
    <div className="glass-panel" style={{ padding: '20px', margin: '0 16px 14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '0.95rem', letterSpacing: '0.05em', color: '#f1f5f9' }}>
            LOCALIZATION IMPACT: TRADITIONAL IDS VS AQUASHIELD
          </h2>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Comparing conventional cybersecurity alarms against physics-informed root-cause isolation
          </p>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
          HACKATHON VALUE PROPOSITION
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Left: Traditional Cyber IDS */}
        <div style={{
          background: 'rgba(255, 42, 95, 0.04)',
          border: '1px solid rgba(255, 42, 95, 0.25)',
          borderRadius: '10px',
          padding: '16px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <XCircle size={18} color="#ff2a5f" />
            <h3 className="font-display" style={{ fontSize: '0.85rem', color: '#ff7185' }}>
              TRADITIONAL IDS (DETECTION ONLY)
            </h3>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
            Treats the facility as a black box. Sounds an alert when any variable looks strange, but provides zero information about origin or propagation.
          </div>

          <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.68rem', color: '#ff2a5f', fontWeight: 700 }}>OPERATIONAL RESPONSE:</div>
            <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '2px', fontWeight: 600 }}>
              {isAttack ? localizationResult.traditionalResult : 'Idle / Standby (Vulnerable to zero-day stealth attacks)'}
            </div>
          </div>

          <ul style={{ marginTop: '12px', fontSize: '0.72rem', color: '#fca5a5', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>❌ <strong>Downtime:</strong> 4 to 8 hours of plant stoppage</li>
            <li>❌ <strong>Water Waste:</strong> 150,000+ Liters dumped out of safety panic</li>
            <li>❌ <strong>Diagnostics:</strong> Technicians forced to probe each device manually</li>
          </ul>
        </div>

        {/* Right: AquaShield Localization */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.04)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          padding: '16px',
          position: 'relative',
          boxShadow: isAttack ? '0 0 20px rgba(16,185,129,0.15)' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={18} color="#10b981" />
            <h3 className="font-display" style={{ fontSize: '0.85rem', color: '#34d399' }}>
              AQUASHIELD (ATTACK LOCALIZATION)
            </h3>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
            Executes physics-informed cross-validation. Pins the root cause to the exact layer (Sensor, Channel, PLC, Firmware, or Actuator) in milliseconds.
          </div>

          <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>SURGICAL RESILIENT MITIGATION:</div>
            <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '2px', fontWeight: 600 }}>
              {isAttack ? localizationResult.recoveryMsg : 'Digital Twin verifying 14 physical mass-balance invariants continuously'}
            </div>
          </div>

          <ul style={{ marginTop: '12px', fontSize: '0.72rem', color: '#6ee7b7', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>✅ <strong>Downtime:</strong> ZERO seconds (Continues potable production)</li>
            <li>✅ <strong>Water Saved:</strong> 100% of clean water preserved</li>
            <li>✅ <strong>Precision:</strong> Pinpoints exact component ({isAttack ? localizationResult.culpritNode : 'All Verified'})</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
