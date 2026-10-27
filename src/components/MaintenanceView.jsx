import React, { useState, useMemo } from 'react';
import Section, { openSection } from './Section';
import {
  Wrench,
  Activity,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  Droplets,
  AlertCircle,
  Calendar,
  UserCheck,
  Cpu,
  Sparkles,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEffects';

// Catalog of physical sensors and actuators in the clean water facility
const INITIAL_COMPONENTS = [
  {
    id: 'AIT_501',
    name: 'Potable Chlorine Residual Sensor',
    tag: 'AIT-501',
    category: 'Water Quality Probe',
    location: 'Tank 6 (Potable Export)',
    type: 'Membrane-covered Amperometric Sensor',
    currentWear: 72.4, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 1400,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    liveTelemetry: { metric: 'Chlorine', value: '2.05 ppm' },
    simpleDescription: 'Measures chemical disinfectant in finished drinking water to ensure zero pathogens reach the public.',
    riskIfDamaged: 'Under-chlorination risks bacteria outbreak; over-chlorination creates toxic chemical byproducts.',
    physicalWearCause: 'Chloramine deposits coat the permeable membrane and chemical electrolyte slowly depletes.',
    trendPoints: [
      { hour: 0, wear: 0 },
      { hour: 280, wear: 16.5 },
      { hour: 570, wear: 34.0 },
      { hour: 860, wear: 52.8 },
      { hour: 1143, wear: 72.4 }
    ]
  },
  {
    id: 'PIT_401',
    name: 'Reverse Osmosis Pressure Sensor',
    tag: 'PIT-401',
    category: 'Pressure Sensor',
    location: 'Tank 4 (RO Train-B)',
    type: 'Piezoresistive Stainless Steel Diaphragm',
    currentWear: 58.2, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 2200,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    liveTelemetry: { metric: 'Feed Pressure', value: '7.80 Bar' },
    simpleDescription: 'Tracks high-pressure water pushing through desalination membranes to filter out salts and heavy metals.',
    riskIfDamaged: 'Cannot detect membrane tears or sudden pipe-rupturing pressure spikes.',
    physicalWearCause: 'Mechanical diaphragm micro-flexing under high saline pressure (6.5 to 8.2 Bar).',
    trendPoints: [
      { hour: 0, wear: 0 },
      { hour: 280, wear: 12.0 },
      { hour: 570, wear: 26.5 },
      { hour: 860, wear: 41.0 },
      { hour: 1143, wear: 58.2 }
    ]
  },
  {
    id: 'LIT_201',
    name: 'Filter Basin Ultrasonic Level Sensor',
    tag: 'LIT-201',
    category: 'Water Level Sensor',
    location: 'Tank 2 (Filter / Bio)',
    type: 'Acoustic Sound-Wave Transducer',
    currentWear: 32.0, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 3200,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    liveTelemetry: { metric: 'Water Level', value: '76% Full' },
    simpleDescription: 'Bounces sound pulses off the water surface to know exact water depth and prevent tank overflow.',
    riskIfDamaged: 'False empty readings cause intake booster pumps to suck air and burn out motors.',
    physicalWearCause: 'Moisture vapor condensation on ultrasonic acoustic horn and crystal micro-aging.',
    trendPoints: [
      { hour: 0, wear: 0 },
      { hour: 280, wear: 7.2 },
      { hour: 570, wear: 15.0 },
      { hour: 860, wear: 23.5 },
      { hour: 1143, wear: 32.0 }
    ]
  },
  {
    id: 'FIT_101',
    name: 'Raw Intake Magnetic Flowmeter',
    tag: 'FIT-101',
    category: 'Flow Rate Sensor',
    location: 'Tank 1 (Raw Intake)',
    type: 'Electromagnetic Induction Sensor',
    currentWear: 18.5, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 4000,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    liveTelemetry: { metric: 'Intake Velocity', value: '42.5 L/s' },
    simpleDescription: 'Measures raw seawater or river water volume entering the facility to balance overall plant equations.',
    riskIfDamaged: 'Plant cannot detect hidden pipe leaks or water theft.',
    physicalWearCause: 'Abrasive suspended grit and sand particles scouring the inner insulating liner.',
    trendPoints: [
      { hour: 0, wear: 0 },
      { hour: 280, wear: 4.0 },
      { hour: 570, wear: 8.8 },
      { hour: 860, wear: 13.5 },
      { hour: 1143, wear: 18.5 }
    ]
  },
  {
    id: 'PUMP_101',
    name: 'Primary Intake Booster Pump',
    tag: 'P-101',
    category: 'Mechanical Actuator',
    location: 'Interconnect (Tank 1 → 2)',
    type: 'Centrifugal Impeller & Electric Motor',
    currentWear: 44.0, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 2600,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    liveTelemetry: { metric: 'Shaft Speed', value: '1,450 RPM' },
    simpleDescription: 'Spins stainless-steel impellers to lift and push heavy water volumes through secondary filtration.',
    riskIfDamaged: 'Pump seizure halts plant forward intake and cuts off drinking water generation.',
    physicalWearCause: 'Shaft seal friction, bearing micro-vibration, and cavitation pitting on impeller blades.',
    trendPoints: [
      { hour: 0, wear: 0 },
      { hour: 280, wear: 10.5 },
      { hour: 570, wear: 21.0 },
      { hour: 860, wear: 32.2 },
      { hour: 1143, wear: 44.0 }
    ]
  },
  {
    id: 'VALVE_201',
    name: 'Motorized Diverter Bypass Valve',
    tag: 'MV-201',
    category: 'Mechanical Actuator',
    location: 'Interconnect (Tank 2 → 3)',
    type: 'Stainless Steel Motorized Butterfly Valve',
    currentWear: 29.0, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 3500,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    liveTelemetry: { metric: 'Gate Position', value: '100% Open' },
    simpleDescription: 'Rotates an internal stainless disc to direct water flow into treatment or divert dirty backwash wash-water.',
    riskIfDamaged: 'Valve jams shut, trapping pressurized water and causing pipe overpressure ruptures.',
    physicalWearCause: 'Elastomeric seal compression hardening and electric actuator gearbox backlash.',
    trendPoints: [
      { hour: 0, wear: 0 },
      { hour: 280, wear: 6.5 },
      { hour: 570, wear: 13.8 },
      { hour: 860, wear: 21.2 },
      { hour: 1143, wear: 29.0 }
    ]
  }
];

export default function MaintenanceView() {
  const [components, setComponents] = useState(INITIAL_COMPONENTS);
  const [selectedId, setSelectedId] = useState('AIT_501');
    const [notification, setNotification] = useState(null);

  // Power Outage / Physical Shock Simulator
  const [outageDuration, setOutageDuration] = useState('30');
  const [outageScenario, setOutageScenario] = useState('POWER_BLACKOUT');
  const [outageReport, setOutageReport] = useState(null);

  // Maintenance & Service History Log
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: 'Today, 02:45 AM',
      tag: 'AIT-501',
      title: 'Preventive Warning: Chlorine Probe Reached 70% Wear',
      type: 'PREVENTIVE_ALERT',
      detail: 'AquaShield AI flagged chemical electrolyte depletion. Human technician dispatched with replacement probe.'
    },
    {
      id: 2,
      timestamp: 'Yesterday, 18:20 PM',
      tag: 'PIT-401',
      title: 'Hydraulic Pressure Surge Deflection',
      type: 'CYBER_WEAR',
      detail: 'Hacker valve jam triggered 7.8 Bar pressure transient. Diaphragm sustained +1.4% accelerated mechanical fatigue.'
    },
    {
      id: 3,
      timestamp: '3 Days Ago',
      tag: 'LIT-201',
      title: 'Human Tech: Routine Acoustic Cleaning',
      type: 'HUMAN_SERVICE',
      detail: 'Certified technician wiped transducer face and verified 4-20mA loop accuracy against physical dipstick.'
    }
  ]);

  const selectedComponent = components.find(c => c.id === selectedId) || components[0];

  // Plant-wide aggregate health score
  const aggregateHealth = useMemo(() => {
    const totalWear = components.reduce((acc, c) => acc + c.currentWear, 0);
    const avgWear = totalWear / components.length;
    return Math.round(100 - avgWear);
  }, [components]);

  const attentionCount = useMemo(() => {
    return components.filter(c => c.currentWear >= 60).length;
  }, [components]);

  // ACTION: Replace Individual Component
  const handleReplaceComponent = (componentId) => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#047857', '#0891b2', '#0e7490']
      });
    } catch {}

    const comp = components.find(c => c.id === componentId);
    if (!comp) return;

    setComponents(prev =>
      prev.map(c => {
        if (c.id === componentId) {
          return {
            ...c,
            currentWear: 0.0,
            hoursInService: 0.0,
            trendPoints: [
              { hour: 0, wear: 0 },
              { hour: 40, wear: 0.8 }
            ]
          };
        }
        return c;
      })
    );

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      {
        id: Date.now(),
        timestamp: `Just now (${nowTime})`,
        tag: comp.tag,
        title: `Physical Replacement Completed: ${comp.name}`,
        type: 'REPLACED',
        detail: `Human technician installed fresh physical hardware on ${comp.location}. AquaShield digital twin recalibrated to 100% health.`
      },
      ...prev
    ]);

    setNotification(`Fresh ${comp.name} (${comp.tag}) installed by technician. Digital twin recalibrated to 100% Health!`);
    setTimeout(() => setNotification(null), 5000);
  };

  // ACTION: Replace All Degraded Components (The user's explicit request!)
  const handleReplaceAll = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#059669', '#0891b2', '#0e7490', '#047857', '#8b5cf6']
      });
    } catch {}

    setComponents(prev =>
      prev.map(c => ({
        ...c,
        currentWear: 0.0,
        hoursInService: 0.0,
        trendPoints: [
          { hour: 0, wear: 0 },
          { hour: 40, wear: 0.8 }
        ]
      }))
    );

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      {
        id: Date.now(),
        timestamp: `Just now (${nowTime})`,
        tag: 'ALL-HARDWARE',
        title: 'Full Facility Overhaul: All Sensors & Actuators Replaced',
        type: 'REPLACED_ALL',
        detail: 'On-site maintenance crew completed comprehensive hardware overhaul across all 6 stages. All physical units renewed to 100% baseline.'
      },
      ...prev
    ]);

    setNotification('Full Plant Refurbishment Complete: All 6 sensors & actuators refreshed with new hardware (100% Health restored)!');
    setTimeout(() => setNotification(null), 6000);
  };

  // ACTION: Outage & Physical Shock Simulator
  const handleAssessOutageDamage = () => {
    sound.playClick();
    const durationMins = parseInt(outageDuration, 10);

    let wearIncrease = 3.5;
    let headline = 'Moderate Reverse Hydraulic Pressure Wave';
    let summary = `A ${durationMins}-minute power disruption caused booster pumps to stop while water momentum continued forward, creating an abrupt 4.2 Bar reverse water-hammer oscillation.`;

    if (outageScenario === 'POWER_BLACKOUT') {
      if (durationMins >= 60) {
        wearIncrease = 7.5;
        headline = 'Severe Vacuum & Cavitation Shock';
        summary = `During the ${durationMins}-minute complete blackout, back-siphoning created negative pressure (-0.6 Bar), straining pump mechanical seals and causing micro-cavitation.`;
      }
    } else if (outageScenario === 'WATER_HAMMER') {
      wearIncrease = durationMins >= 30 ? 11.5 : 6.0;
      headline = 'Destructive Hydraulic Water Hammer Shock';
      summary = `Sudden valve shut-off while pumps ran at full blast created an 8.6 Bar kinetic shockwave. Piezoresistive pressure diaphragms and pump bearings absorbed peak stress.`;
    } else if (outageScenario === 'CHEMICAL_SURGE') {
      wearIncrease = 5.0;
      headline = 'Chlorine Residual Probe Chemical Saturation';
      summary = `Over-concentrated chemical dosing batch coated sensor electrodes, accelerating electrolyte consumption by 3.2x.`;
    }

    setComponents(prev =>
      prev.map(c => {
        let boost = wearIncrease;
        if (outageScenario === 'CHEMICAL_SURGE' && c.id === 'AIT_501') boost *= 1.7;
        if (outageScenario === 'WATER_HAMMER' && (c.id === 'PIT_401' || c.id === 'PUMP_101')) boost *= 1.5;

        const newWear = Math.min(100, Math.round((c.currentWear + boost) * 10) / 10);
        return { ...c, currentWear: newWear };
      })
    );

    setOutageReport({
      headline,
      summary,
      wearIncrease,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setLogs(prev => [
      {
        id: Date.now(),
        timestamp: 'Just now',
        tag: 'STRESS-TEST',
        title: `Simulated Shock: ${headline}`,
        type: 'CYBER_WEAR',
        detail: `${summary} (Increased physical component wear by +${wearIncrease}%).`
      },
      ...prev
    ]);
  };

  // Forecast Remaining Useful Life (RUL) for selected component
  const remainingHours = Math.max(
    0,
    Math.round(
      ((selectedComponent.replacementThreshold - selectedComponent.currentWear) /
        (selectedComponent.currentWear > 0 ? selectedComponent.currentWear / (selectedComponent.hoursInService || 1) : 0.05))
    )
  );
  const remainingDays = (remainingHours / 24).toFixed(1);

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & HIGH-LEVEL OVERVIEW BAR                       */}
      {/* ============================================================== */}
      <Section id="maint-overview" title="Plant health overview" subtitle="Overall equipment condition at a glance" icon={ShieldCheck} defaultOpen>
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(18, 35, 31, 0.08)',
          background: 'var(--frost)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(14, 116, 144, 0.15)',
              border: '1.5px solid #0e7490',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Wrench size={22} color="#0e7490" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                PLANT MAINTENANCE & SENSOR CONDITION LOG
              </h2>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(14, 116, 144, 0.15)',
                  color: '#0e7490',
                  border: '1px solid rgba(14, 116, 144, 0.3)'
                }}
              >
                CPS HARDWARE TELEMETRY
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#5a6b65', margin: '4px 0 0 0' }}>
              Predicts physical sensor damage, schedules human technician repairs, and recalibrates the digital twin.
            </p>
          </div>
        </div>

        {/* Action Buttons: Replace All & Learn How it Works */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Explanation Toggle */}
          <button
            onClick={() => openSection('maint-how')}
            className="glass-panel"
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(18, 35, 31, 0.12)',
              background: 'var(--frost)',
              color: '#5a6b65',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Info size={14} />
            <span>How Replacement Works</span>
            <ChevronDown size={14} />
          </button>

          {/* REPLACE ALL OPTION (Requested by User!) */}
          <button
            onClick={handleReplaceAll}
            className="glass-panel"
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(8, 145, 178, 0.25))',
              border: '1.5px solid #059669',
              color: '#047857',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 16px rgba(5, 150, 105, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={15} />
            <span>Replace All Degraded Components</span>
          </button>
        </div>
      </div>
      </Section>

      {/* Confirmation Notification Toast */}
      {notification && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            background: 'rgba(5, 150, 105, 0.2)',
            border: '1px solid #059669',
            color: '#047857',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 16px rgba(18, 35, 31, 0.072)',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. "HOW REPLACEMENT WORKS: HUMANS VS SYSTEM" (Answers User Confusion!) */}
      {/* ============================================================== */}
      <Section id="maint-how" title="How replacement works" subtitle="Who does what: humans vs. the system" icon={Sparkles}>
        <div
          className="glass-panel"
          style={{
            padding: '18px 22px',
            borderRadius: '14px',
            border: '1px solid rgba(8, 145, 178, 0.2)',
            background: 'var(--frost)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#0891b2" />
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0891b2', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                How Sensor Replacement Works (Who Does What?)
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#5a6b65' }}>
              Cyber-Physical Systems (CPS) Maintenance Workflow
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {/* Step 1: System Watches */}
            <div style={{ background: 'rgba(18, 35, 31, 0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(18, 35, 31, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Cpu size={16} color="#0e7490" />
                <strong style={{ fontSize: '0.8rem', color: 'var(--ink)' }}>1. AquaShield AI (The System)</strong>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#3b4d46', margin: 0, lineHeight: 1.45 }}>
                The software continuously computes fluid friction and pressure shocks. It sounds a warning <strong style={{ color: '#0e7490' }}>48+ hours before</strong> a physical sensor burns out. If damaged, AI runs virtual math estimators so clean drinking water never stops.
              </p>
            </div>

            {/* Step 2: Human Replaces */}
            <div style={{ background: 'rgba(18, 35, 31, 0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(18, 35, 31, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <UserCheck size={16} color="#b45309" />
                <strong style={{ fontSize: '0.8rem', color: 'var(--ink)' }}>2. Certified Field Crew (Humans)</strong>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#3b4d46', margin: 0, lineHeight: 1.45 }}>
                Sensors are real stainless-steel hardware in water tanks. Software cannot unscrew bolts! A <strong style={{ color: '#b45309' }}>human technician</strong> physically visits the tank, unplugs the fouled or cracked sensor, and installs a brand-new factory unit.
              </p>
            </div>

            {/* Step 3: Digital Sync */}
            <div style={{ background: 'rgba(18, 35, 31, 0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(18, 35, 31, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <RotateCcw size={16} color="#047857" />
                <strong style={{ fontSize: '0.8rem', color: 'var(--ink)' }}>3. Digital Calibration ("Replace")</strong>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#3b4d46', margin: 0, lineHeight: 1.45 }}>
                Clicking <strong style={{ color: '#047857' }}>"Confirm Replacement"</strong> tells the digital twin that fresh physical hardware is now in place. AquaShield recalibrates its mass-balance equations and resets the wear counter to 100% Health.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================== */}
      {/* 3. PHYSICAL HARDWARE CARDS GRID (3 COLUMNS x 2 ROWS)           */}
      {/* ============================================================== */}
      <Section id="maint-hardware" title="Hardware health cards" subtitle="Wear and damage forecast for every physical component" icon={Wrench} defaultOpen>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
              PHYSICAL EQUIPMENT CONDITION & DAMAGE FORECAST
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#5a6b65' }}>
              Select any card to view its wear curve, or click "Confirm Replacement" to simulate on-site technician hardware swap.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.74rem', color: '#5a6b65' }}>
              Facility Status: <strong style={{ color: aggregateHealth > 75 ? '#047857' : '#b45309' }}>{aggregateHealth}% Overall Health</strong>
            </span>
            {attentionCount > 0 && (
              <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(217, 119, 6, 0.15)', color: '#b45309', border: '1px solid #d97706', fontWeight: 700 }}>
                {attentionCount} Action(s) Advised
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {components.map(comp => {
            const isSelected = comp.id === selectedId;
            const healthScore = Math.max(0, Math.round(100 - comp.currentWear));
            const isBrandNew = comp.currentWear <= 1.0;

            let badgeColor = '#047857';
            let badgeBg = 'rgba(5, 150, 105, 0.15)';
            let badgeText = 'OPTIMAL';

            if (comp.currentWear >= comp.criticalThreshold) {
              badgeColor = '#e11d48';
              badgeBg = 'rgba(225, 29, 72, 0.18)';
              badgeText = 'CRITICAL WEAR';
            } else if (comp.currentWear >= comp.replacementThreshold) {
              badgeColor = '#b45309';
              badgeBg = 'rgba(217, 119, 6, 0.18)';
              badgeText = 'REPLACE SOON';
            } else if (comp.currentWear >= 60) {
              badgeColor = '#d97706';
              badgeBg = 'rgba(217, 119, 6, 0.12)';
              badgeText = 'SERVICE DUE';
            } else if (comp.currentWear >= 35) {
              badgeColor = '#0e7490';
              badgeBg = 'rgba(14, 116, 144, 0.12)';
              badgeText = 'NORMAL WEAR';
            }

            // Remaining hours
            const compRemainingHours = Math.max(
              0,
              Math.round(
                ((comp.replacementThreshold - comp.currentWear) /
                  (comp.currentWear > 0 ? comp.currentWear / (comp.hoursInService || 1) : 0.05))
              )
            );
            const compRemainingDays = (compRemainingHours / 24).toFixed(1);

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedId(comp.id)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: isSelected ? '1.5px solid #0891b2' : '1px solid rgba(18, 35, 31, 0.08)',
                  background: isSelected ? 'rgba(8, 145, 178, 0.06)' : 'var(--frost)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(8, 145, 178, 0.06)' : 'none'
                }}
              >
                <div>
                  {/* Card Top: Tag + Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '6px',
                          background: 'rgba(14, 116, 144, 0.15)',
                          color: '#0e7490',
                          border: '1px solid rgba(14, 116, 144, 0.3)'
                        }}
                      >
                        {comp.tag}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#5a6b65' }}>
                        {comp.location}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeColor}`
                      }}
                    >
                      {badgeText}
                    </span>
                  </div>

                  {/* Component Title */}
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--ink)', margin: '8px 0 2px 0' }}>
                    {comp.name}
                  </h4>

                  {/* Plain English Summary */}
                  <p style={{ fontSize: '0.72rem', color: '#5a6b65', margin: '2px 0 8px 0', lineHeight: 1.4, minHeight: '32px' }}>
                    {comp.simpleDescription}
                  </p>

                  {/* Health Gauge & Wear Bar */}
                  <div style={{ background: 'rgba(18, 35, 31, 0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(18, 35, 31, 0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#5a6b65' }}>Condition</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, color: badgeColor }}>
                        {healthScore}% <span style={{ fontSize: '0.68rem', color: '#5a6b65', fontWeight: 500 }}>Health</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', background: 'rgba(18, 35, 31, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, comp.currentWear)}%`,
                          height: '100%',
                          background: comp.currentWear >= 75
                            ? 'linear-gradient(90deg, #d97706, #e11d48)'
                            : comp.currentWear >= 50
                            ? 'linear-gradient(90deg, #059669, #d97706)'
                            : 'linear-gradient(90deg, #0891b2, #059669)',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#6b7b75', marginTop: '4px' }}>
                      <span>Wear: {comp.currentWear.toFixed(1)}%</span>
                      <span>Service threshold: {comp.replacementThreshold}%</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Replace Sensor */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(18, 35, 31, 0.06)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.64rem', color: '#5a6b65' }}>Est. Remaining:</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: comp.currentWear >= 75 ? '#b45309' : 'var(--ink)' }}>
                      {isBrandNew ? 'Full Life (1,400+ h)' : `${compRemainingHours} hrs (~${compRemainingDays} d)`}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReplaceComponent(comp.id);
                    }}
                    className="glass-panel"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: isBrandNew ? 'rgba(5, 150, 105, 0.1)' : 'rgba(5, 150, 105, 0.2)',
                      border: '1px solid #059669',
                      color: '#047857',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <UserCheck size={13} />
                    <span>{isBrandNew ? 'Refreshed' : 'Confirm Replace'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </Section>

      {/* ============================================================== */}
      {/* 4. DEEP-DIVE DEGRADATION GRAPH FOR SELECTED SENSOR             */}
      {/* ============================================================== */}
      <Section id="maint-trend" title="Degradation forecast" subtitle="Wear curve and plain-English diagnosis of the selected component" icon={Activity}>
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(8, 145, 178, 0.25)',
          background: 'var(--frost)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '20px'
        }}
      >
        {/* Left: Interactive SVG Degradation Chart */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#0891b2', fontWeight: 800, textTransform: 'uppercase' }}>
                Failure Horizon Prediction
              </span>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--ink)', margin: '2px 0 0 0' }}>
                Degradation Trend Curve: {selectedComponent.name} ({selectedComponent.tag})
              </h4>
            </div>

            <span style={{ fontSize: '0.72rem', color: '#5a6b65' }}>
              Current Wear: <strong style={{ color: selectedComponent.currentWear >= 75 ? '#b45309' : '#047857' }}>{selectedComponent.currentWear.toFixed(1)}%</strong>
            </span>
          </div>

          {/* SVG Chart */}
          <div style={{ background: 'var(--frost)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(18, 35, 31, 0.06)' }}>
            <svg viewBox="0 0 450 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Horizontal Grid Lines */}
              <line x1="40" y1="20" x2="430" y2="20" stroke="rgba(18, 35, 31, 0.06)" strokeWidth="1" />
              <line x1="40" y1="60" x2="430" y2="60" stroke="rgba(18, 35, 31, 0.06)" strokeWidth="1" />
              <line x1="40" y1="100" x2="430" y2="100" stroke="rgba(18, 35, 31, 0.06)" strokeWidth="1" />
              <line x1="40" y1="140" x2="430" y2="140" stroke="rgba(18, 35, 31, 0.15)" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="32" y="24" fill="#5a6b65" fontSize="8.5" textAnchor="end">100%</text>
              <text x="32" y="64" fill="#5a6b65" fontSize="8.5" textAnchor="end">75%</text>
              <text x="32" y="104" fill="#5a6b65" fontSize="8.5" textAnchor="end">50%</text>
              <text x="32" y="144" fill="#5a6b65" fontSize="8.5" textAnchor="end">0%</text>

              {/* Critical Failure Danger Zone (85%) */}
              <line x1="40" y1="38" x2="430" y2="38" stroke="#e11d48" strokeDasharray="4 4" strokeWidth="1.2" opacity="0.8" />
              <text x="428" y="34" fill="#e11d48" fontSize="8" textAnchor="end" fontWeight="700">85% · Critical Failure Danger</text>

              {/* Replacement Required Line (75%) */}
              <line x1="40" y1="50" x2="430" y2="50" stroke="#b45309" strokeDasharray="4 4" strokeWidth="1.2" opacity="0.8" />
              <text x="428" y="47" fill="#b45309" fontSize="8" textAnchor="end" fontWeight="700">75% · Replacement Required</text>

              {/* Preventive Service Line (70%) */}
              <line x1="40" y1="56" x2="430" y2="56" stroke="#d97706" strokeDasharray="2 3" strokeWidth="1" opacity="0.6" />
              <text x="428" y="66" fill="#d97706" fontSize="7.5" textAnchor="end">70% · Preventive Inspection</text>

              {/* Trend Curve & Data Points */}
              {(() => {
                const maxH = 1400;
                const pts = selectedComponent.trendPoints || [
                  { hour: 0, wear: 0 },
                  { hour: selectedComponent.hoursInService, wear: selectedComponent.currentWear }
                ];

                const coords = pts.map(p => {
                  const x = 40 + (p.hour / maxH) * (430 - 40);
                  const y = 140 - (p.wear / 100) * (140 - 20);
                  return { x, y, hour: p.hour, wear: p.wear };
                });

                const pathStr = coords.reduce((acc, pt, idx) => {
                  return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                }, '');

                const currentPt = coords[coords.length - 1];

                return (
                  <g>
                    {/* Shaded Area Under Curve */}
                    <path
                      d={`${pathStr} L ${currentPt.x} 140 L 40 140 Z`}
                      fill="url(#trendGradient2)"
                      opacity="0.3"
                    />
                    {/* Glowing Line */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="#0891b2"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Points */}
                    {coords.map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={i === coords.length - 1 ? 5 : 3}
                        fill={i === coords.length - 1 ? (selectedComponent.currentWear >= 75 ? '#b45309' : '#e11d48') : '#0891b2'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    ))}
                  </g>
                );
              })()}

              <defs>
                <linearGradient id="trendGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* X Axis Time Labels */}
              <text x="40" y="154" fill="#5a6b65" fontSize="8" textAnchor="start">0h</text>
              <text x="137" y="154" fill="#5a6b65" fontSize="8" textAnchor="middle">350h</text>
              <text x="235" y="154" fill="#5a6b65" fontSize="8" textAnchor="middle">700h</text>
              <text x="332" y="154" fill="#5a6b65" fontSize="8" textAnchor="middle">1050h</text>
              <text x="430" y="154" fill="#5a6b65" fontSize="8" textAnchor="end">1400h</text>
            </svg>

            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#5a6b65', marginTop: '4px' }}>
              Simulated Plant Run-Time (Operating Hours Since Commissioning)
            </div>
          </div>
        </div>

        {/* Right: Plain-English Diagnostic Card */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0e7490' }}>
                DIAGNOSTIC & REPLACEMENT ADVISORY
              </span>
              <button
                onClick={() => handleReplaceComponent(selectedComponent.id)}
                className="badge badge-emerald"
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: '1px solid #059669',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserCheck size={14} />
                <span>Replace This Component</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
              <div style={{ background: 'rgba(18, 35, 31, 0.03)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(18, 35, 31, 0.06)' }}>
                <div style={{ fontSize: '0.64rem', color: '#5a6b65' }}>CURRENT WEAR</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: selectedComponent.currentWear >= 75 ? '#b45309' : '#047857', marginTop: '2px' }}>
                  {selectedComponent.currentWear.toFixed(1)}%
                </div>
              </div>

              <div style={{ background: 'rgba(18, 35, 31, 0.03)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(18, 35, 31, 0.06)' }}>
                <div style={{ fontSize: '0.64rem', color: '#5a6b65' }}>EST. REMAINING</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0e7490', marginTop: '2px' }}>
                  {remainingHours} h
                </div>
              </div>

              <div style={{ background: 'rgba(18, 35, 31, 0.03)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(18, 35, 31, 0.06)' }}>
                <div style={{ fontSize: '0.64rem', color: '#5a6b65' }}>HOURS ACTIVE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--ink)', marginTop: '2px' }}>
                  {selectedComponent.hoursInService.toFixed(0)} h
                </div>
              </div>
            </div>

            {/* Why Is It Degrading? */}
            <div style={{ background: 'rgba(18, 35, 31, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(18, 35, 31, 0.05)', marginTop: '10px' }}>
              <strong style={{ fontSize: '0.72rem', color: 'var(--ink)' }}>Why does this component degrade?</strong>
              <p style={{ fontSize: '0.72rem', color: '#3b4d46', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                {selectedComponent.physicalWearCause}
              </p>
            </div>

            {/* Risk if ignored */}
            <div style={{ background: 'rgba(220, 38, 38, 0.06)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.2)', marginTop: '8px' }}>
              <strong style={{ fontSize: '0.72rem', color: '#dc2626' }}>Consequence if not replaced:</strong>
              <p style={{ fontSize: '0.72rem', color: '#3b4d46', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                {selectedComponent.riskIfDamaged}
              </p>
            </div>
          </div>

          {/* Plain English Forecast Box */}
          <div style={{ background: 'rgba(8, 145, 178, 0.05)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(8, 145, 178, 0.15)' }}>
            <div style={{ fontSize: '0.73rem', color: '#3b4d46', lineHeight: 1.4 }}>
              <strong style={{ color: '#0891b2' }}>Layman Forecast:</strong> At normal 24/7 operating load, this unit degrades at approx. <strong style={{ color: '#0891b2' }}>{(selectedComponent.currentWear / (selectedComponent.hoursInService || 1)).toFixed(3)}% per hour</strong>. Replacing it before 75% wear ensures clean water safety with 0 downtime.
            </div>
          </div>
        </div>
      </div>
      </Section>

      {/* ============================================================== */}
      {/* 5. PHYSICAL STRESS SIMULATION & ACTIVITY LOG                   */}
      {/* ============================================================== */}
      <Section id="maint-stress" title="Stress simulator & activity log" subtitle="Simulate physical shocks and review maintenance events" icon={Clock}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        
        {/* Outage / Physical Shock Simulator */}
        <div
          className="glass-panel"
          style={{
            padding: '18px 20px',
            borderRadius: '14px',
            border: '1px solid rgba(18, 35, 31, 0.08)',
            background: 'var(--frost)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#b45309" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                Simulate Physical Shock & Power Failure
              </h4>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#5a6b65', margin: '3px 0 10px 0' }}>
              Test how sudden blackouts or water hammer pressure shockwaves accelerate physical sensor wear.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={outageScenario}
                onChange={(e) => setOutageScenario(e.target.value)}
                className="glass-panel"
                style={{
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'var(--frost)',
                  border: '1px solid rgba(18, 35, 31, 0.15)',
                  color: 'var(--ink)',
                  fontSize: '0.76rem',
                  fontWeight: 600
                }}
              >
                <option value="POWER_BLACKOUT">Grid Power Blackout (0V Dip)</option>
                <option value="WATER_HAMMER">Hydraulic Water Hammer Shock</option>
                <option value="CHEMICAL_SURGE">Chemical Over-Dosing Surge</option>
              </select>

              <select
                value={outageDuration}
                onChange={(e) => setOutageDuration(e.target.value)}
                className="glass-panel"
                style={{
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'var(--frost)',
                  border: '1px solid rgba(18, 35, 31, 0.15)',
                  color: 'var(--ink)',
                  fontSize: '0.76rem',
                  fontWeight: 600
                }}
              >
                <option value="15">15 min duration</option>
                <option value="30">30 min duration</option>
                <option value="60">1 hour duration</option>
              </select>

              <button
                onClick={handleAssessOutageDamage}
                className="glass-panel"
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: 'rgba(217, 119, 6, 0.18)',
                  border: '1px solid #d97706',
                  color: '#b45309',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Activity size={13} />
                <span>Simulate Shock</span>
              </button>
            </div>
          </div>

          {outageReport && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid #d97706',
                marginTop: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 800, color: '#b45309' }}>
                <span>{outageReport.headline}</span>
                <span>+{outageReport.wearIncrease}% Wear</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#3b4d46', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                {outageReport.summary}
              </p>
            </div>
          )}
        </div>

        {/* Maintenance Event Log */}
        <div
          className="glass-panel"
          style={{
            padding: '18px 20px',
            borderRadius: '14px',
            border: '1px solid rgba(18, 35, 31, 0.08)',
            background: 'var(--frost)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={15} color="#0e7490" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                Maintenance & Repair History Log
              </h4>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#6b7b75' }}>
              {logs.length} Logged Entries
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '185px', overflowY: 'auto' }}>
            {logs.map(log => {
              let tagColor = '#0e7490';
              let tagBg = 'rgba(14, 116, 144, 0.12)';

              if (log.type === 'REPLACED' || log.type === 'REPLACED_ALL') {
                tagColor = '#047857';
                tagBg = 'rgba(5, 150, 105, 0.15)';
              } else if (log.type === 'PREVENTIVE_ALERT') {
                tagColor = '#b45309';
                tagBg = 'rgba(217, 119, 6, 0.15)';
              } else if (log.type === 'CYBER_WEAR') {
                tagColor = '#e11d48';
                tagBg = 'rgba(225, 29, 72, 0.15)';
              }

              return (
                <div
                  key={log.id}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(18, 35, 31, 0.02)',
                    border: '1px solid rgba(18, 35, 31, 0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: tagBg,
                          color: tagColor,
                          border: `1px solid ${tagColor}`
                        }}
                      >
                        {log.type}
                      </span>
                      <strong style={{ fontSize: '0.74rem', color: 'var(--ink)' }}>
                        {log.title}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#5a6b65', margin: '2px 0 0 0', lineHeight: 1.35 }}>
                      {log.detail}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.66rem', color: '#6b7b75', whiteSpace: 'nowrap' }}>
                    {log.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      </Section>

    </div>
  );
}
