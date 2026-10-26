import React, { useState } from 'react';
import { Flame, Search, ShieldCheck, RotateCcw, ArrowRight, Eye, Radio, Cpu, Binary, Cog, Zap, UserCheck } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

const SCENARIOS = [
  { key: 'SENSOR_SPOOF', label: '1. Fake Sensor', target: 'Water Sensor', icon: Eye, color: '#00f2fe' },
  { key: 'NETWORK_REPLAY', label: '2. Network Cable', target: 'Cable Delay', icon: Radio, color: '#3b82f6' },
  { key: 'CONTROLLER_HIJACK', label: '3. Computer Brain', target: 'Hacked Computer', icon: Cpu, color: '#a855f7' },
  { key: 'FIRMWARE_ROOTKIT', label: '4. Software Code', target: 'Corrupted Code', icon: Binary, color: '#f59e0b' },
  { key: 'ACTUATOR_JAM', label: '5. Stuck Valve', target: 'Jammed Pipe Valve', icon: Cog, color: '#ff2a5f' }
];

export default function InteractiveControlBar({
  phase,
  activeScenario,
  selectedScenarioKey,
  onSelectScenarioKey,
  onLaunchAttack,
  onLocalize,
  onDeployFix,
  onReset
}) {
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [autoProgress, setAutoProgress] = useState('');

  const isNominal = phase === 'NOMINAL';
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  // AUTONOMOUS 1-CLICK FLOW: System does everything automatically!
  const handleAutoPilotLaunch = () => {
    sound.playAlarm();
    onLaunchAttack(selectedScenarioKey);
    setAutoProgress('Alarm ringing! AquaShield AI is analyzing all 5 layers...');

    // Automatically localize after 1.5 seconds
    setTimeout(() => {
      sound.playScan();
      onLocalize();
      setAutoProgress('Root cause found! Applying automatic self-healing fix...');

      // Automatically self-heal after another 1.8 seconds
      setTimeout(() => {
        sound.playSuccess();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#00f2fe', '#10b981', '#38bdf8']
          });
        } catch {
          // safe fallback
        }
        onDeployFix();
        setAutoProgress('Plant completely protected with zero human intervention required!');
      }, 1800);
    }, 1500);
  };

  const handleManualLaunch = () => {
    sound.playAlarm();
    onLaunchAttack(selectedScenarioKey);
  };

  const handleManualLocalize = () => {
    sound.playScan();
    onLocalize();
  };

  const handleManualFix = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#00f2fe', '#10b981', '#38bdf8']
      });
    } catch {
      // safe fallback
    }
    onDeployFix();
  };

  const handleReset = () => {
    sound.playClick();
    setAutoProgress('');
    onReset();
  };

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', margin: '0 16px 16px 16px', border: isAttackActive ? '1px solid #ff2a5f' : '1px solid rgba(56,189,248,0.25)' }}>
      {/* Top Bar: Title & Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9' }}>
              DEMO CONTROL PANEL
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
              {isAutoPilot ? '⚡ AUTONOMOUS AI ACTIVE' : '👆 STEP-BY-STEP MODE'}
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Pick a cyber attack below, then click the launch button.
          </p>
        </div>

        {/* Mode Toggle: Auto-Pilot vs Manual */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(5, 10, 22, 0.8)', padding: '4px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setIsAutoPilot(true)}
            style={{
              background: isAutoPilot ? '#00f2fe' : 'transparent',
              color: isAutoPilot ? '#050811' : '#94a3b8',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={13} />
            <span>Autonomous AI (Automatic)</span>
          </button>

          <button
            onClick={() => setIsAutoPilot(false)}
            style={{
              background: !isAutoPilot ? '#00f2fe' : 'transparent',
              color: !isAutoPilot ? '#050811' : '#94a3b8',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck size={13} />
            <span>Manual Step-by-Step</span>
          </button>
        </div>
      </div>

      {/* Attack Layer Selector Chips */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select What the Hacker Attacks:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          {SCENARIOS.map((scn) => {
            const Icon = scn.icon;
            const isSelected = selectedScenarioKey === scn.key;
            return (
              <button
                key={scn.key}
                onClick={() => onSelectScenarioKey(scn.key)}
                disabled={!isNominal && !isResolved}
                style={{
                  background: isSelected ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.65)',
                  border: isSelected ? '2px solid #00f2fe' : '1px solid rgba(56, 189, 248, 0.15)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  cursor: (!isNominal && !isResolved) ? 'not-allowed' : 'pointer',
                  opacity: (!isNominal && !isResolved && !isSelected) ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 12px rgba(0,242,254,0.25)' : 'none'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: isSelected ? scn.color : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={16} color={isSelected ? '#050811' : scn.color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {scn.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    {scn.target}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTION BUTTONS (Autonomous vs Manual) */}
      {isAutoPilot ? (
        /* AUTONOMOUS MODE: ONE BIG BEAUTIFUL BUTTON */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleAutoPilotLaunch}
            disabled={!isNominal && !isResolved}
            style={{
              background: isNominal || isResolved ? 'linear-gradient(135deg, #00f2fe, #0284c7)' : 'rgba(30, 41, 59, 0.4)',
              border: isNominal || isResolved ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '14px 20px',
              color: isNominal || isResolved ? '#050811' : '#64748b',
              cursor: isNominal || isResolved ? 'pointer' : 'not-allowed',
              opacity: isNominal || isResolved ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '0.92rem',
              fontWeight: 800,
              boxShadow: isNominal || isResolved ? '0 0 20px rgba(0,242,254,0.45)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={20} />
            <span>Launch Cyber Attack & Watch AquaShield Fix It Automatically</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '14px 18px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <RotateCcw size={16} />
            <span>Reset Plant</span>
          </button>
        </div>
      ) : (
        /* MANUAL 3-STEP MODE */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.3fr 0.8fr', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleManualLaunch}
            disabled={!isNominal && !isResolved}
            style={{
              background: isNominal || isResolved ? 'linear-gradient(135deg, #ff2a5f, #b91c1c)' : 'rgba(30, 41, 59, 0.4)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#ffffff',
              cursor: isNominal || isResolved ? 'pointer' : 'not-allowed',
              opacity: isNominal || isResolved ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <Flame size={16} />
            <span>1. Launch Attack</span>
          </button>

          <button
            onClick={handleManualLocalize}
            disabled={!isAttackActive}
            style={{
              background: isAttackActive ? 'linear-gradient(135deg, #00f2fe, #0284c7)' : 'rgba(30, 41, 59, 0.4)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 14px',
              color: isAttackActive ? '#050811' : '#64748b',
              cursor: isAttackActive ? 'pointer' : 'not-allowed',
              opacity: isAttackActive ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              animation: isAttackActive ? 'pulse-border 1s infinite alternate' : 'none'
            }}
          >
            <Search size={16} />
            <span>2. Find Root Cause</span>
          </button>

          <button
            onClick={handleManualFix}
            disabled={!isLocalized}
            style={{
              background: isLocalized ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(30, 41, 59, 0.4)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#ffffff',
              cursor: isLocalized ? 'pointer' : 'not-allowed',
              opacity: isLocalized ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              animation: isLocalized ? 'pulse-border 1s infinite alternate' : 'none'
            }}
          >
            <ShieldCheck size={16} />
            <span>3. Fix & Heal Plant</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '12px 12px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* PLAIN ENGLISH NARRATIVE EXPLANATION (NO SMART JARGON!) */}
      <div style={{
        marginTop: '14px',
        padding: '12px 16px',
        borderRadius: '8px',
        background: isAttackActive 
          ? 'rgba(255,42,95,0.1)' 
          : isLocalized 
          ? 'rgba(0,242,254,0.08)' 
          : isResolved 
          ? 'rgba(16,185,129,0.1)' 
          : 'rgba(0,0,0,0.25)',
        border: isAttackActive 
          ? '1px solid rgba(255,42,95,0.3)' 
          : isLocalized 
          ? '1px solid rgba(0,242,254,0.3)' 
          : isResolved 
          ? '1px solid rgba(16,185,129,0.3)' 
          : '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.85rem'
      }}>
        {isNominal && (
          <div style={{ color: '#cbd5e1' }}>
            <strong style={{ color: '#10b981' }}>All Good:</strong> Clean drinking water is flowing normally. Click the big blue button above to test a cyber attack!
          </div>
        )}

        {isAttackActive && (
          <div style={{ color: '#fecdd3' }}>
            <strong style={{ color: '#ff2a5f' }}>⚠️ What Happened:</strong> {activeScenario.symptom}
            <div style={{ marginTop: '4px', color: '#fda4af', fontSize: '0.78rem' }}>
              <strong>The Problem:</strong> {activeScenario.traditionalMistake}
            </div>
          </div>
        )}

        {isLocalized && (
          <div style={{ color: '#e0f2fe' }}>
            <strong style={{ color: '#00f2fe' }}>🔍 How AquaShield Found the Problem:</strong> {activeScenario.plainMathProof}
            <div style={{ marginTop: '4px', color: '#38bdf8', fontSize: '0.78rem' }}>
              Only <strong>{activeScenario.layerName}</strong> is broken. The other 4 layers are completely safe!
            </div>
          </div>
        )}

        {isResolved && (
          <div style={{ color: '#d1fae5' }}>
            <strong style={{ color: '#10b981' }}>✅ How We Fixed It:</strong> {activeScenario.plainFix}
          </div>
        )}
      </div>
    </div>
  );
}
