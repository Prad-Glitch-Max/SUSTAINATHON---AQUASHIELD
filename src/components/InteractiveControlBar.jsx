import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Search,
  ShieldCheck,
  RotateCcw,
  Eye,
  Radio,
  Cpu,
  Binary,
  Cog,
  Zap,
  UserCheck,
  CheckCircle2,
  AlertOctagon,
  Activity,
  Sparkles,
  Timer,
  ShieldAlert
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

const SCENARIOS = [
  { key: 'SENSOR_SPOOF', label: '1. Fake Sensor', target: 'Water Sensor (Tank 2)', icon: Eye, color: '#00f2fe' },
  { key: 'NETWORK_REPLAY', label: '2. Network Cable', target: 'Cable Delay / Replay', icon: Radio, color: '#3b82f6' },
  { key: 'CONTROLLER_HIJACK', label: '3. Computer Brain', target: 'Hacked PLC Controller', icon: Cpu, color: '#a855f7' },
  { key: 'FIRMWARE_ROOTKIT', label: '4. Software Code', target: 'Corrupted Motor Firmware', icon: Binary, color: '#f59e0b' },
  { key: 'ACTUATOR_JAM', label: '5. Stuck Valve', target: 'Jammed Physical Valve', icon: Cog, color: '#ff2a5f' }
];

const STAGE_DETAILS = {
  SENSOR_SPOOF: {
    targetName: 'Tank 2 Water Level Sensor',
    layerName: 'Layer 1: Sensor Probe',
    step1: {
      badge: 'BREACH INJECTED',
      title: 'Hacker Injected False Sensor Reading on Tank 2',
      detail: 'A cyber attacker gained access to the telemetry wire and froze Tank 2’s sensor reading at 32%, even though the input pump is running at full power.',
      contrast: 'Old security tools panic! They assume Tank 2 is running bone dry, instruct pumps to flood the facility with excess water, and trigger a catastrophic overflow.'
    },
    step2: {
      badge: 'PHYSICS AUDIT IN PROGRESS',
      title: 'AquaShield AI Audits Fluid Mass Conservation',
      detail: 'AquaShield AI audits real-time conservation of mass: Water pumped in from Tank 1 = 45 L/s, water flowing out = 35 L/s (Net +10 L/s surplus).',
      contrast: 'By fundamental laws of physics, water level MUST rise when inflow exceeds outflow. The sensor claiming 32% violates physical laws—proving it is lying.'
    },
    step3: {
      badge: 'ROOT CAUSE PINPOINTED',
      title: 'Laser Scanner Locks onto Tank 2 Sensor',
      detail: 'Root-cause analysis mathematical proof complete: Only Layer 1 (Sensor) is compromised. The pipe valves, computer brain, firmware, and network cables are 100% healthy.',
      contrast: 'Traditional plants would have executed an emergency shutdown. AquaShield certifies that the other 3 tanks and 4 layers can continue operating safely.'
    },
    step4: {
      badge: 'AUTONOMOUS SELF-HEALING COMPLETE',
      title: 'AI Virtual Estimator Protects Clean Water',
      detail: 'AquaShield isolates the lying sensor and seamlessly generates accurate replacement telemetry using hydraulic pump physics equations.',
      contrast: 'Zero seconds downtime. 0 Liters of water wasted. Clean drinking water distribution continues with zero human intervention required.'
    }
  },
  NETWORK_REPLAY: {
    targetName: 'Communication Wire (Network Cable)',
    layerName: 'Layer 2: Network Transmission Wire',
    step1: {
      badge: 'BREACH INJECTED',
      title: 'Hacker Injected Latency Spikes on Network Cable',
      detail: 'A malicious man-in-the-middle attacker jammed the Ethernet switch, causing packet delays and replaying stale telemetry messages out of order.',
      contrast: 'Old legacy security systems conclude the plant communication is totally dead and initiate an emergency blackout, dumping 40,000 Liters of water.'
    },
    step2: {
      badge: 'TIMING AUDIT IN PROGRESS',
      title: 'AquaShield AI Cross-References Packet Timestamps',
      detail: 'AquaShield AI measures round-trip packet latency against physical tank pressure changes. Latency surged from 5ms to 1,450ms, but physical fluid dynamics remain stable.',
      contrast: 'Physical pumps, valves, and water tanks are operating perfectly. The disturbance is exclusively restricted to the communication wire.'
    },
    step3: {
      badge: 'ROOT CAUSE PINPOINTED',
      title: 'Pinpointed to Layer 2: Network Cable Delay',
      detail: 'AquaShield proves that all 4 water tanks, sensors, motors, and PLC controllers are physically intact. Only the primary network transmission channel is compromised.',
      contrast: 'Old tools would waste 4 hours troubleshooting every sensor. AquaShield isolates the network wire in under 6 seconds.'
    },
    step4: {
      badge: 'AUTONOMOUS SELF-HEALING COMPLETE',
      title: 'Automated Switch to Encrypted Backup Channel',
      detail: 'AquaShield automatically migrates all SCADA packet routing to the secondary wireless redundant link in 38 milliseconds.',
      contrast: '40,000 Liters of clean water saved from emergency drainage. Communication restored with 100% packet integrity.'
    }
  },
  CONTROLLER_HIJACK: {
    targetName: 'Main Control Computer (PLC Brain)',
    layerName: 'Layer 3: PLC Controller Brain',
    step1: {
      badge: 'BREACH INJECTED',
      title: 'Hacker Overwrote PLC Controller Setpoints',
      detail: 'An adversary breached the central PLC controller and commanded pipe pressure to surge to a dangerous 8.5 bar, threatening pipe rupture.',
      contrast: 'Legacy intrusion tools falsely blame the physical pumps for accelerating, completely blind to the fact that the computer brain issued the malicious order.'
    },
    step2: {
      badge: 'SAFETY INVARIANT AUDIT',
      title: 'AquaShield AI Evaluates Structural Safety Boundaries',
      detail: 'AquaShield evaluates the commanded pressure against certified facility tolerances (maximum safe threshold = 3.5 bar).',
      contrast: 'Hydraulic calculations indicate 8.5 bar will cause pipe seam fracturing within 15 seconds. The command breaks physical safety boundary #4.'
    },
    step3: {
      badge: 'ROOT CAUSE PINPOINTED',
      title: 'Pinpointed to Layer 3: Controller Brain Hijack',
      detail: 'AquaShield proves the mechanical pumps and sensors were truthful and only obeying orders. The brain itself was executing unauthorized code.',
      contrast: 'Traditional operators would replace functional pumps. AquaShield locks directly onto the hijacked controller memory thread.'
    },
    step4: {
      badge: 'AUTONOMOUS SELF-HEALING COMPLETE',
      title: 'Hardware Safety Interlock Clamps Pressure',
      detail: 'AquaShield engages an autonomous safety bypass interlock, clamping pressure back to a safe 3.2 bar and enforcing verified golden rules.',
      contrast: 'Pipe rupture completely prevented. Plant infrastructure protected from millions of dollars in physical damage with zero leaks.'
    }
  },
  FIRMWARE_ROOTKIT: {
    targetName: 'Motor Software Code (Firmware)',
    layerName: 'Layer 4: Motor Firmware Microcode',
    step1: {
      badge: 'BREACH INJECTED',
      title: 'Stealth Rootkit Injected into Motor Firmware',
      detail: 'A hacker flashed corrupted firmware onto Pump 2’s motor controller, creating severe 120Hz acoustic vibration while falsely reporting "Normal" on screen.',
      contrast: 'Old SCADA monitors trust whatever the software displays and ignore physical mechanical wear until the pump motor catches fire and burns out.'
    },
    step2: {
      badge: 'CRYPTOGRAPHIC AUDIT IN PROGRESS',
      title: 'AquaShield AI Computes Binary Hashes & Acoustic Signatures',
      detail: 'AquaShield AI cross-references physical acoustic vibration sensors with the running firmware binary checksum.',
      contrast: 'Physical vibration sensors report dangerous 4.8 mm/s oscillation, and the firmware memory hash does NOT match the certified clean build image.'
    },
    step3: {
      badge: 'ROOT CAUSE PINPOINTED',
      title: 'Pinpointed to Layer 4: Corrupted Firmware Hash',
      detail: 'Rootkit identified with signature mismatch (Hash: 0xDEADBEEF). The physical copper windings and mechanical shaft are undamaged—only the microcode is rogue.',
      contrast: 'Traditional investigation takes days of offline disassembly. AquaShield isolates the firmware corruption in real time.'
    },
    step4: {
      badge: 'AUTONOMOUS SELF-HEALING COMPLETE',
      title: 'Clean Golden Firmware Restored in 420ms',
      detail: 'AquaShield flashes the verified golden firmware image from secure read-only hardware storage in 420 milliseconds.',
      contrast: 'Motor vibration drops to a silky-smooth 0.2 mm/s. $18,000 industrial pump motor saved from destruction with zero process downtime.'
    }
  },
  ACTUATOR_JAM: {
    targetName: 'Physical Emergency Drain Valve',
    layerName: 'Layer 5: Physical Valve (Actuator)',
    step1: {
      badge: 'BREACH INJECTED',
      title: 'Physical Drain Valve Stuck Wide Open at 100%',
      detail: 'The emergency discharge valve mechanically jammed wide open, draining treated drinking water out of the facility manifold at 85 L/s.',
      contrast: 'Traditional tools assume the flow sensor is glitching or giving false alarms, allowing tens of thousands of liters of clean water to pour away.'
    },
    step2: {
      badge: 'ACTUATION AUDIT IN PROGRESS',
      title: 'AquaShield AI Compares Control Command vs Physical Discharge',
      detail: 'AquaShield examines the physical loop: Controller commanded 0% (VALVE CLOSED), yet downstream flowmeters detect 85 L/s continuous discharge.',
      contrast: 'The sensors and computer brain are confirmed 100% healthy. Water is physically discharging through an unresponsive mechanical valve.'
    },
    step3: {
      badge: 'ROOT CAUSE PINPOINTED',
      title: 'Pinpointed to Layer 5: Mechanical Valve Jam',
      detail: 'AquaShield isolates the failure to mechanical gate obstruction. Electronics, firmware, and telemetry channels are certified operational.',
      contrast: 'Traditional crews spend hours debugging software. AquaShield immediately identifies physical mechanical failure.'
    },
    step4: {
      badge: 'AUTONOMOUS SELF-HEALING COMPLETE',
      title: 'Automated Diverter Bypass Route Engaged',
      detail: 'AquaShield activates the motorized secondary diverter valve and closes upstream shutoff gate #2 in 580 milliseconds.',
      contrast: 'Leak stopped instantly! 60,000 Liters of purified drinking water saved from waste with zero plant downtime.'
    }
  }
};

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
  const [autoStage, setAutoStage] = useState(0); // 0: Idle, 1: Attack, 2: Physics Audit, 3: Localized, 4: Healed
  const [progressPercent, setProgressPercent] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  const timersRef = useRef([]);

  const isNominal = phase === 'NOMINAL';
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  // When manually resetting or changing scenario from outside, keep UI synchronized
  useEffect(() => {
    if (isNominal) {
      setAutoStage(0);
      setProgressPercent(0);
      setElapsedSec(0);
    }
  }, [isNominal]);

  // DRAMATIC, SLOWER 4-STAGE AUTONOMOUS TIMELINE (~9.5 SECONDS)
  const handleAutoPilotLaunch = () => {
    clearAllTimers();
    setAutoStage(1);
    setProgressPercent(25);
    setElapsedSec(0.0);

    // Stage 1 (T = 0s): Attack Injected + Alarm Sounds
    sound.playAlarm();
    onLaunchAttack(selectedScenarioKey);

    // Elapsed timer tick (updates every 100ms for smooth progress animation)
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedSec(Math.min(elapsed, 9.5));
    }, 100);
    timersRef.current.push(intervalId);

    // Stage 2 (T = 2.8s): AI Starts Physics & Mass Balance Audit
    const timerStage2 = setTimeout(() => {
      sound.playScan();
      setAutoStage(2);
      setProgressPercent(55);
    }, 2800);
    timersRef.current.push(timerStage2);

    // Stage 3 (T = 5.8s): Root Cause Pinpointed (Laser Locks on Layer)
    const timerStage3 = setTimeout(() => {
      sound.playScan();
      onLocalize();
      setAutoStage(3);
      setProgressPercent(80);
    }, 5800);
    timersRef.current.push(timerStage3);

    // Stage 4 (T = 8.5s): Autonomous Self-Healing Applied + Confetti
    const timerStage4 = setTimeout(() => {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#00f2fe', '#10b981', '#38bdf8', '#34d399']
        });
      } catch {
        // safe fallback
      }
      onDeployFix();
      setAutoStage(4);
      setProgressPercent(100);
      clearInterval(intervalId);
      setElapsedSec(9.5);
    }, 8500);
    timersRef.current.push(timerStage4);
  };

  const handleManualLaunch = () => {
    clearAllTimers();
    sound.playAlarm();
    setAutoStage(1);
    setProgressPercent(33);
    onLaunchAttack(selectedScenarioKey);
  };

  const handleManualLocalize = () => {
    sound.playScan();
    setAutoStage(3);
    setProgressPercent(66);
    onLocalize();
  };

  const handleManualFix = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#00f2fe', '#10b981', '#38bdf8']
      });
    } catch {
      // safe fallback
    }
    setAutoStage(4);
    setProgressPercent(100);
    onDeployFix();
  };

  const handleReset = () => {
    clearAllTimers();
    sound.playClick();
    setAutoStage(0);
    setProgressPercent(0);
    setElapsedSec(0);
    onReset();
  };

  const currentDetails = STAGE_DETAILS[selectedScenarioKey] || STAGE_DETAILS.SENSOR_SPOOF;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '22px 26px',
        margin: '0 16px 16px 16px',
        border: isAttackActive
          ? '1.5px solid #ff2a5f'
          : isLocalized
          ? '1.5px solid #00f2fe'
          : isResolved
          ? '1.5px solid #10b981'
          : '1px solid rgba(56,189,248,0.25)',
        boxShadow: isAttackActive
          ? '0 0 30px rgba(255,42,95,0.2)'
          : isResolved
          ? '0 0 30px rgba(16,185,129,0.15)'
          : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Top Header & Mode Selection */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.02em' }}>
              CYBER-PHYSICAL ATTACK & SELF-HEALING LAB
            </span>
            <span
              className="badge"
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 10px',
                background: isAutoPilot ? 'rgba(0,242,254,0.15)' : 'rgba(255,255,255,0.08)',
                color: isAutoPilot ? '#00f2fe' : '#94a3b8',
                border: isAutoPilot ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.15)'
              }}
            >
              {isAutoPilot ? '⚡ AUTONOMOUS AI (AUTOMATIC)' : '👆 MANUAL STEP-BY-STEP'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            Select an attack layer below, then trigger the demonstration to observe root-cause localization.
          </p>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(5, 10, 22, 0.85)', padding: '4px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => {
              clearAllTimers();
              setIsAutoPilot(true);
            }}
            style={{
              background: isAutoPilot ? '#00f2fe' : 'transparent',
              color: isAutoPilot ? '#050811' : '#94a3b8',
              border: 'none',
              borderRadius: '20px',
              padding: '7px 16px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={14} />
            <span>Autonomous AI (Automatic)</span>
          </button>

          <button
            onClick={() => {
              clearAllTimers();
              setIsAutoPilot(false);
            }}
            style={{
              background: !isAutoPilot ? '#00f2fe' : 'transparent',
              color: !isAutoPilot ? '#050811' : '#94a3b8',
              border: 'none',
              borderRadius: '20px',
              padding: '7px 16px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck size={14} />
            <span>Manual Step-by-Step</span>
          </button>
        </div>
      </div>

      {/* 5 Scenario Selector Cards */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Select Cyber Attack Scenario:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '8px' }}>
          {SCENARIOS.map((scn) => {
            const Icon = scn.icon;
            const isSelected = selectedScenarioKey === scn.key;
            return (
              <button
                key={scn.key}
                onClick={() => {
                  if (isNominal || isResolved) {
                    onSelectScenarioKey(scn.key);
                  }
                }}
                disabled={!isNominal && !isResolved}
                style={{
                  background: isSelected ? 'rgba(0, 242, 254, 0.22)' : 'rgba(15, 23, 42, 0.7)',
                  border: isSelected ? '2px solid #00f2fe' : '1px solid rgba(56, 189, 248, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  cursor: !isNominal && !isResolved ? 'not-allowed' : 'pointer',
                  opacity: !isNominal && !isResolved && !isSelected ? 0.4 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(0,242,254,0.3)' : 'none'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isSelected ? scn.color : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={18} color={isSelected ? '#050811' : scn.color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                    {scn.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>
                    {scn.target}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTION CONTROLS */}
      {isAutoPilot ? (
        /* AUTONOMOUS MODE: ONE BIG BEAUTIFUL BUTTON + RESET */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'center' }}>
          <button
            onClick={handleAutoPilotLaunch}
            disabled={!isNominal && !isResolved}
            style={{
              background: isNominal || isResolved ? 'linear-gradient(135deg, #00f2fe, #0284c7)' : 'rgba(30, 41, 59, 0.45)',
              border: isNominal || isResolved ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px 24px',
              color: isNominal || isResolved ? '#050811' : '#64748b',
              cursor: isNominal || isResolved ? 'pointer' : 'not-allowed',
              opacity: isNominal || isResolved ? 1 : 0.45,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '0.98rem',
              fontWeight: 900,
              boxShadow: isNominal || isResolved ? '0 0 24px rgba(0,242,254,0.45)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Zap size={22} />
            <span>Launch Cyber Attack & Watch AquaShield Fix It Automatically</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px',
              padding: '16px 22px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
          >
            <RotateCcw size={18} />
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
              padding: '14px 16px',
              color: '#ffffff',
              cursor: isNominal || isResolved ? 'pointer' : 'not-allowed',
              opacity: isNominal || isResolved ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 800
            }}
          >
            <Flame size={18} />
            <span>1. Launch Attack</span>
          </button>

          <button
            onClick={handleManualLocalize}
            disabled={!isAttackActive}
            style={{
              background: isAttackActive ? 'linear-gradient(135deg, #00f2fe, #0284c7)' : 'rgba(30, 41, 59, 0.4)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 16px',
              color: isAttackActive ? '#050811' : '#64748b',
              cursor: isAttackActive ? 'pointer' : 'not-allowed',
              opacity: isAttackActive ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              animation: isAttackActive ? 'pulse-border 1s infinite alternate' : 'none'
            }}
          >
            <Search size={18} />
            <span>2. Find Root Cause</span>
          </button>

          <button
            onClick={handleManualFix}
            disabled={!isLocalized}
            style={{
              background: isLocalized ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(30, 41, 59, 0.4)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 16px',
              color: '#ffffff',
              cursor: isLocalized ? 'pointer' : 'not-allowed',
              opacity: isLocalized ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              animation: isLocalized ? 'pulse-border 1s infinite alternate' : 'none'
            }}
          >
            <ShieldCheck size={18} />
            <span>3. Fix & Heal Plant</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '14px 16px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* 4-STAGE VISUAL TIMELINE STEPPER & PROGRESS BAR */}
      {(autoStage > 0 || isAttackActive || isLocalized || isResolved) && (
        <div style={{ marginTop: '20px' }}>
          {/* Stepper Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
            {/* Step 1 Pill */}
            <div
              style={{
                background: autoStage === 1 || isAttackActive
                  ? 'rgba(255, 42, 95, 0.18)'
                  : autoStage > 1 || isLocalized || isResolved
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(15, 23, 42, 0.5)',
                border: autoStage === 1 || isAttackActive
                  ? '1.5px solid #ff2a5f'
                  : autoStage > 1 || isLocalized || isResolved
                  ? '1px solid #10b981'
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: autoStage > 1 || isLocalized || isResolved ? '#10b981' : '#ff2a5f',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {autoStage > 1 || isLocalized || isResolved ? '✓' : '1'}
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: autoStage === 1 || isAttackActive ? '#ff2a5f' : '#ffffff' }}>
                  Breach Injected
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Alarm Sounding</div>
              </div>
            </div>

            {/* Step 2 Pill */}
            <div
              style={{
                background: autoStage === 2
                  ? 'rgba(0, 242, 254, 0.2)'
                  : autoStage > 2 || isLocalized || isResolved
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(15, 23, 42, 0.5)',
                border: autoStage === 2
                  ? '1.5px solid #00f2fe'
                  : autoStage > 2 || isLocalized || isResolved
                  ? '1px solid #10b981'
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: autoStage > 2 || isLocalized || isResolved ? '#10b981' : autoStage === 2 ? '#00f2fe' : 'rgba(255,255,255,0.1)',
                  color: autoStage === 2 ? '#050811' : '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {autoStage > 2 || isLocalized || isResolved ? '✓' : '2'}
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: autoStage === 2 ? '#00f2fe' : '#ffffff' }}>
                  Physics Audit
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Mass Conservation</div>
              </div>
            </div>

            {/* Step 3 Pill */}
            <div
              style={{
                background: autoStage === 3 || isLocalized
                  ? 'rgba(168, 85, 247, 0.2)'
                  : autoStage > 3 || isResolved
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(15, 23, 42, 0.5)',
                border: autoStage === 3 || isLocalized
                  ? '1.5px solid #a855f7'
                  : autoStage > 3 || isResolved
                  ? '1px solid #10b981'
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: autoStage > 3 || isResolved ? '#10b981' : autoStage === 3 || isLocalized ? '#a855f7' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {autoStage > 3 || isResolved ? '✓' : '3'}
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: autoStage === 3 || isLocalized ? '#c084fc' : '#ffffff' }}>
                  Root Cause Pinpointed
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Laser Lock on Layer</div>
              </div>
            </div>

            {/* Step 4 Pill */}
            <div
              style={{
                background: autoStage === 4 || isResolved
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(15, 23, 42, 0.5)',
                border: autoStage === 4 || isResolved
                  ? '1.5px solid #10b981'
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: autoStage === 4 || isResolved ? '#10b981' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {autoStage === 4 || isResolved ? '✓' : '4'}
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: autoStage === 4 || isResolved ? '#34d399' : '#ffffff' }}>
                  Self-Healed
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>0s Downtime</div>
              </div>
            </div>
          </div>

          {/* Animated Glowing Progress Bar */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', height: '10px', borderRadius: '5px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: autoStage === 4 || isResolved
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : autoStage === 3 || isLocalized
                  ? 'linear-gradient(90deg, #00f2fe, #a855f7)'
                  : autoStage === 2
                  ? 'linear-gradient(90deg, #ff2a5f, #00f2fe)'
                  : 'linear-gradient(90deg, #ff2a5f, #f59e0b)',
                transition: 'width 0.4s ease-out',
                boxShadow: '0 0 12px currentColor'
              }}
            />
          </div>

          {/* Timer Display */}
          {isAutoPilot && autoStage > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Timer size={13} color="#00f2fe" />
                <span>Sequence Time: <strong style={{ color: '#ffffff' }}>{elapsedSec.toFixed(1)}s</strong> / ~9.5s</span>
              </div>
              <div>
                {autoStage === 1 && <span style={{ color: '#ff2a5f', fontWeight: 700 }}>Injecting Breach & Sounding Alarms...</span>}
                {autoStage === 2 && <span style={{ color: '#00f2fe', fontWeight: 700 }}>AI Auditing Fluid Inflow vs Outflow...</span>}
                {autoStage === 3 && <span style={{ color: '#c084fc', fontWeight: 700 }}>Laser Locking onto Root Cause...</span>}
                {autoStage === 4 && <span style={{ color: '#34d399', fontWeight: 700 }}>Autonomous Self-Healing Active!</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAILED PLAIN-ENGLISH NARRATIVE CARD */}
      <div
        style={{
          marginTop: '16px',
          padding: '16px 20px',
          borderRadius: '10px',
          background: autoStage === 1 || isAttackActive
            ? 'rgba(255, 42, 95, 0.08)'
            : autoStage === 2
            ? 'rgba(0, 242, 254, 0.08)'
            : autoStage === 3 || isLocalized
            ? 'rgba(168, 85, 247, 0.08)'
            : autoStage === 4 || isResolved
            ? 'rgba(16, 185, 129, 0.08)'
            : 'rgba(0, 0, 0, 0.25)',
          border: autoStage === 1 || isAttackActive
            ? '1.5px solid rgba(255, 42, 95, 0.35)'
            : autoStage === 2
            ? '1.5px solid rgba(0, 242, 254, 0.35)'
            : autoStage === 3 || isLocalized
            ? '1.5px solid rgba(168, 85, 247, 0.35)'
            : autoStage === 4 || isResolved
            ? '1.5px solid rgba(16, 185, 129, 0.35)'
            : '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {isNominal && autoStage === 0 && (
          <div style={{ color: '#cbd5e1', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800, marginBottom: '4px' }}>
              <CheckCircle2 size={16} />
              <span>Plant Operating Normally</span>
            </div>
            Clean drinking water is currently circulating through all 4 treatment tanks. Click the big cyan button above to watch AquaShield handle an attack automatically.
          </div>
        )}

        {(autoStage === 1 || (isAttackActive && autoStage === 0)) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-rose" style={{ fontSize: '0.72rem', padding: '3px 10px', fontWeight: 800 }}>
                {currentDetails.step1.badge}
              </span>
              <strong style={{ color: '#ffffff', fontSize: '0.92rem' }}>
                {currentDetails.step1.title}
              </strong>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.84rem', lineHeight: '1.45', margin: '4px 0' }}>
              {currentDetails.step1.detail}
            </p>
            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(255, 42, 95, 0.12)', borderRadius: '6px', fontSize: '0.78rem', color: '#fda4af' }}>
              <strong style={{ color: '#ff2a5f' }}>⚠️ The Danger with Old Tools: </strong>
              {currentDetails.step1.contrast}
            </div>
          </div>
        )}

        {autoStage === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '3px 10px', fontWeight: 800 }}>
                {currentDetails.step2.badge}
              </span>
              <strong style={{ color: '#ffffff', fontSize: '0.92rem' }}>
                {currentDetails.step2.title}
              </strong>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.84rem', lineHeight: '1.45', margin: '4px 0' }}>
              {currentDetails.step2.detail}
            </p>
            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '6px', fontSize: '0.78rem', color: '#7dd3fc' }}>
              <strong style={{ color: '#00f2fe' }}>🧠 Physical Math Proof: </strong>
              {currentDetails.step2.contrast}
            </div>
          </div>
        )}

        {(autoStage === 3 || (isLocalized && autoStage === 0)) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc', border: '1px solid #a855f7', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 800 }}>
                {currentDetails.step3.badge}
              </span>
              <strong style={{ color: '#ffffff', fontSize: '0.92rem' }}>
                {currentDetails.step3.title}
              </strong>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.84rem', lineHeight: '1.45', margin: '4px 0' }}>
              {currentDetails.step3.detail}
            </p>
            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.12)', borderRadius: '6px', fontSize: '0.78rem', color: '#e9d5ff' }}>
              <strong style={{ color: '#c084fc' }}>🎯 Precision Localization: </strong>
              {currentDetails.step3.contrast}
            </div>
          </div>
        )}

        {(autoStage === 4 || (isResolved && autoStage === 0)) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '3px 10px', fontWeight: 800 }}>
                {currentDetails.step4.badge}
              </span>
              <strong style={{ color: '#ffffff', fontSize: '0.92rem' }}>
                {currentDetails.step4.title}
              </strong>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.84rem', lineHeight: '1.45', margin: '4px 0' }}>
              {currentDetails.step4.detail}
            </p>
            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '6px', fontSize: '0.78rem', color: '#a7f3d0' }}>
              <strong style={{ color: '#10b981' }}>🛡️ Zero Downtime Self-Healing: </strong>
              {currentDetails.step4.contrast}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
