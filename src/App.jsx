import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ZeroDayPromptConsole from './components/ZeroDayPromptConsole';
import InteractiveControlBar from './components/InteractiveControlBar';
import DigitalTwinSCADA from './components/DigitalTwinSCADA';
import DatasetBenchmarkView from './components/DatasetBenchmarkView';
import { CPSSimulator } from './engine/cpsSimulator';
import { LayoutDashboard, Database } from 'lucide-react';

export default function App() {
  const simRef = useRef(null);
  if (!simRef.current) {
    simRef.current = new CPSSimulator();
  }

  const [simState, setSimState] = useState(() => simRef.current.getState());
  const [selectedScenarioKeys, setSelectedScenarioKeys] = useState(['SENSOR_SPOOF']);
  const [autoStage, setAutoStage] = useState(0);
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'comparison' | 'terminal' | 'dataset'

  // Simulation step loop (4 Hz updates)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextState = simRef.current.step(0.25);
      setSimState({ ...nextState });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Step 1: Launch Attack (single or multiple)
  const handleLaunchAttack = (keys) => {
    simRef.current.launchAttack(keys);
    setSimState({ ...simRef.current.getState() });
  };

  // Step 1b: Launch Custom Zero-Day Attack from Hacker Prompt Console
  const handleLaunchCustomAttack = (customScenario) => {
    setSelectedScenarioKeys([customScenario]);
    handleLaunchAttack([customScenario]);

    // Dramatic automated 4-stage presentation
    setAutoStage(1);
    setTimeout(() => {
      setAutoStage(2);
    }, 2800);
    setTimeout(() => {
      simRef.current.localizeAttack();
      setSimState({ ...simRef.current.getState() });
      setAutoStage(3);
    }, 5800);
    setTimeout(() => {
      simRef.current.deployFix();
      setSimState({ ...simRef.current.getState() });
      setAutoStage(4);
    }, 8500);
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

      </div>

      {/* TAB 1: INTERACTIVE ATTACK LAB (MAIN STAGE) */}
      {activeTab === 'lab' && (
        <div style={{ margin: '0 16px' }}>
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
