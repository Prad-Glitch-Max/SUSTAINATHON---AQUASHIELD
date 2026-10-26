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
        colors: ['#00f2fe', '#10b981', '#38bdf8']
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
            background: 'rgba(255, 42, 95, 0.15)',
            border: '1px solid #ff2a5f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={18} color="#ff2a5f" />
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: '0.95rem', letterSpacing: '0.05em', color: '#f1f5f9' }}>
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
            background: activeScenario.id === 'NONE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.9)',
            border: activeScenario.id === 'NONE' ? '1px solid #10b981' : '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}
        >
          <ShieldCheck size={16} color="#10b981" />
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
            background: activeScenario.id === 'SENSOR_SPOOF' ? 'rgba(0, 242, 254, 0.25)' : 'rgba(15, 23, 42, 0.7)',
            border: activeScenario.id === 'SENSOR_SPOOF' ? '2px solid #00f2fe' : '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'SENSOR_SPOOF' ? '0 0 16px rgba(0,242,254,0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Eye size={18} color="#00f2fe" />
            <span style={{ fontSize: '0.62rem', color: '#00f2fe', background: 'rgba(0,242,254,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 1
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
            Sensor Spoofing
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
            Freeze TNK-102 Level at 32%
          </div>
        </button>

        {/* L2: NETWORK */}
        <button
          onClick={() => handleAttackClick('NETWORK_REPLAY')}
          style={{
            background: activeScenario.id === 'NETWORK_REPLAY' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.7)',
            border: activeScenario.id === 'NETWORK_REPLAY' ? '2px solid #3b82f6' : '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'NETWORK_REPLAY' ? '0 0 16px rgba(59,130,246,0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Radio size={18} color="#3b82f6" />
            <span style={{ fontSize: '0.62rem', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 2
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
            Modbus Replay Attack
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
            Stale Telemetry & 385ms Jitter
          </div>
        </button>

        {/* L3: CONTROLLER */}
        <button
          onClick={() => handleAttackClick('CONTROLLER_HIJACK')}
          style={{
            background: activeScenario.id === 'CONTROLLER_HIJACK' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(15, 23, 42, 0.7)',
            border: activeScenario.id === 'CONTROLLER_HIJACK' ? '2px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'CONTROLLER_HIJACK' ? '0 0 16px rgba(168,85,247,0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Cpu size={18} color="#a855f7" />
            <span style={{ fontSize: '0.62rem', color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 3
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
            PLC Setpoint Hijack
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
            Pressure Override to 8.5 bar
          </div>
        </button>

        {/* L4: FIRMWARE */}
        <button
          onClick={() => handleAttackClick('FIRMWARE_ROOTKIT')}
          style={{
            background: activeScenario.id === 'FIRMWARE_ROOTKIT' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(15, 23, 42, 0.7)',
            border: activeScenario.id === 'FIRMWARE_ROOTKIT' ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'FIRMWARE_ROOTKIT' ? '0 0 16px rgba(245,158,11,0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Binary size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.62rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 4
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
            Firmware Stuxnet Rootkit
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
            Corrupt Microcode Hash
          </div>
        </button>

        {/* L5: ACTUATOR */}
        <button
          onClick={() => handleAttackClick('ACTUATOR_JAM')}
          style={{
            background: activeScenario.id === 'ACTUATOR_JAM' ? 'rgba(255, 42, 95, 0.25)' : 'rgba(15, 23, 42, 0.7)',
            border: activeScenario.id === 'ACTUATOR_JAM' ? '2px solid #ff2a5f' : '1px solid rgba(255, 42, 95, 0.25)',
            borderRadius: '10px',
            padding: '14px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: activeScenario.id === 'ACTUATOR_JAM' ? '0 0 16px rgba(255,42,95,0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Cog size={18} color="#ff2a5f" />
            <span style={{ fontSize: '0.62rem', color: '#ff2a5f', background: 'rgba(255,42,95,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              LAYER 5
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
            Actuator Valve Jam
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
            Solenoid Stuck Open at 100%
          </div>
        </button>
      </div>
    </div>
  );
}
