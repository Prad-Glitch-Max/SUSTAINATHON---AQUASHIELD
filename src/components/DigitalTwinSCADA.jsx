import React from 'react';
import { Activity, AlertOctagon, CheckCircle2, ShieldCheck, Search, ShieldAlert, Cpu, Radio, Binary, Cog, Eye, Zap } from 'lucide-react';

export default function DigitalTwinSCADA({ state, autoStage = 0, selectedScenarioKeys = ['SENSOR_SPOOF'] }) {
  const { tanks, sensors, activeScenario, activeScenarios = [activeScenario], phase } = state;

  const isNominal = phase === 'NOMINAL';
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  // Effective stage: derived from autoStage or phase
  const effectiveStage = autoStage > 0
    ? autoStage
    : isResolved
    ? 4
    : isLocalized
    ? 3
    : isAttackActive
    ? 1
    : 0;

  // Active attack layers
  const scns = activeScenarios && activeScenarios.length > 0 ? activeScenarios : [activeScenario];
  const isSensorAttacked = scns.some(s => s?.layer === 'SENSOR');
  const isNetworkAttacked = scns.some(s => s?.layer === 'COMMUNICATION_CHANNEL');
  const isControllerAttacked = scns.some(s => s?.layer === 'CONTROLLER');
  const isFirmwareAttacked = scns.some(s => s?.layer === 'FIRMWARE');
  const isActuatorAttacked = scns.some(s => s?.layer === 'ACTUATOR');

  const isPipeCompromised = (isAttackActive || isLocalized) && (isNetworkAttacked || isActuatorAttacked);

  // Tank levels in %
  const t1 = Math.round(tanks.tank1.level);
  const t2 = Math.round(tanks.tank2.level);
  const t3 = Math.round(tanks.tank3.level);
  const t4 = Math.round(tanks.tank4.level);

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
          ? '0 0 30px rgba(255,42,95,0.2)'
          : isResolved
          ? '0 0 30px rgba(16,185,129,0.15)'
          : 'none',
        transition: 'all 0.3s ease'
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
            <AlertOctagon size={15} /> Alarm Sounding! ({scns.length > 1 ? `${scns.length} Concurrent Breaches` : 'Root Cause Unknown'})
          </span>
        )}

        {isLocalized && (
          <span className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <ShieldAlert size={15} /> Root Cause Pinpointed: {scns.map(s => s.target).join(' & ')}
          </span>
        )}

        {isResolved && (
          <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <CheckCircle2 size={15} /> Fixed! Clean Water Protected (0 Downtime)
          </span>
        )}
      </div>

      {/* SVG Canvas Container with Live Projected HUD Overlay */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '410px',
          background: 'rgba(5, 10, 22, 0.94)',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: 'inset 0 0 45px rgba(0,0,0,0.75)',
          overflow: 'hidden'
        }}
      >
        {/* ================= PROJECTED LIVE HUD STAGE BANNER (DIRECTLY ON SCREEN) ================= */}
        {effectiveStage === 1 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 42, 95, 0.95)',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '24px',
              padding: '8px 24px',
              boxShadow: '0 0 25px rgba(255, 42, 95, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 30,
              maxWidth: '90%',
              textAlign: 'center',
              animation: 'pulse-border 1s infinite alternate'
            }}
          >
            <AlertOctagon size={20} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                STAGE 1/4: 🚨 CYBER BREACH INJECTED!
              </div>
              <div style={{ fontSize: '0.74rem', opacity: 0.95, fontWeight: 700 }}>
                {scns.length > 1
                  ? `${scns.length} Attack Vectors Active simultaneously! Alarms ringing. Old tools cannot isolate root cause.`
                  : `${activeScenario.symptom} Alarms ringing across facility!`}
              </div>
            </div>
          </div>
        )}

        {effectiveStage === 2 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 242, 254, 0.95)',
              color: '#050811',
              border: '2px solid #ffffff',
              borderRadius: '24px',
              padding: '8px 24px',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 30,
              maxWidth: '90%',
              textAlign: 'center'
            }}
          >
            <Activity size={20} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                STAGE 2/4: 🧠 AQUASHIELD AI RUNNING REAL-TIME PHYSICS AUDIT...
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800 }}>
                Auditing Mass Flow Inflow (42.5 L/s) vs Outflow (38.0 L/s) • Natural laws of physics catch anomalies!
              </div>
            </div>
          </div>
        )}

        {effectiveStage === 3 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(168, 85, 247, 0.95)',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '24px',
              padding: '8px 24px',
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 30,
              maxWidth: '90%',
              textAlign: 'center'
            }}
          >
            <Search size={20} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                STAGE 3/4: 🎯 ROOT CAUSE PINPOINTED TO EXACT COMPONENT!
              </div>
              <div style={{ fontSize: '0.74rem', opacity: 0.95, fontWeight: 700 }}>
                Laser targeting: {scns.map(s => s.target).join(' & ')} • Other layers certified 100% healthy!
              </div>
            </div>
          </div>
        )}

        {effectiveStage === 4 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(16, 185, 129, 0.95)',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '24px',
              padding: '8px 24px',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 30,
              maxWidth: '90%',
              textAlign: 'center'
            }}
          >
            <ShieldCheck size={20} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                STAGE 4/4: 🛡️ AUTONOMOUS SELF-HEALING DEPLOYED!
              </div>
              <div style={{ fontSize: '0.74rem', opacity: 0.95, fontWeight: 700 }}>
                Zero seconds downtime • Clean drinking water protected with zero human intervention!
              </div>
            </div>
          </div>
        )}

        <svg viewBox="0 0 960 410" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="waterGradT1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="waterGradT2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe'} stopOpacity="0.85" />
              <stop offset="100%" stopColor={(isAttackActive || isLocalized) && isSensorAttacked ? '#99002b' : '#0369a1'} stopOpacity="0.45" />
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
            <line x1="0" y1="105" x2="960" y2="105" />
            <line x1="0" y1="185" x2="960" y2="185" />
            <line x1="0" y1="270" x2="960" y2="270" />
            <line x1="240" y1="0" x2="240" y2="410" />
            <line x1="480" y1="0" x2="480" y2="410" />
            <line x1="720" y1="0" x2="720" y2="410" />
          </g>

          {/* ================= ZONE 1: TOP NETWORK WIRE (y = 52 to 78) ================= */}
          <g>
            <rect
              x="40"
              y="52"
              width="880"
              height="26"
              rx="6"
              fill="rgba(15, 23, 42, 0.95)"
              stroke={(isAttackActive || isLocalized) && isNetworkAttacked ? '#ff2a5f' : 'rgba(56, 189, 248, 0.35)'}
              strokeWidth={(isAttackActive || isLocalized) && isNetworkAttacked ? '2.5' : '1'}
            />
            <text x="56" y="69" fill="#38bdf8" fontSize="10.5" fontWeight="800" fontFamily="var(--font-mono)">
              🌐 SCADA INDUSTRIAL NETWORK WIRE (COMMUNICATION BUS)
            </text>
            <text
              x="905"
              y="69"
              fill={isAttackActive && isNetworkAttacked ? '#ff2a5f' : isLocalized && isNetworkAttacked ? '#00f2fe' : '#10b981'}
              fontSize="10"
              fontWeight="800"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              {(isAttackActive || isLocalized) && isNetworkAttacked
                ? '⚠️ CABLE DELAY DETECTED'
                : isAttackActive
                ? 'ALARM SOUNDING'
                : isLocalized
                ? 'BREACH PINPOINTED'
                : 'STATUS: NORMAL WIRE TELEMETRY'}
            </text>
          </g>

          {/* ================= ZONE 2: 2-LINE TANK HEADER BADGES (y = 86 to 120, ZERO TEXT OVERFLOW!) ================= */}
          {/* TANK 1 HEADER */}
          <g transform="translate(68, 86)">
            <rect x="0" y="0" width="114" height="32" rx="7" fill="#081026" stroke="#38bdf8" strokeWidth="2" />
            <text x="57" y="14" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              TANK 1
            </text>
            <text x="57" y="26" fill="#38bdf8" fontSize="8.5" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              RAW INTAKE
            </text>
          </g>

          {/* TANK 2 HEADER */}
          <g transform="translate(288, 86)">
            <rect
              x="0"
              y="0"
              width="114"
              height="32"
              rx="7"
              fill={(isAttackActive || isLocalized) && isSensorAttacked ? '#3b0d1a' : '#081026'}
              stroke={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe'}
              strokeWidth="2.5"
            />
            <text x="57" y="14" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              TANK 2
            </text>
            <text
              x="57"
              y="26"
              fill={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff7185' : '#00f2fe'}
              fontSize="8.5"
              fontWeight="800"
              textAnchor="middle"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {(isAttackActive || isLocalized) && isSensorAttacked ? 'SPOOFED SENSOR' : 'FILTER MEMBRANE'}
            </text>
          </g>

          {/* TANK 3 HEADER */}
          <g transform="translate(508, 86)">
            <rect x="0" y="0" width="114" height="32" rx="7" fill="#081026" stroke="#34d399" strokeWidth="2" />
            <text x="57" y="14" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              TANK 3
            </text>
            <text x="57" y="26" fill="#34d399" fontSize="8.5" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              DISINFECTION
            </text>
          </g>

          {/* TANK 4 HEADER */}
          <g transform="translate(728, 86)">
            <rect x="0" y="0" width="114" height="32" rx="7" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <text x="57" y="14" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              TANK 4
            </text>
            <text x="57" y="26" fill="#10b981" fontSize="8.5" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
              DRINKING WATER
            </text>
          </g>

          {/* ================= ZONE 3: PHYSICAL PIPES (y = 195) ================= */}
          {/* Intake into Tank 1 */}
          <path d="M 15 195 L 75 195" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 15 195 L 75 195" fill="none" stroke="#38bdf8" strokeWidth="4" className="pipe-flow" />

          {/* Tank 1 -> Tank 2 (through Pump 1) */}
          <path d="M 175 195 L 295 195" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 175 195 L 295 195" fill="none" stroke="#00f2fe" strokeWidth="4" className="pipe-flow-fast" />

          {/* Tank 2 -> Tank 3 (through Valve) */}
          <path d="M 395 195 L 515 195" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#00f2fe'} strokeWidth="8" opacity="0.3" />
          <path d="M 395 195 L 515 195" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#34d399'} strokeWidth="4" className={isPipeCompromised ? 'pipe-flow-attack' : 'pipe-flow'} />

          {/* Tank 3 -> Tank 4 (through Pump 2) */}
          <path d="M 615 195 L 735 195" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 615 195 L 735 195" fill="none" stroke="#10b981" strokeWidth="4" className="pipe-flow-fast" />

          {/* Tank 4 -> Output Clean Distribution */}
          <path d="M 835 195 L 945 195" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 835 195 L 945 195" fill="none" stroke="#34d399" strokeWidth="4" className="pipe-flow" />

          {/* ================= ZONE 3: PHYSICAL TANKS (y = 126 to 276) ================= */}
          {/* TANK 1 */}
          <g>
            <rect x="75" y="126" width="100" height="150" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="2" />
            <rect x="79" y={272 - (142 * (t1 / 100))} width="92" height={142 * (t1 / 100)} rx="8" fill="url(#waterGradT1)" className="wave-anim" />
            {/* Center Percentage Bubble */}
            <rect x="94" y="174" width="62" height="34" rx="8" fill="#081026" stroke="#38bdf8" strokeWidth="2" />
            <text x="125" y="197" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t1}%</text>
            {/* Mechanical Support Feet */}
            <line x1="68" y1="278" x2="182" y2="278" stroke="#38bdf8" strokeWidth="3" />
            <rect x="90" y="278" width="12" height="6" fill="#38bdf8" />
            <rect x="148" y="278" width="12" height="6" fill="#38bdf8" />
          </g>

          {/* PUMP 1 */}
          <g transform="translate(235, 195)">
            <circle cx="0" cy="0" r="18" fill="#081026" stroke={(isAttackActive || isLocalized) && isControllerAttacked ? '#ff2a5f' : '#00f2fe'} strokeWidth="2" />
            <g className="rotate-turbine">
              <line x1="-10" y1="0" x2="10" y2="0" stroke={(isAttackActive || isLocalized) && isControllerAttacked ? '#ff2a5f' : '#00f2fe'} strokeWidth="2.5" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke={(isAttackActive || isLocalized) && isControllerAttacked ? '#ff2a5f' : '#00f2fe'} strokeWidth="2.5" />
            </g>
            <text x="0" y="28" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 1</text>
          </g>

          {/* TANK 2 */}
          <g>
            <rect
              x="295"
              y="126"
              width="100"
              height="150"
              rx="10"
              fill="rgba(15, 23, 42, 0.95)"
              stroke={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : 'rgba(0, 242, 254, 0.6)'}
              strokeWidth={(isAttackActive || isLocalized) && isSensorAttacked ? '3' : '2'}
            />
            <rect x="299" y={272 - (142 * (t2 / 100))} width="92" height={142 * (t2 / 100)} rx="8" fill="url(#waterGradT2)" />
            {/* Center Percentage Bubble */}
            <rect
              x="314"
              y="174"
              width="62"
              height="34"
              rx="8"
              fill="#081026"
              stroke={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe'}
              strokeWidth="2"
            />
            <text x="345" y="197" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t2}%</text>
            
            {/* SENSOR PROBE ON TANK 2 (Top Right) */}
            <g transform="translate(382, 134)">
              <circle cx="0" cy="0" r="10" fill={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe'} />
              <text x="0" y="4" fill="#050811" fontSize="9" fontWeight="900" textAnchor="middle">S</text>
              <text x="0" y="-12" fill={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#38bdf8'} fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">SENSOR</text>
            </g>

            {/* PROJECTED CALLOUT ON TANK 2 DURING ATTACK / AUDIT */}
            {isSensorAttacked && effectiveStage > 0 && (
              <g transform="translate(345, 236)">
                <rect x="-85" y="0" width="170" height="20" rx="4" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.95" />
                <text x="0" y="13" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {effectiveStage === 1 && '⚠️ FROZEN AT 32%'}
                  {effectiveStage === 2 && '🧠 INFLOW > OUTFLOW (+10L/s)'}
                  {effectiveStage === 3 && '🎯 LYING SENSOR PINPOINTED'}
                  {effectiveStage === 4 && '🛡️ VIRTUAL ESTIMATOR ACTIVE'}
                </text>
              </g>
            )}

            {/* Mechanical Support Feet */}
            <line x1="288" y1="278" x2="402" y2="278" stroke={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe'} strokeWidth="3" />
            <rect x="310" y="278" width="12" height="6" fill={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe'} />
            <rect x="368" y="278" width="12" height="6" fill={(isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe'} />
          </g>

          {/* VALVE (Actuator) */}
          <g transform="translate(455, 195)">
            <polygon points="-10,-8 10,0 -10,8" fill={(isAttackActive || isLocalized) && isActuatorAttacked ? '#ff2a5f' : '#00f2fe'} />
            <polygon points="10,-8 -10,0 10,8" fill={(isAttackActive || isLocalized) && isActuatorAttacked ? '#ff2a5f' : '#00f2fe'} />
            <circle cx="0" cy="0" r="5" fill="#ffffff" />
            <text x="0" y="28" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
              {(isAttackActive || isLocalized) && isActuatorAttacked ? 'STUCK VALVE' : 'VALVE'}
            </text>
            {/* Projected callout if valve is attacked */}
            {isActuatorAttacked && effectiveStage > 0 && (
              <g transform="translate(0, 42)">
                <rect x="-65" y="0" width="130" height="18" rx="4" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.95" />
                <text x="0" y="12" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {effectiveStage === 1 && '⚠️ JAMMED AT 100%'}
                  {effectiveStage === 2 && '🧠 LEAKING 65 L/s'}
                  {effectiveStage === 3 && '🎯 VALVE JAM ISOLATED'}
                  {effectiveStage === 4 && '🛡️ DIVERTER ENGAGED'}
                </text>
              </g>
            )}
          </g>

          {/* TANK 3 */}
          <g>
            <rect x="515" y="126" width="100" height="150" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(52, 211, 153, 0.6)" strokeWidth="2" />
            <rect x="519" y={272 - (142 * (t3 / 100))} width="92" height={142 * (t3 / 100)} rx="8" fill="url(#waterGradT3)" />
            {/* Center Percentage Bubble */}
            <rect x="534" y="174" width="62" height="34" rx="8" fill="#081026" stroke="#34d399" strokeWidth="2" />
            <text x="565" y="197" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t3}%</text>
            {/* Mechanical Support Feet */}
            <line x1="508" y1="278" x2="622" y2="278" stroke="#34d399" strokeWidth="3" />
            <rect x="530" y="278" width="12" height="6" fill="#34d399" />
            <rect x="588" y="278" width="12" height="6" fill="#34d399" />
          </g>

          {/* PUMP 2 (Firmware Target) */}
          <g transform="translate(675, 195)">
            <circle cx="0" cy="0" r="18" fill="#081026" stroke={(isAttackActive || isLocalized) && isFirmwareAttacked ? '#f59e0b' : '#10b981'} strokeWidth="2" />
            <g className="rotate-turbine">
              <line x1="-10" y1="0" x2="10" y2="0" stroke={(isAttackActive || isLocalized) && isFirmwareAttacked ? '#f59e0b' : '#10b981'} strokeWidth="2.5" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke={(isAttackActive || isLocalized) && isFirmwareAttacked ? '#f59e0b' : '#10b981'} strokeWidth="2.5" />
            </g>
            <text x="0" y="28" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 2</text>
            {/* Projected callout if firmware is attacked */}
            {isFirmwareAttacked && effectiveStage > 0 && (
              <g transform="translate(0, 42)">
                <rect x="-65" y="0" width="130" height="18" rx="4" fill={effectiveStage === 4 ? '#10b981' : '#f59e0b'} opacity="0.95" />
                <text x="0" y="12" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {effectiveStage === 1 && '⚠️ 120Hz VIBRATION'}
                  {effectiveStage === 2 && '🧠 HASH MISMATCH'}
                  {effectiveStage === 3 && '🎯 BAD CODE CAUGHT'}
                  {effectiveStage === 4 && '🛡️ GOLDEN CODE RESTORED'}
                </text>
              </g>
            )}
          </g>

          {/* TANK 4 */}
          <g>
            <rect x="735" y="126" width="100" height="150" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" />
            <rect x="739" y={272 - (142 * (t4 / 100))} width="92" height={142 * (t4 / 100)} rx="8" fill="url(#waterGradT4)" />
            {/* Center Percentage Bubble */}
            <rect x="754" y="174" width="62" height="34" rx="8" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <text x="785" y="197" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>{t4}%</text>
            {/* Mechanical Support Feet */}
            <line x1="728" y1="278" x2="842" y2="278" stroke="#10b981" strokeWidth="3" />
            <rect x="750" y="278" width="12" height="6" fill="#10b981" />
            <rect x="808" y="278" width="12" height="6" fill="#10b981" />
          </g>

          {/* ================= ZONE 4: TARGETING LASERS FOR ALL COMPROMISED LAYERS ================= */}
          {isLocalized && (
            <g>
              {isSensorAttacked && (
                <>
                  <line x1="480" y1="78" x2="382" y2="134" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="382" cy="134" r="16" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                </>
              )}
              {isNetworkAttacked && (
                <>
                  <rect x="40" y="52" width="880" height="26" fill="none" stroke="#ff2a5f" strokeWidth="3" className="laser-trace" rx="6" />
                </>
              )}
              {isControllerAttacked && (
                <>
                  <line x1="480" y1="78" x2="235" y2="177" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="235" cy="195" r="22" fill="none" stroke="#a855f7" strokeWidth="2.5" className="wave-anim" />
                </>
              )}
              {isFirmwareAttacked && (
                <>
                  <line x1="480" y1="78" x2="675" y2="195" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="675" cy="195" r="22" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="wave-anim" />
                </>
              )}
              {isActuatorAttacked && (
                <>
                  <line x1="480" y1="78" x2="455" y2="195" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="455" cy="195" r="20" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                </>
              )}
            </g>
          )}

          {/* ================= ZONE 5: BOTTOM STATUS CONSOLE BANNER (y = 330 to 395) ================= */}
          {isNominal && (
            <g transform="translate(40, 335)">
              <rect x="0" y="0" width="880" height="52" rx="10" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
              <circle cx="30" cy="26" r="12" fill="#10b981" opacity="0.25" />
              <text x="30" y="31" fill="#10b981" fontSize="14" fontWeight="900" textAnchor="middle">✓</text>
              <text x="55" y="24" fill="#ffffff" fontSize="12" fontWeight="800" style={{ fontFamily: 'system-ui, sans-serif' }}>
                NORMAL FACILITY OPERATION: ALL 4 TANKS BALANCED & CLEAN
              </text>
              <text x="55" y="41" fill="#94a3b8" fontSize="10" fontWeight="600" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Continuous fluid conservation satisfied (Inflow = Outflow). All 5 CPS layers safe.
              </text>
            </g>
          )}

          {isAttackActive && (
            <g transform="translate(40, 335)">
              <rect x="0" y="0" width="880" height="52" rx="10" fill="rgba(255, 42, 95, 0.15)" stroke="#ff2a5f" strokeWidth="2" />
              <circle cx="30" cy="26" r="12" fill="#ff2a5f" opacity="0.25" />
              <text x="30" y="31" fill="#ff2a5f" fontSize="14" fontWeight="900" textAnchor="middle">!</text>
              <text x="55" y="24" fill="#ffffff" fontSize="12" fontWeight="900" style={{ fontFamily: 'system-ui, sans-serif' }}>
                ⚠️ FACILITY ALARM TRIGGERED ({scns.length} BREACH{scns.length > 1 ? 'ES' : ''} DETECTED)
              </text>
              <text x="55" y="41" fill="#fecdd3" fontSize="10" fontWeight="700" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Old security tools are confused and cannot pinpoint the root cause. AquaShield AI is auditing physics...
              </text>
            </g>
          )}

          {isLocalized && (
            <g transform="translate(40, 335)">
              <rect x="0" y="0" width="880" height="52" rx="10" fill="rgba(0, 242, 254, 0.15)" stroke="#00f2fe" strokeWidth="2" />
              <circle cx="30" cy="26" r="12" fill="#00f2fe" opacity="0.25" />
              <text x="30" y="31" fill="#00f2fe" fontSize="13" fontWeight="900" textAnchor="middle">🎯</text>
              <text x="55" y="24" fill="#ffffff" fontSize="12" fontWeight="900" style={{ fontFamily: 'system-ui, sans-serif' }}>
                TARGET PINPOINTED: {scns.map(s => s.target).join(' & ')} ({scns.map(s => s.layerName).join(' & ')})
              </text>
              <text x="55" y="41" fill="#7dd3fc" fontSize="10" fontWeight="700" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Math Proof: {scns.map(s => s.plainMathProof).join(' • ')}
              </text>
            </g>
          )}

          {isResolved && (
            <g transform="translate(40, 335)">
              <rect x="0" y="0" width="880" height="52" rx="10" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
              <circle cx="30" cy="26" r="12" fill="#10b981" opacity="0.3" />
              <text x="30" y="31" fill="#10b981" fontSize="13" fontWeight="900" textAnchor="middle">🛡️</text>
              <text x="55" y="24" fill="#ffffff" fontSize="12" fontWeight="900" style={{ fontFamily: 'system-ui, sans-serif' }}>
                AUTONOMOUS SELF-HEALING COMPLETE • 0 SECONDS FACILITY DOWNTIME
              </text>
              <text x="55" y="41" fill="#6ee7b7" fontSize="10" fontWeight="700" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {scns.map(s => s.plainFix).join(' • ')}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* DEDICATED SENSOR TELEMETRY COMPARISON STRIP */}
      {isSensorAttacked && (isAttackActive || isLocalized || isResolved) && (
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
                {isResolved ? '(Calculated from Flow Math)' : '(Fake / Frozen Reading)'}
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
                (Inflow - Outflow Mass Conservation)
              </span>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>
              AQUASHIELD VERDICT
            </div>
            <div style={{ fontSize: '0.92rem', color: isResolved ? '#34d399' : isLocalized ? '#ff2a5f' : '#fbbf24', fontWeight: 900, marginTop: '2px' }}>
              {isResolved
                ? '✅ Sensor Isolated • Backup Estimator Engaged'
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
            background: (isAttackActive || isLocalized) && isSensorAttacked ? 'rgba(255, 42, 95, 0.12)' : 'rgba(15, 23, 42, 0.75)',
            border: (isAttackActive || isLocalized) && isSensorAttacked ? '2px solid #ff2a5f' : '1.5px solid #00f2fe',
            borderRadius: '10px',
            padding: '12px 14px',
            boxShadow: (isAttackActive || isLocalized) && isSensorAttacked ? '0 0 16px rgba(255, 42, 95, 0.3)' : '0 4px 12px rgba(0, 242, 254, 0.15)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 900, color: (isAttackActive || isLocalized) && isSensorAttacked ? '#ff2a5f' : '#00f2fe', letterSpacing: '0.06em' }}>
              🧪 TANK 2
            </span>
            <span
              style={{
                background: (isAttackActive || isLocalized) && isSensorAttacked ? 'rgba(255, 42, 95, 0.25)' : 'rgba(0, 242, 254, 0.2)',
                color: (isAttackActive || isLocalized) && isSensorAttacked ? '#ff7185' : '#00f2fe',
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
          <div style={{ fontSize: '0.72rem', color: (isAttackActive || isLocalized) && isSensorAttacked ? '#fda4af' : '#94a3b8', marginTop: '2px', fontWeight: (isAttackActive || isLocalized) && isSensorAttacked ? 800 : 400 }}>
            {(isAttackActive || isLocalized) && isSensorAttacked ? '🚨 SENSOR READING FROZEN!' : '40,000L Sensor Monitored'}
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
              color: (isAttackActive || isLocalized) && isControllerAttacked ? '#ff2a5f' : '#34d399',
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
