import React from 'react';
import { Activity, AlertOctagon, CheckCircle2, ShieldCheck, Gauge, Droplets, Waves, ShieldAlert } from 'lucide-react';

export default function DigitalTwinSCADA({ state }) {
  const { tanks, sensors, activeScenario, phase } = state;
  const targetLayer = activeScenario.layer;

  const isNominal = phase === 'NOMINAL';
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  // Tank levels in %
  const t1 = Math.round(tanks.tank1.level);
  const t2 = Math.round(tanks.tank2.level);
  const t3 = Math.round(tanks.tank3.level);
  const t4 = Math.round(tanks.tank4.level);

  const isPipeCompromised = (isAttackActive || isLocalized) && (targetLayer === 'COMMUNICATION_CHANNEL' || targetLayer === 'ACTUATOR');

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        position: 'relative',
        border: isAttackActive
          ? '1.5px solid #ff2a5f'
          : isLocalized
          ? '1.5px solid #00f2fe'
          : isResolved
          ? '1.5px solid #10b981'
          : '1px solid rgba(56,189,248,0.25)',
        boxShadow: isAttackActive
          ? '0 0 25px rgba(255,42,95,0.15)'
          : isResolved
          ? '0 0 25px rgba(16,185,129,0.12)'
          : 'none'
      }}
    >
      {/* Schematic Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(0,242,254,0.12)',
              border: '1px solid rgba(0,242,254,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Activity size={20} color="#00f2fe" />
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.15rem', letterSpacing: '0.04em', color: '#f8fafc', fontWeight: 900 }}>
              CLEAN WATER RECYCLING FACILITY (DIGITAL TWIN SCADA)
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time fluid mechanics simulation across 4 continuous water treatment tanks
            </p>
          </div>
        </div>

        {/* Global Status Pill */}
        {isNominal && (
          <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <CheckCircle2 size={15} /> All 4 Tanks Running Clean
          </span>
        )}

        {isAttackActive && (
          <span className="badge badge-rose" style={{ animation: 'pulse-border 1s infinite alternate', fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <AlertOctagon size={15} /> Alarm Sounding! (Root Cause Unknown)
          </span>
        )}

        {isLocalized && (
          <span className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <ShieldAlert size={15} /> Root Cause Pinpointed: {activeScenario.target}
          </span>
        )}

        {isResolved && (
          <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <CheckCircle2 size={15} /> Fixed! Clean Water Protected (0 Downtime)
          </span>
        )}
      </div>

      {/* SVG Canvas for SCADA Facility with Dedicated Non-Overlapping Coordinate Zones */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          background: 'rgba(5, 10, 22, 0.92)',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7)',
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 960 380" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="waterGradT1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="waterGradT2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} stopOpacity="0.85" />
              <stop offset="100%" stopColor={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#99002b' : '#0369a1'} stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="waterGradT3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="waterGradT4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2a5f" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#ff2a5f" stopOpacity="1" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Background Technical Grid lines */}
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
            <line x1="0" y1="95" x2="960" y2="95" />
            <line x1="0" y1="175" x2="960" y2="175" />
            <line x1="0" y1="260" x2="960" y2="260" />
            <line x1="240" y1="0" x2="240" y2="380" />
            <line x1="480" y1="0" x2="480" y2="380" />
            <line x1="720" y1="0" x2="720" y2="380" />
          </g>

          {/* ================= ZONE 1: TOP NETWORK WIRE (y = 10 to 36) ================= */}
          <g>
            <rect
              x="40"
              y="10"
              width="880"
              height="26"
              rx="6"
              fill="rgba(15, 23, 42, 0.95)"
              stroke={(isAttackActive || isLocalized) && targetLayer === 'COMMUNICATION_CHANNEL' ? '#ff2a5f' : 'rgba(56, 189, 248, 0.35)'}
              strokeWidth={(isAttackActive || isLocalized) && targetLayer === 'COMMUNICATION_CHANNEL' ? '2.5' : '1'}
            />
            <text x="56" y="27" fill="#38bdf8" fontSize="10.5" fontWeight="800" fontFamily="var(--font-mono)">
              🌐 SCADA INDUSTRIAL NETWORK WIRE (COMMUNICATION BUS)
            </text>
            <text
              x="905"
              y="27"
              fill={isAttackActive ? '#ff2a5f' : isLocalized ? '#00f2fe' : '#10b981'}
              fontSize="10"
              fontWeight="800"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              {(isAttackActive || isLocalized) && targetLayer === 'COMMUNICATION_CHANNEL'
                ? '⚠️ CABLE DELAY DETECTED'
                : isAttackActive
                ? 'ALARM: UNKNOWN ROOT CAUSE'
                : isLocalized
                ? 'BREACH PINPOINTED'
                : 'STATUS: NORMAL WIRE TELEMETRY'}
            </text>
          </g>

          {/* ================= ZONE 2: TANK HEADER LABELS (y = 48 to 76) ================= */}
          {/* TANK 1 HEADER */}
          <g>
            <rect x="70" y="48" width="110" height="28" rx="6" fill="#081026" stroke="#38bdf8" strokeWidth="2" />
            <text x="125" y="67" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              TANK 1: RAW
            </text>
          </g>

          {/* TANK 2 HEADER */}
          <g>
            <rect
              x="290"
              y="48"
              width="110"
              height="28"
              rx="6"
              fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#3b0d1a' : '#081026'}
              stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'}
              strokeWidth="2"
            />
            <text
              x="345"
              y="67"
              fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff7185' : '#ffffff'}
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 'TANK 2: ATTACKED' : 'TANK 2: FILTER'}
            </text>
          </g>

          {/* TANK 3 HEADER */}
          <g>
            <rect x="510" y="48" width="110" height="28" rx="6" fill="#081026" stroke="#34d399" strokeWidth="2" />
            <text x="565" y="67" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              TANK 3: PURIFIER
            </text>
          </g>

          {/* TANK 4 HEADER */}
          <g>
            <rect x="730" y="48" width="110" height="28" rx="6" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <text x="785" y="67" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              TANK 4: CLEAN
            </text>
          </g>

          {/* ================= ZONE 3: PHYSICAL PIPES (y = 175) ================= */}
          {/* Intake into Tank 1 */}
          <path d="M 15 175 L 75 175" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 15 175 L 75 175" fill="none" stroke="#38bdf8" strokeWidth="4" className="pipe-flow" />

          {/* Tank 1 -> Tank 2 (through Pump 1) */}
          <path d="M 175 175 L 295 175" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 175 175 L 295 175" fill="none" stroke="#00f2fe" strokeWidth="4" className="pipe-flow-fast" />

          {/* Tank 2 -> Tank 3 (through Valve) */}
          <path d="M 395 175 L 515 175" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#00f2fe'} strokeWidth="8" opacity="0.3" />
          <path d="M 395 175 L 515 175" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#34d399'} strokeWidth="4" className={isPipeCompromised ? 'pipe-flow-attack' : 'pipe-flow'} />

          {/* Tank 3 -> Tank 4 (through Pump 2) */}
          <path d="M 615 175 L 735 175" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 615 175 L 735 175" fill="none" stroke="#10b981" strokeWidth="4" className="pipe-flow-fast" />

          {/* Tank 4 -> Output Clean Distribution */}
          <path d="M 835 175 L 945 175" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 835 175 L 945 175" fill="none" stroke="#34d399" strokeWidth="4" className="pipe-flow" />

          {/* ================= ZONE 3: PHYSICAL TANKS (y = 86 to 256) ================= */}
          {/* TANK 1 */}
          <g>
            <rect x="75" y="86" width="100" height="170" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="2" />
            <rect x="79" y={252 - (162 * (t1 / 100))} width="92" height={162 * (t1 / 100)} rx="8" fill="url(#waterGradT1)" className="wave-anim" />
            {/* Center Percentage Bubble */}
            <rect x="94" y="152" width="62" height="34" rx="8" fill="#081026" stroke="#38bdf8" strokeWidth="2" />
            <text x="125" y="175" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t1}%</text>
            {/* Mechanical Support Feet */}
            <line x1="68" y1="258" x2="182" y2="258" stroke="#38bdf8" strokeWidth="3" />
            <rect x="90" y="258" width="12" height="6" fill="#38bdf8" />
            <rect x="148" y="258" width="12" height="6" fill="#38bdf8" />
          </g>

          {/* PUMP 1 */}
          <g transform="translate(235, 175)">
            <circle cx="0" cy="0" r="18" fill="#081026" stroke="#00f2fe" strokeWidth="2" />
            <g className="rotate-turbine">
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#00f2fe" strokeWidth="2.5" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#00f2fe" strokeWidth="2.5" />
            </g>
            <text x="0" y="28" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 1</text>
          </g>

          {/* TANK 2 */}
          <g>
            <rect
              x="295"
              y="86"
              width="100"
              height="170"
              rx="10"
              fill="rgba(15, 23, 42, 0.95)"
              stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : 'rgba(0, 242, 254, 0.6)'}
              strokeWidth={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '3' : '2'}
            />
            <rect x="299" y={252 - (162 * (t2 / 100))} width="92" height={162 * (t2 / 100)} rx="8" fill="url(#waterGradT2)" />
            {/* Center Percentage Bubble */}
            <rect
              x="314"
              y="152"
              width="62"
              height="34"
              rx="8"
              fill="#081026"
              stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'}
              strokeWidth="2"
            />
            <text x="345" y="175" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t2}%</text>
            {/* SENSOR PROBE ON TANK 2 (Top Right) */}
            <g transform="translate(382, 94)">
              <circle cx="0" cy="0" r="10" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} />
              <text x="0" y="4" fill="#050811" fontSize="9" fontWeight="900" textAnchor="middle">S</text>
              <text x="0" y="-12" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#38bdf8'} fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">SENSOR</text>
            </g>
            {/* Mechanical Support Feet */}
            <line x1="288" y1="258" x2="402" y2="258" stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} strokeWidth="3" />
            <rect x="310" y="258" width="12" height="6" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} />
            <rect x="368" y="258" width="12" height="6" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} />
          </g>

          {/* VALVE (Actuator) */}
          <g transform="translate(455, 175)">
            <polygon points="-10,-8 10,0 -10,8" fill={(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? '#ff2a5f' : '#00f2fe'} />
            <polygon points="10,-8 -10,0 10,8" fill={(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? '#ff2a5f' : '#00f2fe'} />
            <circle cx="0" cy="0" r="5" fill="#ffffff" />
            <text x="0" y="28" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
              {(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? 'STUCK VALVE' : 'VALVE'}
            </text>
          </g>

          {/* TANK 3 */}
          <g>
            <rect x="515" y="86" width="100" height="170" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(52, 211, 153, 0.6)" strokeWidth="2" />
            <rect x="519" y={252 - (162 * (t3 / 100))} width="92" height={162 * (t3 / 100)} rx="8" fill="url(#waterGradT3)" />
            {/* Center Percentage Bubble */}
            <rect x="534" y="152" width="62" height="34" rx="8" fill="#081026" stroke="#34d399" strokeWidth="2" />
            <text x="565" y="175" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t3}%</text>
            {/* Mechanical Support Feet */}
            <line x1="508" y1="258" x2="622" y2="258" stroke="#34d399" strokeWidth="3" />
            <rect x="530" y="258" width="12" height="6" fill="#34d399" />
            <rect x="588" y="258" width="12" height="6" fill="#34d399" />
          </g>

          {/* PUMP 2 */}
          <g transform="translate(675, 175)">
            <circle cx="0" cy="0" r="18" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <g className="rotate-turbine">
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#10b981" strokeWidth="2.5" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#10b981" strokeWidth="2.5" />
            </g>
            <text x="0" y="28" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 2</text>
          </g>

          {/* TANK 4 */}
          <g>
            <rect x="735" y="86" width="100" height="170" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" />
            <rect x="739" y={252 - (162 * (t4 / 100))} width="92" height={162 * (t4 / 100)} rx="8" fill="url(#waterGradT4)" />
            {/* Center Percentage Bubble */}
            <rect x="754" y="152" width="62" height="34" rx="8" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <text x="785" y="175" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t4}%</text>
            {/* Mechanical Support Feet */}
            <line x1="728" y1="258" x2="842" y2="258" stroke="#10b981" strokeWidth="3" />
            <rect x="750" y="258" width="12" height="6" fill="#10b981" />
            <rect x="808" y="258" width="12" height="6" fill="#10b981" />
          </g>

          {/* ================= ZONE 4: DEDICATED STATUS & ROOT CAUSE ZONE (y = 295 to 365) ================= */}
          {/* This zone is 100% collision-free below all tanks and pipes */}

          {/* 1. NOMINAL STATE BANNER */}
          {isNominal && (
            <g transform="translate(40, 305)">
              <rect x="0" y="0" width="880" height="50" rx="10" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
              <circle cx="30" cy="25" r="12" fill="#10b981" opacity="0.2" />
              <text x="30" y="30" fill="#10b981" fontSize="14" fontWeight="900" textAnchor="middle">✓</text>
              <text x="55" y="24" fill="#ffffff" fontSize="12" fontWeight="800" style={{ fontFamily: 'system-ui, sans-serif' }}>
                NORMAL FACILITY STATUS: ALL 4 TANKS CONTINUOUSLY FLOWING
              </text>
              <text x="55" y="40" fill="#94a3b8" fontSize="10" fontWeight="600" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Mass conservation balanced (Inflow = Outflow). All 5 CPS layers verified operating in clean nominal state.
              </text>
            </g>
          )}

          {/* 2. ATTACK ACTIVE BANNER */}
          {isAttackActive && (
            <g transform="translate(40, 305)">
              <rect x="0" y="0" width="880" height="50" rx="10" fill="rgba(255, 42, 95, 0.15)" stroke="#ff2a5f" strokeWidth="2" className="pulse-border" />
              <circle cx="30" cy="25" r="12" fill="#ff2a5f" opacity="0.25" />
              <text x="30" y="30" fill="#ff2a5f" fontSize="14" fontWeight="900" textAnchor="middle">!</text>
              <text x="55" y="24" fill="#ffffff" fontSize="12.5" fontWeight="900" style={{ fontFamily: 'system-ui, sans-serif' }}>
                ⚠️ FACILITY ALARM TRIGGERED: DISCREPANCY DETECTED
              </text>
              <text x="55" y="40" fill="#fecdd3" fontSize="10.5" fontWeight="700" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Traditional security is confused (cannot pinpoint root cause). AquaShield AI is auditing fluid physics across all 5 layers...
              </text>
            </g>
          )}

          {/* 3. ROOT CAUSE PINPOINTED BANNER & TARGETING LASERS */}
          {isLocalized && (
            <g>
              {/* Laser Target Reticle & Beams */}
              {targetLayer === 'SENSOR' && (
                <>
                  <line x1="480" y1="36" x2="382" y2="94" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="382" cy="94" r="16" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                </>
              )}
              {targetLayer === 'COMMUNICATION_CHANNEL' && (
                <>
                  <rect x="40" y="10" width="880" height="26" fill="none" stroke="#ff2a5f" strokeWidth="3" className="laser-trace" rx="6" />
                </>
              )}
              {targetLayer === 'CONTROLLER' && (
                <>
                  <line x1="480" y1="36" x2="345" y2="120" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                </>
              )}
              {targetLayer === 'FIRMWARE' && (
                <>
                  <line x1="480" y1="36" x2="675" y2="175" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="675" cy="175" r="22" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="wave-anim" />
                </>
              )}
              {targetLayer === 'ACTUATOR' && (
                <>
                  <line x1="480" y1="36" x2="455" y2="175" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="455" cy="175" r="20" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                </>
              )}

              {/* Dedicated Root Cause Console Banner */}
              <g transform="translate(40, 305)">
                <rect x="0" y="0" width="880" height="50" rx="10" fill="rgba(0, 242, 254, 0.14)" stroke="#00f2fe" strokeWidth="2" />
                <circle cx="30" cy="25" r="12" fill="#00f2fe" opacity="0.25" />
                <text x="30" y="30" fill="#00f2fe" fontSize="13" fontWeight="900" textAnchor="middle">🎯</text>
                <text x="55" y="24" fill="#ffffff" fontSize="12.5" fontWeight="900" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  TARGET PINPOINTED: {activeScenario.target} ({activeScenario.layerName})
                </text>
                <text x="55" y="40" fill="#7dd3fc" fontSize="10.5" fontWeight="700" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  Math Proof: {activeScenario.plainMathProof} • Other 4 layers verified 100% clean!
                </text>
              </g>
            </g>
          )}

          {/* 4. RESOLVED / HEALED BANNER */}
          {isResolved && (
            <g transform="translate(40, 305)">
              <rect x="0" y="0" width="880" height="50" rx="10" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
              <circle cx="30" cy="25" r="12" fill="#10b981" opacity="0.3" />
              <text x="30" y="30" fill="#10b981" fontSize="13" fontWeight="900" textAnchor="middle">🛡️</text>
              <text x="55" y="24" fill="#ffffff" fontSize="12.5" fontWeight="900" style={{ fontFamily: 'system-ui, sans-serif' }}>
                AUTONOMOUS SELF-HEALING COMPLETE • 0 SECONDS FACILITY DOWNTIME
              </text>
              <text x="55" y="40" fill="#6ee7b7" fontSize="10.5" fontWeight="700" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {activeScenario.plainFix}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* DEDICATED SENSOR TELEMETRY COMPARISON STRIP (FLOW LAYOUT, NEVER CLASHES WITH SVG) */}
      {(isAttackActive || isLocalized || isResolved) && targetLayer === 'SENSOR' && (
        <div
          style={{
            marginTop: '14px',
            background: isResolved ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 42, 95, 0.12)',
            border: isResolved ? '1.5px solid #10b981' : '1.5px solid #ff2a5f',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            alignItems: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: isResolved ? '#6ee7b7' : '#ff7185', fontWeight: 800 }}>
              {isResolved ? 'BACKUP ESTIMATED VALUE' : 'WHAT SENSOR CLAIMS'}
            </div>
            <div className="font-mono" style={{ fontSize: '1.25rem', color: isResolved ? '#34d399' : '#ff2a5f', fontWeight: 900 }}>
              {isResolved ? sensors.levelT2_true.toFixed(0) : sensors.levelT2_observed.toFixed(0)}%{' '}
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {isResolved ? '(Calculated from Flow)' : '(Fake / Frozen Reading)'}
              </span>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>
              REAL PHYSICAL WATER IN TANK
            </div>
            <div className="font-mono" style={{ fontSize: '1.25rem', color: '#00f2fe', fontWeight: 900 }}>
              {sensors.levelT2_true.toFixed(0)}%{' '}
              <span style={{ fontSize: '0.75rem', color: '#7dd3fc', fontWeight: 700 }}>
                (Fluid Inflow - Outflow Math)
              </span>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>
              AQUASHIELD VERDICT
            </div>
            <div style={{ fontSize: '0.92rem', color: isResolved ? '#34d399' : isLocalized ? '#ff2a5f' : '#fbbf24', fontWeight: 900, marginTop: '2px' }}>
              {isResolved
                ? '✅ Sensor Isolated • Plant Operating Smoothly'
                : isLocalized
                ? '🚨 Discrepancy Caught! Sensor Is Lying'
                : 'Auditing Mass Balance Equations...'}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED 4-TANK HIGH-VISIBILITY STATUS CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginTop: '14px'
        }}
      >
        {/* TANK 1 CARD */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1.5px solid #38bdf8',
            borderRadius: '10px',
            padding: '12px 14px',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.06em' }}>
              🚰 TANK 1
            </span>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              {t1}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Raw Water Intake
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            50,000L Reservoir • Normal
          </div>
        </div>

        {/* TANK 2 CARD */}
        <div
          style={{
            background: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 'rgba(255, 42, 95, 0.12)' : 'rgba(15, 23, 42, 0.75)',
            border: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '2px solid #ff2a5f' : '1.5px solid #00f2fe',
            borderRadius: '10px',
            padding: '12px 14px',
            boxShadow: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '0 0 16px rgba(255, 42, 95, 0.3)' : '0 4px 12px rgba(0, 242, 254, 0.15)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 900, color: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe', letterSpacing: '0.06em' }}>
              🧪 TANK 2
            </span>
            <span
              style={{
                background: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 'rgba(255, 42, 95, 0.25)' : 'rgba(0, 242, 254, 0.2)',
                color: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff7185' : '#00f2fe',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px'
              }}
            >
              {t2}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Filter Membrane Tank
          </div>
          <div style={{ fontSize: '0.72rem', color: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#fda4af' : '#94a3b8', marginTop: '2px', fontWeight: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 800 : 400 }}>
            {(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '🚨 SENSOR READING FROZEN!' : '40,000L Sensor Monitored'}
          </div>
        </div>

        {/* TANK 3 CARD */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1.5px solid #34d399',
            borderRadius: '10px',
            padding: '12px 14px',
            boxShadow: '0 4px 12px rgba(52, 211, 153, 0.15)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.06em' }}>
              🫧 TANK 3
            </span>
            <span style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              {t3}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Disinfection Chamber
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            45,000L Neutralizer • Safe
          </div>
        </div>

        {/* TANK 4 CARD */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1.5px solid #10b981',
            borderRadius: '10px',
            padding: '12px 14px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.06em' }}>
              💧 TANK 4
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              {t4}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Clean Drinking Water
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            60,000L 100% Pure Drinkable
          </div>
        </div>
      </div>

      {/* 4 Bottom Telemetry Indicators */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginTop: '12px'
        }}
      >
        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>WATER INFLOW</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {sensors.flowInflow.toFixed(1)} Liters/sec
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>WATER OUTFLOW</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#00f2fe', marginTop: '2px' }}>
            {sensors.flowOutflow.toFixed(1)} Liters/sec
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PIPE PRESSURE</span>
          <p
            className="font-mono"
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: (isAttackActive || isLocalized) && targetLayer === 'CONTROLLER' ? '#ff2a5f' : '#34d399',
              marginTop: '2px'
            }}
          >
            {sensors.pressureBar.toFixed(1)} bar
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>WATER CLEANLINESS</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            100% Pure Drinkable
          </p>
        </div>
      </div>
    </div>
  );
}
