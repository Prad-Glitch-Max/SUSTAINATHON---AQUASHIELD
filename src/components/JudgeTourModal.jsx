import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Award, Sparkles, CheckCircle2, Shield, Play } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const SLIDES = [
  {
    step: 1,
    title: 'The 30-Second Hook (Grab the Judge\'s Attention)',
    tagline: 'Why Cybersecurity Detection Fails Sustainable Infrastructure',
    script: `“Good morning judges! We are presenting AquaShield CPS.\n\nImagine an alarm goes off at a municipal water recycling plant saying: 'Tank pressure critical!' Traditional security systems can sound the siren, but they cannot tell you WHERE the attack originated — was it a spoofed sensor? An intercepted network packet? A rogue PLC controller? Corrupt firmware? Or a physically jammed valve?\n\nIf operators guess wrong, they either dump 200,000 liters of drinking water out of panic, or let real physical damage destroy critical green infrastructure.”`
  },
  {
    step: 2,
    title: 'Connecting to Sustainathon (UN SDG 6 & SDG 9)',
    tagline: 'Why Attack Localization is a Climate & Water Security Problem',
    script: `“This is not just software security — it is a critical sustainability challenge.\n\nSmart water plants, desalination facilities, and solar microgrids are all Cyber-Physical Systems. When an anomaly occurs, shutting down the entire plant wastes massive energy and millions of liters of clean water. AquaShield provides real-time localization so that only the corrupted node is quarantined, while clean water keeps flowing with ZERO downtime.”`
  },
  {
    step: 3,
    title: 'The Core Innovation: "Physics Doesn\'t Lie"',
    tagline: 'Digital Twin Invariants & Causal Dependency Tracing',
    script: `“How do we solve it? Hackers can forge digital packets, but they cannot violate fluid dynamics.\n\nOur system runs a continuous Physical Invariant Engine: by comparing mass flow (Qin - Qout) against tank volume rates (dh/dt), cryptographic firmware hashes, and network jitter, our algorithm isolates the root cause layer in less than 40 milliseconds with 98%+ confidence.”`
  },
  {
    step: 4,
    title: 'The Interactive Demo (Hand the Mouse to the Judge!)',
    tagline: 'Invite them to launch an attack and watch the system self-heal',
    script: `“Judge, please click any button in our Chaos Injection Studio below — for example, 'L1: Sensor Spoofing'.\n\nNotice how the traditional IDS panics and wants to shut the plant down. But AquaShield's causal laser traces directly to Sensor #204, isolates it, activates the virtual physics estimator, and keeps the plant 100% operational!”`
  }
];

export default function JudgeTourModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    sound.playClick();
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '28px',
        border: '1px solid #00f2fe',
        boxShadow: '0 0 40px rgba(0, 242, 254, 0.25)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(0,242,254,0.15)', padding: '8px', borderRadius: '8px' }}>
            <Award size={22} color="#00f2fe" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#00f2fe', fontWeight: 700, textTransform: 'uppercase' }}>
              STEP {slide.step} OF {SLIDES.length} • HACKATHON PITCH SCRIPT
            </div>
            <h3 className="font-display" style={{ fontSize: '1.1rem', color: '#f1f5f9' }}>
              {slide.title}
            </h3>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '12px', fontWeight: 600 }}>
          {slide.tagline}
        </div>

        {/* Script Card */}
        <div style={{
          background: 'rgba(5, 10, 22, 0.9)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '10px',
          padding: '18px',
          fontSize: '0.88rem',
          color: '#e2e8f0',
          lineHeight: '1.6',
          whiteSpace: 'pre-line',
          minHeight: '180px'
        }}>
          {slide.script}
        </div>

        {/* Navigation & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {SLIDES.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: idx === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentSlide ? '#00f2fe' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="glass-panel"
                style={{ padding: '8px 14px', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
            )}

            {currentSlide < SLIDES.length - 1 ? (
              <button
                onClick={handleNext}
                className="badge badge-cyan"
                style={{ padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #00f2fe' }}
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="badge badge-emerald"
                style={{ padding: '8px 20px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Ready to Win! <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
