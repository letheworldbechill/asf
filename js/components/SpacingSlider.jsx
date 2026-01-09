/* ============================================
   SMOOTH BUILDER 5.0 - SPACING SLIDER
   ============================================
   No build step. Exposes: window.SB5.components.SpacingSlider
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before SpacingSlider.jsx');

  const { useMemo } = React;

  function SpacingSlider({
    label,
    value,
    onChange,
    min = 0,
    max = 160,
    step = 8,
    presets // optional: [{ label:'S', value:32 }, ...]
  }) {
    const v = Number.isFinite(Number(value)) ? Number(value) : 0;

    const presetList = useMemo(() => {
      if (Array.isArray(presets) && presets.length) return presets;
      return [
        { label: 'S', value: 32 },
        { label: 'M', value: 64 },
        { label: 'L', value: 96 },
        { label: 'XL', value: 128 }
      ];
    }, [presets]);

    return (
      <div className="spacing-slider">
        <div className="spacing-slider__header">
          <label className="spacing-slider__label">{label}</label>
          <span className="spacing-slider__value" aria-label={`${v} Pixel`}>{v}px</span>
        </div>

        <input
          className="spacing-slider__range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          onChange={(e) => typeof onChange === 'function' && onChange(Number(e.target.value))}
          aria-label={label}
        />

        <div className="spacing-slider__presets" aria-label="Presets">
          {presetList.map(p => (
            <button
              key={p.label}
              type="button"
              className={`spacing-slider__preset ${v === p.value ? 'is-active' : ''}`}
              onClick={() => typeof onChange === 'function' && onChange(p.value)}
              aria-pressed={v === p.value}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  SB5.components.SpacingSlider = SpacingSlider;
})(window);


