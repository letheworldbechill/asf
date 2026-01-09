/* ============================================
   SMOOTH BUILDER 5.0 - COLOR PALETTE
   ============================================
   No build step. Exposes: window.SB5.components.ColorPalette
   Editable token list with color input + hex input.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.features = SB5.features || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before ColorPalette.jsx');

  const { useMemo, useCallback } = React;

  const Toast = SB5.components.Toast;

  function normalizeHex(value, fallback) {
    const v = String(value || '').trim();
    if (!v) return fallback;
    let h = v.startsWith('#') ? v : `#${v}`;
    // allow rgba(...) etc
    if (/^rgba?\(/i.test(h)) return value;
    if (/^#([0-9a-f]{3})$/i.test(h)) {
      const m = h.match(/^#([0-9a-f]{3})$/i);
      const s = m[1];
      h = `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
    }
    if (!/^#([0-9a-f]{6})$/i.test(h)) return fallback;
    return h.toLowerCase();
  }

  function asColorInputValue(value) {
    const n = normalizeHex(value, '#000000');
    // if rgba string, fallback to black for color input
    if (/^rgba?\(/i.test(n)) return '#000000';
    return n;
  }

  function ColorPalette({
    colors,
    onChange
  }) {
    const model = colors || {};
    const rows = useMemo(() => ([
      { key: 'primary', label: 'Primary' },
      { key: 'accent', label: 'Accent' },
      { key: 'background', label: 'Background' },
      { key: 'surface', label: 'Surface' },
      { key: 'text', label: 'Text' },
      { key: 'textLight', label: 'Text Muted' },
      { key: 'border', label: 'Border' }
    ]), []);

    const update = useCallback((key, value) => {
      if (typeof onChange !== 'function') return;
      const next = { ...model };

      // keep border allowing rgba()
      if (key === 'border') {
        next.border = String(value || '').trim();
        onChange(next);
        return;
      }

      const fallback = next[key] || '#000000';
      next[key] = normalizeHex(value, fallback);

      // Keep text contrast sane when background is edited manually
      if (key === 'background') {
        const cm = SB5.features.colorMath;
        if (cm && typeof cm.pickTextOn === 'function') {
          next.text = cm.pickTextOn(next.background, 4.5);
          next.textLight = cm.pickTextOn(next.background, 3.0) === '#ffffff'
            ? 'rgba(255,255,255,0.72)'
            : '#64748b';
        }
      }

      onChange(next);
    }, [onChange, model]);

    const copy = useCallback(async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        Toast && Toast.success && Toast.success('Kopiert.');
      } catch (e) {
        // ignore (clipboard API may be blocked in some contexts)
      }
    }, []);

    return (
      <div className="color-palette" aria-label="Farben">
        {rows.map(r => (
          <div key={r.key} className="color-palette__row">
            <div className="color-palette__label">{r.label}</div>

            <div className="color-palette__controls">
              {r.key !== 'border' && (
                <input
                  className="color-palette__picker"
                  type="color"
                  value={asColorInputValue(model[r.key])}
                  onChange={(e) => update(r.key, e.target.value)}
                  aria-label={`${r.label} wählen`}
                />
              )}

              <input
                className="color-palette__input"
                type="text"
                value={model[r.key] || ''}
                onChange={(e) => update(r.key, e.target.value)}
                placeholder={r.key === 'border' ? 'rgba(0,0,0,0.08)' : '#000000'}
                aria-label={`${r.label} Wert`}
                spellCheck={false}
              />

              <button
                type="button"
                className="btn btn--xs"
                onClick={() => copy(String(model[r.key] || ''))}
                aria-label={`${r.label} kopieren`}
                title="Kopieren"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  SB5.components.ColorPalette = ColorPalette;
})(window);


