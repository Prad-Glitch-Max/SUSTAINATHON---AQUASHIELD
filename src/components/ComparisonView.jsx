import React from 'react';
import { XCircle, CheckCircle, AlertOctagon, ShieldCheck, ArrowRight, ZapOff, Sparkles } from 'lucide-react';

export default function ComparisonView({ activeScenario, localizationResult }) {
  const isAttack = activeScenario.id !== 'NONE';

  return (
    <div className="glass-panel" style={{ padding: '20px', margin: '0 16px 14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '0.95rem', letterSpacing: '0.05em', color: 'var(--ink)' }}>
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
          background: 'rgba(225, 29, 72, 0.04)',
          border: '1px solid rgba(225, 29, 72, 0.25)',
          borderRadius: '10px',
          padding: '16px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <XCircle size={18} color="#e11d48" />
            <h3 className="font-display" style={{ fontSize: '0.85rem', color: '#be123c' }}>
              TRADITIONAL IDS (DETECTION ONLY)
            </h3>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#5a6b65', lineHeight: '1.4' }}>
            Treats the facility as a black box. Sounds an alert when any variable looks strange, but provides zero information about origin or propagation.
          </div>

          <div style={{ marginTop: '12px', background: 'rgba(18, 35, 31, 0.048)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(18, 35, 31, 0.05)' }}>
            <div style={{ fontSize: '0.68rem', color: '#e11d48', fontWeight: 700 }}>OPERATIONAL RESPONSE:</div>
            <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '2px', fontWeight: 600 }}>
              {isAttack ? localizationResult.traditionalResult : 'Idle / Standby (Vulnerable to zero-day stealth attacks)'}
            </div>
          </div>

          <ul style={{ marginTop: '12px', fontSize: '0.72rem', color: '#b91c1c', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>❌ <strong>Downtime:</strong> 4 to 8 hours of plant stoppage</li>
            <li>❌ <strong>Water Waste:</strong> 150,000+ Liters dumped out of safety panic</li>
            <li>❌ <strong>Diagnostics:</strong> Technicians forced to probe each device manually</li>
          </ul>
        </div>

        {/* Right: AquaShield Localization */}
        <div style={{
          background: 'rgba(5, 150, 105, 0.04)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          borderRadius: '10px',
          padding: '16px',
          position: 'relative',
          boxShadow: isAttack ? '0 0 20px rgba(5, 150, 105, 0.05)' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={18} color="#059669" />
            <h3 className="font-display" style={{ fontSize: '0.85rem', color: '#047857' }}>
              AQUASHIELD (ATTACK LOCALIZATION)
            </h3>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#5a6b65', lineHeight: '1.4' }}>
            Executes physics-informed cross-validation. Pins the root cause to the exact layer (Sensor, Channel, PLC, Firmware, or Actuator) in milliseconds.
          </div>

          <div style={{ marginTop: '12px', background: 'rgba(18, 35, 31, 0.048)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>SURGICAL RESILIENT MITIGATION:</div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
              {isAttack ? localizationResult.recoveryMsg : 'Digital Twin verifying 14 physical mass-balance invariants continuously'}
            </div>
          </div>

          <ul style={{ marginTop: '12px', fontSize: '0.72rem', color: '#059669', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>✅ <strong>Downtime:</strong> ZERO seconds (Continues potable production)</li>
            <li>✅ <strong>Water Saved:</strong> 100% of clean water preserved</li>
            <li>✅ <strong>Precision:</strong> Pinpoints exact component ({isAttack ? localizationResult.culpritNode : 'All Verified'})</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
