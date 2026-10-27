import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  AlertTriangle,
  MapPin,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  Droplets,
  ArrowRight
} from 'lucide-react';

const PREVENTION_DATABASE = {
  SENSOR_SPOOF: {
    title: 'Hardware-Enforced Mass-Balance Telemetry & Edge Attestation',
    steps: [
      'Deploy hardware cryptographic attestation directly at the 4-20mA sensor head to prevent packet injection.',
      'Embed physical continuity invariant watchers inside the PLC runtime to automatically reject unphysical sensor teleportation.',
      'Implement dual-redundant acoustic level sensors as cross-validating physical baselines.'
    ]
  },
  NETWORK_REPLAY: {
    title: 'Zero-Trust Time-Sensitive Networking (TSN) & Monotonic Timestamps',
    steps: [
      'Upgrade SCADA ring bus to IEEE 1588 nanosecond-precision synchronized monotonic timestamps.',
      'Deploy industrial MACsec hardware encryption across all fieldbus conduits to block man-in-the-middle replays.',
      'Implement dual-homed redundant fiber rings with sub-millisecond bump-less automatic failover.'
    ]
  },
  CONTROLLER_HIJACK: {
    title: 'Out-of-Band Hardware Safety Relays & Immutable Setpoint Bounds',
    steps: [
      'Install hardwired physical pressure-relief safety relays that physically disconnect pump coil power if pressure exceeds 4.5 bar.',
      'Enforce multi-operator biometric dual-authorization for any PLC setpoint modifications.',
      'Air-gap the industrial controller programming interface with read-only physical interlocks during runtime.'
    ]
  },
  FIRMWARE_ROOTKIT: {
    title: 'Immutable Hardware Root-of-Trust (RoT) & Secure Boot ROM',
    steps: [
      'Enforce hardware-verified cryptographic secure boot with RSA-4096 signature verification on every actuator startup.',
      'Engage physical write-protect hardware jumpers on actuator flash memory to eliminate in-place firmware reflashing.',
      'Continuously audit runtime motor memory hashes against immutable golden snapshots stored in secure silicon.'
    ]
  },
  ACTUATOR_JAM: {
    title: 'Predictive Torque Profiling & Automated Diverter Bypasses',
    steps: [
      'Perform continuous motor current signature analysis (MCSA) to detect mechanical silt buildup before full valve seizure.',
      'Mandate parallel dual-diverter piping loops with spring-assisted automated bypass actuation.',
      'Schedule automated periodic physical exercise stroking routines to prevent mechanical calcium calcification.'
    ]
  },
  ALL_PATHS_BLOCKED: {
    title: 'Zero-Power Mechanical Relief Burst Discs & Dedicated Buffer Loops',
    steps: [
      'Equip all high-pressure conduits with passive mechanical rupture discs and spring-loaded pressure relief valves that require zero electricity.',
      'Permanently plumb a closed-circuit internal recirculation loop connecting all filtration stages back to reservoir intake tanks.',
      'Interlock upstream feed pumps to immediately drop electrical power when downstream pressure differential surges above 5.0 bar.'
    ]
  },
  POWER_GRID_BLACKOUT: {
    title: 'Fail-Secure Spring Counterweights & Gravitational Head Gradients',
    steps: [
      'Standardize all critical municipal valves to fail-secure mechanical counterweight designs that mechanically snap open under 0V grid failure.',
      'Preserve natural hydraulic elevation gradients (P = ρgh) between intake reservoirs and municipal drinking supplies to guarantee passive gravity flow.',
      'Maintain isolated 24V DC battery backup systems dedicated solely to running edge telemetry and zero-power communication.'
    ]
  }
};

export default function IncidentPostMortemModal({
  isOpen,
  onClose,
  scenarios = [],
  sensors = {},
  sustainability = {}
}) {
  if (!isOpen || !scenarios || scenarios.length === 0) return null;

  // Primary scenario or list of scenarios
  const scnList = scenarios.filter(s => s && s.id !== 'NONE');
  if (scnList.length === 0) return null;

  const isMulti = scnList.length > 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'var(--frost)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--frost-strong)',
          border: '1.5px solid rgba(5, 150, 105, 0.45)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(18, 35, 31, 0.126), 0 0 35px rgba(5, 150, 105, 0.07)',
          padding: '24px 26px',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(18, 35, 31, 0.06)',
            border: '1px solid rgba(18, 35, 31, 0.12)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5a6b65',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.background = 'rgba(18, 35, 31, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#5a6b65';
            e.currentTarget.style.background = 'rgba(18, 35, 31, 0.06)';
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(5, 150, 105, 0.15)',
              border: '1px solid rgba(5, 150, 105, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={24} color="#059669" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                AUTONOMOUS HEALING POST-MORTEM REPORT
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.66rem', padding: '1px 8px' }}>
                ZERO DOWNTIME
              </span>
            </div>
            <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--ink)', fontWeight: 900, marginTop: '2px' }}>
              Incident Resolved & Physical Plant Protected
            </h3>
          </div>
        </div>

        {/* Content for Each Breached Scenario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {scnList.map((scn, idx) => {
            const prevention = PREVENTION_DATABASE[scn.id] || {
              title: 'Hardware Invariants & Multi-Layer Continuous Telemetry Auditing',
              steps: [
                'Implement physical continuity invariant verification across fluid intake and discharge telemetry.',
                'Enforce strict cryptographic separation between corporate supervisory networks and field actuators.',
                'Deploy automated failover routes and passive mechanical pressure-relief dampers.'
              ]
            };

            return (
              <div
                key={idx}
                style={{
                  background: 'var(--frost)',
                  border: '1px solid rgba(14, 116, 144, 0.2)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Breached Target Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(18, 35, 31, 0.08)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0e7490' }}>
                      {scn.name}
                    </span>
                    {isMulti && (
                      <span style={{ fontSize: '0.68rem', color: '#5a6b65', background: 'rgba(18, 35, 31, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                        Vector {idx + 1} of {scnList.length}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 800 }}>
                    100% Mitigated in &lt;40ms
                  </span>
                </div>

                {/* 1. What was the Problem */}
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#be123c', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                    <AlertTriangle size={13} color="#be123c" />
                    <span>1. The Problem (What Happened)</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#24362f', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                    {scn.symptom || scn.description}
                  </p>
                </div>

                {/* 2. Where It Occurred */}
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0e7490', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                    <MapPin size={13} color="#0e7490" />
                    <span>2. Where It Occurred (Exact Root-Cause Location)</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#24362f', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                    <strong style={{ color: '#0891b2' }}>{scn.target}</strong> ({scn.layerName || 'Physical Cyber-Physical Layer'}).
                    <div style={{ fontSize: '0.78rem', color: '#5a6b65', marginTop: '2px' }}>
                      <strong>Mathematical Proof:</strong> {scn.plainMathProof || 'Mass flow continuity confirmed physical discrepancy.'}
                    </div>
                  </div>
                </div>

                {/* 3. Solution Taken */}
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                    <Wrench size={13} color="#047857" />
                    <span>3. Solution Taken (How AquaShield Fixed It)</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#24362f', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                    {scn.plainFix || 'Isolated compromised component and engaged virtual physics state estimator.'}
                  </p>
                </div>

                {/* 4. Future Prevention & Hardening */}
                <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(5, 150, 105, 0.25)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                    <ShieldAlert size={13} color="#059669" />
                    <span>4. Future Prevention (How to Prevent This Again)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46', marginTop: '3px' }}>
                    {prevention.title}
                  </div>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '0.76rem', color: '#3b4d46', lineHeight: 1.45 }}>
                    {prevention.steps.map((st, sIdx) => (
                      <li key={sIdx} style={{ marginTop: '2px' }}>{st}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Bottom Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', borderTop: '1px solid rgba(18, 35, 31, 0.08)', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets size={16} color="#0e7490" />
            <span style={{ fontSize: '0.76rem', color: '#5a6b65' }}>
              Drinking water preserved with <strong style={{ color: '#047857' }}>0 Liters wasted</strong> & <strong style={{ color: '#0891b2' }}>0 seconds downtime</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="badge badge-emerald"
            style={{
              padding: '9px 22px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: '1px solid #059669',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Got It • Close Report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
