import React from 'react';
import { Eye, Radio, Cpu, Binary, Cog, ShieldCheck, Flame, RefreshCw } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function ChaosConsole({ activeScenario, onSelectScenario }) {
  const handleAttackClick = (key) => {
    sound.playAlarm();
    onSelectScenario(key);
  };

  const handleRestoreClick = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0891b2', '#059669', '#0e7490']
      });
    } catch {
      // safe fallback
    }
    onSelectScenario('NONE');
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', margin: '0 16px 14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(225, 29, 72, 0.15)',
            border: '1px solid #e11d48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={18} color="#e11d48" />
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: '0.95rem', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              CHAOS INJECTION STUDIO (JUDGE TESTING DOCK)
            </h2>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Select a cyber-physical attack vector below to test real-time localization
            </p>
          </div>
        </div>

        {/* Restore Button */}
        <button
          onClick={handleRestoreClick}
          className="glass-panel"
          style={{
            cursor: 'pointer',
            padding: '8px 18px',
            background: activeScenario.id === 'NONE' ? 'rgba(5, 150, 105, 0.2)' : 'var(--frost)',
            border: activeScenario.id === 'NONE' ? '1px solid #059669' : '1px solid rgba(14, 116, 144, 0.3)',
            borderRadius: '8px',
            color: '#047857',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}
        >
          <ShieldCheck size={16} color="#059669" />
          <span>Restore Nominal Baseline</span>
        </button>
      </div>

      {/* 5 Attack Trigger Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        {/* L1: SENSOR */}
        <button
          onClick={() => handleAttackClick('SENSOR_SPOOF')}
          style={{
            background: activeScenario.id === 'SENSOR_SPOOF' ? 'rgba(8, 145, 178, 0.25)' : 'var(--frost)',
            border: activeScenario.id === 'SENSOR_SPOOF' ? '2px solid #0891b2' : '1px solid rgba(8, 145, 178, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'SENSOR_SPOOF' ? '0 0 16px rgba(8, 145, 178, 0.14)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Eye size={18} color="#0891b2" />
            <span style={{ fontSize: '0.62rem', color: '#0891b2', background: 'rgba(8, 145, 178, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 1
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
            Sensor Spoofing
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5a6b65', marginTop: '3px' }}>
            Freeze TNK-102 Level at 32%
          </div>
        </button>

        {/* L2: NETWORK */}
        <button
          onClick={() => handleAttackClick('NETWORK_REPLAY')}
          style={{
            background: activeScenario.id === 'NETWORK_REPLAY' ? 'rgba(37, 99, 235, 0.25)' : 'var(--frost)',
            border: activeScenario.id === 'NETWORK_REPLAY' ? '2px solid #2563eb' : '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'NETWORK_REPLAY' ? '0 0 16px rgba(37, 99, 235, 0.14)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Radio size={18} color="#2563eb" />
            <span style={{ fontSize: '0.62rem', color: '#2563eb', background: 'rgba(37, 99, 235, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 2
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
            Modbus Replay Attack
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5a6b65', marginTop: '3px' }}>
            Stale Telemetry & 385ms Jitter
          </div>
        </button>

        {/* L3: CONTROLLER */}
        <button
          onClick={() => handleAttackClick('CONTROLLER_HIJACK')}
          style={{
            background: activeScenario.id === 'CONTROLLER_HIJACK' ? 'rgba(139, 92, 246, 0.25)' : 'var(--frost)',
            border: activeScenario.id === 'CONTROLLER_HIJACK' ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'CONTROLLER_HIJACK' ? '0 0 16px rgba(139, 92, 246, 0.14)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Cpu size={18} color="#8b5cf6" />
            <span style={{ fontSize: '0.62rem', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 3
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
            PLC Setpoint Hijack
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5a6b65', marginTop: '3px' }}>
            Pressure Override to 8.5 bar
          </div>
        </button>

        {/* L4: FIRMWARE */}
        <button
          onClick={() => handleAttackClick('FIRMWARE_ROOTKIT')}
          style={{
            background: activeScenario.id === 'FIRMWARE_ROOTKIT' ? 'rgba(217, 119, 6, 0.25)' : 'var(--frost)',
            border: activeScenario.id === 'FIRMWARE_ROOTKIT' ? '2px solid #d97706' : '1px solid rgba(217, 119, 6, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'FIRMWARE_ROOTKIT' ? '0 0 16px rgba(217, 119, 6, 0.14)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Binary size={18} color="#d97706" />
            <span style={{ fontSize: '0.62rem', color: '#d97706', background: 'rgba(217, 119, 6, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 4
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
            Firmware Stuxnet Rootkit
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5a6b65', marginTop: '3px' }}>
            Corrupt Microcode Hash
          </div>
        </button>

        {/* L5: ACTUATOR */}
        <button
          onClick={() => handleAttackClick('ACTUATOR_JAM')}
          style={{
            background: activeScenario.id === 'ACTUATOR_JAM' ? 'rgba(225, 29, 72, 0.25)' : 'var(--frost)',
            border: activeScenario.id === 'ACTUATOR_JAM' ? '2px solid #e11d48' : '1px solid rgba(225, 29, 72, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'ACTUATOR_JAM' ? '0 0 16px rgba(225, 29, 72, 0.14)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Cog size={18} color="#e11d48" />
            <span style={{ fontSize: '0.62rem', color: '#e11d48', background: 'rgba(225, 29, 72, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 5
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
            Actuator Valve Jam
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5a6b65', marginTop: '3px' }}>
            Solenoid Stuck Open at 100%
          </div>
        </button>
      </div>
    </div>
  );
}
