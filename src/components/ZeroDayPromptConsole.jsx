import React, { useState } from 'react';
import { Terminal, Send, Sparkles, ShieldAlert, Cpu, AlertTriangle, ShieldCheck, Flame, Zap } from 'lucide-react';
import { classifyCustomHackerPrompt } from '../engine/zeroDayClassifier';
import { sound } from '../utils/soundEffects';

const QUICK_ZERO_DAY_CHIPS = [
  { label: '🧪 Chlorine Chemical Overdose (Tank 3)', prompt: 'Inject 6.8 ppm chlorine chemical overdose into Tank 3 disinfectant' },
  { label: '⚡ Pump 1 Voltage Drop & Turbine Cavitation', prompt: 'Slashing electrical voltage to Pump 1 motor causing severe hydraulic cavitation' },
  { label: '🌐 Modbus TCP SYN-Flood Delay on Network Wire', prompt: 'Flooding Modbus TCP industrial bus with 50,000 delayed packets per second' },
  { label: '🌊 Tank 4 Reverse Back-Pressure Hydraulic Surge', prompt: 'Tank 4 municipal delivery line experiencing reverse back-pressure wave of 8.5 bar' },
  { label: '💾 Zero-Day PLC Firmware Logic Bomb', prompt: 'Deploying zero-day Stuxnet rootkit into PLC flash memory creating 120Hz hidden vibration' },
  { label: '🚰 Tank 1 Raw Water Intake Valve Silt Jam', prompt: 'Raw water intake valve jammed open at 100% spilling untreated muddy water' }
];

export default function ZeroDayPromptConsole({
  phase,
  activeScenario,
  onLaunchCustomAttack,
  onReset
}) {
  const [promptInput, setPromptInput] = useState('');
  const [lastCustomScenario, setLastCustomScenario] = useState(null);

  const isNominal = phase === 'NOMINAL';
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const text = promptInput.trim();
    if (!text) return;

    sound.playAlarm();
    const customScenario = classifyCustomHackerPrompt(text);
    setLastCustomScenario(customScenario);
    onLaunchCustomAttack(customScenario);
  };

  const handleChipClick = (prompt) => {
    setPromptInput(prompt);
    sound.playAlarm();
    const customScenario = classifyCustomHackerPrompt(prompt);
    setLastCustomScenario(customScenario);
    onLaunchCustomAttack(customScenario);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px 20px',
        margin: '0 0 16px 0',
        borderRadius: '14px',
        border: isAttackActive
          ? '1.5px solid #ff2a5f'
          : isLocalized
          ? '1.5px solid #00f2fe'
          : isResolved
          ? '1.5px solid #10b981'
          : '1px solid rgba(56, 189, 248, 0.35)',
        background: 'rgba(10, 16, 32, 0.92)',
        boxShadow: isAttackActive ? '0 0 25px rgba(255, 42, 95, 0.2)' : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 42, 95, 0.15)',
              border: '1px solid #ff2a5f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Terminal size={17} color="#ff2a5f" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-display" style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>
                HACKER ZERO-DAY PROMPT CONSOLE
              </span>
              <span className="badge badge-rose" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                JUDGE FREE-FORM ATTACK SIMULATOR
              </span>
            </div>
            <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: 0 }}>
              Judges can act as the hacker and test <strong>any out-of-the-box attack</strong> in natural language. AquaShield will parse the physical kinematics, derive the broken conservation equation, and self-heal in real-time.
            </p>
          </div>
        </div>

        {/* Live Status Indicator */}
        {isAttackActive && (
          <span className="badge badge-rose" style={{ animation: 'pulse-border 1s infinite alternate', fontSize: '0.72rem' }}>
            <AlertTriangle size={13} /> Zero-Day Attack Running
          </span>
        )}
        {isResolved && (
          <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
            <ShieldCheck size={13} /> Zero-Day Neutralized (0s Downtime)
          </span>
        )}
      </div>

      {/* Natural Language Prompt Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Type ANY custom zero-day hack (e.g. 'Inject chlorine overdose in tank 3' or 'Cut power to pump 1 while faking sensor')..."
            style={{
              width: '100%',
              padding: '11px 16px',
              background: 'rgba(3, 7, 18, 0.85)',
              border: '1.5px solid rgba(0, 242, 254, 0.35)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
              transition: 'border 0.2s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 242, 254, 0.35)')}
          />
        </div>

        <button
          type="submit"
          className="cta-pulse-button"
          style={{
            padding: '10px 22px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ff2a5f 0%, #a855f7 100%)',
            color: '#ffffff',
            border: '1px solid #ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '0.04em',
            flexShrink: 0
          }}
        >
          <Flame size={16} />
          <span>Launch Custom Attack</span>
        </button>
      </form>

      {/* Quick Judge Attack Preset Chips */}
      <div>
        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
          Or Click Quick Zero-Day Scenarios to Test AquaShield:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {QUICK_ZERO_DAY_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.prompt)}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '6px',
                padding: '5px 11px',
                fontSize: '0.72rem',
                color: '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00f2fe';
                e.currentTarget.style.background = 'rgba(0, 242, 254, 0.12)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE ZERO-DAY REAL-TIME DECOMPOSITION CARD */}
      {lastCustomScenario && (isAttackActive || isLocalized || isResolved) && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px 14px',
            borderRadius: '8px',
            background: isResolved ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 42, 95, 0.08)',
            border: isResolved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 42, 95, 0.3)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '10px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.67rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              DECIPHERED TARGET & LAYER
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f1f5f9', marginTop: '2px' }}>
              🎯 {lastCustomScenario.target} ({lastCustomScenario.layerName})
            </div>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '3px' }}>
              📊 Academic Validation: {lastCustomScenario.swatCorrelation}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.67rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              PHYSICAL LAW DERIVED BY AQUASHIELD
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.35 }}>
              ⚖️ {lastCustomScenario.plainMathProof}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.67rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              AUTONOMOUS HEALING DEPLOYED
            </div>
            <div style={{ fontSize: '0.74rem', color: isResolved ? '#34d399' : '#f59e0b', marginTop: '2px', lineHeight: 1.35 }}>
              🛡️ {lastCustomScenario.plainFix}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
