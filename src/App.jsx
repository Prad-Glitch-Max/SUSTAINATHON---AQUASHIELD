import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ZeroDayPromptConsole from './components/ZeroDayPromptConsole';
import InteractiveControlBar from './components/InteractiveControlBar';
import DigitalTwinSCADA from './components/DigitalTwinSCADA';
import DatasetBenchmarkView from './components/DatasetBenchmarkView';
import IncidentPostMortemModal from './components/IncidentPostMortemModal';
import BlueprintSelector from './components/BlueprintSelector';
import MaintenanceView from './components/MaintenanceView';
import { CPSSimulator } from './engine/cpsSimulator';
import { LayoutDashboard, Database, ShieldCheck, Wrench } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from './utils/soundEffects';

export default function App() {
  const simRef = useRef(null);
  if (!simRef.current) {
    simRef.current = new CPSSimulator();
  }

  const [simState, setSimState] = useState(() => simRef.current.getState());
  const [selectedScenarioKeys, setSelectedScenarioKeys] = useState(['SENSOR_SPOOF']);
  const [autoStage, setAutoStage] = useState(0);
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'dataset'
  const [showPostMortem, setShowPostMortem] = useState(false);
  const prevPhaseRef = useRef(simState.phase);
  const customAttackTimersRef = useRef([]);

  // Trigger incident summary modal upon resolution
  useEffect(() => {
    if (simState.phase === 'RESOLVED' && prevPhaseRef.current !== 'RESOLVED') {
      const timer = setTimeout(() => {
        setShowPostMortem(true);
      }, 700);
      return () => clearTimeout(timer);
    }
    prevPhaseRef.current = simState.phase;
  }, [simState.phase]);

  // Simulation step loop (4 Hz updates)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextState = simRef.current.step(0.25);
      setSimState({ ...nextState });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Blueprint Switcher Handler
  const handleSelectBlueprint = (blueprintId) => {
    customAttackTimersRef.current.forEach(t => clearTimeout(t));
    customAttackTimersRef.current = [];
    setShowPostMortem(false);
    setAutoStage(0);
    simRef.current.setBlueprint(blueprintId);
    setSimState({ ...simRef.current.getState() });
  };

  // Step 1: Launch Attack (single or multiple)
  const handleLaunchAttack = (keys) => {
    setShowPostMortem(false);
    simRef.current.launchAttack(keys);
    setSimState({ ...simRef.current.getState() });
  };

  // Step 1b: Launch Custom Zero-Day Attack from Hacker Prompt Console
  // Slowed down smoothly to ~8.5s so judges & operators can observe every phase!
  const handleLaunchCustomAttack = (customScenario) => {
    // Clear any previous running sequence
    customAttackTimersRef.current.forEach(t => clearTimeout(t));
    customAttackTimersRef.current = [];

    setSelectedScenarioKeys([customScenario]);
    handleLaunchAttack([customScenario]);

    setAutoStage(1);

    const t1 = setTimeout(() => {
      sound.playScan();
      setAutoStage(2);
    }, 2800);

    const t2 = setTimeout(() => {
      sound.playScan();
      simRef.current.localizeAttack();
      setSimState({ ...simRef.current.getState() });
      setAutoStage(3);
    }, 5600);

    const t3 = setTimeout(() => {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#00f2fe', '#10b981', '#38bdf8', '#34d399']
        });
      } catch {}
      simRef.current.deployFix();
      setSimState({ ...simRef.current.getState() });
      setAutoStage(4);
    }, 8500);

    customAttackTimersRef.current.push(t1, t2, t3);
  };

  // Step 1c: Replay Verified Real-World SWaT Dataset Attack into live SCADA
  const handleReplayDatasetAttack = (swatAttack) => {
    let targetNode = 'tank2';
    let layer = 'SENSOR';
    let layerName = 'Layer 1: Sensor (SWaT Testbed)';

    if (swatAttack.id === 'SWAT_ATTACK_01') {
      targetNode = 'tank1';
      layer = 'SENSOR';
      layerName = 'Layer 1: Sensor (LIT-101)';
    } else if (swatAttack.id === 'SWAT_ATTACK_04') {
      targetNode = 'valve';
      layer = 'ACTUATOR';
      layerName = 'Layer 5: Actuator (MV-101)';
    } else if (swatAttack.id === 'SWAT_ATTACK_16') {
      targetNode = 'pump1';
      layer = 'ACTUATOR';
      layerName = 'Layer 5: Pump Motor (P-101)';
    } else if (swatAttack.id === 'SWAT_ATTACK_22') {
      targetNode = 'tank3';
      layer = 'ACTUATOR';
      layerName = 'Layer 5: Chemical Dosing Pump (P-301)';
    } else if (swatAttack.id === 'SWAT_ATTACK_26') {
      targetNode = 'wire';
      layer = 'COMMUNICATION_CHANNEL';
      layerName = 'Layer 2: Communication Channel (Modbus TCP)';
    }

    const swatScenario = {
      id: swatAttack.id,
      isCustom: true,
      isSwatReplay: true,
      swatAttack,
      name: swatAttack.name,
      layer,
      layerName,
      target: swatAttack.targetSensor,
      targetNode,
      description: `SWaT Kaggle Dataset Replay (${swatAttack.kaggleIndex}): ${swatAttack.name}`,
      symptom: swatAttack.injectedPhysicsState ? Object.values(swatAttack.injectedPhysicsState)[0] : 'Telemetry mismatch',
      traditionalMistake: swatAttack.traditionalFailure,
      plainMathProof: swatAttack.aquaShieldLocalizationProof,
      plainFix: swatAttack.remedyApplied,
      color: '#ff2a5f',
      physicsImpact: {
        tank1Delta: swatAttack.id === 'SWAT_ATTACK_01' ? 18 : 0,
        tank3Delta: swatAttack.id === 'SWAT_ATTACK_22' ? 20 : 0,
        pressureDelta: swatAttack.id === 'SWAT_ATTACK_04' ? -1.2 : 0,
        flowDelta: swatAttack.id === 'SWAT_ATTACK_04' ? 26 : 0
      },
      swatCorrelation: `Kaggle Verified Dataset: ${swatAttack.kaggleIndex}`
    };

    setActiveTab('lab');
    handleLaunchCustomAttack(swatScenario);

    setTimeout(() => {
      document.getElementById('scada-facility-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Step 2: Localize Root-Cause
  const handleLocalize = () => {
    simRef.current.localizeAttack();
    setSimState({ ...simRef.current.getState() });
  };

  // Step 3: Deploy Resilient Fix
  const handleDeployFix = () => {
    simRef.current.deployFix();
    setSimState({ ...simRef.current.getState() });
  };

  // Reset to Baseline
  const handleReset = () => {
    customAttackTimersRef.current.forEach(t => clearTimeout(t));
    customAttackTimersRef.current = [];
    setShowPostMortem(false);
    setAutoStage(0);
    simRef.current.restoreBaseline();
    setSimState({ ...simRef.current.getState() });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
      {/* Top Header Bar */}
      <Header
        activeScenario={simState.activeScenario}
        phase={simState.phase}
      />

      {/* Clean Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        margin: '0 16px 16px 16px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('lab')}
          className="glass-panel"
          style={{
            padding: '10px 22px',
            cursor: 'pointer',
            borderRadius: '24px',
            background: activeTab === 'lab' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: activeTab === 'lab' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
            color: activeTab === 'lab' ? '#00f2fe' : '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'lab' ? '0 0 16px rgba(0,242,254,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <LayoutDashboard size={16} />
          <span>Interactive Attack Lab (Main Stage)</span>
        </button>

        <button
          onClick={() => setActiveTab('dataset')}
          className="glass-panel"
          style={{
            padding: '10px 22px',
            cursor: 'pointer',
            borderRadius: '24px',
            background: activeTab === 'dataset' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: activeTab === 'dataset' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
            color: activeTab === 'dataset' ? '#00f2fe' : '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'dataset' ? '0 0 16px rgba(0,242,254,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Database size={16} />
          <span>Real-World Dataset Benchmark (SWaT / Kaggle)</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className="glass-panel"
          style={{
            padding: '10px 22px',
            cursor: 'pointer',
            borderRadius: '24px',
            background: activeTab === 'maintenance' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: activeTab === 'maintenance' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
            color: activeTab === 'maintenance' ? '#00f2fe' : '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'maintenance' ? '0 0 16px rgba(0,242,254,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Wrench size={16} />
          <span>Maintenance</span>
        </button>

      </div>

      {/* TAB 1: INTERACTIVE ATTACK LAB (MAIN STAGE) */}
      {activeTab === 'lab' && (
        <div style={{ margin: '0 16px' }}>
          {/* REVIEW 2: DYNAMIC BLUEPRINT TOPOLOGY SELECTOR (3, 4, 5, 6 TANKS) */}
          <BlueprintSelector
            activeBlueprintId={simState.blueprintId || simState.blueprint?.id || 'BLUEPRINT_4_CASCADE'}
            onSelectBlueprint={handleSelectBlueprint}
            phase={simState.phase}
          />

          {/* ZERO-DAY HACKER PROMPT CONSOLE (JUDGES CAN ENTER ANY OUT-OF-THE-BOX ATTACK!) */}
          <ZeroDayPromptConsole
            phase={simState.phase}
            activeScenario={simState.activeScenario}
            onLaunchCustomAttack={handleLaunchCustomAttack}
            onReset={handleReset}
          />

          {/* Step-by-Step & Autonomous Demo Controller */}
          <InteractiveControlBar
            phase={simState.phase}
            activeScenario={simState.activeScenario}
            activeScenarios={simState.activeScenarios}
            selectedScenarioKeys={selectedScenarioKeys}
            onSelectScenarioKeys={setSelectedScenarioKeys}
            autoStage={autoStage}
            onChangeAutoStage={setAutoStage}
            onLaunchAttack={handleLaunchAttack}
            onLocalize={handleLocalize}
            onDeployFix={handleDeployFix}
            onReset={handleReset}
          />

          {/* 1. SCADA Digital Twin Facility (Full Width, Spacious!) */}
          <section>
            <DigitalTwinSCADA
              state={simState}
              autoStage={autoStage}
              selectedScenarioKeys={selectedScenarioKeys}
            />
          </section>
        </div>
      )}

      {/* TAB 2: REAL-WORLD DATASET BENCHMARK (SWaT / KAGGLE) */}
      {activeTab === 'dataset' && (
        <div style={{ margin: '0 16px' }}>
          <DatasetBenchmarkView
            activeScenario={simState.activeScenario}
            phase={simState.phase}
            onReplayDatasetAttack={handleReplayDatasetAttack}
          />
        </div>
      )}

      {/* TAB 3: MAINTENANCE & SENSOR DEGRADATION MONITOR */}
      {activeTab === 'maintenance' && (
        <div style={{ margin: '0 16px' }}>
          <MaintenanceView simState={simState} />
        </div>
      )}

      {/* Floating Reopen Button if in RESOLVED state and modal is dismissed */}
      {simState.phase === 'RESOLVED' && !showPostMortem && (
        <button
          onClick={() => setShowPostMortem(true)}
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 900,
            background: 'rgba(16, 185, 129, 0.25)',
            border: '1.5px solid #10b981',
            borderRadius: '24px',
            padding: '10px 18px',
            color: '#34d399',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <ShieldCheck size={18} />
          <span>Incident Resolution Report</span>
        </button>
      )}

      {/* Incident Post-Mortem & Future Prevention Modal */}
      <IncidentPostMortemModal
        isOpen={showPostMortem}
        onClose={() => setShowPostMortem(false)}
        scenarios={simState.activeScenarios || [simState.activeScenario]}
        sensors={simState.sensors}
        sustainability={simState.sustainability}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '18px',
        color: 'var(--text-dim)',
        fontSize: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        margin: '24px 16px 0 16px'
      }}>
        AquaShield CPS • Built for <strong style={{ color: '#00f2fe' }}>Sustainathon</strong> • Vellore Institute of Technology (VITV) • UN Sustainable Development Goal 6 (Clean Water)
      </footer>
    </div>
  );
}
