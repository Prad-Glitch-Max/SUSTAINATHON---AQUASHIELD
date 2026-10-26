import React from 'react';
import { Activity, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function DigitalTwinSCADA({ state }) {
  const { tanks, sensors, activeScenario, phase } = state;
  const targetLayer = activeScenario.layer;

  const isNominal = phase === 'NOMINAL';
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isLocalized = phase === 'LOCALIZED';
  const isResolved = phase === 'RESOLVED';

  // Tank levels in %
  const t1 = tanks.tank1.level;
  const t2 = tanks.tank2.level;
  const t3 = tanks.tank3.level;
  const t4 = tanks.tank4.level;

  const isPipeCompromised = (isAttackActive || isLocalized) && (targetLayer === 'COMMUNICATION_CHANNEL' || targetLayer === 'ACTUATOR');

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      border: isAttackActive ? '1px solid #ff2a5f' : isLocalized ? '1px solid #00f2fe' : '1px solid rgba(56,189,248,0.25)'
    }}>
      {/* Schematic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'rgba(0,242,254,0.1)',
            border: '1px solid rgba(0,242,254,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={18} color="#00f2fe" />
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.1rem', letterSpacing: '0.04em', color: '#f1f5f9' }}>
              CLEAN WATER RECYCLING FACILITY (LIVE SIMULATION)
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time fluid mechanics simulation across 4 continuous water treatment tanks
            </p>
          </div>
        </div>

        {/* Status Pill */}
        {isNominal && (
          <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
            <CheckCircle2 size={14} /> All 4 Tanks Running Clean
          </span>
        )}

        {isAttackActive && (
          <span className="badge badge-rose" style={{ animation: 'pulse-border 1s infinite alternate', fontSize: '0.78rem', padding: '5px 14px' }}>
            <AlertOctagon size={14} /> Alarm Sounding! (Root Cause Unknown)
          </span>
        )}

        {isLocalized && (
          <span className="badge badge-cyan" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
            Root Cause Pinpointed: {activeScenario.target}
          </span>
        )}

        {isResolved && (
          <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
            <CheckCircle2 size={14} /> Fixed! Clean Water Protected (0 Downtime)
          </span>
        )}
      </div>

      {/* SVG Canvas for SCADA Facility */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '340px',
        background: 'rgba(5, 10, 22, 0.85)',
        borderRadius: '12px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        boxShadow: 'inset 0 0 35px rgba(0,0,0,0.6)'
      }}>
        <svg viewBox="0 0 960 360" style={{ width: '100%', height: '100%' }}>
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
              <stop offset="0%" stopColor="#ff2a5f" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ff2a5f" stopOpacity="1" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
            <line x1="0" y1="90" x2="960" y2="90" />
            <line x1="0" y1="180" x2="960" y2="180" />
            <line x1="0" y1="270" x2="960" y2="270" />
            <line x1="240" y1="0" x2="240" y2="360" />
            <line x1="480" y1="0" x2="480" y2="360" />
            <line x1="720" y1="0" x2="720" y2="360" />
          </g>

          {/* Pipes */}
          <path d="M 20 185 L 100 185" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 20 185 L 100 185" fill="none" stroke="#38bdf8" strokeWidth="4" className="pipe-flow" />

          <path d="M 195 235 L 255 235 L 255 185 L 320 185" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 195 235 L 255 235 L 255 185 L 320 185" fill="none" stroke="#00f2fe" strokeWidth="4" className="pipe-flow-fast" />

          <path d="M 415 185 L 520 185" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#00f2fe'} strokeWidth="8" opacity="0.3" />
          <path d="M 415 185 L 520 185" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#34d399'} strokeWidth="4" className={isPipeCompromised ? 'pipe-flow-attack' : 'pipe-flow'} />

          <path d="M 615 235 L 675 235 L 675 185 L 740 185" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 615 235 L 675 235 L 675 185 L 740 185" fill="none" stroke="#10b981" strokeWidth="4" className="pipe-flow-fast" />

          <path d="M 835 185 L 940 185" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 835 185 L 940 185" fill="none" stroke="#34d399" strokeWidth="4" className="pipe-flow" />

          {/* ================= TANK 1: Raw Water ================= */}
          <g transform="translate(100, 68)">
            {/* SOLID TANK HEADER PLATE (ALWAYS 100% VISIBLE ABOVE WATER) */}
            <rect x="-8" y="-36" width="111" height="32" rx="7" fill="#081026" stroke="#38bdf8" strokeWidth="2" />
            <text x="47.5" y="-18" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 1</text>
            <text x="47.5" y="-6" fill="#38bdf8" fontSize="9.5" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>RAW WATER</text>

            {/* Tank Shell */}
            <rect x="0" y="0" width="95" height="175" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="2" />
            {/* Water Fluid */}
            <rect x="4" y={171 - (167 * (t1 / 100))} width="87" height={167 * (t1 / 100)} rx="8" fill="url(#waterGradT1)" className="wave-anim" />
            
            {/* Percentage Display Bubble (Always visible over water!) */}
            <rect x="12" y="65" width="71" height="38" rx="8" fill="#081026" stroke="#38bdf8" strokeWidth="2" />
            <text x="47.5" y="91" fill="#ffffff" fontSize="19" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{t1}%</text>

            {/* SOLID BASE PEDESTAL & BOTTOM LABEL (100% VISIBLE) */}
            <rect x="-8" y="180" width="111" height="32" rx="7" fill="#081026" stroke="#38bdf8" strokeWidth="2" />
            <text x="47.5" y="196" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 1: RAW</text>
            <text x="47.5" y="207" fill="#38bdf8" fontSize="8.5" fontWeight="700" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>50,000L INTAKE</text>
          </g>

          {/* Pump 1 */}
          <g transform="translate(235, 165)">
            <circle cx="20" cy="20" r="19" fill="rgba(15, 23, 42, 0.95)" stroke="#00f2fe" strokeWidth="2" />
            <g className="rotate-turbine" transform="translate(20, 20)">
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#00f2fe" strokeWidth="2.5" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#00f2fe" strokeWidth="2.5" />
            </g>
            <text x="20" y="52" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 1</text>
          </g>

          {/* ================= TANK 2: Filter Tank (Sensor Target) ================= */}
          <g transform="translate(320, 68)">
            {/* SOLID TANK HEADER PLATE */}
            <rect
              x="-8"
              y="-36"
              width="111"
              height="32"
              rx="7"
              fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#3b0d1a' : '#081026'}
              stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'}
              strokeWidth="2.5"
            />
            <text x="47.5" y="-18" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 2</text>
            <text x="47.5" y="-6" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff7185' : '#00f2fe'} fontSize="9.5" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 'SENSOR ATTACKED' : 'FILTER MEMBRANE'}
            </text>

            {/* Tank Shell */}
            <rect
              x="0"
              y="0"
              width="95"
              height="175"
              rx="10"
              fill="rgba(15, 23, 42, 0.95)"
              stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : 'rgba(0, 242, 254, 0.6)'}
              strokeWidth={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '3' : '2'}
            />
            <rect x="4" y={171 - (167 * (t2 / 100))} width="87" height={167 * (t2 / 100)} rx="8" fill="url(#waterGradT2)" />

            {/* Percentage Display Bubble */}
            <rect x="12" y="65" width="71" height="38" rx="8" fill="#081026" stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} strokeWidth="2" />
            <text x="47.5" y="91" fill="#ffffff" fontSize="19" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{t2}%</text>

            {/* SOLID BASE PEDESTAL & BOTTOM LABEL (100% VISIBLE) */}
            <rect
              x="-8"
              y="180"
              width="111"
              height="32"
              rx="7"
              fill="#081026"
              stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'}
              strokeWidth="2"
            />
            <text x="47.5" y="196" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 2: FILTER</text>
            <text x="47.5" y="207" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff7185' : '#00f2fe'} fontSize="8.5" fontWeight="700" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 'SPOOFED SENSOR' : '40,000L SENSOR'}
            </text>

            {/* SENSOR PROBE ON TANK 2 */}
            <g transform="translate(80, 36)">
              <circle cx="10" cy="10" r="11" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} />
              <text x="10" y="14" fill="#050811" fontSize="10" fontWeight="900" textAnchor="middle">S</text>
              <text x="10" y="-4" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#38bdf8'} fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">SENSOR</text>
            </g>
          </g>

          {/* Valve / Actuator */}
          <g transform="translate(455, 165)">
            <polygon points="10,10 30,20 10,30" fill={(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? '#ff2a5f' : '#00f2fe'} />
            <polygon points="30,10 10,20 30,30" fill={(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? '#ff2a5f' : '#00f2fe'} />
            <circle cx="20" cy="20" r="5" fill="#ffffff" />
            <text x="20" y="46" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">
              {(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? 'STUCK VALVE' : 'VALVE'}
            </text>
          </g>

          {/* ================= TANK 3: Disinfection ================= */}
          <g transform="translate(520, 68)">
            {/* SOLID TANK HEADER PLATE */}
            <rect x="-8" y="-36" width="111" height="32" rx="7" fill="#081026" stroke="#34d399" strokeWidth="2" />
            <text x="47.5" y="-18" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 3</text>
            <text x="47.5" y="-6" fill="#34d399" fontSize="9.5" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>DISINFECTION</text>

            {/* Tank Shell */}
            <rect x="0" y="0" width="95" height="175" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(52, 211, 153, 0.6)" strokeWidth="2" />
            <rect x="4" y={171 - (167 * (t3 / 100))} width="87" height={167 * (t3 / 100)} rx="8" fill="url(#waterGradT3)" />

            {/* Percentage Display Bubble */}
            <rect x="12" y="65" width="71" height="38" rx="8" fill="#081026" stroke="#34d399" strokeWidth="2" />
            <text x="47.5" y="91" fill="#ffffff" fontSize="19" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{t3}%</text>

            {/* SOLID BASE PEDESTAL & BOTTOM LABEL (100% VISIBLE) */}
            <rect x="-8" y="180" width="111" height="32" rx="7" fill="#081026" stroke="#34d399" strokeWidth="2" />
            <text x="47.5" y="196" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 3: PURIFIER</text>
            <text x="47.5" y="207" fill="#34d399" fontSize="8.5" fontWeight="700" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>45,000L CHEMICAL</text>
          </g>

          {/* Pump 2 */}
          <g transform="translate(655, 165)">
            <circle cx="20" cy="20" r="19" fill="rgba(15, 23, 42, 0.95)" stroke="#10b981" strokeWidth="2" />
            <g className="rotate-turbine" transform="translate(20, 20)">
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#10b981" strokeWidth="2.5" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#10b981" strokeWidth="2.5" />
            </g>
            <text x="20" y="52" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 2</text>
          </g>

          {/* ================= TANK 4: Clean Drinking Water ================= */}
          <g transform="translate(740, 68)">
            {/* SOLID TANK HEADER PLATE */}
            <rect x="-8" y="-36" width="111" height="32" rx="7" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <text x="47.5" y="-18" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 4</text>
            <text x="47.5" y="-6" fill="#10b981" fontSize="9.5" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>DRINKING WATER</text>

            {/* Tank Shell */}
            <rect x="0" y="0" width="95" height="175" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" />
            <rect x="4" y={171 - (167 * (t4 / 100))} width="87" height={167 * (t4 / 100)} rx="8" fill="url(#waterGradT4)" />

            {/* Percentage Display Bubble */}
            <rect x="12" y="65" width="71" height="38" rx="8" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <text x="47.5" y="91" fill="#ffffff" fontSize="19" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{t4}%</text>

            {/* SOLID BASE PEDESTAL & BOTTOM LABEL (100% VISIBLE) */}
            <rect x="-8" y="180" width="111" height="32" rx="7" fill="#081026" stroke="#10b981" strokeWidth="2" />
            <text x="47.5" y="196" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>TANK 4: CLEAN</text>
            <text x="47.5" y="207" fill="#10b981" fontSize="8.5" fontWeight="700" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>60,000L OUTPUT</text>
          </g>

          {/* Top Network Wire */}
          <g transform="translate(80, 8)">
            <rect x="0" y="0" width="800" height="22" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
            <text x="16" y="15" fill="#38bdf8" fontSize="9.5" fontWeight="700" fontFamily="var(--font-mono)">
              NETWORK WIRE (MESSAGES BETWEEN TANKS AND COMPUTER)
            </text>
            <text x="785" y="15" fill={isAttackActive ? '#ff2a5f' : '#10b981'} fontSize="9.5" fontWeight="700" textAnchor="end" fontFamily="var(--font-mono)">
              {isAttackActive ? 'ALARM: UNKNOWN ROOT CAUSE' : isLocalized ? 'BREACH PINPOINTED' : 'STATUS: NORMAL'}
            </text>
          </g>

          {/* LASER LINE WHEN LOCALIZED */}
          {isLocalized && (
            <g>
              {targetLayer === 'SENSOR' && (
                <>
                  <line x1="480" y1="16" x2="410" y2="120" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <circle cx="410" cy="120" r="16" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                  <text x="410" y="155" fill="#ff2a5f" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 FAKE SENSOR LOCATED
                  </text>
                </>
              )}
              {targetLayer === 'COMMUNICATION_CHANNEL' && (
                <>
                  <rect x="240" y="8" width="260" height="24" fill="none" stroke="#ff2a5f" strokeWidth="3" className="laser-trace" rx="6" />
                  <text x="370" y="52" fill="#ff2a5f" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 NETWORK CABLE DELAY DETECTED
                  </text>
                </>
              )}
              {targetLayer === 'CONTROLLER' && (
                <>
                  <line x1="480" y1="16" x2="365" y2="70" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <text x="365" y="58" fill="#a855f7" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 COMPUTER BRAIN HACK LOCATED
                  </text>
                </>
              )}
              {targetLayer === 'FIRMWARE' && (
                <>
                  <line x1="480" y1="16" x2="675" y2="185" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <text x="675" y="235" fill="#f59e0b" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 BAD CODE FINGERPRINT CAUGHT
                  </text>
                </>
              )}
              {targetLayer === 'ACTUATOR' && (
                <>
                  <line x1="480" y1="16" x2="475" y2="185" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <circle cx="475" cy="185" r="16" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                  <text x="475" y="235" fill="#ff2a5f" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 MECHANICAL VALVE JAM LOCATED
                  </text>
                </>
              )}
            </g>
          )}

          {isResolved && (
            <g transform="translate(355, 14)">
              <rect x="0" y="0" width="250" height="26" rx="6" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
              <text x="125" y="17" fill="#34d399" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                🛡️ AI VIRTUAL ESTIMATOR PROTECTING PLANT
              </text>
            </g>
          )}
        </svg>

        {/* Telemetry Comparison Badge */}
        {(isAttackActive || isLocalized || isResolved) && targetLayer === 'SENSOR' && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '20px',
            background: 'rgba(10, 16, 30, 0.96)',
            border: isResolved ? '1.5px solid #10b981' : '1.5px solid #ff2a5f',
            borderRadius: '10px',
            padding: '10px 18px',
            display: 'flex',
            gap: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: isResolved ? '#6ee7b7' : '#ff7185', fontWeight: 800 }}>
                {isResolved ? 'BACKUP COMPUTER VALUE' : 'WHAT SENSOR CLAIMS'}
              </div>
              <div className="font-mono" style={{ fontSize: '1.1rem', color: isResolved ? '#34d399' : '#ff2a5f', fontWeight: 800 }}>
                {isResolved ? sensors.levelT2_true.toFixed(0) : sensors.levelT2_observed.toFixed(0)}% {isResolved ? '(Real Math)' : '(Fake / Frozen)'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 800 }}>REAL WATER IN TANK</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', color: '#00f2fe', fontWeight: 800 }}>
                {sensors.levelT2_true.toFixed(0)}% <span style={{ fontSize: '0.75rem' }}>(Physics Math)</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800 }}>VERDICT</div>
              <div style={{ fontSize: '0.85rem', color: isResolved ? '#34d399' : isLocalized ? '#ff2a5f' : '#fbbf24', fontWeight: 800, marginTop: '2px' }}>
                {isResolved ? 'All Safe & Clean' : isLocalized ? 'The Sensor Is Lying!' : 'Checking Math...'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DEDICATED 4-TANK HIGH-VISIBILITY STATUS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginTop: '16px'
      }}>
        {/* TANK 1 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid #38bdf8',
          borderRadius: '10px',
          padding: '12px 14px',
          boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.06em' }}>🚰 TANK 1</span>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              {t1}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Raw Water Intake
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            50,000L Initial Reservoir • Normal
          </div>
        </div>

        {/* TANK 2 */}
        <div style={{
          background: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 'rgba(255, 42, 95, 0.12)' : 'rgba(15, 23, 42, 0.75)',
          border: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '2px solid #ff2a5f' : '1.5px solid #00f2fe',
          borderRadius: '10px',
          padding: '12px 14px',
          boxShadow: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '0 0 16px rgba(255, 42, 95, 0.3)' : '0 4px 12px rgba(0, 242, 254, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe', letterSpacing: '0.06em' }}>
              🧪 TANK 2
            </span>
            <span style={{
              background: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 'rgba(255, 42, 95, 0.25)' : 'rgba(0, 242, 254, 0.2)',
              color: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff7185' : '#00f2fe',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {t2}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Filter Membrane Tank
          </div>
          <div style={{ fontSize: '0.72rem', color: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#fda4af' : '#94a3b8', marginTop: '2px', fontWeight: (isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? 700 : 400 }}>
            {(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '🚨 SENSOR READING FROZEN!' : '40,000L Monitored by Sensor'}
          </div>
        </div>

        {/* TANK 3 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid #34d399',
          borderRadius: '10px',
          padding: '12px 14px',
          boxShadow: '0 4px 12px rgba(52, 211, 153, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.06em' }}>🫧 TANK 3</span>
            <span style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              {t3}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Disinfection Chamber
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            45,000L Neutralizer • Safe
          </div>
        </div>

        {/* TANK 4 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid #10b981',
          borderRadius: '10px',
          padding: '12px 14px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.06em' }}>💧 TANK 4</span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              {t4}% FULL
            </span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            Clean Drinking Water
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            60,000L 100% Pure Drinkable
          </div>
        </div>
      </div>

      {/* 4 Bottom Telemetry Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginTop: '12px'
      }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>WATER INFLOW</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>{sensors.flowInflow.toFixed(1)} Liters/sec</p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>WATER OUTFLOW</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#00f2fe' }}>{sensors.flowOutflow.toFixed(1)} Liters/sec</p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>PIPE PRESSURE</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: (isAttackActive || isLocalized) && targetLayer === 'CONTROLLER' ? '#ff2a5f' : '#34d399' }}>
            {sensors.pressureBar.toFixed(1)} bar
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>WATER CLEANLINESS</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10b981' }}>100% Pure Drinkable</p>
        </div>
      </div>
    </div>
  );
}
