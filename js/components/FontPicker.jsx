/* ============================================
   SMOOTH BUILDER 5.0 - FONT PICKER
   ============================================
   No build step. Exposes: window.SB5.components.FontPicker
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.data = SB5.data || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before FontPicker.jsx');

  const { useMemo } = React;

  function resolveFonts() {
    const f = SB5.data.fonts;
    if (Array.isArray(f) && f.length) return f;
    // Safe defaults (no remote font download required)
    return [
      { id: 'inter', label: 'Inter', stack: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"' },
      { id: 'system', label: 'System', stack: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"' },
      { id: 'serif', label: 'Serif', stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
      { id: 'mono', label: 'Mono', stack: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }
    ];
  }

  function FontPicker({ value, onChange, label = 'Font' }) {
    const fonts = useMemo(() => resolveFonts(), []);
    const current = value || 'inter';

    return (
      <div className="font-picker" aria-label="Font Auswahl">
        <div className="font-picker__label">{label}</div>
        <div className="font-picker__grid" role="radiogroup" aria-label={label}>
          {fonts.map(f => {
            const active = current === f.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`font-option ${active ? 'active' : ''}`}
                onClick={() => typeof onChange === 'function' && onChange(f.id)}
                role="radio"
                aria-checked={active}
                style={{ fontFamily: f.stack || undefined }}
              >
                <div className="font-option__name">{f.label || f.id}</div>
                <div className="font-option__sample">Aa Bb Cc</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  SB5.components.FontPicker = FontPicker;
})(window);


