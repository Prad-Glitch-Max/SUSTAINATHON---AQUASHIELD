import React, { useState } from 'react';
import { Terminal, Send, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Flame, Sparkles } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');

  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  const triggerScrollToTanks = () => {
    setTimeout(() => {
      const el = document.getElementById('scada-facility-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const text = promptInput.trim();
    if (!text) return;

    sound.playAlarm();
    const customScenario = classifyCustomHackerPrompt(text);
    
    // 1. Collapse the dropdown
    setIsOpen(false);
    
    // 2. Launch the attack
    onLaunchCustomAttack(customScenario);
    
    // 3. Automatically scroll down smoothly to tank animation
    triggerScrollToTanks();
  };

  const handleChipClick = (prompt) => {
    setPromptInput(prompt);
    sound.playAlarm();
    const customScenario = classifyCustomHackerPrompt(prompt);
    
    // 1. Collapse dropdown
    setIsOpen(false);
    
    // 2. Launch
    onLaunchCustomAttack(customScenario);
    
    // 3. Smooth scroll
    triggerScrollToTanks();
  };

  return (
    <div style={{ margin: '0 0 14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Sleek Top-Centre Dropdown Toggle Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel"
        style={{
          padding: '9px 24px',
          borderRadius: '30px',
          border: isOpen ? '1.5px solid #00f2fe' : '1px solid rgba(56, 189, 248, 0.45)',
          background: isOpen ? 'rgba(0, 242, 254, 0.18)' : 'rgba(15, 23, 42, 0.9)',
          color: '#00f2fe',
          fontSize: '0.84rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: isOpen ? '0 0 20px rgba(0,242,254,0.4)' : '0 4px 15px rgba(0,0,0,0.3)',
          transition: 'all 0.25s ease',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.04em'
        }}
      >
        <Terminal size={15} color="#00f2fe" />
        <span>{isOpen ? 'Close Hacker Prompt Box' : '⚡ Enter Custom Hacker Attack Prompt'}</span>
        <div
          style={{
            background: 'rgba(0, 242, 254, 0.2)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '2px'
          }}
        >
          <ChevronDown
            size={14}
            color="#00f2fe"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease'
            }}
          />
        </div>
      </button>

      {/* Expandable Hacker Console Panel (Only appears when clicked) */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            marginTop: '10px',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1.5px solid rgba(0, 242, 254, 0.4)',
            background: 'rgba(8, 14, 28, 0.96)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.2)',
            width: '100%',
            maxWidth: '920px',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '3px 8px' }}>
                JUDGE FREE-FORM ATTACK INPUT
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Type <strong>any out-of-the-box cyber-physical attack</strong>. AquaShield will parse the kinematics, prove the broken physics, and auto-scroll to the live simulation.
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Type ANY custom attack (e.g. 'Inject chlorine overdose in tank 3' or 'Cut power to pump 1 while faking sensor')..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(3, 7, 18, 0.9)',
                  border: '1.5px solid rgba(0, 242, 254, 0.4)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)'
                }}
              />
            </div>

            <button
              type="submit"
              className="cta-pulse-button"
              style={{
                padding: '9px 20px',
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
              <Flame size={15} />
              <span>Launch & Watch SCADA Fix</span>
            </button>
          </form>

          {/* Quick Clickable Chips */}
          <div>
            <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Or click one of these common out-of-the-box scenarios:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_ZERO_DAY_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip.prompt)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00f2fe';
                    e.currentTarget.style.background = 'rgba(0, 242, 254, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
