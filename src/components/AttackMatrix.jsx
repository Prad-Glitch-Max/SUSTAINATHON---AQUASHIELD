import React from 'react';
import { Eye, Radio, Cpu, Binary, Cog, CheckCircle, AlertTriangle, HelpCircle, ShieldCheck } from 'lucide-react';

const LAYER_CONFIG = [
  {
    key: 'SENSOR',
    name: 'Layer 1: Sensor',
    analogy: '(The Eyes)',
    simpleJob: 'Reads water level and pressure',
    icon: Eye,
    color: '#0891b2'
  },
  {
    key: 'COMMUNICATION_CHANNEL',
    name: 'Layer 2: Network Cable',
    analogy: '(The Nerves)',
    simpleJob: 'Sends messages between tanks and computers',
    icon: Radio,
    color: '#2563eb'
  },
  {
    key: 'CONTROLLER',
    name: 'Layer 3: Computer Brain',
    analogy: '(The Brain)',
    simpleJob: 'Makes decisions to open or close valves',
    icon: Cpu,
    color: '#8b5cf6'
  },
  {
    key: 'FIRMWARE',
    name: 'Layer 4: Software Code',
    analogy: '(The Instincts)',
    simpleJob: 'The low-level code running inside the motor',
    icon: Binary,
    color: '#d97706'
  },
  {
    key: 'ACTUATOR',
    name: 'Layer 5: Moving Parts',
    analogy: '(The Muscles)',
    simpleJob: 'Physical water pumps and valves that move',
    icon: Cog,
    color: '#e11d48'
  }
];

export default function AttackMatrix({ activeScenario, localizationResult, phase }) {
  const isNominal = phase === 'NOMINAL';
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  const targetLayerKey = activeScenario.layer;

  return (
    <div className="glass-panel" style={{ padding: '24px', margin: '16px 0 0 0' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="font-display" style={{ fontSize: '1.05rem', letterSpacing: '0.04em', color: 'var(--ink)' }}>
              THE 5-LAYER HIERARCHY (THE PROBLEM STATEMENT)
            </h2>
            <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
              WHERE ATTACKS CAN HIDE
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Existing tools cannot tell which of these 5 layers is broken. AquaShield checks all 5 and pinpoints the exact culprit.
          </p>
        </div>

        <span className={`badge ${isAttackActive ? 'badge-rose' : isLocalized ? 'badge-cyan' : 'badge-emerald'}`} style={{ fontSize: '0.72rem', padding: '4px 12px' }}>
          {isNominal && 'ALL 5 LAYERS SAFE'}
          {isAttackActive && 'WHICH LAYER BROKE? (INVESTIGATING)'}
          {isLocalized && 'ROOT CAUSE FOUND'}
          {isResolved && 'ALL 5 LAYERS PROTECTED'}
        </span>
      </div>

      {/* 5 Layer Cards Arranged Horizontally */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {LAYER_CONFIG.map((layer) => {
          const Icon = layer.icon;
          const isTarget = targetLayerKey === layer.key;

          let statusText = 'SAFE';
          let statusColor = '#047857';
          let cardBg = 'var(--frost)';
          let borderColor = 'rgba(14, 116, 144, 0.12)';
          let glow = 'none';

          if (isNominal) {
            statusText = 'SAFE & NORMAL';
            statusColor = '#047857';
          } else if (isAttackActive) {
            statusText = '? COULD BE HERE';
            statusColor = '#b45309';
            cardBg = 'rgba(217, 119, 6, 0.06)';
            borderColor = 'rgba(217, 119, 6, 0.25)';
          } else if (isLocalized) {
            if (isTarget) {
              statusText = '🚨 FOUND! THIS BROKE';
              statusColor = '#e11d48';
              cardBg = 'rgba(225, 29, 72, 0.18)';
              borderColor = '#e11d48';
              glow = '0 0 16px rgba(225, 29, 72, 0.14)';
            } else {
              statusText = '✅ CHECKED & SAFE';
              statusColor = '#047857';
              cardBg = 'rgba(5, 150, 105, 0.05)';
              borderColor = 'rgba(5, 150, 105, 0.25)';
            }
          } else if (isResolved) {
            if (isTarget) {
              statusText = '🛡️ FIXED WITH MATH';
              statusColor = '#059669';
              cardBg = 'rgba(5, 150, 105, 0.15)';
              borderColor = '#059669';
            } else {
              statusText = 'SAFE & NORMAL';
              statusColor = '#047857';
            }
          }

          return (
            <div
              key={layer.key}
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                boxShadow: glow,
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: (isLocalized && isTarget) ? '#e11d48' : 'rgba(8, 145, 178, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} color={(isLocalized && isTarget) ? '#ffffff' : layer.color} />
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#5a6b65', fontStyle: 'italic' }}>
                    {layer.analogy}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: (isLocalized && isTarget) ? '#e11d48' : 'var(--ink)' }}>
                  {layer.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#5a6b65', marginTop: '3px', lineHeight: '1.3' }}>
                  {(isLocalized && isTarget) ? activeScenario.target : layer.simpleJob}
                </div>
              </div>

              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(18, 35, 31, 0.06)', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: statusColor }}>
                  {statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Layman Explanation Card (No smart words!) */}
      <div style={{
        marginTop: '16px',
        padding: '14px 18px',
        borderRadius: '10px',
        background: isAttackActive 
          ? 'rgba(225, 29, 72, 0.08)' 
          : isLocalized 
          ? 'rgba(8, 145, 178, 0.08)' 
          : isResolved 
          ? 'rgba(5, 150, 105, 0.08)' 
          : 'rgba(18, 35, 31, 0.02)',
        border: `1px solid ${isAttackActive ? 'rgba(225, 29, 72, 0.3)' : isLocalized ? 'rgba(8, 145, 178, 0.3)' : isResolved ? 'rgba(5, 150, 105, 0.3)' : 'rgba(18, 35, 31, 0.06)'}`
      }}>
        {isNominal && (
          <div style={{ fontSize: '0.82rem', color: '#3b4d46' }}>
            <strong style={{ color: '#059669' }}>How it works:</strong> In a real plant, water plants have 5 layers. When an alarm rings, normal security tools have no idea which of the 5 layers failed. AquaShield uses the laws of physics to test all 5 layers and pinpoint the exact one in milliseconds.
          </div>
        )}

        {isAttackActive && (
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ color: '#e11d48', fontWeight: 800 }}>
              ⚠️ The Big Dilemma: An alarm is ringing! But where did it start?
            </div>
            <p style={{ color: 'var(--ink)', marginTop: '4px', lineHeight: '1.4' }}>
              Is the sensor lying? Is the network wire jammed? Did someone hack the computer? Or is the valve broken? Old security tools cannot answer this, so they panic and dump all the clean drinking water.
            </p>
          </div>
        )}

        {isLocalized && (
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ color: '#0891b2', fontWeight: 800 }}>
              🔍 AquaShield Solved It: Only {activeScenario.layerName} is broken!
            </div>
            <p style={{ color: 'var(--ink)', marginTop: '4px', lineHeight: '1.4' }}>
              <strong>Simple Reason:</strong> {activeScenario.plainMathProof}
            </p>
            <div style={{ marginTop: '6px', color: '#047857', fontSize: '0.78rem' }}>
              Notice how the other 4 layers are proven completely safe! We don't need to shut down the plant.
            </div>
          </div>
        )}

        {isResolved && (
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ color: '#059669', fontWeight: 800 }}>
              ✅ Self-Healing Complete: Clean Water Flowing!
            </div>
            <p style={{ color: 'var(--ink)', marginTop: '4px', lineHeight: '1.4' }}>
              {activeScenario.plainFix}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
