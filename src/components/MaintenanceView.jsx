import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  Droplets,
  Gauge,
  Sliders,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEffects';

// Initial realistic baseline component and sensor catalog
const INITIAL_COMPONENTS = [
  {
    id: 'AIT_501',
    name: 'Potable Chlorine Residual Sensor',
    tag: 'AIT-501',
    category: 'Water Quality Probe',
    location: 'Tank 6 (Potable Export)',
    type: 'Membrane-covered Amperometric Probe',
    currentWear: 72.4, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 1400,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    status: 'SERVICE_SOON', // 'NORMAL' | 'SERVICE_SOON' | 'CRITICAL'
    description: 'Measures residual chlorine (2.05 ppm) to ensure drinking water is completely sterile and pathogen-free.',
    failureImpact: 'If damaged: Under-chlorination risks bacterial outbreak; over-chlorination creates harmful disinfection byproducts.',
    wearDrivers: 'Chemical electrolyte depletion and bio-film coating on the permeable membrane head.',
    liveTelemetry: { metric: 'Chlorine', value: '2.05 ppm', status: 'In Spec' },
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
    type: 'Piezoresistive Stainless Diaphragm',
    currentWear: 58.2, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 2200,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    status: 'NORMAL',
    description: 'Monitors high-pressure feed (6.5 - 8.2 Bar) across reverse osmosis desalination membranes.',
    failureImpact: 'If damaged: Cannot detect burst membranes or destructive hydraulic water hammer shocks.',
    wearDrivers: 'Repeated micro-oscillations from pump pulsations and saline water corrosive pitting.',
    liveTelemetry: { metric: 'Feed Pressure', value: '7.80 Bar', status: 'High Stress' },
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
    type: 'Non-contact Ultrasonic Transducer',
    currentWear: 32.0, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 3200,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    status: 'NORMAL',
    description: 'Bounces high-frequency sound waves off the water surface to calculate exact liquid volume and prevent overflows.',
    failureImpact: 'If damaged: False empty readings trigger pumps to run dry, burning out motor coils.',
    wearDrivers: 'Condensation vapor on transducer horn and internal crystal acoustic fatigue.',
    liveTelemetry: { metric: 'Water Level', value: '76% Full', status: 'Optimal' },
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
    name: 'Raw Seawater Magnetic Flowmeter',
    tag: 'FIT-101',
    category: 'Flow Sensor',
    location: 'Tank 1 (Raw Intake)',
    type: 'Electromagnetic Induction Sensor',
    currentWear: 18.5, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 4000,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    status: 'NORMAL',
    description: 'Detects inflow velocity without moving parts using Faraday induction to audit plant mass balance equations.',
    failureImpact: 'If damaged: Plant cannot balance inflow against outflow, masking pipe ruptures or theft.',
    wearDrivers: 'Abrasive suspended grit and marine micro-organisms coating the electrode lining.',
    liveTelemetry: { metric: 'Intake Velocity', value: '42.5 L/s', status: 'Optimal' },
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
    type: 'Variable Frequency Centrifugal Pump',
    currentWear: 44.0, // %
    hoursInService: 1143.0,
    expectedLifespanHours: 2600,
    replacementThreshold: 75.0,
    criticalThreshold: 85.0,
    status: 'NORMAL',
    description: 'Pumps water continuously from intake basin through secondary multimedia filtration.',
    failureImpact: 'If damaged: Total loss of forward water conveyance halts drinking water production.',
    wearDrivers: 'Mechanical shaft seal friction and impeller cavitation wear from cyber throttle spikes.',
    liveTelemetry: { metric: 'Shaft Speed', value: '1,450 RPM', status: 'Optimal' },
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
    status: 'NORMAL',
    description: 'Directs treated effluent either to ultrafiltration or diverts backwash during cleaning cycles.',
    failureImpact: 'If damaged: Valve jams shut, causing pipe overpressure and halting downstream treatment.',
    wearDrivers: 'Seat seal elastomer compression and electric motor gearbox micro-backlash.',
    liveTelemetry: { metric: 'Gate Position', value: '100% Open', status: 'Optimal' },
    trendPoints: [
      { hour: 0, wear: 0 },
      { hour: 280, wear: 6.5 },
      { hour: 570, wear: 13.8 },
      { hour: 860, wear: 21.2 },
      { hour: 1143, wear: 29.0 }
    ]
  }
];

export default function MaintenanceView({ simState }) {
  const [components, setComponents] = useState(INITIAL_COMPONENTS);
  const [selectedId, setSelectedId] = useState('AIT_501');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [serviceFeedback, setServiceFeedback] = useState(null);

  // Power Outage Simulator State
  const [outageDuration, setOutageDuration] = useState('30');
  const [outageScenario, setOutageScenario] = useState('POWER_BLACKOUT');
  const [outageReport, setOutageReport] = useState(null);

  // Maintenance Event Log
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: 'Today, 02:45 AM',
      tag: 'AIT-501',
      title: 'Preventive Warning: Chlorine Probe Reached 70% Wear',
      type: 'ALERT',
      detail: 'Electrolyte depletion rate is steady. Replacement is recommended within the next 60 operating hours to guarantee safe drinking water.'
    },
    {
      id: 2,
      timestamp: 'Yesterday, 18:20 PM',
      tag: 'PIT-401',
      title: 'Hydraulic Pressure Shock Absorbed',
      type: 'CYBER_WEAR',
      detail: 'Cyber attack pressure surge (8.2 Bar) produced minor diaphragm deflection. Component wear accelerated by +1.4%.'
    },
    {
      id: 3,
      timestamp: '3 Days Ago',
      tag: 'LIT-201',
      title: 'Scheduled Calibration Performed',
      type: 'SERVICE',
      detail: 'Routine acoustic horn wipe and 4-20mA loop calibration verified zero drift.'
    }
  ]);

  const selectedComponent = components.find(c => c.id === selectedId) || components[0];

  // Plant-wide aggregate health score
  const aggregateHealth = useMemo(() => {
    const totalWear = components.reduce((acc, c) => acc + c.currentWear, 0);
    const avgWear = totalWear / components.length;
    return Math.round(100 - avgWear);
  }, [components]);

  const urgentCount = useMemo(() => {
    return components.filter(c => c.currentWear >= c.replacementThreshold).length;
  }, [components]);

  // Handle Replacement Action
  const handleReplaceComponent = (componentId) => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#34d399', '#00f2fe', '#38bdf8']
      });
    } catch {}

    const comp = components.find(c => c.id === componentId);
    if (!comp) return;

    // Reset component wear to 0%
    setComponents(prev =>
      prev.map(c => {
        if (c.id === componentId) {
          return {
            ...c,
            currentWear: 0.0,
            hoursInService: 0.0,
            status: 'NORMAL',
            trendPoints: [
              { hour: 0, wear: 0 },
              { hour: 50, wear: 1.0 }
            ]
          };
        }
        return c;
      })
    );

    // Add log entry
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      {
        id: Date.now(),
        timestamp: `Just now (${nowTime})`,
        tag: comp.tag,
        title: `Component Replaced: Fresh ${comp.name} Installed`,
        type: 'REPLACED',
        detail: `Physical replacement confirmed. Sensor calibrated to factory baseline (100% Health restored, 0 hours runtime).`
      },
      ...prev
    ]);

    setServiceFeedback(`Fresh ${comp.name} (${comp.tag}) successfully installed and recalibrated! Component health restored to 100%.`);
    setTimeout(() => setServiceFeedback(null), 5000);
  };

  // Handle Power Outage / Stress Simulator
  const handleAssessOutageDamage = () => {
    sound.playClick();
    const durationMins = parseInt(outageDuration, 10);

    let severity = 'LOW';
    let wearIncrease = 2.5;
    let headline = 'Minor Grid Fluctuation Absorbed';
    let summary = 'Water plant automated backup batteries absorbed the transient dip without valve damage.';

    if (outageScenario === 'POWER_BLACKOUT') {
      if (durationMins >= 60) {
        severity = 'HIGH';
        wearIncrease = 7.5;
        headline = 'Severe Pressure Drop & Cavitation Surge';
        summary = `During the ${durationMins}-minute complete power cutoff, booster pumps stopped abruptly while valves remained in motion. This caused a -0.6 Bar back-siphon shockwave across the piping manifold.`;
      } else {
        severity = 'MEDIUM';
        wearIncrease = 4.2;
        headline = 'Moderate Reverse Hydraulic Pressure Wave';
        summary = `A ${durationMins}-minute blackout induced water hammer oscillation. Level sensors remained intact; pump mechanical seals experienced transient thermal shock.`;
      }
    } else if (outageScenario === 'WATER_HAMMER') {
      severity = durationMins >= 30 ? 'CRITICAL' : 'HIGH';
      wearIncrease = durationMins >= 30 ? 12.0 : 6.5;
      headline = 'Extreme Hydraulic Water Hammering';
      summary = `Sudden gate closure while pumps ran at full speed created an 8.6 Bar shockwave. Diaphragm sensors and pump bearings bore the brunt of the kinetic energy.`;
    } else if (outageScenario === 'CHEMICAL_SURGE') {
      severity = 'MEDIUM';
      wearIncrease = 5.0;
      headline = 'Chlorine Analyzer Chemical Saturation';
      summary = `Over-concentrated chlorine chemical batch coated probe membranes, accelerating chemical degradation of sensitive measurement electrodes.`;
    }

    // Apply incremental wear to relevant components
    setComponents(prev =>
      prev.map(c => {
        let boost = wearIncrease;
        if (outageScenario === 'CHEMICAL_SURGE' && c.id === 'AIT_501') boost *= 1.8;
        if (outageScenario === 'WATER_HAMMER' && (c.id === 'PIT_401' || c.id === 'PUMP_101')) boost *= 1.6;

        const newWear = Math.min(100, Math.round((c.currentWear + boost) * 10) / 10);
        const newStatus = newWear >= c.criticalThreshold ? 'CRITICAL' : newWear >= c.replacementThreshold ? 'SERVICE_SOON' : 'NORMAL';

        return {
          ...c,
          currentWear: newWear,
          status: newStatus
        };
      })
    );

    // Save report
    setOutageReport({
      severity,
      durationMins,
      wearIncrease,
      headline,
      summary,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Add to logs
    setLogs(prev => [
      {
        id: Date.now(),
        timestamp: 'Just now',
        tag: 'PLANT-WIDE',
        title: `Simulated Stress: ${headline}`,
        type: 'STRESS_TEST',
        detail: `${summary} (Estimated equipment wear increased by ~${wearIncrease}%).`
      },
      ...prev
    ]);
  };

  // Filtered components
  const filteredComponents = useMemo(() => {
    if (categoryFilter === 'ALL') return components;
    if (categoryFilter === 'URGENT') return components.filter(c => c.currentWear >= c.replacementThreshold);
    if (categoryFilter === 'SENSORS') return components.filter(c => c.category.includes('Sensor') || c.category.includes('Probe'));
    if (categoryFilter === 'ACTUATORS') return components.filter(c => c.category.includes('Actuator') || c.category.includes('Pump'));
    return components;
  }, [components, categoryFilter]);

  // Calculate estimated remaining hours for selected component
  const remainingHours = Math.max(
    0,
    Math.round(
      ((selectedComponent.replacementThreshold - selectedComponent.currentWear) /
        (selectedComponent.currentWear > 0 ? selectedComponent.currentWear / selectedComponent.hoursInService : 0.05))
    )
  );
  const remainingDays = (remainingHours / 24).toFixed(1);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. TOP HEADER & HIGH-LEVEL HEALTH METRICS BANNER */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.78)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Wrench size={20} color="#38bdf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '0.02em' }}>
                MAINTENANCE & SENSOR CONDITION MONITOR
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                Track physical sensor wear, estimate time until damage, and prevent plant breakdown before it occurs.
              </p>
            </div>
          </div>
        </div>

        {/* Aggregate Plant Health Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: aggregateHealth > 80 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${aggregateHealth > 80 ? '#10b981' : '#f59e0b'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Activity size={20} color={aggregateHealth > 80 ? '#34d399' : '#fbbf24'} />
            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Overall Sensor Health
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: aggregateHealth > 80 ? '#34d399' : '#fbbf24' }}>
                {aggregateHealth}% <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>({aggregateHealth > 80 ? 'Optimal' : 'Service Due'})</span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Clock size={20} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Simulated Operating Run Time
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                1,143.0 hrs <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>(~47.6 days)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Feedback Toast */}
      {serviceFeedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{serviceFeedback}</span>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN VIEW: (LEFT: COMPONENT HEALTH CARDS | RIGHT: DEEP-DIVE PREDICTIVE DEGRADATION GRAPH) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: COMPONENT CARDS & QUICK STATUS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { key: 'ALL', label: `All Components (${components.length})` },
                { key: 'SENSORS', label: 'Sensors (4)' },
                { key: 'ACTUATORS', label: 'Pumps & Valves (2)' },
                { key: 'URGENT', label: `Needs Attention (${urgentCount})`, highlight: urgentCount > 0 }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setCategoryFilter(tab.key)}
                  className="glass-panel"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: categoryFilter === tab.key ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                    border: categoryFilter === tab.key ? '1px solid #00f2fe' : tab.highlight ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                    color: categoryFilter === tab.key ? '#00f2fe' : tab.highlight ? '#fbbf24' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Click any card to inspect degradation graph
            </span>
          </div>

          {/* Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredComponents.map(comp => {
              const isSelected = comp.id === selectedId;
              const isUrgent = comp.currentWear >= comp.replacementThreshold;
              const isCritical = comp.currentWear >= comp.criticalThreshold;
              const healthScore = Math.round(100 - comp.currentWear);

              let badgeColor = '#34d399';
              let badgeBg = 'rgba(16, 185, 129, 0.12)';
              let badgeText = 'OPTIMAL';

              if (comp.currentWear >= comp.criticalThreshold) {
                badgeColor = '#ff2a5f';
                badgeBg = 'rgba(255, 42, 95, 0.18)';
                badgeText = 'CRITICAL WEAR';
              } else if (comp.currentWear >= comp.replacementThreshold) {
                badgeColor = '#fbbf24';
                badgeBg = 'rgba(245, 158, 11, 0.15)';
                badgeText = 'REPLACEMENT REQUIRED';
              } else if (comp.currentWear >= 60) {
                badgeColor = '#f59e0b';
                badgeBg = 'rgba(245, 158, 11, 0.15)';
                badgeText = 'SERVICE RECOMMENDED';
              } else if (comp.currentWear >= 35) {
                badgeColor = '#38bdf8';
                badgeBg = 'rgba(56, 189, 248, 0.12)';
                badgeText = 'NORMAL WEAR';
              }

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedId(comp.id)}
                  className="glass-panel"
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(0, 242, 254, 0.07)' : 'rgba(15, 23, 42, 0.65)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 14px rgba(0, 242, 254, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.3)'
                          }}
                        >
                          {comp.tag}
                        </span>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          {comp.name}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                        {comp.location} • {comp.category}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}`
                        }}
                      >
                        {badgeText}
                      </span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: badgeColor, marginTop: '4px' }}>
                        {healthScore}% <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>Health</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Wear Progress Bar */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>Wear: <strong>{comp.currentWear.toFixed(1)}%</strong></span>
                      <span>Service threshold: {comp.replacementThreshold}%</span>
                    </div>
                    <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, comp.currentWear)}%`,
                          height: '100%',
                          background: isCritical
                            ? 'linear-gradient(90deg, #f59e0b, #ff2a5f)'
                            : isUrgent
                            ? 'linear-gradient(90deg, #10b981, #f59e0b)'
                            : 'linear-gradient(90deg, #00f2fe, #10b981)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom details */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.72rem' }}>
                    <span style={{ color: '#cbd5e1' }}>
                      Telemetry: <strong style={{ color: '#00f2fe' }}>{comp.liveTelemetry.metric}: {comp.liveTelemetry.value}</strong>
                    </span>
                    <span style={{ color: isUrgent ? '#fbbf24' : '#94a3b8', fontWeight: isUrgent ? 700 : 500 }}>
                      {isUrgent ? 'Replace soon' : `${Math.round((comp.expectedLifespanHours - comp.hoursInService))} hrs remaining`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL INSPECTION, GRAPH & ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Detailed Component Inspector Card */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              background: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase' }}>
                  Detailed Sensor Diagnostic
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0 0' }}>
                  {selectedComponent.name} ({selectedComponent.tag})
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  {selectedComponent.type} • {selectedComponent.location}
                </div>
              </div>

              {/* Physical Replacement Button */}
              <button
                onClick={() => handleReplaceComponent(selectedComponent.id)}
                className="badge badge-emerald"
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: '1px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCcw size={14} />
                <span>Confirm Component Replacement</span>
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>CURRENT WEAR</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: selectedComponent.currentWear >= 75 ? '#fbbf24' : '#34d399', marginTop: '2px' }}>
                  {selectedComponent.currentWear.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                  Replace at {selectedComponent.replacementThreshold}%
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>REMAINING LIFE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
                  {remainingHours} h
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                  approx. ~{remainingDays} days
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>HOURS IN SERVICE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                  {selectedComponent.hoursInService.toFixed(0)} h
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                  Max: {selectedComponent.expectedLifespanHours} h
                </div>
              </div>
            </div>

            {/* Simple Layman Explanation */}
            <div style={{ background: 'rgba(0, 242, 254, 0.05)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 800, color: '#00f2fe' }}>
                <Info size={14} />
                <span>What This Sensor Does (Simple English):</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.45 }}>
                {selectedComponent.description}
              </p>
              <div style={{ fontSize: '0.73rem', color: '#f87171', marginTop: '6px', lineHeight: 1.4 }}>
                <strong>Risk if ignored:</strong> {selectedComponent.failureImpact}
              </div>
            </div>

            {/* 3. VISUAL DEGRADATION TREND GRAPH (CLEAN SVG WITH THRESHOLD LINES) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} color="#00f2fe" />
                  <span>Degradation Trend Over Operating Time (Di(t))</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Current Wear: <strong style={{ color: selectedComponent.currentWear >= 75 ? '#fbbf24' : '#34d399' }}>{selectedComponent.currentWear.toFixed(1)}%</strong>
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div style={{ background: 'rgba(2, 6, 23, 0.65)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <svg viewBox="0 0 450 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="430" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="40" y1="60" x2="430" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="40" y1="100" x2="430" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="40" y1="140" x2="430" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="32" y="24" fill="#94a3b8" fontSize="9" textAnchor="end">100%</text>
                  <text x="32" y="64" fill="#94a3b8" fontSize="9" textAnchor="end">75%</text>
                  <text x="32" y="104" fill="#94a3b8" fontSize="9" textAnchor="end">50%</text>
                  <text x="32" y="144" fill="#94a3b8" fontSize="9" textAnchor="end">0%</text>

                  {/* Critical Threshold Line (85%) */}
                  <line x1="40" y1="38" x2="430" y2="38" stroke="#ff2a5f" strokeDasharray="4 4" strokeWidth="1.2" opacity="0.8" />
                  <text x="428" y="34" fill="#ff2a5f" fontSize="8" textAnchor="end" fontWeight="700">85% · Critical Failure</text>

                  {/* Replacement Threshold Line (75%) */}
                  <line x1="40" y1="50" x2="430" y2="50" stroke="#fbbf24" strokeDasharray="4 4" strokeWidth="1.2" opacity="0.8" />
                  <text x="428" y="47" fill="#fbbf24" fontSize="8" textAnchor="end" fontWeight="700">75% · Replacement Required</text>

                  {/* 70% Preventive Service Line */}
                  <line x1="40" y1="56" x2="430" y2="56" stroke="#f59e0b" strokeDasharray="2 3" strokeWidth="1" opacity="0.6" />
                  <text x="428" y="65" fill="#f59e0b" fontSize="7.5" textAnchor="end">70% · Preventive Service</text>

                  {/* Trend Curve */}
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
                          fill="url(#trendGradient)"
                          opacity="0.3"
                        />
                        {/* Glowing Line */}
                        <path
                          d={pathStr}
                          fill="none"
                          stroke="#00f2fe"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Data dots */}
                        {coords.map((pt, i) => (
                          <circle
                            key={i}
                            cx={pt.x}
                            cy={pt.y}
                            r={i === coords.length - 1 ? 5 : 3}
                            fill={i === coords.length - 1 ? (selectedComponent.currentWear >= 75 ? '#fbbf24' : '#ff2a5f') : '#00f2fe'}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        ))}
                      </g>
                    );
                  })()}

                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* X Axis Time Labels */}
                  <text x="40" y="154" fill="#94a3b8" fontSize="8" textAnchor="start">0h</text>
                  <text x="137" y="154" fill="#94a3b8" fontSize="8" textAnchor="middle">350h</text>
                  <text x="235" y="154" fill="#94a3b8" fontSize="8" textAnchor="middle">700h</text>
                  <text x="332" y="154" fill="#94a3b8" fontSize="8" textAnchor="middle">1050h</text>
                  <text x="430" y="154" fill="#94a3b8" fontSize="8" textAnchor="end">1400h</text>
                </svg>
                
                <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                  Simulated Operating Run Time (Hours Since Commissioning)
                </div>
              </div>
            </div>

            {/* Plain English Wear Forecast Box (Replaces Confusing Mathematical Formula) */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.45 }}>
                <strong style={{ color: '#f8fafc' }}>Forecast Summary:</strong> At the current steady operational load, this component is wearing at approximately <strong style={{ color: '#00f2fe' }}>{(selectedComponent.currentWear / (selectedComponent.hoursInService || 1)).toFixed(3)}% per hour</strong>. Based on continuous plant throughput, it will reach the 75% service threshold in <strong style={{ color: '#fbbf24' }}>approx. {remainingHours} hours ({remainingDays} days)</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PHYSICAL STRESS & POWER OUTAGE SIMULATOR (REPLACED CONFUSING FORMULAS WITH AN INTUITIVE OPERATOR TOOL) */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                PHYSICAL STRESS & POWER OUTAGE DAMAGE ASSESSMENT
              </h3>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Simulate how unexpected electrical blackouts or hydraulic pressure shocks damage physical sensors and actuators.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Scenario Selector */}
            <select
              value={outageScenario}
              onChange={(e) => setOutageScenario(e.target.value)}
              className="glass-panel"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              <option value="POWER_BLACKOUT">Grid Power Blackout (0V Surge)</option>
              <option value="WATER_HAMMER">Hydraulic Water Hammer Shock</option>
              <option value="CHEMICAL_SURGE">Chemical Over-Dosing Shock</option>
            </select>

            {/* Duration Selector */}
            <select
              value={outageDuration}
              onChange={(e) => setOutageDuration(e.target.value)}
              className="glass-panel"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              <option value="15">15 min outage</option>
              <option value="30">30 min outage</option>
              <option value="60">60 min outage</option>
              <option value="120">2 hour outage</option>
            </select>

            {/* Run Assessment Button */}
            <button
              onClick={handleAssessOutageDamage}
              className="glass-panel"
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid #f59e0b',
                color: '#fbbf24',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Activity size={14} />
              <span>Assess Physical Damage Impact</span>
            </button>
          </div>
        </div>

        {/* Damage Assessment Result Report */}
        {outageReport && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: outageReport.severity === 'CRITICAL' ? 'rgba(255, 42, 95, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${outageReport.severity === 'CRITICAL' ? '#ff2a5f' : '#f59e0b'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              animation: 'fadeIn 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: outageReport.severity === 'CRITICAL' ? '#ff2a5f' : '#fbbf24' }}>
                {outageReport.headline}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Modeled Impact: <strong style={{ color: '#f8fafc' }}>+{outageReport.wearIncrease}% Equipment Wear</strong>
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
              {outageReport.summary}
            </p>
          </div>
        )}
      </div>

      {/* 5. MAINTENANCE & SENSOR REPLACEMENT HISTORY LOG */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="#38bdf8" />
            <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              MAINTENANCE & SENSOR REPLACEMENT HISTORY
            </h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {logs.length} Logged Events
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {logs.map(log => {
            let tagColor = '#38bdf8';
            let tagBg = 'rgba(56, 189, 248, 0.12)';

            if (log.type === 'REPLACED') {
              tagColor = '#34d399';
              tagBg = 'rgba(16, 185, 129, 0.15)';
            } else if (log.type === 'ALERT') {
              tagColor = '#fbbf24';
              tagBg = 'rgba(245, 158, 11, 0.15)';
            } else if (log.type === 'CYBER_WEAR' || log.type === 'STRESS_TEST') {
              tagColor = '#ff2a5f';
              tagBg = 'rgba(255, 42, 95, 0.15)';
            }

            return (
              <div
                key={log.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: tagBg,
                        color: tagColor,
                        border: `1px solid ${tagColor}`
                      }}
                    >
                      {log.type}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                      {log.title}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                    {log.detail}
                  </p>
                </div>

                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {log.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
