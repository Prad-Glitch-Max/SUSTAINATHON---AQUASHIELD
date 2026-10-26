import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Shield, Zap, Clock, ShieldCheck, Play, Pause, Volume2, VolumeX, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function IntroSplash({ onEnter, sustainability }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const iframeRef = useRef(null);

  // Auto-listen for ENTER key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleLaunch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Try playing the Jailer 2 One Name theme when user clicks anywhere or toggles
  const handleToggleAudio = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      sound.playJailerTheme();
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleLaunch = () => {
    setIsWarping(true);
    sound.playWarpLaunch();
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  const liters = sustainability?.litersProtected || 142850;
  const energy = sustainability?.energySavedKwh || 382.4;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, #0a1128 0%, #030712 75%, #010409 100%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        opacity: isWarping ? 0 : 1,
        transform: isWarping ? 'scale(1.08)' : 'scale(1)'
      }}
    >
      {/* Background Cybernetic Grid & Scanning Beam */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(0, 242, 254, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 254, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />
      <div className="scanline-beam" />

      {/* Embedded YouTube Audio Player for Jailer 2 "One Name" BGM */}
      {isPlayingAudio && (
        <iframe
          ref={iframeRef}
          title="Jailer 2 One Name BGM"
          style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0.01, pointerEvents: 'none' }}
          src="https://www.youtube.com/embed/isDo6u7QQ74?autoplay=1&loop=1&playlist=isDo6u7QQ74&playsinline=1"
          allow="autoplay"
        />
      )}

      {/* TOP STATUS & MUSIC CONTROLLER HUD */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00f2fe',
              boxShadow: '0 0 10px #00f2fe'
            }}
          />
          <span
            className="font-mono"
            style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            SUSTAINATHON 2024 • VIT VELLORE • CPS LAB
          </span>
        </div>

        {/* Jailer 2 BGM Controller */}
        <div
          onClick={handleToggleAudio}
          className="glass-panel"
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            border: isPlayingAudio ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.15)',
            background: isPlayingAudio ? 'rgba(0, 242, 254, 0.15)' : 'rgba(15, 23, 42, 0.7)',
            boxShadow: isPlayingAudio ? '0 0 18px rgba(0,242,254,0.4)' : 'none',
            transition: 'all 0.25s ease'
          }}
          title="Click to Play/Pause Jailer 2 Theme Music"
        >
          {/* Animated EQ Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
            <span
              className={isPlayingAudio ? 'eq-bar-1' : ''}
              style={{ width: '3px', height: '10px', background: '#00f2fe', borderRadius: '1px' }}
            />
            <span
              className={isPlayingAudio ? 'eq-bar-2' : ''}
              style={{ width: '3px', height: '16px', background: '#10b981', borderRadius: '1px' }}
            />
            <span
              className={isPlayingAudio ? 'eq-bar-3' : ''}
              style={{ width: '3px', height: '6px', background: '#38bdf8', borderRadius: '1px' }}
            />
            <span
              className={isPlayingAudio ? 'eq-bar-4' : ''}
              style={{ width: '3px', height: '14px', background: '#00f2fe', borderRadius: '1px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f1f5f9' }}>
              🎵 Jailer 2 — "One Name" BGM
            </span>
            <span style={{ fontSize: '0.62rem', color: isPlayingAudio ? '#00f2fe' : '#94a3b8' }}>
              {isPlayingAudio ? 'Playing (Anirudh Ravichander)' : 'Click to Play Audio'}
            </span>
          </div>

          <button
            style={{
              background: isPlayingAudio ? '#00f2fe' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPlayingAudio ? '#050811' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            {isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </div>

      {/* CENTER HERO: MASSIVE GLOWING AQUASHIELD LOGO */}
      <div style={{ textAlign: 'center', zIndex: 10, maxWidth: '960px', width: '100%', marginTop: '40px' }}>
        {/* Hologram Icon */}
        <div style={{ display: 'inline-flex', position: 'relative', marginBottom: '14px' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(0,242,254,0.25), rgba(16,185,129,0.25))',
              border: '2px solid #00f2fe',
              boxShadow: '0 0 35px rgba(0, 242, 254, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Droplets size={44} color="#00f2fe" style={{ filter: 'drop-shadow(0 0 12px #00f2fe)' }} />
          </div>
        </div>

        {/* Massive Logo Typography */}
        <h1
          className="font-display intro-logo-glow"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.6rem)',
            fontWeight: 900,
            letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #ffffff 0%, #00f2fe 55%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0',
            textTransform: 'uppercase'
          }}
        >
          AQUASHIELD
        </h1>

        {/* Tagline */}
        <div
          className="font-mono"
          style={{
            fontSize: 'clamp(0.82rem, 1.8vw, 1.05rem)',
            color: '#38bdf8',
            letterSpacing: '0.08em',
            fontWeight: 800,
            marginBottom: '10px',
            textTransform: 'uppercase'
          }}
        >
          PHYSICS-INFORMED CYBER-PHYSICAL ATTACK LOCALIZATION
        </div>

        <p
          style={{
            fontSize: '0.88rem',
            color: '#94a3b8',
            maxWidth: '680px',
            margin: '0 auto 28px auto',
            lineHeight: 1.5
          }}
        >
          Surgical 38ms root-cause isolation and autonomous self-healing for clean water infrastructure — protecting drinking water with <strong style={{ color: '#10b981' }}>0 seconds downtime</strong>.
        </p>

        {/* ================= FEATURED SUSTAINABILITY METRIC CARDS (FROM IMAGE 2) ================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px',
            margin: '0 auto 34px auto',
            maxWidth: '940px',
            width: '100%',
            textAlign: 'left'
          }}
        >
          {/* Card 1: Clean Water Protected */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.15)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Droplets size={22} color="#00f2fe" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 700
                }}
              >
                CLEAN WATER PROTECTED
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                {liters.toLocaleString()} <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Liters</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                + Zero emergency dumps required
              </div>
            </div>
          </div>

          {/* Card 2: Localization Latency */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Clock size={22} color="#10b981" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 700
                }}
              >
                LOCALIZATION LATENCY
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                &lt; 50 ms <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Real-time</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, marginTop: '2px' }}>
                vs 4.5 hrs manual diagnostic
              </div>
            </div>
          </div>

          {/* Card 3: Pump Energy Conserved */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Zap size={22} color="#f59e0b" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 700
                }}
              >
                PUMP ENERGY CONSERVED
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
                {energy.toFixed(1)} <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>kWh</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                Avoided pump burnout & surge
              </div>
            </div>
          </div>

          {/* Card 4: Plant Availability */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={22} color="#a855f7" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 700
                }}
              >
                PLANT AVAILABILITY
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc' }}>
                100% <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Operational</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                UN SDG 6.1 Clean Drinking Water
              </div>
            </div>
          </div>
        </div>

        {/* ENTER CALL TO ACTION BUTTON */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleLaunch}
            className="cta-pulse-button"
            style={{
              padding: '16px 38px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #10b981 100%)',
              color: '#050811',
              border: '2px solid #ffffff',
              fontSize: '1.05rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              letterSpacing: '0.06em',
              transition: 'transform 0.15s ease',
              fontFamily: 'var(--font-display)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span>ENTER COMMAND CENTER</span>
            <span
              style={{
                background: '#050811',
                color: '#00f2fe',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 800
              }}
            >
              PRESS ENTER ↵
            </span>
          </button>

          <span
            className="font-mono"
            style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.04em' }}
          >
            Click or press [ENTER] on your keyboard to enter live SCADA dashboard
          </span>
        </div>
      </div>
    </div>
  );
}
