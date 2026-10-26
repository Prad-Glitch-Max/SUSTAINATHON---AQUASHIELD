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
      border: isAttackActive ? '1px solid #ff2a5f' : isLocalized ? '1px solid #00f2fe' : '1px solid rgba(56,189,248,0.2)'
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
              Real-time physical water flow through 4 treatment tanks
            </p>
          </div>
        </div>

        {/* Phase Pill */}
        {isNominal && (
          <span className="badge badge-emerald" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            <CheckCircle2 size={14} /> All 4 Tanks Running Clean
          </span>
        )}

        {isAttackActive && (
          <span className="badge badge-rose" style={{ animation: 'pulse-border 1s infinite alternate', fontSize: '0.75rem', padding: '4px 12px' }}>
            <AlertOctagon size={14} /> Alarm Sounding! (Old tools don't know why)
          </span>
        )}

        {isLocalized && (
          <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            AquaShield Found Origin: {activeScenario.target}
          </span>
        )}

        {isResolved && (
          <span className="badge badge-emerald" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            <CheckCircle2 size={14} /> Fixed! Clean Water Protected (0 Downtime)
          </span>
        )}
      </div>

      {/* SVG Canvas for SCADA Facility */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '330px',
        background: 'rgba(5, 10, 22, 0.75)',
        borderRadius: '12px',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
      }}>
        <svg viewBox="0 0 960 330" style={{ width: '100%', height: '100%' }}>
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
              <stop offset="50%" stopColor="#ff2a5f" stopOpacity="1" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
            <line x1="0" y1="80" x2="960" y2="80" />
            <line x1="0" y1="165" x2="960" y2="165" />
            <line x1="0" y1="250" x2="960" y2="250" />
            <line x1="240" y1="0" x2="240" y2="330" />
            <line x1="480" y1="0" x2="480" y2="330" />
            <line x1="720" y1="0" x2="720" y2="330" />
          </g>

          {/* Pipes */}
          <path d="M 20 180 L 100 180" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 20 180 L 100 180" fill="none" stroke="#38bdf8" strokeWidth="4" className="pipe-flow" />

          <path d="M 195 230 L 255 230 L 255 180 L 320 180" fill="none" stroke="#00f2fe" strokeWidth="8" opacity="0.3" />
          <path d="M 195 230 L 255 230 L 255 180 L 320 180" fill="none" stroke="#00f2fe" strokeWidth="4" className="pipe-flow-fast" />

          <path d="M 415 180 L 520 180" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#00f2fe'} strokeWidth="8" opacity="0.3" />
          <path d="M 415 180 L 520 180" fill="none" stroke={isPipeCompromised ? '#ff2a5f' : '#34d399'} strokeWidth="4" className={isPipeCompromised ? 'pipe-flow-attack' : 'pipe-flow'} />

          <path d="M 615 230 L 675 230 L 675 180 L 740 180" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 615 230 L 675 230 L 675 180 L 740 180" fill="none" stroke="#10b981" strokeWidth="4" className="pipe-flow-fast" />

          <path d="M 835 180 L 940 180" fill="none" stroke="#10b981" strokeWidth="8" opacity="0.3" />
          <path d="M 835 180 L 940 180" fill="none" stroke="#34d399" strokeWidth="4" className="pipe-flow" />

          {/* TANK 1: Raw Water */}
          <g transform="translate(100, 70)">
            <rect x="0" y="0" width="95" height="175" rx="10" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" />
            <rect x="4" y={171 - (167 * (t1 / 100))} width="87" height={167 * (t1 / 100)} rx="8" fill="url(#waterGradT1)" className="wave-anim" />
            <text x="47" y="24" fill="#f1f5f9" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">TANK 1</text>
            <text x="47" y="38" fill="#94a3b8" fontSize="9" textAnchor="middle">RAW WATER</text>
            <text x="47" y="95" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">{t1}%</text>
          </g>

          {/* Pump 1 */}
          <g transform="translate(235, 160)">
            <circle cx="20" cy="20" r="18" fill="rgba(15, 23, 42, 0.95)" stroke="#00f2fe" strokeWidth="2" />
            <g className="rotate-turbine" transform="translate(20, 20)">
              <line x1="-11" y1="0" x2="11" y2="0" stroke="#00f2fe" strokeWidth="2.5" />
              <line x1="0" y1="-11" x2="0" y2="11" stroke="#00f2fe" strokeWidth="2.5" />
            </g>
            <text x="20" y="50" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 1</text>
          </g>

          {/* TANK 2: Filter Tank (Sensor Target) */}
          <g transform="translate(320, 70)">
            <rect
              x="0"
              y="0"
              width="95"
              height="175"
              rx="10"
              fill="rgba(15, 23, 42, 0.9)"
              stroke={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : 'rgba(0, 242, 254, 0.5)'}
              strokeWidth={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '3' : '2'}
            />
            <rect x="4" y={171 - (167 * (t2 / 100))} width="87" height={167 * (t2 / 100)} rx="8" fill="url(#waterGradT2)" />
            <text x="47" y="24" fill="#f1f5f9" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">TANK 2</text>
            <text x="47" y="38" fill="#94a3b8" fontSize="9" textAnchor="middle">FILTER TANK</text>
            <text x="47" y="95" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">{t2}%</text>

            {/* SENSOR PROBE ON TANK 2 */}
            <g transform="translate(80, 40)">
              <circle cx="10" cy="10" r="10" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#00f2fe'} />
              <text x="10" y="14" fill="#050811" fontSize="10" fontWeight="900" textAnchor="middle">S</text>
              <text x="10" y="-4" fill={(isAttackActive || isLocalized) && targetLayer === 'SENSOR' ? '#ff2a5f' : '#38bdf8'} fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">SENSOR</text>
            </g>
          </g>

          {/* Valve / Actuator */}
          <g transform="translate(455, 160)">
            <polygon points="10,10 30,20 10,30" fill={(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? '#ff2a5f' : '#00f2fe'} />
            <polygon points="30,10 10,20 30,30" fill={(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? '#ff2a5f' : '#00f2fe'} />
            <circle cx="20" cy="20" r="5" fill="#ffffff" />
            <text x="20" y="44" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">
              {(isAttackActive || isLocalized) && targetLayer === 'ACTUATOR' ? 'STUCK VALVE' : 'VALVE'}
            </text>
          </g>

          {/* TANK 3: Disinfection */}
          <g transform="translate(520, 70)">
            <rect x="0" y="0" width="95" height="175" rx="10" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="2" />
            <rect x="4" y={171 - (167 * (t3 / 100))} width="87" height={167 * (t3 / 100)} rx="8" fill="url(#waterGradT3)" />
            <text x="47" y="24" fill="#f1f5f9" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">TANK 3</text>
            <text x="47" y="38" fill="#94a3b8" fontSize="9" textAnchor="middle">DISINFECTION</text>
            <text x="47" y="95" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">{t3}%</text>
          </g>

          {/* Pump 2 */}
          <g transform="translate(655, 160)">
            <circle cx="20" cy="20" r="18" fill="rgba(15, 23, 42, 0.95)" stroke="#10b981" strokeWidth="2" />
            <g className="rotate-turbine" transform="translate(20, 20)">
              <line x1="-11" y1="0" x2="11" y2="0" stroke="#10b981" strokeWidth="2.5" />
              <line x1="0" y1="-11" x2="0" y2="11" stroke="#10b981" strokeWidth="2.5" />
            </g>
            <text x="20" y="50" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">PUMP 2</text>
          </g>

          {/* TANK 4: Clean Drinking Water */}
          <g transform="translate(740, 70)">
            <rect x="0" y="0" width="95" height="175" rx="10" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="2" />
            <rect x="4" y={171 - (167 * (t4 / 100))} width="87" height={167 * (t4 / 100)} rx="8" fill="url(#waterGradT4)" />
            <text x="47" y="24" fill="#f1f5f9" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">TANK 4</text>
            <text x="47" y="38" fill="#94a3b8" fontSize="9" textAnchor="middle">DRINKING WATER</text>
            <text x="47" y="95" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">{t4}%</text>
            <text x="47" y="120" fill="#10b981" fontSize="9.5" textAnchor="middle" fontFamily="var(--font-mono)">100% CLEAN</text>
          </g>

          {/* Top Network Wire */}
          <g transform="translate(80, 18)">
            <rect x="0" y="0" width="800" height="24" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
            <text x="16" y="16" fill="#38bdf8" fontSize="9.5" fontWeight="700" fontFamily="var(--font-mono)">
              NETWORK WIRE (MESSAGES BETWEEN TANKS AND COMPUTER)
            </text>
            <text x="785" y="16" fill={isAttackActive ? '#ff2a5f' : '#10b981'} fontSize="9.5" fontWeight="700" textAnchor="end" fontFamily="var(--font-mono)">
              {isAttackActive ? 'ALARM: UNKNOWN ROOT CAUSE' : isLocalized ? 'BREACH PINPOINTED' : 'STATUS: NORMAL'}
            </text>
          </g>

          {/* LASER LINE WHEN LOCALIZED */}
          {isLocalized && (
            <g>
              {targetLayer === 'SENSOR' && (
                <>
                  <line x1="480" y1="20" x2="410" y2="120" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <circle cx="410" cy="120" r="16" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                  <text x="410" y="155" fill="#ff2a5f" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 FAKE SENSOR LOCATED
                  </text>
                </>
              )}
              {targetLayer === 'COMMUNICATION_CHANNEL' && (
                <>
                  <rect x="240" y="15" width="260" height="30" fill="none" stroke="#ff2a5f" strokeWidth="3" className="laser-trace" rx="6" />
                  <text x="370" y="62" fill="#ff2a5f" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 NETWORK CABLE DELAY DETECTED
                  </text>
                </>
              )}
              {targetLayer === 'CONTROLLER' && (
                <>
                  <line x1="480" y1="20" x2="365" y2="70" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <text x="365" y="60" fill="#a855f7" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 COMPUTER BRAIN HACK LOCATED
                  </text>
                </>
              )}
              {targetLayer === 'FIRMWARE' && (
                <>
                  <line x1="480" y1="20" x2="675" y2="180" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <text x="675" y="235" fill="#f59e0b" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 BAD CODE FINGERPRINT CAUGHT
                  </text>
                </>
              )}
              {targetLayer === 'ACTUATOR' && (
                <>
                  <line x1="480" y1="20" x2="475" y2="180" stroke="url(#laserGrad)" strokeWidth="4" className="laser-trace" />
                  <circle cx="475" cy="180" r="16" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                  <text x="475" y="230" fill="#ff2a5f" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                    🚨 MECHANICAL VALVE JAM LOCATED
                  </text>
                </>
              )}
            </g>
          )}

          {isResolved && (
            <g transform="translate(355, 26)">
              <rect x="0" y="0" width="250" height="28" rx="6" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
              <text x="125" y="18" fill="#34d399" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                🛡️ AI VIRTUAL ESTIMATOR PROTECTING PLANT
              </text>
            </g>
          )}
        </svg>

        {/* Plain English Telemetry Overlay */}
        {(isAttackActive || isLocalized || isResolved) && targetLayer === 'SENSOR' && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '20px',
            background: 'rgba(10, 16, 30, 0.95)',
            border: isResolved ? '1px solid #10b981' : '1px solid #ff2a5f',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: isResolved ? '#6ee7b7' : '#ff7185', fontWeight: 700 }}>
                {isResolved ? 'BACKUP COMPUTER VALUE' : 'WHAT SENSOR CLAIMS'}
              </div>
              <div className="font-mono" style={{ fontSize: '1.05rem', color: isResolved ? '#34d399' : '#ff2a5f', fontWeight: 800 }}>
                {isResolved ? sensors.levelT2_true.toFixed(0) : sensors.levelT2_observed.toFixed(0)}% {isResolved ? '(Real Math)' : '(Fake / Frozen)'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>REAL WATER IN TANK</div>
              <div className="font-mono" style={{ fontSize: '1.05rem', color: '#00f2fe', fontWeight: 800 }}>
                {sensors.levelT2_true.toFixed(0)}% <span style={{ fontSize: '0.75rem' }}>(Physics Math)</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>VERDICT</div>
              <div style={{ fontSize: '0.8rem', color: isResolved ? '#34d399' : isLocalized ? '#ff2a5f' : '#fbbf24', fontWeight: 700, marginTop: '2px' }}>
                {isResolved ? 'All Safe & Clean' : isLocalized ? 'The Sensor Is Lying!' : 'Checking Math...'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Bottom Telemetry Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginTop: '14px'
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
