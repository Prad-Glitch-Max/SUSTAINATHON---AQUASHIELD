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
import Section, { openSection } from './components/Section';
import { LayoutDashboard, Database, ShieldCheck, Wrench, Terminal, Network, Activity, SlidersHorizontal, Shield, Gauge, Layers, BookOpen, Cpu } from 'lucide-react';
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
          colors: ['#0891b2', '#059669', '#0e7490', '#047857']
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
      color: '#e11d48',
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

  // ---- Navigation model: views + the titles shown in the "Contents" dropdown ----
  const VIEWS = [
    { id: 'lab', label: 'Attack Lab' },
    { id: 'dataset', label: 'Real-World Dataset' },
    { id: 'maintenance', label: 'Maintenance' }
  ];

  const MENU_GROUPS = [
    {
      label: 'Attack Lab', view: 'lab',
      items: [
        { id: 'lab-controls', title: 'Attack lab controls', subtitle: 'Launch, locate and self-heal an attack', icon: SlidersHorizontal },
        { id: 'lab-twin', title: 'Digital twin — live plant', subtitle: 'Animated tanks, pumps, valves and pipes', icon: Activity },
        { id: 'twin-explain', title: 'Live explanation', subtitle: 'What is happening, in plain words', icon: BookOpen },
        { id: 'twin-tanks', title: 'Tank status', subtitle: 'Level and health of every tank', icon: Gauge },
        { id: 'twin-telemetry', title: 'Live telemetry', subtitle: 'Flow, pressure, chlorine and more', icon: Cpu },
        { id: 'lab-prompt', title: 'Custom hacker prompt', subtitle: 'Type any attack in plain English', icon: Terminal },
        { id: 'lab-topology', title: 'Plant topology', subtitle: 'Switch between 3, 4, 5 or 6 tanks', icon: Network }
      ]
    },
    {
      label: 'Real-World Dataset', view: 'dataset',
      items: [
        { id: 'dataset-main', title: 'SWaT / Kaggle benchmark', subtitle: 'Replay recorded attacks on the twin', icon: Database }
      ]
    },
    {
      label: 'Maintenance', view: 'maintenance',
      items: [
        { id: 'maint-overview', title: 'Plant health overview', icon: Shield },
        { id: 'maint-how', title: 'How replacement works', subtitle: 'Humans vs. the system', icon: BookOpen },
        { id: 'maint-hardware', title: 'Hardware health cards', icon: Layers },
        { id: 'maint-trend', title: 'Degradation forecast', icon: Activity },
        { id: 'maint-stress', title: 'Stress simulator & activity log', icon: Wrench }
      ]
    }
  ];

  const handleMenuSelect = (view, sectionId) => {
    if (view !== activeTab) setActiveTab(view);
    // wait for the view to mount before opening the section
    setTimeout(() => openSection(sectionId), view !== activeTab ? 140 : 0);
  };

  const phaseBadge = {
    NOMINAL: { text: 'Normal', tone: 'ok' },
    ATTACK_ACTIVE: { text: 'Attack active', tone: 'warn' },
    LOCALIZED: { text: 'Root cause found', tone: 'info' },
    RESOLVED: { text: 'Fixed', tone: 'ok' }
  }[simState.phase] || { text: '', tone: '' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
      <Header
        activeScenario={simState.activeScenario}
        phase={simState.phase}
        activeTab={activeTab}
        onTab={setActiveTab}
        views={VIEWS}
        menuGroups={MENU_GROUPS}
        onMenuSelect={handleMenuSelect}
      />

      <main className="page">
        {/* VIEW 1: ATTACK LAB */}
        {activeTab === 'lab' && (
          <>
            <Section
              id="lab-controls"
              title="Attack lab controls"
              subtitle="Launch an attack, find the root cause, then self-heal"
              icon={SlidersHorizontal}
              badge={phaseBadge.text}
              badgeTone={phaseBadge.tone}
              defaultOpen
            >
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
            </Section>

            <Section
              id="lab-twin"
              title="Digital twin — live plant"
              subtitle="Animated tanks, pumps, valves and pipes"
              icon={Activity}
              defaultOpen
            >
              <DigitalTwinSCADA
                state={simState}
                autoStage={autoStage}
                selectedScenarioKeys={selectedScenarioKeys}
              />
            </Section>

            <Section
              id="lab-prompt"
              title="Custom hacker prompt"
              subtitle="Type any attack in plain English and watch the twin react"
              icon={Terminal}
            >
              <ZeroDayPromptConsole
                embedded
                phase={simState.phase}
                activeScenario={simState.activeScenario}
                onLaunchCustomAttack={handleLaunchCustomAttack}
                onReset={handleReset}
              />
            </Section>

            <Section
              id="lab-topology"
              title="Plant topology"
              subtitle="Switch between 3, 4, 5 or 6 tank layouts"
              icon={Network}
            >
              <BlueprintSelector
                activeBlueprintId={simState.blueprintId || simState.blueprint?.id || 'BLUEPRINT_4_CASCADE'}
                onSelectBlueprint={handleSelectBlueprint}
                phase={simState.phase}
              />
            </Section>
          </>
        )}

        {/* VIEW 2: REAL-WORLD DATASET BENCHMARK (SWaT / KAGGLE) */}
        {activeTab === 'dataset' && (
          <Section
            id="dataset-main"
            title="SWaT / Kaggle benchmark"
            subtitle="Replay real recorded attacks on the digital twin"
            icon={Database}
            defaultOpen
          >
            <DatasetBenchmarkView
              activeScenario={simState.activeScenario}
              phase={simState.phase}
              onReplayDatasetAttack={handleReplayDatasetAttack}
            />
          </Section>
        )}

        {/* VIEW 3: MAINTENANCE & SENSOR DEGRADATION MONITOR */}
        {activeTab === 'maintenance' && <MaintenanceView simState={simState} />}
      </main>

      {/* Floating reopen button once resolved and the report was dismissed */}
      {simState.phase === 'RESOLVED' && !showPostMortem && (
        <button
          onClick={() => setShowPostMortem(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 900,
            background: '#059669',
            border: 'none',
            borderRadius: '999px',
            padding: '11px 18px',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 650,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(18, 35, 31, 0.2)'
          }}
        >
          <ShieldCheck size={17} />
          <span>Incident resolution report</span>
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

      <footer style={{
        textAlign: 'center',
        padding: '18px',
        color: 'var(--text-dim)',
        fontSize: '0.75rem',
        margin: '12px auto 0',
        maxWidth: 1200
      }}>
        AquaShield CPS · Built for <strong style={{ color: 'var(--accent)' }}>Sustainathon</strong> · Vellore Institute of Technology (VITV) · UN Sustainable Development Goal 6 (Clean Water)
      </footer>
    </div>
  );
}
