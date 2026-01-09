/* ============================================
   SMOOTH BUILDER 5.0 - VARIANT PICKER
   ============================================
   No build step. Exposes: window.SB5.components.VariantPicker
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.data = SB5.data || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before VariantPicker.jsx');

  const { useMemo } = React;

  function resolveVariants(sectionType) {
    const sections = SB5.data.sections || SB5.data.sectionDefinitions || null;
    if (!sections) return [];
    const dict = sections.sections ? sections.sections : sections;
    const meta = dict && dict[sectionType] ? dict[sectionType] : null;
    const variants = meta && Array.isArray(meta.variants) ? meta.variants : [];
    return variants;
  }

  function VariantPicker({
    sectionType,
    currentVariant,
    onChange,
    label = 'Layout-Variante',
    variants // optional override
  }) {
    const type = String(sectionType || '');
    const list = useMemo(() => {
      if (Array.isArray(variants)) return variants;
      return resolveVariants(type);
    }, [variants, type]);

    if (!type) return null;
    if (!list.length) {
      return (
        <div className="variant-picker">
          <label className="variant-picker__label">{label}</label>
          <div className="variant-picker__empty">Keine Varianten verfügbar</div>
        </div>
      );
    }

    return (
      <div className="variant-picker">
        <label className="variant-picker__label">{label}</label>
        <div className="variant-picker__grid" role="listbox" aria-label={label}>
          {list.map(v => {
            const id = String(v.id);
            const active = currentVariant === id;
            return (
              <button
                key={id}
                type="button"
                className={`variant-option ${active ? 'active' : ''}`}
                onClick={() => typeof onChange === 'function' && onChange(id)}
                title={v.description ? String(v.description) : ''}
                role="option"
                aria-selected={active}
              >
                <span className="variant-option__label">{v.label ? String(v.label) : id}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  SB5.components.VariantPicker = VariantPicker;
})(window);



