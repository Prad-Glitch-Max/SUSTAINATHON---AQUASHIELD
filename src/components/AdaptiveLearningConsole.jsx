import React, { useState } from 'react';
import {
  Brain,
  Zap,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { adaptiveLearningEngine } from '../engine/adaptiveLearningEngine';

export default function AdaptiveLearningConsole({
  simState,
  onTeachAttack,
  onLaunchDemoLearningLoop
}) {
  const { isLearnedReflex, learnedExperience, activeScenario, phase } = simState;
  const isAttackActive = phase === 'ATTACK_ACTIVE';
  const isResolved = phase === 'RESOLVED';
  const isLocalized = phase === 'LOCALIZED';

  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showTeachModal, setShowTeachModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [customFix, setCustomFix] = useState('');
  const [vaultMemories, setVaultMemories] = useState(() => adaptiveLearningEngine.getAllMemories());

  const handleOpenTeach = () => {
    setFeedbackText(
      activeScenario?.symptom
        ? `Operator confirmed anomaly on ${activeScenario.target || 'target component'}. Validated physical continuity failure.`
        : 'Operator confirmed failure root cause. Command verified isolation policy.'
    );
    setCustomFix(
      activeScenario?.plainFix ||
        'AquaShield isolates compromised node and activates virtual physics state estimator in <15ms.'
    );
    setShowTeachModal(true);
  };

  const handleSaveFeedback = (e) => {
    e.preventDefault();
    if (!activeScenario) return;

    adaptiveLearningEngine.recordFeedback({
      scenario: activeScenario,
      feedbackText,
      customFix
    });

    setVaultMemories(adaptiveLearningEngine.getAllMemories());
    setShowTeachModal(false);

    if (onTeachAttack) {
      onTeachAttack(activeScenario);
    }
  };

  const handleResetVault = () => {
    if (window.confirm('Reset Experience Vault back to baseline certified experiences?')) {
      const reset = adaptiveLearningEngine.resetVault();
      setVaultMemories(reset);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '14px 18px',
        marginBottom: '14px',
        borderRadius: '12px',
        background: isLearnedReflex
          ? 'rgba(5, 150, 105, 0.08)'
          : isAttackActive
            ? 'rgba(225, 29, 72, 0.07)'
            : 'var(--frost)',
        border: isLearnedReflex
          ? '1.5px solid #059669'
          : isAttackActive
            ? '1.5px solid rgba(225, 29, 72, 0.4)'
            : '1px solid rgba(14, 116, 144, 0.22)',
        boxShadow: isLearnedReflex
          ? '0 0 25px rgba(5, 150, 105, 0.09)'
          : '0 8px 24px rgba(18, 35, 31, 0.072)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {/* Left: Engine Title & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: isLearnedReflex ? 'rgba(5, 150, 105, 0.2)' : 'rgba(139, 92, 246, 0.15)',
              border: `1px solid ${isLearnedReflex ? '#059669' : '#8b5cf6'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Brain size={18} color={isLearnedReflex ? '#059669' : '#6d28d9'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 className="font-display" style={{ fontSize: '0.94rem', color: 'var(--ink)', fontWeight: 900, letterSpacing: '0.03em' }}>
                ADAPTIVE LEARNING & EXPERIENCE VAULT
              </h3>
              <span
                className={isLearnedReflex ? 'badge badge-emerald' : 'badge badge-cyan'}
                style={{ fontSize: '0.66rem', padding: '1px 8px' }}
              >
                {isLearnedReflex ? 'LEARNED REFLEX ACTIVE' : 'LEARNING FROM FEEDBACK'}
              </span>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
              Self-supervised invariant learning: novel failures teach the system to rectify identical or similar attacks in &lt;15ms
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Quick Guided Learning Loop Demo Button */}
          {onLaunchDemoLearningLoop && (
            <button
              onClick={onLaunchDemoLearningLoop}
              className="glass-panel"
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.18)',
                border: '1px solid #8b5cf6',
                color: '#5b21b6',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={14} color="#6d28d9" />
              <span>1-Click Learning Demo</span>
            </button>
          )}

          {/* Teach / Provide Feedback Button (When attack active or localized or resolved) */}
          {(isAttackActive || isLocalized || isResolved) && activeScenario?.id !== 'NONE' && (
            <button
              onClick={handleOpenTeach}
              className="glass-panel"
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: isLearnedReflex ? 'rgba(5, 150, 105, 0.15)' : 'rgba(8, 145, 178, 0.15)',
                border: `1px solid ${isLearnedReflex ? '#059669' : '#0891b2'}`,
                color: isLearnedReflex ? '#047857' : '#0e7490',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={13} />
              <span>{isLearnedReflex ? 'Update Operator Feedback' : 'Teach AquaShield / Feed Back Fix'}</span>
            </button>
          )}

          {/* Inspect Vault Modal Trigger */}
          <button
            onClick={() => {
              setVaultMemories(adaptiveLearningEngine.getAllMemories());
              setShowVaultModal(true);
            }}
            className="glass-panel"
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'var(--frost)',
              border: '1px solid rgba(18, 35, 31, 0.12)',
              color: '#3b4d46',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Database size={13} color="#0891b2" />
            <span>Memory Vault ({vaultMemories.length})</span>
          </button>
        </div>
      </div>

      {/* Dynamic Learning State Banner */}
      {isLearnedReflex && learnedExperience && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(5, 150, 105, 0.14)',
            border: '1px solid #059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#047857' }}>
              RECOGNIZED FROM MEMORY (Incident #{learnedExperience.id})
            </span>
            <span style={{ fontSize: '0.7rem', color: '#065f46' }}>
              Encounter #{learnedExperience.encounterCount || 2} • 99.8% Match Confidence
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '0.74rem', color: '#3b4d46' }}>
              First Encounter: <strong style={{ color: '#be123c' }}>{learnedExperience.firstEncounterMs || 8500}ms</strong>
              <ArrowRight size={11} style={{ margin: '0 4px', verticalAlign: 'middle' }} />
              Subsequent Recall: <strong style={{ color: '#047857' }}>{learnedExperience.secondEncounterMs || 12}ms (Instant Reflex!)</strong>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.64rem', padding: '2px 8px' }}>
              99.8% Speedup
            </span>
          </div>
        </div>
      )}

      {isAttackActive && !isLearnedReflex && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={15} color="#b45309" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309' }}>
              Novel Attack Encountered: First-Time Diagnostic Search (8.5s)
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#3b4d46' }}>
            AquaShield will isolate the root cause. Once resolved, click <strong>"Teach AquaShield"</strong> so next time it self-heals in 12ms!
          </div>
        </div>
      )}

      {/* ================= TEACH / FEEDBACK MODAL ================= */}
      {showTeachModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            background: 'var(--frost)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '560px',
              width: '100%',
              background: 'var(--frost-strong)',
              border: '1.5px solid #0891b2',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(18, 35, 31, 0.144), 0 0 35px rgba(8, 145, 178, 0.07)',
              padding: '22px 24px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowTeachModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(18, 35, 31, 0.06)',
                border: '1px solid rgba(18, 35, 31, 0.12)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5a6b65',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Brain size={22} color="#0891b2" />
              <div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 900 }}>
                  Teach AquaShield from Experience & Feedback
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Incorporate human feedback to train future instant reflex self-healing policies
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0e7490', display: 'block', marginBottom: '4px' }}>
                  Target Attack Signature
                </label>
                <div style={{ background: 'var(--frost)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--ink)', border: '1px solid rgba(18, 35, 31, 0.08)' }}>
                  {activeScenario?.name || 'Zero-Day Scenario'} ({activeScenario?.target || 'Target Component'})
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0e7490', display: 'block', marginBottom: '4px' }}>
                  Operator Feedback / Root-Cause Confirmation
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--frost)',
                    border: '1px solid rgba(14, 116, 144, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--ink)',
                    fontSize: '0.78rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  placeholder="e.g. Confirmed physical valve jam on transfer conduit. Instructed dynamic pump throttling."
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857', display: 'block', marginBottom: '4px' }}>
                  Learned Autonomous Countermeasure Policy
                </label>
                <textarea
                  value={customFix}
                  onChange={(e) => setCustomFix(e.target.value)}
                  rows={2}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--frost)',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--ink)',
                    fontSize: '0.78rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  placeholder="e.g. AquaShield isolates valve and activates secondary bypass solenoid in 12ms."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowTeachModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(18, 35, 31, 0.06)',
                    border: '1px solid rgba(18, 35, 31, 0.1)',
                    color: '#5a6b65',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="badge badge-emerald"
                  style={{
                    padding: '8px 20px',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    border: '1px solid #059669',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>Commit to Experience Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EXPERIENCE VAULT INSPECTOR MODAL ================= */}
      {showVaultModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            background: 'var(--frost)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '720px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              background: 'var(--frost-strong)',
              border: '1.5px solid rgba(5, 150, 105, 0.4)',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(18, 35, 31, 0.144)',
              padding: '24px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowVaultModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(18, 35, 31, 0.06)',
                border: '1px solid rgba(18, 35, 31, 0.12)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5a6b65',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={22} color="#0891b2" />
                <div>
                  <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--ink)', fontWeight: 900 }}>
                    AquaShield Adaptive Experience Vault
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Persistent cyber-physical policy memories learned from failures & operator feedback
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetVault}
                style={{
                  background: 'rgba(18, 35, 31, 0.06)',
                  border: '1px solid rgba(18, 35, 31, 0.12)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  color: '#5a6b65',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={12} />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vaultMemories.map((mem) => (
                <div
                  key={mem.id}
                  style={{
                    background: 'var(--frost)',
                    border: '1px solid rgba(14, 116, 144, 0.2)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(18, 35, 31, 0.06)', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.76rem', color: '#0891b2', fontFamily: 'monospace', fontWeight: 800 }}>
                        {mem.id}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>
                        {mem.name}
                      </strong>
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.64rem', padding: '1px 8px' }}>
                      Encounter #{mem.encounterCount || 1} • {mem.speedup || '99.8% Faster'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#3b4d46' }}>
                    <strong style={{ color: '#0e7490' }}>Target Node: </strong>
                    <span>{mem.component} ({mem.layer})</span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#5a6b65', lineHeight: 1.4 }}>
                    <strong style={{ color: '#b45309' }}>Operator Feedback: </strong>
                    <span>{mem.operatorFeedback}</span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#047857', lineHeight: 1.4, background: 'rgba(5, 150, 105, 0.08)', padding: '6px 10px', borderRadius: '6px' }}>
                    <strong style={{ color: '#059669' }}>Learned Countermeasure: </strong>
                    <span>{mem.learnedFix}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#6b7b75', marginTop: '2px' }}>
                    <span>First Search: {mem.firstEncounterMs || 8500}ms → Subsequent Reflex: {mem.secondEncounterMs || 12}ms</span>
                    <span>Confidence: {(mem.learnedConfidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowVaultModal(false)}
                className="badge badge-emerald"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: '1px solid #059669'
                }}
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
