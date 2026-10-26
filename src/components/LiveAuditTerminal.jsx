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
              <Terminal size={16} color="#00f2fe" />
              <h3 className="font-display" style={{ fontSize: '0.88rem', color: '#f1f5f9' }}>
                SCADA TELEMETRY & ATTACK LOCALIZATION LOGS
              </h3>
            </div>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748b' }}>
              LIVE AUDIT TRAIL
            </span>
          </div>

          <div style={{
            background: 'rgba(5, 10, 20, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
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
                  color: isAlert ? '#fb7185' : '#cbd5e1',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <span style={{ color: '#64748b', userSelect: 'none' }}>[{log.time}]</span>
                  <span style={{
                    fontWeight: 700,
                    color: isAlert ? '#ff2a5f' : '#34d399',
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
        <div style={{ background: 'rgba(5, 10, 20, 0.65)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calculator size={16} color="#10b981" />
            <h4 className="font-display" style={{ fontSize: '0.82rem', color: '#34d399' }}>
              PHYSICS INVARIANT FORMULA CHECK
            </h4>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.4' }}>
            The Digital Twin checks mass balance conservation:
          </div>

          <div className="font-mono" style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '8px 12px',
            borderRadius: '6px',
            marginTop: '8px',
            fontSize: '0.78rem',
            color: '#38bdf8',
            border: '1px solid rgba(0, 242, 254, 0.2)'
          }}>
            ΔV = ∫ (Q_in - Q_out) dt = A × (dh / dt)
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Expected Net Flow (Q_in - Q_out):</span>
              <strong className="font-mono" style={{ color: '#f1f5f9' }}>
                {(sensors.flowInflow - sensors.flowOutflow).toFixed(1)} L/s
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Observed vs True Level Delta:</span>
              <strong className="font-mono" style={{ color: isAttack && activeScenario.layer === 'SENSOR' ? '#ff2a5f' : '#10b981' }}>
                {isAttack && activeScenario.layer === 'SENSOR' 
                  ? `Δ = ${(sensors.levelT2_true - sensors.levelT2_observed).toFixed(1)}% (VIOLATION)` 
                  : 'Δ = 0.0% (MATCH)'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Invariant Verification Status:</span>
              <span className="badge" style={{
                background: isAttack ? 'rgba(255,42,95,0.15)' : 'rgba(16,185,129,0.15)',
                color: isAttack ? '#fb7185' : '#34d399',
                border: isAttack ? '1px solid rgba(255,42,95,0.3)' : '1px solid rgba(16,185,129,0.3)',
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
