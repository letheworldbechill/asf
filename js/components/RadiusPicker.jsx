/* ============================================
   SMOOTH BUILDER 5.0 - RADIUS PICKER
   ============================================
   No build step. Exposes: window.SB5.components.RadiusPicker
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before RadiusPicker.jsx');

  function RadiusPicker({ value, onChange, label = 'Radius' }) {
    const current = value || 'rounded';
    const options = [
      { id: 'sharp', label: 'Sharp', radius: 4 },
      { id: 'rounded', label: 'Rounded', radius: 12 },
      { id: 'pill', label: 'Pill', radius: 999 }
    ];

    return (
      <div className="radius-picker" aria-label="Radius Auswahl">
        <div className="radius-picker__label">{label}</div>
        <div className="radius-picker__grid" role="radiogroup" aria-label={label}>
          {options.map(o => {
            const active = current === o.id;
            return (
              <button
                key={o.id}
                type="button"
                className={`radius-option ${active ? 'active' : ''}`}
                onClick={() => typeof onChange === 'function' && onChange(o.id)}
                role="radio"
                aria-checked={active}
              >
                <div className="radius-option__chip" style={{ borderRadius: o.radius }} />
                <div className="radius-option__name">{o.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  SB5.components.RadiusPicker = RadiusPicker;
})(window);



