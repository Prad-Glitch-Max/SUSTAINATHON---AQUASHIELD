import React, { useState, useEffect, useRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export const SECTION_OPEN_EVENT = 'aquashield:open-section';
export const SECTION_ALL_EVENT = 'aquashield:all-sections';

/** Open (and scroll to) any <Section id="..."> from anywhere, e.g. from the Contents menu. */
export function openSection(id) {
  window.dispatchEvent(new CustomEvent(SECTION_OPEN_EVENT, { detail: { id } }));
}
/** Expand or collapse every mounted section. */
export function setAllSections(open) {
  window.dispatchEvent(new CustomEvent(SECTION_ALL_EVENT, { detail: { open } }));
}

/**
 * Collapsible section: only the title row is visible until the user clicks the title/arrow.
 * Children stay mounted while collapsed so timers/animations/state inside them keep running.
 */
export default function Section({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeTone = '',        // '' | 'warn' | 'ok' | 'info'
  defaultOpen = false,
  openWhen,              // when this flips to true the section opens itself (e.g. an attack starts)
  flat = true,           // flatten a child .glass-panel so cards don't nest inside cards
  children
}) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef(null);
  const bodyId = useId();

  useEffect(() => {
    const onOpen = (e) => {
      if (e.detail?.id !== id) return;
      setOpen(true);
      setTimeout(() => rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    };
    const onAll = (e) => setOpen(!!e.detail?.open);
    window.addEventListener(SECTION_OPEN_EVENT, onOpen);
    window.addEventListener(SECTION_ALL_EVENT, onAll);
    return () => {
      window.removeEventListener(SECTION_OPEN_EVENT, onOpen);
      window.removeEventListener(SECTION_ALL_EVENT, onAll);
    };
  }, [id]);

  const prevWhen = useRef(openWhen);
  useEffect(() => {
    if (openWhen && !prevWhen.current) setOpen(true);
    prevWhen.current = openWhen;
  }, [openWhen]);

  return (
    <section id={id} ref={rootRef} className={`sec${open ? ' open' : ''}`}>
      <button
        type="button"
        className="sec-head"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen(o => !o)}
      >
        {Icon && (
          <span className="sec-icon"><Icon size={18} /></span>
        )}
        <span style={{ minWidth: 0 }}>
          <div className="sec-title">{title}</div>
          {subtitle && <div className="sec-sub">{subtitle}</div>}
        </span>
        {badge && <span className={`sec-badge ${badgeTone}`}>{badge}</span>}
        <span className="sec-chev" style={badge ? undefined : { marginLeft: 'auto' }} aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
      <div className="sec-body" id={bodyId} role="region" aria-label={typeof title === 'string' ? title : undefined}>
        <div className="sec-body-inner">
          <div className={`sec-pad${flat ? ' sec-flat' : ''}`}>{children}</div>
        </div>
      </div>
    </section>
  );
}
