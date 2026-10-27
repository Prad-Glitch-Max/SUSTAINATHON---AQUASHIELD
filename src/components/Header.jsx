import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Volume2, VolumeX, ChevronDown, Menu, LayoutDashboard, Database, Wrench, ChevronsUpDown } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { setAllSections } from './Section';

const VIEW_ICONS = { lab: LayoutDashboard, dataset: Database, maintenance: Wrench };

export default function Header({
  activeScenario,
  phase,
  activeTab,
  onTab,
  views = [],
  menuGroups = [],
  onMenuSelect
}) {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(sound.muted);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const updateTime = () => setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // close the Contents menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const isNominal = phase === 'NOMINAL' || phase === 'RESOLVED';
  const statusText =
    phase === 'NOMINAL' ? 'All systems normal'
    : phase === 'ATTACK_ACTIVE' ? 'Alarm — attack in progress'
    : phase === 'LOCALIZED' ? `Root cause: ${activeScenario?.layerName || 'identified'}`
    : 'Fixed — clean water flowing';
  const dot = phase === 'ATTACK_ACTIVE' || phase === 'LOCALIZED' ? '#e11d48' : '#047857';

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '6px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: 'var(--gradient-brand)',
            display: 'grid', placeItems: 'center', color: '#fff',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)'
          }}>
            <Droplets size={19} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.02rem', fontWeight: 750, letterSpacing: '-0.02em', lineHeight: 1.1,
              background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
              color: 'transparent', WebkitTextFillColor: 'transparent'
            }}>
              AquaShield CPS
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Smart water security · UN SDG 6
            </p>
          </div>
        </div>

        {/* Contents dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="menu-btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <Menu size={16} />
            <span>Contents</span>
            <ChevronDown size={15} style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          </button>
          {menuOpen && (
            <div className="menu-pop" role="menu">
              {menuGroups.map(group => (
                <div key={group.label}>
                  <div className="menu-group">{group.label}</div>
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className="menu-item"
                      onClick={() => { setMenuOpen(false); onMenuSelect && onMenuSelect(group.view, item.id); }}
                    >
                      <span className="sec-icon" style={{ width: 28, height: 28, borderRadius: 8 }}>
                        {item.icon ? <item.icon size={15} /> : null}
                      </span>
                      <span>
                        {item.title}
                        {item.subtitle && <small>{item.subtitle}</small>}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '8px 0 2px', paddingTop: 6 }}>
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => { const next = !allOpen; setAllOpen(next); setAllSections(next); setMenuOpen(false); }}
                >
                  <span className="sec-icon" style={{ width: 28, height: 28, borderRadius: 8 }}><ChevronsUpDown size={15} /></span>
                  <span>{allOpen ? 'Collapse all sections' : 'Expand all sections'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View tabs */}
        <nav className="view-tabs" aria-label="Views">
          {views.map(v => {
            const Icon = VIEW_ICONS[v.id];
            return (
              <button
                key={v.id}
                type="button"
                className={`view-tab${activeTab === v.id ? ' active' : ''}`}
                onClick={() => onTab(v.id)}
              >
                {Icon && <Icon size={15} />}
                <span>{v.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: status, clock, sound */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999,
            background: isNominal ? '#ecfdf3' : '#fff1f2',
            border: `1px solid ${isNominal ? '#bbf7d0' : '#fecdd3'}`
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 650, color: isNominal ? '#166534' : '#be123c' }}>
              {statusText}
            </span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{timeStr}</span>
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? 'Turn sound on' : 'Turn sound off'}
            aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
            className="menu-btn"
            style={{ padding: '7px 9px', color: isMuted ? 'var(--text-dim)' : 'var(--accent)' }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
