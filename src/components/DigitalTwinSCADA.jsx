import React from 'react';
import { Activity, AlertOctagon, CheckCircle2, ShieldCheck, Search, ShieldAlert, Cpu, Radio, Binary, Cog, Eye, Zap, Sparkles } from 'lucide-react';
import { getBlueprintLayout, BLUEPRINT_PRESETS } from '../engine/blueprints';

export default function DigitalTwinSCADA({ state, autoStage = 0, selectedScenarioKeys = ['SENSOR_SPOOF'] }) {
  const { tanks, sensors, activeScenario, activeScenarios = [activeScenario], phase, blueprint, isLearnedReflex, learnedExperience } = state;

  const activeBlueprint = blueprint || BLUEPRINT_PRESETS.BLUEPRINT_4_CASCADE;
  const layout = getBlueprintLayout(activeBlueprint);
  const count = activeBlueprint.tankCount || 4;

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

  // Active attack scenarios
  const scns = activeScenarios && activeScenarios.length > 0 ? activeScenarios : [activeScenario];

  // ---- PER-COMPONENT TARGET RESOLUTION ----
  const LAYER_DEFAULT_NODE = {
    SENSOR: 'tank2',
    COMMUNICATION_CHANNEL: 'wire',
    CONTROLLER: 'pump1',
    FIRMWARE: 'pump2',
    ACTUATOR: 'valve'
  };

  const resolveNode = (s) => {
    if (!s || s.id === 'NONE') return null;
    const n = s.targetNode || LAYER_DEFAULT_NODE[s.layer] || null;
    if (n === 'controller') return 'pump1';
    if (n === 'firmware') return 'pump2';
    return n;
  };

  const hitNodes = new Set(scns.map(resolveNode).filter(Boolean));

  const isPump1Attacked = hitNodes.has('pump1');
  const isPump2Attacked = hitNodes.has('pump2');
  const isValveAttacked = hitNodes.has('valve') || hitNodes.has('valve2');
  const isWireAttacked = hitNodes.has('wire');

  const isAlarmLive = isAttackActive || isLocalized;
  const isSensorAttacked = hitNodes.has('tank2') && scns.some(s => s?.layer === 'SENSOR' && resolveNode(s) === 'tank2');
  const isNetworkAttacked = isWireAttacked;
  const isControllerAttacked = isPump1Attacked;
  const isFirmwareAttacked = isPump2Attacked;
  const isActuatorAttacked = isValveAttacked;

  const isAllPathsBlocked = scns.some(s => s?.id === 'ALL_PATHS_BLOCKED' || s?.isAllPathsBlocked);
  const isPowerBlackout = scns.some(s => s?.id === 'POWER_GRID_BLACKOUT' || s?.isPowerBlackout);
  const isPipeCompromised = isAlarmLive && (isWireAttacked || isValveAttacked || isAllPathsBlocked);

  // Dynamic tank layouts with active live levels
  const dynamicTanks = layout.tanks.map((t, idx) => {
    const liveTank = tanks[t.key] || t;
    const level = Math.round(liveTank.level ?? t.level);
    const isAttacked = isAlarmLive && (hitNodes.has(t.key) || (t.key === 'tank2' && isSensorAttacked));
    return {
      ...t,
      liveLevel: level,
      isAttacked,
      tankNum: idx + 1
    };
  });

  // Dynamic component anchor coordinates (Pipe centerline at y = 185)
  const pipeY = 185;
  const t1 = dynamicTanks[0] || { x: 56, width: 90, centerX: 101 };
  const t2 = dynamicTanks[1] || { x: 250, width: 90, centerX: 295 };
  const t3 = dynamicTanks[2] || { x: 440, width: 90, centerX: 485 };
  const t4 = dynamicTanks[3] || { x: 630, width: 90, centerX: 675 };
  const lastTank = dynamicTanks[dynamicTanks.length - 1];

  // Specific Actuator Positions:
  // Pump 1: Gap between Tank 1 & 2
  const pump1Pos = {
    x: (t1.x + t1.width + t2.x) / 2,
    y: pipeY
  };

  // Valve 1: Gap between Tank 2 & 3
  const valve1Pos = {
    x: (t2.x + t2.width + t3.x) / 2,
    y: pipeY
  };

  // Pump 2: If 4 or 5 tanks, gap between Tank 3 & 4. If 6 tanks, gap between Tank 4 & 5.
  const pump2Pos = count === 6
    ? { x: (dynamicTanks[3].x + dynamicTanks[3].width + dynamicTanks[4].x) / 2, y: pipeY }
    : count >= 4
      ? { x: (t3.x + t3.width + t4.x) / 2, y: pipeY }
      : { x: (t1.x + t1.width + t2.x) / 2, y: pipeY };

  // Valve 2: If 5 tanks, gap between Tank 4 & 5. If 6 tanks, gap between Tank 5 & 6.
  const valve2Pos = count === 5
    ? { x: (dynamicTanks[3].x + dynamicTanks[3].width + dynamicTanks[4].x) / 2, y: pipeY }
    : count === 6
      ? { x: (dynamicTanks[4].x + dynamicTanks[4].width + dynamicTanks[5].x) / 2, y: pipeY }
      : null;

  // Determine threat target coordinate for clean overhead routing (NO diagonal slicing!)
  let threatTargetX = t2.centerX;
  let threatTargetY = 120;

  if (isControllerAttacked) {
    threatTargetX = pump1Pos.x;
    threatTargetY = 145;
  } else if (isFirmwareAttacked) {
    threatTargetX = pump2Pos.x;
    threatTargetY = 145;
  } else if (isActuatorAttacked) {
    threatTargetX = valve1Pos.x;
    threatTargetY = pipeY;
  } else if (isNetworkAttacked) {
    threatTargetX = 540;
    threatTargetY = 50;
  } else {
    // Tank targets
    const attackedTank = dynamicTanks.find(t => t.isAttacked);
    if (attackedTank) {
      threatTargetX = attackedTank.centerX;
      threatTargetY = attackedTank.y;
    }
  }

  // Safe observed level on Tank 2 during spoofing
  const displayLevelT2 = (isSensorAttacked && !isResolved) ? 32 : (dynamicTanks[1]?.liveLevel ?? 68);

  return (
    <div
      id="scada-facility-section"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="font-display" style={{ fontSize: '1.15rem', letterSpacing: '0.04em', color: '#f8fafc', fontWeight: 900 }}>
                CLEAN WATER RECYCLING FACILITY (DIGITAL TWIN SCADA)
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.66rem', padding: '1px 8px' }}>
                {activeBlueprint.shortName || `${count} Tanks`}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time fluid mechanics simulation across {count} continuous water treatment stages
            </p>
          </div>
        </div>

        {/* Global Status Pill */}
        {isNominal && (
          <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <CheckCircle2 size={15} /> All {count} Tanks Running Clean
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
            <CheckCircle2 size={15} />
            {isLearnedReflex ? '✦ Learned Reflex Fix (<15ms)' : 'Fixed! Clean Water Protected (0 Downtime)'}
          </span>
        )}
      </div>

      {/* SVG Canvas Container with Live Projected HUD Overlay */}
      {/* Spacious 1080x380 resolution ensures generous room for tanks, equipment, and dedicated lower callouts */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '395px',
          background: 'rgba(5, 10, 22, 0.94)',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: 'inset 0 0 45px rgba(0,0,0,0.75)',
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 1080 380" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="waterGradGeneral" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="waterGradHot" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff2a5f" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#99002b" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2a5f" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#ff2a5f" stopOpacity="1" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Background Technical Grid lines */}
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
            <line x1="0" y1="95" x2="1080" y2="95" />
            <line x1="0" y1="185" x2="1080" y2="185" />
            <line x1="0" y1="260" x2="1080" y2="260" />
            {dynamicTanks.map((t, idx) => (
              <line key={`grid-${idx}`} x1={t.centerX} y1="0" x2={t.centerX} y2="380" />
            ))}
          </g>

          {/* ================= LAYER 2: INDUSTRIAL MODBUS NETWORK BUS (y=50) ================= */}
          <g>
            {/* Main horizontal fieldbus cable at y=50 */}
            <path
              d={`M ${t1.x} 50 L ${lastTank.x + lastTank.width} 50`}
              fill="none"
              stroke={isNetworkAttacked ? '#ff2a5f' : 'rgba(56, 189, 248, 0.45)'}
              strokeWidth={isNetworkAttacked ? '3' : '2'}
              strokeDasharray={isNetworkAttacked ? '6,3' : '4,3'}
              className={isNetworkAttacked ? 'laser-trace' : ''}
            />
            {/* Drop taps down to each tank header at y=68 */}
            {dynamicTanks.map((t, idx) => (
              <g key={`wire-tap-${idx}`}>
                <line
                  x1={t.centerX}
                  y1="50"
                  x2={t.centerX}
                  y2="68"
                  stroke={isNetworkAttacked ? '#ff2a5f' : 'rgba(56, 189, 248, 0.45)'}
                  strokeWidth="1.5"
                />
                <circle cx={t.centerX} cy="50" r="3" fill={isNetworkAttacked ? '#ff2a5f' : '#00f2fe'} />
              </g>
            ))}
            {/* Bus label */}
            <text
              x={t1.x}
              y="44"
              fill={isNetworkAttacked ? '#ff7185' : '#64748b'}
              fontSize="7.5"
              fontWeight="800"
              fontFamily="var(--font-mono)"
            >
              MODBUS TCP INDUSTRIAL RING BUS (100 Mbps)
            </text>

            {/* Network Cable Attack Callout (Mounted safely above the tanks at y=36) */}
            {isNetworkAttacked && effectiveStage > 0 && (
              <g transform="translate(540, 36)">
                <rect x="-95" y="-12" width="190" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.96" />
                <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {effectiveStage === 1 && '⚠️ PACKET JITTER +385ms (DELAY)'}
                  {effectiveStage === 2 && '🧠 TIMESTAMPS LATE • TANKS SAFE'}
                  {effectiveStage === 3 && '🎯 BUS CONGESTION ISOLATED'}
                  {effectiveStage === 4 && '🛡️ BACKUP RING ACTIVE (38ms)'}
                </text>
              </g>
            )}
          </g>

          {/* ================= DYNAMIC 2-LINE TANK HEADER BADGES (y=68, height=32) ================= */}
          {dynamicTanks.map((t) => {
            const isHot = t.isAttacked;
            const w = t.headerWidth;
            const h = 32;
            const hx = t.headerX;

            // Clean short name to avoid truncation
            const cleanShortNames = {
              'TNK-101': 'RAW INTAKE',
              'TNK-102': count >= 5 ? 'FILTER / BIO' : 'FILTRATION',
              'TNK-103': count === 3 ? 'CLEAN SUPPLY' : count >= 5 ? 'MEMBRANE UF' : 'DISINFECTION',
              'TNK-104': count === 4 ? 'DRINKING WATER' : count === 5 ? 'REVERSE OSMOSIS' : 'RO TRAIN-B',
              'TNK-105': count === 5 ? 'POTABLE EXPORT' : 'REMINERALIZER',
              'TNK-106': 'POTABLE EXPORT'
            };

            const headerRole = isHot
              ? (t.key === 'tank2' && isSensorAttacked ? 'SPOOFED SENSOR' : 'UNDER ATTACK')
              : (cleanShortNames[t.id] || t.role.split(' ')[0] || 'WATER TANK');

            return (
              <g key={`header-${t.key}`} transform={`translate(${hx}, 68)`}>
                <rect
                  x="0"
                  y="0"
                  width={w}
                  height={h}
                  rx="6"
                  fill={isHot ? '#3b0d1a' : '#081026'}
                  stroke={isHot ? '#ff2a5f' : t.color}
                  strokeWidth={isHot ? '2.2' : '1.5'}
                />
                <text
                  x={w / 2}
                  y="13"
                  fill="#ffffff"
                  fontSize={count >= 5 ? '9.5' : '10.5'}
                  fontWeight="900"
                  textAnchor="middle"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  TANK {t.tankNum}
                </text>
                <text
                  x={w / 2}
                  y="25"
                  fill={isHot ? '#ff7185' : t.color}
                  fontSize={count >= 5 ? '7.5' : '8'}
                  fontWeight="800"
                  textAnchor="middle"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {headerRole}
                </text>
              </g>
            );
          })}

          {/* Blackout HUD Banner (Mounted at y=20) */}
          {isPowerBlackout && (
            <g transform="translate(540, 20)">
              <rect x="-260" y="-12" width="520" height="24" rx="5" fill="rgba(234, 179, 8, 0.25)" stroke="#eab308" strokeWidth="1.5" />
              <text x="0" y="4" fill="#fef08a" fontSize="9.5" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                ⚠ FACILITY POWER GRID: 0.0V AC • BLACKOUT DETECTED • ZERO ELECTRICITY
              </text>
            </g>
          )}

          {/* ================= DYNAMIC PIPES & ACTUATORS (y=185) ================= */}
          {/* Intake Pipe into First Tank */}
          <g>
            <path d={`M 10 185 L ${t1.x} 185`} fill="none" stroke="#00f2fe" strokeWidth="8" opacity={isPowerBlackout ? '0.1' : '0.3'} />
            <path d={`M 10 185 L ${t1.x} 185`} fill="none" stroke="#38bdf8" strokeWidth="4" className={isPowerBlackout ? '' : 'pipe-flow'} />
          </g>

          {/* Connecting pipes between consecutive tanks */}
          {dynamicTanks.map((currTank, i) => {
            if (i >= dynamicTanks.length - 1) return null;
            const nextTank = dynamicTanks[i + 1];
            const x1 = currTank.x + currTank.width;
            const x2 = nextTank.x;

            const isThisPipeCompromised = isAlarmLive && (
              isPipeCompromised ||
              (currTank.isAttacked && nextTank.isAttacked)
            );

            return (
              <g key={`pipe-${i}`}>
                <path
                  d={`M ${x1} 185 L ${x2} 185`}
                  fill="none"
                  stroke={isThisPipeCompromised ? '#ff2a5f' : '#00f2fe'}
                  strokeWidth="8"
                  opacity={isPowerBlackout ? '0.1' : '0.3'}
                />
                <path
                  d={`M ${x1} 185 L ${x2} 185`}
                  fill="none"
                  stroke={isThisPipeCompromised ? '#ff2a5f' : '#38bdf8'}
                  strokeWidth="4"
                  className={isPowerBlackout ? '' : isThisPipeCompromised ? 'pipe-flow-attack' : 'pipe-flow-fast'}
                />
              </g>
            );
          })}

          {/* PUMP 1 (Feed Booster) between Tank 1 & 2 */}
          <g transform={`translate(${pump1Pos.x}, ${pump1Pos.y})`}>
            {/* PLC Industrial Controller mounted above Pump 1 in generous inter-tank gap */}
            <g transform="translate(0, -42)">
              <rect
                x="-24"
                y="-10"
                width="48"
                height="20"
                rx="4"
                fill="#081026"
                stroke={isControllerAttacked ? '#a855f7' : 'rgba(168, 85, 247, 0.45)'}
                strokeWidth={isControllerAttacked ? '2.5' : '1.2'}
              />
              <text x="0" y="3" fill={isControllerAttacked ? '#e9d5ff' : '#c084fc'} fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">
                PLC-101
              </text>
              <line x1="0" y1="10" x2="0" y2="24" stroke={isControllerAttacked ? '#a855f7' : 'rgba(168, 85, 247, 0.4)'} strokeWidth="1.5" strokeDasharray="2,2" />
            </g>

            {/* Pump 1 Volute */}
            <circle
              cx="0"
              cy="0"
              r="16"
              fill="#081026"
              stroke={
                isPowerBlackout
                  ? '#eab308'
                  : isControllerAttacked
                    ? '#a855f7'
                    : (isAlarmLive && isPump1Attacked)
                      ? '#ff2a5f'
                      : '#00f2fe'
              }
              strokeWidth="2"
            />
            {/* Impeller blades */}
            <g className={isPowerBlackout ? '' : 'rotate-turbine'}>
              <line x1="-9" y1="0" x2="9" y2="0" stroke={isPowerBlackout ? '#eab308' : isControllerAttacked ? '#a855f7' : '#00f2fe'} strokeWidth="2.2" />
              <line x1="0" y1="-9" x2="0" y2="9" stroke={isPowerBlackout ? '#eab308' : isControllerAttacked ? '#a855f7' : '#00f2fe'} strokeWidth="2.2" />
            </g>
            <text x="0" y="26" fill={isPowerBlackout ? '#fef08a' : isControllerAttacked ? '#c084fc' : '#94a3b8'} fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
              {isPowerBlackout ? '0V' : 'PUMP 1'}
            </text>
          </g>

          {/* VALVE 1 (Emergency Diverter) between Tank 2 & 3 - CLEAN FLANGED INDUSTRIAL VALVE */}
          <g transform={`translate(${valve1Pos.x}, ${valve1Pos.y})`}>
            {/* Flanged Valve Body Housing */}
            <rect
              x="-11"
              y="-9"
              width="22"
              height="18"
              rx="3"
              fill="#081026"
              stroke={
                isPowerBlackout && effectiveStage === 4
                  ? '#10b981'
                  : isAllPathsBlocked
                    ? effectiveStage === 4
                      ? '#10b981'
                      : '#ff2a5f'
                    : isActuatorAttacked
                      ? '#ff2a5f'
                      : '#00f2fe'
              }
              strokeWidth="1.8"
            />
            {/* Valve flanges */}
            <line x1="-11" y1="-9" x2="-11" y2="9" stroke={isActuatorAttacked ? '#ff2a5f' : '#00f2fe'} strokeWidth="2.5" />
            <line x1="11" y1="-9" x2="11" y2="9" stroke={isActuatorAttacked ? '#ff2a5f' : '#00f2fe'} strokeWidth="2.5" />
            {/* Valve stem */}
            <line x1="0" y1="-9" x2="0" y2="-14" stroke={isActuatorAttacked ? '#ff2a5f' : '#00f2fe'} strokeWidth="2" />
            {/* Actuator solenoid / handwheel */}
            <ellipse cx="0" cy="-15" rx="6" ry="2.2" fill={isActuatorAttacked ? '#ff2a5f' : '#00f2fe'} />
            {/* Center disc port */}
            <circle cx="0" cy="0" r="3.5" fill={isActuatorAttacked ? '#ff2a5f' : '#ffffff'} />

            {/* Clean Valve Label */}
            <text
              x="0"
              y="26"
              fill={
                isPowerBlackout
                  ? '#fef08a'
                  : isAllPathsBlocked
                    ? '#ff7185'
                    : isActuatorAttacked
                      ? '#ff7185'
                      : '#94a3b8'
              }
              fontSize="8"
              fontWeight="800"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              {isPowerBlackout && effectiveStage === 4
                ? 'SPRING OPEN'
                : isAllPathsBlocked
                  ? effectiveStage === 4
                    ? 'VENTED'
                    : 'BLOCKED'
                  : isActuatorAttacked
                    ? 'STUCK JAM'
                    : 'VALVE 1'}
            </text>
          </g>

          {/* PUMP 2 (Booster & Firmware ROM) */}
          {count >= 4 && (
            <g transform={`translate(${pump2Pos.x}, ${pump2Pos.y})`}>
              {/* Firmware ROM Chip mounted above Pump 2 in generous inter-tank gap */}
              <g transform="translate(0, -42)">
                <rect
                  x="-24"
                  y="-10"
                  width="48"
                  height="20"
                  rx="4"
                  fill="#081026"
                  stroke={isFirmwareAttacked ? '#f59e0b' : 'rgba(245, 158, 11, 0.45)'}
                  strokeWidth={isFirmwareAttacked ? '2.5' : '1.2'}
                />
                <text x="0" y="3" fill={isFirmwareAttacked ? '#fef08a' : '#fbbf24'} fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">
                  ROM-VFD
                </text>
                <line x1="0" y1="10" x2="0" y2="24" stroke={isFirmwareAttacked ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)'} strokeWidth="1.5" strokeDasharray="2,2" />
              </g>

              {/* Pump 2 Volute */}
              <circle
                cx="0"
                cy="0"
                r="16"
                fill="#081026"
                stroke={
                  isPowerBlackout
                    ? '#eab308'
                    : isFirmwareAttacked
                      ? '#f59e0b'
                      : (isAlarmLive && isPump2Attacked)
                        ? '#ff2a5f'
                        : '#10b981'
                }
                strokeWidth="2"
              />
              {/* Impeller blades */}
              <g className={isPowerBlackout ? '' : 'rotate-turbine'}>
                <line x1="-9" y1="0" x2="9" y2="0" stroke={isPowerBlackout ? '#eab308' : isFirmwareAttacked ? '#f59e0b' : '#10b981'} strokeWidth="2.2" />
                <line x1="0" y1="-9" x2="0" y2="9" stroke={isPowerBlackout ? '#eab308' : isFirmwareAttacked ? '#f59e0b' : '#10b981'} strokeWidth="2.2" />
              </g>
              <text x="0" y="26" fill={isPowerBlackout ? '#fef08a' : isFirmwareAttacked ? '#fbbf24' : '#94a3b8'} fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                {isPowerBlackout ? '0V' : 'PUMP 2'}
              </text>
            </g>
          )}

          {/* VALVE 2 (for 5 or 6 tanks) - Clean Flanged Design */}
          {valve2Pos && (
            <g transform={`translate(${valve2Pos.x}, ${valve2Pos.y})`}>
              <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#081026" stroke="#10b981" strokeWidth="1.8" />
              <line x1="-10" y1="-8" x2="-10" y2="8" stroke="#10b981" strokeWidth="2.2" />
              <line x1="10" y1="-8" x2="10" y2="8" stroke="#10b981" strokeWidth="2.2" />
              <line x1="0" y1="-8" x2="0" y2="-13" stroke="#10b981" strokeWidth="1.8" />
              <ellipse cx="0" cy="-14" rx="5" ry="2" fill="#10b981" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              <text x="0" y="26" fill="#94a3b8" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                VALVE 2
              </text>
            </g>
          )}

          {/* Export Distribution Pipe from Last Tank to Right Margin */}
          <g>
            <path
              d={`M ${lastTank.x + lastTank.width} 185 L 1070 185`}
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              opacity={isPowerBlackout ? '0.1' : '0.35'}
            />
            <path
              d={`M ${lastTank.x + lastTank.width} 185 L 1070 185`}
              fill="none"
              stroke="#34d399"
              strokeWidth="4"
              className={isPowerBlackout ? '' : 'pipe-flow-fast'}
            />
          </g>

          {/* ================= DYNAMIC PHYSICAL TANKS (y=116, height=138) ================= */}
          {dynamicTanks.map((t, idx) => {
            const isHot = t.isAttacked;
            const lvl = t.key === 'tank2' ? displayLevelT2 : t.liveLevel;
            const waterHeight = Math.max(8, (132 * (lvl / 100)));
            const waterY = 254 - waterHeight;

            return (
              <g key={`tank-body-${t.key}`}>
                {/* Tank Outer Shell */}
                <rect
                  x={t.x}
                  y="116"
                  width={t.width}
                  height="138"
                  rx="10"
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke={isHot ? '#ff2a5f' : t.color}
                  strokeWidth={isHot ? '3' : '1.8'}
                  opacity={isHot ? '1' : '0.85'}
                />

                {/* Water Fluid Level Fill */}
                <rect
                  x={t.x + 3}
                  y={waterY}
                  width={t.width - 6}
                  height={waterHeight}
                  rx="8"
                  fill={isHot ? 'url(#waterGradHot)' : 'url(#waterGradGeneral)'}
                  className="wave-anim"
                />

                {/* Center Percentage Bubble (centered at y=185) */}
                <rect
                  x={t.centerX - 26}
                  y="171"
                  width="52"
                  height="28"
                  rx="7"
                  fill="#081026"
                  stroke={isHot ? '#ff2a5f' : t.color}
                  strokeWidth="1.8"
                />
                <text
                  x={t.centerX}
                  y="189"
                  fill="#ffffff"
                  fontSize={count >= 5 ? '13.5' : '15'}
                  fontWeight="900"
                  textAnchor="middle"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {lvl}%
                </text>

                {/* Sensor Probe Indicator on Tank 2 (The Sensor Tank) */}
                {t.key === 'tank2' && (
                  <g transform={`translate(${t.x + t.width - 6}, 122)`}>
                    <circle cx="0" cy="0" r="8" fill={isSensorAttacked ? '#ff2a5f' : '#00f2fe'} />
                    <text x="0" y="3" fill="#050811" fontSize="7.5" fontWeight="900" textAnchor="middle">S</text>
                    <text x="0" y="-10" fill={isSensorAttacked ? '#ff2a5f' : '#38bdf8'} fontSize="6.8" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                      SENSOR
                    </text>
                  </g>
                )}

                {/* Mechanical Support Feet */}
                <line x1={t.x - 3} y1="254" x2={t.x + t.width + 3} y2="254" stroke={isHot ? '#ff2a5f' : t.color} strokeWidth="2.2" />
                <rect x={t.x + 6} y="254" width="8" height="4" fill={isHot ? '#ff2a5f' : t.color} />
                <rect x={t.x + t.width - 14} y="254" width="8" height="4" fill={isHot ? '#ff2a5f' : t.color} />
              </g>
            );
          })}

          {/* ================= ZONE 5: DEDICATED LOWER TELEMETRY & CALLOUT TIER (y=265 to 375) ================= */}
          {/* Unobstructed dedicated tier below tanks: NO clipping, NO overlapping tank bodies! */}
          <line x1="30" y1="266" x2="1050" y2="266" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="3,3" />

          {/* ROW A (y=278): Component 1 (Pump 1 PLC), Component 3 (Valve 1), Component 5 (Valve 2) */}
          {/* 1. Pump 1 / Controller (PLC-101) Callout at y=278 */}
          {isControllerAttacked && effectiveStage > 0 && (
            <g transform={`translate(${pump1Pos.x}, 278)`}>
              <line x1="0" y1="-56" x2="0" y2="0" stroke={effectiveStage === 4 ? '#10b981' : '#a855f7'} strokeWidth="1.5" strokeDasharray="2,2" />
              <rect x="-64" y="0" width="128" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#a855f7'} opacity="0.96" />
              <text x="0" y="14" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {effectiveStage === 1 && '⚠️ PLC HIJACK: 8.5 BAR'}
                {effectiveStage === 2 && '🧠 BURST LIMIT DETECTED'}
                {effectiveStage === 3 && '🎯 PLC HIJACK ISOLATED'}
                {effectiveStage === 4 && '🛡️ CLAMPED TO 3.2 BAR'}
              </text>
            </g>
          )}

          {/* 2. Valve 1 Actuator Jam Callout at y=278 */}
          {!isAllPathsBlocked && !isPowerBlackout && isActuatorAttacked && effectiveStage > 0 && (
            <g transform={`translate(${valve1Pos.x}, 278)`}>
              <line x1="0" y1="-56" x2="0" y2="0" stroke={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} strokeWidth="1.5" strokeDasharray="2,2" />
              <rect x="-64" y="0" width="128" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.96" />
              <text x="0" y="14" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {effectiveStage === 1 && '⚠️ JAMMED 100% OPEN'}
                {effectiveStage === 2 && '🧠 DRAIN LEAK 65 L/s'}
                {effectiveStage === 3 && '🎯 GATE JAM ISOLATED'}
                {effectiveStage === 4 && '🛡️ DIVERTER SEALED TO T3'}
              </text>
            </g>
          )}

          {/* 3. Valve 2 (if present and attacked) at y=278 */}
          {valve2Pos && hitNodes.has('valve2') && effectiveStage > 0 && (
            <g transform={`translate(${valve2Pos.x}, 278)`}>
              <line x1="0" y1="-56" x2="0" y2="0" stroke={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} strokeWidth="1.5" strokeDasharray="2,2" />
              <rect x="-64" y="0" width="128" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.96" />
              <text x="0" y="14" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {effectiveStage === 1 && '⚠️ VALVE 2 JAMMED'}
                {effectiveStage === 2 && '🧠 OUTFLOW LEAK AUDITED'}
                {effectiveStage === 3 && '🎯 VALVE 2 ISOLATED'}
                {effectiveStage === 4 && '🛡️ DIVERTER SECURED'}
              </text>
            </g>
          )}

          {/* ROW B (y=322): Component 2 (Tank 2 Sensor), Component 4 (Pump 2 ROM), and Gridlock Alerts */}
          {/* 1. Tank 2 Sensor Spoof Callout at y=322 */}
          {isSensorAttacked && effectiveStage > 0 && (
            <g transform={`translate(${t2.centerX}, 322)`}>
              <line x1="0" y1="-64" x2="0" y2="0" stroke={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} strokeWidth="1.5" strokeDasharray="2,2" />
              <rect x="-62" y="0" width="124" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.96" />
              <text x="0" y="14" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {effectiveStage === 1 && '⚠️ FROZEN AT 32%'}
                {effectiveStage === 2 && '🧠 AUDITING MASS FLOW'}
                {effectiveStage === 3 && '🎯 SENSOR SPOOF LOCKED'}
                {effectiveStage === 4 && '🛡️ ESTIMATOR ON • TRUE 68%'}
              </text>
            </g>
          )}

          {/* 2. Pump 2 / Firmware (ROM-VFD) Callout at y=322 */}
          {isFirmwareAttacked && effectiveStage > 0 && (
            <g transform={`translate(${pump2Pos.x}, 322)`}>
              <line x1="0" y1="-100" x2="0" y2="0" stroke={effectiveStage === 4 ? '#10b981' : '#f59e0b'} strokeWidth="1.5" strokeDasharray="2,2" />
              <rect x="-64" y="0" width="128" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#f59e0b'} opacity="0.96" />
              <text x="0" y="14" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {effectiveStage === 1 && '⚠️ CORRUPTED FIRMWARE'}
                {effectiveStage === 2 && '🧠 120Hz VIBRATION SPIKE'}
                {effectiveStage === 3 && '🎯 ROOTKIT PINPOINTED'}
                {effectiveStage === 4 && '🛡️ CLEAN FIRMWARE RESTORED'}
              </text>
            </g>
          )}

          {/* 3. All Paths Blocked Callout at y=322 */}
          {isAllPathsBlocked && effectiveStage > 0 && (
            <g transform={`translate(${(t2.centerX + t3.centerX) / 2}, 322)`}>
              <rect x="-95" y="0" width="190" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.96" />
              <text x="0" y="14" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {effectiveStage === 1 && '⚠️ ALL PATHS BLOCKED: 0 L/s'}
                {effectiveStage === 2 && '🧠 HYDRAULIC SURGE (7.8 BAR)'}
                {effectiveStage === 3 && '🎯 BLOCKAGE CONDUITS ISOLATED'}
                {effectiveStage === 4 && '🛡️ RECIRCULATION LOOP VENTED'}
              </text>
            </g>
          )}

          {/* 4. Custom Zero-Day Attacks on any other tanks at y=322 */}
          {dynamicTanks.filter(t => t.key !== 'tank2' && t.isAttacked && effectiveStage > 0).map(t => (
            <g key={`callout-custom-${t.key}`} transform={`translate(${t.centerX}, 322)`}>
              <line x1="0" y1="-64" x2="0" y2="0" stroke={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} strokeWidth="1.5" strokeDasharray="2,2" />
              <rect x="-60" y="0" width="120" height="22" rx="5" fill={effectiveStage === 4 ? '#10b981' : '#ff2a5f'} opacity="0.96" />
              <text x="0" y="14" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {effectiveStage === 1 && '⚠️ PROCESS ANOMALY'}
                {effectiveStage === 2 && '🧠 INVARIANT AUDIT'}
                {effectiveStage === 3 && '🎯 DEFECT PINPOINTED'}
                {effectiveStage === 4 && '🛡️ BALANCED (0 DOWNTIME)'}
              </text>
            </g>
          ))}

          {/* ================= CLEAN OVERHEAD THREAT BEACON & ORTHOGONAL ROUTE ================= */}
          {/* Routes along overhead tray at y=18, NEVER cutting across tanks or text! */}
          {isAlarmLive && (
            <g>
              {/* Top Cyber Threat Intruder Beacon */}
              <circle cx="540" cy="18" r="12" fill="#ff2a5f" opacity="0.25" className="wave-anim" />
              <circle cx="540" cy="18" r="6" fill="#ff2a5f" />
              <text x="540" y="10" fill="#ff7185" fontSize="7.5" fontWeight="900" textAnchor="middle" letterSpacing="0.05em">
                CYBER INTRUSION DETECTED
              </text>

              {/* Orthogonal overhead rail (Zero Tank Intersect!) */}
              <path
                d={`M 540 18 L ${threatTargetX} 18 L ${threatTargetX} ${threatTargetY - 18}`}
                fill="none"
                stroke="url(#laserGrad)"
                strokeWidth="2.5"
                className="laser-trace"
              />

              {/* Concentric pulsing target crosshair over the compromised component */}
              <circle cx={threatTargetX} cy={threatTargetY - 18} r="14" fill="none" stroke="#ff2a5f" strokeWidth="2" className="wave-anim" />
              <circle cx={threatTargetX} cy={threatTargetY - 18} r="5" fill="#ff2a5f" />
            </g>
          )}
        </svg>
      </div>

      {/* ================= REAL-WORLD SWaT / KAGGLE DATASET INJECTION HUD ================= */}
      {activeScenario?.isSwatReplay && (
        <div
          className="glass-panel"
          style={{
            marginTop: '14px',
            padding: '14px 18px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1.5px solid #06b6d4',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#22d3ee', letterSpacing: '0.04em' }}>
                📡 REAL-WORLD SWaT TESTBED DATA INJECTED: {activeScenario.swatAttack?.targetSensor || activeScenario.target}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#67e8f9', background: 'rgba(6, 182, 212, 0.2)', padding: '2px 8px', borderRadius: '10px' }}>
                {activeScenario.swatAttack?.kaggleIndex || 'SWaT Dataset Replay'}
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              <strong>Difference from normal buttons:</strong> Normal buttons run synthetic code. This injects actual recorded physical hardware sensor logs from the Singapore SUTD water plant testbed.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase' }}>Physical Ground Truth (Reality)</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {activeScenario.swatAttack?.injectedPhysicsState ? Object.values(activeScenario.swatAttack.injectedPhysicsState)[0] : 'Inflow 2.52 m³/h'}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 42, 95, 0.08)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255, 42, 95, 0.25)' }}>
              <div style={{ fontSize: '0.66rem', color: '#fb7185', textTransform: 'uppercase' }}>Hacker Injected Signal</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ff2a5f', marginTop: '2px' }}>
                {activeScenario.swatAttack?.attackValue || 'Manipulated sensor telemetry'}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ fontSize: '0.66rem', color: '#6ee7b7', textTransform: 'uppercase' }}>AquaShield Live Fix</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                {activeScenario.swatAttack?.remedyApplied || 'Corrected in 38.2ms with 0 plant downtime'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DYNAMIC EXPANDING LIVE EXPLANATION BANNER ================= */}
      <div
        className="glass-panel"
        style={{
          marginTop: '14px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: isAttackActive
            ? 'rgba(255, 42, 95, 0.12)'
            : isLocalized
              ? 'rgba(0, 242, 254, 0.12)'
              : isResolved
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(15, 23, 42, 0.85)',
          border: isAttackActive
            ? '1.5px solid #ff2a5f'
            : isLocalized
              ? '1.5px solid #00f2fe'
              : isResolved
                ? '1.5px solid #10b981'
                : '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: isAttackActive
            ? '0 0 20px rgba(255, 42, 95, 0.2)'
            : isResolved
              ? '0 0 20px rgba(16, 185, 129, 0.2)'
              : 'none',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}
      >
        <div style={{ marginTop: '2px' }}>
          {isNominal && <ShieldCheck size={26} color="#10b981" />}
          {isAttackActive && <AlertOctagon size={26} color="#ff2a5f" />}
          {isLocalized && <Search size={26} color="#00f2fe" />}
          {isResolved && <CheckCircle2 size={26} color="#10b981" />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              className="font-display"
              style={{
                fontSize: '0.92rem',
                fontWeight: 900,
                color: isAttackActive
                  ? '#ff2a5f'
                  : isLocalized
                    ? '#00f2fe'
                    : isResolved
                      ? '#10b981'
                      : '#38bdf8',
                letterSpacing: '0.04em'
              }}
            >
              {isNominal && `FACILITY NOMINAL STATUS • ACTIVE BLUEPRINT: ${activeBlueprint.name.toUpperCase()}`}
              {isAttackActive &&
                `FACILITY ALARM: ${scns
                  .map((s) => s.name)
                  .join(' + ')
                  .toUpperCase()}`}
              {isLocalized &&
                `TARGET PINPOINTED IN 38ms: ${scns
                  .map((s) => s.target)
                  .join(' & ')}`}
              {isResolved &&
                (isLearnedReflex
                  ? '✦ LEARNED REFLEX APPLIED (<15ms RECTIFICATION)'
                  : '🛡️ AUTONOMOUS SELF-HEALING COMPLETE (ZERO DOWNTIME)')}
            </span>
            <span
              className={
                isAttackActive
                  ? 'badge badge-rose'
                  : isLocalized
                    ? 'badge badge-cyan'
                    : 'badge badge-emerald'
              }
              style={{ fontSize: '0.66rem', textTransform: 'uppercase' }}
            >
              {isAttackActive && 'Physical Law Audit Running'}
              {isLocalized && 'Anomaly Localized'}
              {isResolved && 'Clean Water Safe'}
              {isNominal && 'Synchronized'}
            </span>
          </div>

          <p
            style={{
              fontSize: '0.84rem',
              lineHeight: 1.5,
              color: '#e2e8f0',
              margin: '6px 0 0 0',
              fontWeight: 500
            }}
          >
            {isNominal && (
              <>
                All {count} treatment tanks in the {activeBlueprint.name} blueprint are operating at full efficiency. Continuous fluid mass conservation (Inflow = Outflow) is satisfied with zero anomalies.
              </>
            )}

            {isAttackActive && (
              <>
                <strong>What happened:</strong>{' '}
                {scns.length === 1
                  ? scns[0].symptom
                  : `Multiple breaches injected across facility: ${scns.map(s => s.symptom).join(' | ')}.`}
                {' '}Old security tools are confused and cannot pinpoint whether a sensor is broken or if pipes are physically ruptured. AquaShield AI is auditing fluid dynamics equations in real-time.
              </>
            )}

            {isLocalized && (
              <>
                <strong>Root Cause Isolated:</strong>{' '}
                AquaShield cross-verified physical mass balance across all {count} tanks without trusting the compromised reading.
                {' '}Target pinpointed to{' '}
                <strong style={{ color: '#00f2fe' }}>
                  {scns.map(s => `${s.target} (${s.layerName})`).join(' and ')}
                </strong>
                .{' '}
                {scns.length === 1
                  ? scns[0].plainMathProof
                  : 'Mass flow conservation equations identified the exact faulty points while verifying all remaining stages are completely safe.'}
              </>
            )}

            {isResolved && (
              <>
                <strong>Autonomous Fix Deployed:</strong>{' '}
                {isLearnedReflex && (
                  <span style={{ color: '#34d399', fontWeight: 800 }}>
                    [Adaptive Memory Reflex] Rectified in 12ms using verified countermeasure policy from Incident #{learnedExperience?.id}!{' '}
                  </span>
                )}
                {scns.length === 1
                  ? scns[0].plainFix
                  : `All ${scns.length} compromised layers autonomously neutralized in parallel: physical backup flow estimation engaged and bypass valves rerouted clean water.`}
                {' '}Drinking water supply continues uninterrupted without human intervention or plant shutdown.
              </>
            )}
          </p>
        </div>
      </div>

      {/* ================= SENSOR TELEMETRY COMPARISON STRIP (DURING SENSOR SPOOF) ================= */}
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
              {isResolved ? '68%' : '32%'}{' '}
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {isResolved ? '(Calculated via Mass Flow Math)' : '(Fake / Frozen Reading)'}
              </span>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>
              REAL PHYSICAL WATER IN TANK
            </div>
            <div className="font-mono" style={{ fontSize: '1.25rem', color: '#00f2fe', fontWeight: 900 }}>
              68%{' '}
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

      {/* ================= DYNAMIC STATUS CARDS FOR ALL ACTIVE TANKS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${dynamicTanks.length}, 1fr)`,
          gap: '10px',
          marginTop: '14px'
        }}
      >
        {dynamicTanks.map((t) => {
          const isHot = t.isAttacked;
          const lvl = t.key === 'tank2' ? displayLevelT2 : t.liveLevel;

          return (
            <div
              key={`card-${t.key}`}
              style={{
                background: isHot ? 'rgba(255, 42, 95, 0.12)' : 'rgba(15, 23, 42, 0.75)',
                border: isHot ? '2px solid #ff2a5f' : `1.5px solid ${t.color}`,
                borderRadius: '10px',
                padding: '10px 12px',
                boxShadow: isHot ? '0 0 16px rgba(255, 42, 95, 0.3)' : `0 4px 12px rgba(0, 0, 0, 0.2)`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: isHot ? '#ff2a5f' : t.color, letterSpacing: '0.04em' }}>
                  TANK {t.tankNum}
                </span>
                <span
                  style={{
                    background: isHot ? 'rgba(255, 42, 95, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isHot ? '#ff7185' : '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}
                >
                  {lvl}% FULL
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: isHot ? '#fda4af' : '#94a3b8', marginTop: '2px', fontWeight: isHot ? 800 : 400 }}>
                {isHot ? (t.key === 'tank2' && isSensorAttacked ? '🚨 SENSOR READING FROZEN!' : '🚨 COMPROMISED') : `${(t.capacity / 1000).toFixed(0)}kL • Normal`}
              </div>
            </div>
          );
        })}
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
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: isPowerBlackout ? '#eab308' : '#38bdf8', marginTop: '2px' }}>
            {isPowerBlackout ? '0.0 L/s (0V Blackout)' : `${sensors.flowInflow.toFixed(1)} Liters/sec`}
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>WATER OUTFLOW</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: isPowerBlackout && effectiveStage === 4 ? '#10b981' : isAllPathsBlocked && effectiveStage < 4 ? '#ff2a5f' : '#00f2fe', marginTop: '2px' }}>
            {isPowerBlackout && effectiveStage === 4
              ? '18.5 L/s (Gravity Siphon)'
              : isAllPathsBlocked && effectiveStage < 4
                ? '0.0 L/s (Gridlock Jam)'
                : `${sensors.flowOutflow.toFixed(1)} Liters/sec`}
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>HYDRAULIC PRESSURE</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: (isAlarmLive && isControllerAttacked) || sensors.pressureBar > 4.5 ? '#ff2a5f' : isPowerBlackout ? '#eab308' : '#34d399', marginTop: '2px' }}>
            {isControllerAttacked && !isResolved ? '8.20 Bar (BURST DANGER)' : `${sensors.pressureBar.toFixed(2)} Bar`}
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>DISINFECTION CHLORINE</span>
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {sensors.chlorinePpm.toFixed(2)} ppm (Safe)
          </p>
        </div>
      </div>
    </div>
  );
}