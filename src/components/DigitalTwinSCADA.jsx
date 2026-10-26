import React from 'react';
import { Activity, AlertOctagon, CheckCircle2, ShieldCheck, Search, ShieldAlert, Cpu, Radio, Binary, Cog, Eye, Zap, Sparkles } from 'lucide-react';
import { getBlueprintLayout, BLUEPRINT_PRESETS } from '../engine/blueprints';

export default function DigitalTwinSCADA({ state, autoStage = 0, selectedScenarioKeys = ['SENSOR_SPOOF'] }) {
  const { tanks, sensors, activeScenario, activeScenarios = [activeScenario], phase, blueprint, isLearnedReflex, learnedExperience } = state;

  const activeBlueprint = blueprint || BLUEPRINT_PRESETS.BLUEPRINT_4_CASCADE;
  const layout = getBlueprintLayout(activeBlueprint);

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
                {activeBlueprint.shortName || `${activeBlueprint.tankCount} Tanks`}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time fluid mechanics simulation across {activeBlueprint.tankCount} continuous water treatment stages
            </p>
          </div>
        </div>

        {/* Global Status Pill */}
        {isNominal && (
          <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 16px', fontWeight: 800 }}>
            <CheckCircle2 size={15} /> All {activeBlueprint.tankCount} Tanks Running Clean
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
            {isLearnedReflex ? '⚡ Learned Reflex Fix (<15ms)' : 'Fixed! Clean Water Protected (0 Downtime)'}
          </span>
        )}
      </div>

      {/* SVG Canvas Container with Live Projected HUD Overlay */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '315px',
          background: 'rgba(5, 10, 22, 0.94)',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: 'inset 0 0 45px rgba(0,0,0,0.75)',
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 960 310" style={{ width: '100%', height: '100%' }}>
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
            <line x1="0" y1="105" x2="960" y2="105" />
            <line x1="0" y1="185" x2="960" y2="185" />
            <line x1="0" y1="270" x2="960" y2="270" />
            {dynamicTanks.map((t, idx) => (
              <line key={`grid-${idx}`} x1={t.centerX} y1="0" x2={t.centerX} y2="310" />
            ))}
          </g>

          {/* ================= DYNAMIC 2-LINE TANK HEADER BADGES ================= */}
          {dynamicTanks.map((t) => {
            const isHot = t.isAttacked;
            const w = t.headerWidth;
            const h = 32;
            const hx = t.headerX;

            return (
              <g key={`header-${t.key}`} transform={`translate(${hx}, 86)`}>
                <rect
                  x="0"
                  y="0"
                  width={w}
                  height={h}
                  rx="7"
                  fill={isHot ? '#3b0d1a' : '#081026'}
                  stroke={isHot ? '#ff2a5f' : t.color}
                  strokeWidth={isHot ? '2.5' : '2'}
                />
                <text
                  x={w / 2}
                  y="14"
                  fill="#ffffff"
                  fontSize="10.5"
                  fontWeight="900"
                  textAnchor="middle"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  TANK {t.tankNum}
                </text>
                <text
                  x={w / 2}
                  y="26"
                  fill={isHot ? '#ff7185' : t.color}
                  fontSize="7.5"
                  fontWeight="800"
                  textAnchor="middle"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {isHot
                    ? (t.key === 'tank2' && isSensorAttacked ? 'SPOOFED SENSOR' : 'UNDER ATTACK')
                    : (t.name.length > 16 ? t.name.slice(0, 15) + '..' : t.name).toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Blackout HUD Banner */}
          {isPowerBlackout && (
            <g transform="translate(480, 24)">
              <rect x="-260" y="-14" width="520" height="28" rx="6" fill="rgba(234, 179, 8, 0.25)" stroke="#eab308" strokeWidth="1.5" />
              <text x="0" y="4" fill="#fef08a" fontSize="10" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                FACILITY POWER GRID: 0.0V AC • BLACKOUT DETECTED • ZERO ELECTRICITY
              </text>
            </g>
          )}

          {/* ================= DYNAMIC PIPES & ACTUATORS ================= */}
          {/* Intake Pipe into First Tank */}
          {dynamicTanks.length > 0 && (
            <g>
              <path d={`M 15 195 L ${dynamicTanks[0].x} 195`} fill="none" stroke="#00f2fe" strokeWidth="8" opacity={isPowerBlackout ? '0.1' : '0.3'} />
              <path d={`M 15 195 L ${dynamicTanks[0].x} 195`} fill="none" stroke="#38bdf8" strokeWidth="4" className={isPowerBlackout ? '' : 'pipe-flow'} />
            </g>
          )}

          {/* Interconnecting Pipes and Inline Actuators between adjacent tanks */}
          {dynamicTanks.map((t, i) => {
            if (i >= dynamicTanks.length - 1) return null;
            const nextT = dynamicTanks[i + 1];
            const x1 = t.x + t.width;
            const x2 = nextT.x;
            const midX = (x1 + x2) / 2;

            // Determine if this segment has an actuator
            const isPumpSegment = i % 2 === 0;
            const isValveSegment = i % 2 === 1;

            return (
              <g key={`pipe-actuator-${i}`}>
                {/* Pipe */}
                <path
                  d={`M ${x1} 195 L ${x2} 195`}
                  fill="none"
                  stroke={isPipeCompromised && (i === 1 || isAllPathsBlocked) ? '#ff2a5f' : '#00f2fe'}
                  strokeWidth="8"
                  opacity={isPowerBlackout ? '0.1' : '0.3'}
                />
                <path
                  d={`M ${x1} 195 L ${x2} 195`}
                  fill="none"
                  stroke={isPipeCompromised && (i === 1 || isAllPathsBlocked) ? '#ff2a5f' : '#38bdf8'}
                  strokeWidth="4"
                  className={
                    isPowerBlackout
                      ? ''
                      : isPipeCompromised && (i === 1 || isAllPathsBlocked)
                        ? 'pipe-flow-attack'
                        : 'pipe-flow-fast'
                  }
                />

                {/* Inline Pump (on even segments) */}
                {isPumpSegment && (
                  <g transform={`translate(${midX}, 195)`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill="#081026"
                      stroke={
                        isPowerBlackout
                          ? '#eab308'
                          : (isAlarmLive && (i === 0 ? isPump1Attacked : isPump2Attacked))
                            ? '#ff2a5f'
                            : '#00f2fe'
                      }
                      strokeWidth="2"
                    />
                    <g className={isPowerBlackout ? '' : 'rotate-turbine'}>
                      <line
                        x1="-9"
                        y1="0"
                        x2="9"
                        y2="0"
                        stroke={
                          isPowerBlackout
                            ? '#eab308'
                            : (isAlarmLive && (i === 0 ? isPump1Attacked : isPump2Attacked))
                              ? '#ff2a5f'
                              : '#00f2fe'
                        }
                        strokeWidth="2.5"
                      />
                      <line
                        x1="0"
                        y1="-9"
                        x2="0"
                        y2="9"
                        stroke={
                          isPowerBlackout
                            ? '#eab308'
                            : (isAlarmLive && (i === 0 ? isPump1Attacked : isPump2Attacked))
                              ? '#ff2a5f'
                              : '#00f2fe'
                        }
                        strokeWidth="2.5"
                      />
                    </g>
                    <text
                      x="0"
                      y="26"
                      fill={isPowerBlackout ? '#fef08a' : '#94a3b8'}
                      fontSize="8"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                    >
                      {isPowerBlackout ? '0V' : i === 0 ? 'PUMP 1' : 'PUMP 2'}
                    </text>
                  </g>
                )}

                {/* Inline Valve (on odd segments) */}
                {isValveSegment && (
                  <g transform={`translate(${midX}, 195)`}>
                    <polygon
                      points="-8,-7 8,0 -8,7"
                      fill={
                        isPowerBlackout && effectiveStage === 4
                          ? '#10b981'
                          : isAllPathsBlocked
                            ? effectiveStage === 4
                              ? '#10b981'
                              : '#ff2a5f'
                            : (isAlarmLive && isValveAttacked)
                              ? '#ff2a5f'
                              : '#00f2fe'
                      }
                    />
                    <polygon
                      points="8,-7 -8,0 8,7"
                      fill={
                        isPowerBlackout && effectiveStage === 4
                          ? '#10b981'
                          : isAllPathsBlocked
                            ? effectiveStage === 4
                              ? '#10b981'
                              : '#ff2a5f'
                            : (isAlarmLive && isValveAttacked)
                              ? '#ff2a5f'
                              : '#00f2fe'
                      }
                    />
                    <circle cx="0" cy="0" r="4" fill="#ffffff" />
                    <text
                      x="0"
                      y="26"
                      fill={
                        isPowerBlackout
                          ? '#fef08a'
                          : isAllPathsBlocked
                            ? '#ff7185'
                            : '#94a3b8'
                      }
                      fontSize="8"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                    >
                      {isPowerBlackout && effectiveStage === 4
                        ? 'SPRING OPEN'
                        : isAllPathsBlocked
                          ? effectiveStage === 4
                            ? 'VENTED'
                            : 'GRIDLOCKED'
                          : (isAlarmLive && isValveAttacked)
                            ? 'STUCK'
                            : 'VALVE'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Export Distribution Pipe from Last Tank to Right Margin */}
          {dynamicTanks.length > 0 && (
            <g>
              <path
                d={`M ${dynamicTanks[dynamicTanks.length - 1].x + dynamicTanks[dynamicTanks.length - 1].width} 195 L 945 195`}
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                opacity="0.3"
              />
              <path
                d={`M ${dynamicTanks[dynamicTanks.length - 1].x + dynamicTanks[dynamicTanks.length - 1].width} 195 L 945 195`}
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
                className="pipe-flow"
              />
            </g>
          )}

          {/* Overhead Bypass Conduit (Special Visualization for ALL_PATHS_BLOCKED) */}
          {isAllPathsBlocked && dynamicTanks.length >= 2 && (
            <g>
              <path
                d={`M ${dynamicTanks[1].x + dynamicTanks[1].width} 155 L ${dynamicTanks[2] ? dynamicTanks[2].x : dynamicTanks[1].x + 130} 155`}
                fill="none"
                stroke="#ff2a5f"
                strokeWidth="3"
                strokeDasharray="5,4"
              />
              <rect x="390" y="145" width="120" height="18" rx="3" fill="#081026" stroke="#ff2a5f" strokeWidth="1" />
              <text x="450" y="157" fill="#ff7185" fontSize="7.5" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                ❌ BYPASS CONDUIT BLOCKED
              </text>
            </g>
          )}

          {/* Relief Disc and Recirculation Loop when ALL_PATHS_BLOCKED is resolved */}
          {isAllPathsBlocked && effectiveStage === 4 && dynamicTanks.length >= 2 && (
            <g>
              <path
                d={`M ${dynamicTanks[1].centerX} 278 C ${dynamicTanks[1].centerX} 320, ${dynamicTanks[0].centerX} 320, ${dynamicTanks[0].centerX} 278`}
                fill="none"
                stroke="#00f2fe"
                strokeWidth="5"
                strokeDasharray="8,5"
                className="pipe-flow-fast"
              />
              <rect x="180" y="308" width="220" height="18" rx="4" fill="#081026" stroke="#00f2fe" strokeWidth="1.2" />
              <text x="290" y="321" fill="#00f2fe" fontSize="7.5" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, sans-serif' }}>
                RECIRCULATION TO TANK 1 (0L LOST)
              </text>
            </g>
          )}

          {/* ================= DYNAMIC PHYSICAL TANKS ================= */}
          {dynamicTanks.map((t) => {
            const isHot = t.isAttacked;
            const lvl = t.liveLevel;
            const waterHeight = Math.max(8, (138 * (lvl / 100)));
            const waterY = 272 - waterHeight;

            return (
              <g key={`tank-body-${t.key}`}>
                {/* Tank Outer Shell */}
                <rect
                  x={t.x}
                  y="126"
                  width={t.width}
                  height="146"
                  rx="10"
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke={isHot ? '#ff2a5f' : t.color}
                  strokeWidth={isHot ? '3' : '2'}
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

                {/* Center Percentage Bubble */}
                <rect
                  x={t.centerX - 27}
                  y="174"
                  width="54"
                  height="32"
                  rx="7"
                  fill="#081026"
                  stroke={isHot ? '#ff2a5f' : t.color}
                  strokeWidth="2"
                />
                <text
                  x={t.centerX}
                  y="196"
                  fill="#ffffff"
                  fontSize="16"
                  fontWeight="900"
                  textAnchor="middle"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {lvl}%
                </text>

                {/* Sensor Probe Indicator on Tank 2 */}
                {t.key === 'tank2' && (
                  <g transform={`translate(${t.x + t.width - 8}, 134)`}>
                    <circle cx="0" cy="0" r="9" fill={isHot ? '#ff2a5f' : '#00f2fe'} />
                    <text x="0" y="3" fill="#050811" fontSize="8.5" fontWeight="900" textAnchor="middle">S</text>
                    <text x="0" y="-11" fill={isHot ? '#ff2a5f' : '#38bdf8'} fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                      SENSOR
                    </text>
                  </g>
                )}

                {/* Mechanical Support Feet */}
                <line x1={t.x - 4} y1="274" x2={t.x + t.width + 4} y2="274" stroke={isHot ? '#ff2a5f' : t.color} strokeWidth="2.5" />
                <rect x={t.x + 8} y="274" width="10" height="5" fill={isHot ? '#ff2a5f' : t.color} />
                <rect x={t.x + t.width - 18} y="274" width="10" height="5" fill={isHot ? '#ff2a5f' : t.color} />
              </g>
            );
          })}

          {/* ================= DYNAMIC LASER THREAT TRACE ================= */}
          {isAlarmLive && (
            <g>
              {/* Top Cyber Intruder Node */}
              <circle cx="480" cy="40" r="14" fill="#ff2a5f" opacity="0.3" className="wave-anim" />
              <circle cx="480" cy="40" r="8" fill="#ff2a5f" />
              <text x="480" y="62" fill="#ff7185" fontSize="8" fontWeight="900" textAnchor="middle">
                CYBER THREAT INTRUSION
              </text>

              {/* Dynamic Laser Traces to Attacked Tanks */}
              {dynamicTanks.map((t) => {
                if (!t.isAttacked) return null;
                return (
                  <g key={`laser-${t.key}`}>
                    <line x1="480" y1="40" x2={t.centerX} y2="174" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                    <circle cx={t.centerX} cy="174" r="22" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                  </g>
                );
              })}

              {/* Laser Trace to Valve if Valve is Attacked */}
              {isValveAttacked && (
                <g>
                  <line x1="480" y1="40" x2="455" y2="195" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                  <circle cx="455" cy="195" r="18" fill="none" stroke="#ff2a5f" strokeWidth="2.5" className="wave-anim" />
                </g>
              )}

              {/* Laser Trace to Pump 1 if Pump 1 is Attacked */}
              {isPump1Attacked && dynamicTanks.length >= 2 && (
                <g>
                  <line x1="480" y1="40" x2={(dynamicTanks[0].x + dynamicTanks[0].width + dynamicTanks[1].x) / 2} y2="195" stroke="url(#laserGrad)" strokeWidth="3" className="laser-trace" />
                </g>
              )}
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
          alignItems: 'flex-start',
          gap: '14px',
          width: '100%',
          minHeight: '64px',
          height: 'auto',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: isAttackActive
              ? 'rgba(255, 42, 95, 0.2)'
              : isLocalized
                ? 'rgba(0, 242, 254, 0.2)'
                : isResolved
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isAttackActive ? '#ff2a5f' : isLocalized ? '#00f2fe' : '#10b981'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}
        >
          {isAttackActive ? (
            <AlertOctagon size={20} color="#ff2a5f" />
          ) : isLocalized ? (
            <Search size={20} color="#00f2fe" />
          ) : isResolved ? (
            <ShieldCheck size={20} color="#10b981" />
          ) : (
            <CheckCircle2 size={20} color="#10b981" />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.88rem',
              fontWeight: 900,
              letterSpacing: '0.03em',
              color: isAttackActive
                ? '#ff7185'
                : isLocalized
                  ? '#38bdf8'
                  : isResolved
                    ? '#34d399'
                    : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <span>
              {isNominal && `NORMAL OPERATION: ALL ${activeBlueprint.tankCount} TANKS BALANCED & CLEAN`}
              {isAttackActive &&
                `⚠️ FACILITY ALARM: ${scns.length > 1
                  ? `${scns.length} ATTACK VECTORS ACTIVE`
                  : (scns[0]?.name || 'ANOMALY DETECTED').toUpperCase()
                }`}
              {isLocalized &&
                `🎯 TARGET PINPOINTED IN 38ms: ${scns
                  .map((s) => s.target)
                  .join(' & ')}`}
              {isResolved &&
                (isLearnedReflex
                  ? '⚡ LEARNED REFLEX APPLIED (<15ms RECTIFICATION)'
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
              style={{ fontSize: '0.66rem', padding: '2px 8px' }}
            >
              {isNominal && 'PHYSICS IN SYNC'}
              {isAttackActive && 'PHYSICAL LAW AUDIT RUNNING'}
              {isLocalized && 'ROOT CAUSE ISOLATED'}
              {isResolved && (isLearnedReflex ? 'LEARNED FROM PAST FEEDBACK' : '100% OPERATIONAL')}
            </span>
          </div>

          <p
            style={{
              fontSize: '0.82rem',
              lineHeight: 1.55,
              color: '#e2e8f0',
              margin: '6px 0 0 0',
              fontWeight: 500
            }}
          >
            {isNominal && (
              <>
                All {activeBlueprint.tankCount} treatment tanks in the {activeBlueprint.name} blueprint are operating at full efficiency. Continuous fluid mass conservation (Inflow = Outflow) is satisfied with zero anomalies.
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
                AquaShield cross-verified physical mass balance across all {activeBlueprint.tankCount} tanks without trusting the compromised reading.
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

      {/* DEDICATED DYNAMIC STATUS CARDS FOR ALL ACTIVE TANKS */}
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
                  {t.liveLevel}%
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: isHot ? '#fda4af' : '#94a3b8', marginTop: '2px', fontWeight: isHot ? 800 : 400 }}>
                {isHot ? '🚨 COMPROMISED' : `${(t.capacity / 1000).toFixed(0)}kL • Normal`}
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
          <p className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: sensors.pressureBar > 4.5 ? '#ff2a5f' : '#34d399', marginTop: '2px' }}>
            {sensors.pressureBar.toFixed(2)} Bar
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