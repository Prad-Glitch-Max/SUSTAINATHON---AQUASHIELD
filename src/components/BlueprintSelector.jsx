import React from 'react';
import { Layers, Check, Sliders, Cpu, GitFork, Activity } from 'lucide-react';
import { BLUEPRINT_PRESETS } from '../engine/blueprints';

export default function BlueprintSelector({
  activeBlueprintId,
  onSelectBlueprint,
  phase
}) {
  const blueprints = Object.values(BLUEPRINT_PRESETS);
  const activeBlueprint = BLUEPRINT_PRESETS[activeBlueprintId] || BLUEPRINT_PRESETS.BLUEPRINT_4_CASCADE;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px 20px',
        marginBottom: '14px',
        borderRadius: '12px',
        background: 'rgba(11, 19, 38, 0.85)',
        border: '1px solid rgba(56, 189, 248, 0.22)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Layers size={18} color="#00f2fe" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="font-display" style={{ fontSize: '0.98rem', color: '#f8fafc', fontWeight: 900, letterSpacing: '0.03em' }}>
                FACILITY BLUEPRINT & TOPOLOGY STUDIO
              </h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.66rem', padding: '1px 8px' }}>
                REVIEW 2 ENHANCEMENT
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Test how AquaShield's mass-conservation equations & physics models dynamically adapt to different tank layouts
            </p>
          </div>
        </div>

        {/* Dynamic Topology Invariant Metric Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem'
          }}>
            <Activity size={13} color="#00f2fe" />
            <span style={{ color: '#94a3b8' }}>Dynamic Nodes:</span>
            <strong style={{ color: '#00f2fe' }}>{activeBlueprint.tankCount} Tanks + {activeBlueprint.actuators?.length || 2} Actuators</strong>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem'
          }}>
            <Check size={13} color="#34d399" />
            <span style={{ color: '#a7f3d0' }}>Adaptive Physics:</span>
            <strong style={{ color: '#10b981' }}>Synchronized</strong>
          </div>
        </div>
      </div>

      {/* Blueprint Preset Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '10px'
      }}>
        {blueprints.map((bp) => {
          const isSelected = bp.id === activeBlueprintId;

          return (
            <button
              key={bp.id}
              onClick={() => onSelectBlueprint(bp.id)}
              disabled={phase === 'ATTACK_ACTIVE' || phase === 'LOCALIZED'}
              className="glass-panel"
              style={{
                padding: '12px 14px',
                textAlign: 'left',
                cursor: phase === 'ATTACK_ACTIVE' || phase === 'LOCALIZED' ? 'not-allowed' : 'pointer',
                borderRadius: '10px',
                background: isSelected
                  ? 'rgba(0, 242, 254, 0.16)'
                  : 'rgba(15, 23, 42, 0.65)',
                border: isSelected
                  ? '1.5px solid #00f2fe'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected
                  ? '0 0 20px rgba(0, 242, 254, 0.25)'
                  : 'none',
                opacity: phase === 'ATTACK_ACTIVE' || phase === 'LOCALIZED' ? 0.6 : 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 900,
                    color: isSelected ? '#00f2fe' : '#e2e8f0'
                  }}
                >
                  {bp.shortName}
                </span>
                <span
                  className={isSelected ? 'badge badge-cyan' : 'badge'}
                  style={{
                    fontSize: '0.64rem',
                    padding: '1px 6px',
                    background: isSelected ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255,255,255,0.06)',
                    color: isSelected ? '#38bdf8' : '#94a3b8'
                  }}
                >
                  {bp.tankCount} Tanks
                </span>
              </div>

              <div style={{ fontSize: '0.72rem', color: isSelected ? '#cbd5e1' : '#94a3b8', lineHeight: 1.35 }}>
                {bp.description}
              </div>

              <div style={{
                fontSize: '0.67rem',
                color: isSelected ? '#38bdf8' : '#64748b',
                fontWeight: 700,
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <GitFork size={12} />
                <span>{bp.type}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Math Proof & Invariant Preview for Active Blueprint */}
      <div style={{
        marginTop: '12px',
        padding: '8px 14px',
        borderRadius: '8px',
        background: 'rgba(5, 10, 24, 0.6)',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
          <strong style={{ color: '#38bdf8' }}>Active Flow Graph: </strong>
          <span>{activeBlueprint.topologySummary}</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'monospace' }}>
          {activeBlueprint.mathInvariants ? activeBlueprint.mathInvariants[0] : '∑ dVi/dt = Qin - Qout'}
        </div>
      </div>
    </div>
  );
}
