import React, { useRef, useEffect } from 'react';
import { Terminal, Shield, Calculator, Check, AlertCircle } from 'lucide-react';

export default function LiveAuditTerminal({ logs, activeScenario, localizationResult, sensors }) {
  const isAttack = activeScenario.id !== 'NONE';

  return (
    <div className="glass-panel" style={{ padding: '20px', margin: '0 16px 14px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
        {/* Left: Industrial SOC Audit Event Stream */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="#0891b2" />
              <h3 className="font-display" style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>
                SCADA TELEMETRY & ATTACK LOCALIZATION LOGS
              </h3>
            </div>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: '#6b7b75' }}>
              LIVE AUDIT TRAIL
            </span>
          </div>

          <div style={{
            background: 'var(--frost)',
            border: '1px solid rgba(14, 116, 144, 0.15)',
            borderRadius: '8px',
            padding: '10px 14px',
            height: '180px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem'
          }}>
            {logs.map((log) => {
              const isAlert = log.level === 'ALERT';
              return (
                <div key={log.id} style={{
                  padding: '3px 0',
                  color: isAlert ? '#be123c' : '#3b4d46',
                  borderBottom: '1px solid rgba(18, 35, 31, 0.03)',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <span style={{ color: '#6b7b75', userSelect: 'none' }}>[{log.time}]</span>
                  <span style={{
                    fontWeight: 700,
                    color: isAlert ? '#e11d48' : '#047857',
                    width: '45px'
                  }}>
                    {log.level}
                  </span>
                  <span>{log.msg}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Physics Invariant Validator & Formula Inspector */}
        <div style={{ background: 'var(--frost)', border: '1px solid rgba(14, 116, 144, 0.15)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calculator size={16} color="#059669" />
            <h4 className="font-display" style={{ fontSize: '0.82rem', color: '#047857' }}>
              PHYSICS INVARIANT FORMULA CHECK
            </h4>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#5a6b65', lineHeight: '1.4' }}>
            The Digital Twin checks mass balance conservation:
          </div>

          <div className="font-mono" style={{
            background: 'rgba(18, 35, 31, 0.06)',
            padding: '8px 12px',
            borderRadius: '6px',
            marginTop: '8px',
            fontSize: '0.78rem',
            color: '#0e7490',
            border: '1px solid rgba(8, 145, 178, 0.2)'
          }}>
            ΔV = ∫ (Q_in - Q_out) dt = A × (dh / dt)
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5a6b65' }}>
              <span>Expected Net Flow (Q_in - Q_out):</span>
              <strong className="font-mono" style={{ color: 'var(--ink)' }}>
                {(sensors.flowInflow - sensors.flowOutflow).toFixed(1)} L/s
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5a6b65' }}>
              <span>Observed vs True Level Delta:</span>
              <strong className="font-mono" style={{ color: isAttack && activeScenario.layer === 'SENSOR' ? '#e11d48' : '#059669' }}>
                {isAttack && activeScenario.layer === 'SENSOR' 
                  ? `Δ = ${(sensors.levelT2_true - sensors.levelT2_observed).toFixed(1)}% (VIOLATION)` 
                  : 'Δ = 0.0% (MATCH)'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5a6b65' }}>
              <span>Invariant Verification Status:</span>
              <span className="badge" style={{
                background: isAttack ? 'rgba(225, 29, 72, 0.15)' : 'rgba(5, 150, 105, 0.15)',
                color: isAttack ? '#be123c' : '#047857',
                border: isAttack ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(5, 150, 105, 0.3)',
                fontSize: '0.65rem'
              }}>
                {isAttack ? 'INVARIANT BREACH ISOLATED' : 'ALL 14 INVARIANTS PASS'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
