import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import InteractiveControlBar from './components/InteractiveControlBar';
import DigitalTwinSCADA from './components/DigitalTwinSCADA';
import ComparisonView from './components/ComparisonView';
import LiveAuditTerminal from './components/LiveAuditTerminal';
import { CPSSimulator } from './engine/cpsSimulator';
import { LayoutDashboard, GitCompare, Terminal } from 'lucide-react';

export default function App() {
  const simRef = useRef(null);
  if (!simRef.current) {
    simRef.current = new CPSSimulator();
  }

  const [simState, setSimState] = useState(() => simRef.current.getState());
  const [selectedScenarioKeys, setSelectedScenarioKeys] = useState(['SENSOR_SPOOF']);
  const [autoStage, setAutoStage] = useState(0);
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'comparison' | 'terminal'

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
        margin: '0 16px 16px 16px'
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
          onClick={() => setActiveTab('comparison')}
          className="glass-panel"
          style={{
            padding: '10px 22px',
            cursor: 'pointer',
            borderRadius: '24px',
            background: activeTab === 'comparison' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: activeTab === 'comparison' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
            color: activeTab === 'comparison' ? '#00f2fe' : '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'comparison' ? '0 0 16px rgba(0,242,254,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <GitCompare size={16} />
          <span>Old Security Tools vs AquaShield</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className="glass-panel"
          style={{
            padding: '10px 22px',
            cursor: 'pointer',
            borderRadius: '24px',
            background: activeTab === 'terminal' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: activeTab === 'terminal' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
            color: activeTab === 'terminal' ? '#00f2fe' : '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'terminal' ? '0 0 16px rgba(0,242,254,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Terminal size={16} />
          <span>Plant Logs & Math Proof</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE ATTACK LAB (MAIN STAGE) */}
      {activeTab === 'lab' && (
        <div style={{ margin: '0 16px' }}>
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

      {/* TAB 2: COMPARATIVE BENCHMARK */}
      {activeTab === 'comparison' && (
        <div style={{ margin: '0 16px' }}>
          <ComparisonView
            activeScenario={simState.activeScenario}
            localizationResult={simState.localizationResult}
          />
        </div>
      )}

      {/* TAB 3: AUDIT LOGS & MATH FORMULAS */}
      {activeTab === 'terminal' && (
        <div style={{ margin: '0 16px' }}>
          <LiveAuditTerminal
            logs={simState.logs}
            activeScenario={simState.activeScenario}
            localizationResult={simState.localizationResult}
            sensors={simState.sensors}
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
