/* ============================================
   SMOOTH BUILDER 5.0 - SECTION PLACEHOLDER
   ============================================
   No build step. Exposes: window.SB5.components.SectionPlaceholder
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.data = SB5.data || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before SectionPlaceholder.jsx');

  const { useMemo, useCallback } = React;

  function resolveSectionMeta(type) {
    const sections = SB5.data.sections || SB5.data.sectionDefinitions || null;
    if (!sections) return null;

    // Support both: { hero: {...} } and { sections: { hero: {...} } }
    const dict = sections.sections ? sections.sections : sections;
    const meta = dict && dict[type] ? dict[type] : null;
    return meta;
  }

  function SectionPlaceholder({
    section,
    spacing = { pt: 64, pb: 64 },
    isActive = false,
    onSelect,
    onRemove
  }) {
    const type = section && section.type ? String(section.type) : 'section';
    const id = section && section.id ? String(section.id) : '';
    const variant = section && section.variant ? String(section.variant) : 'default';

    const meta = useMemo(() => resolveSectionMeta(type), [type]);

    const name = meta && meta.name ? meta.name : type;
    const icon = meta && meta.icon ? meta.icon : '⬚';

    const handleSelect = useCallback(() => {
      if (typeof onSelect === 'function') onSelect(id);
    }, [onSelect, id]);

    const handleRemove = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof onRemove === 'function') onRemove(id);
    }, [onRemove, id]);

    const pt = Number.isFinite(Number(spacing.pt)) ? Number(spacing.pt) : 64;
    const pb = Number.isFinite(Number(spacing.pb)) ? Number(spacing.pb) : 64;

    return (
      <div
        className={`placeholder ${isActive ? 'placeholder--active' : ''}`}
        style={{ paddingTop: pt, paddingBottom: pb }}
        onClick={handleSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        }}
        aria-label={`${name} auswählen`}
      >
        <div className="placeholder__inner">
          <span className="placeholder__icon" aria-hidden="true">{icon}</span>
          <span className="placeholder__label">{name}</span>
          <span className="placeholder__variant">{variant}</span>
        </div>

        <button
          type="button"
          className="placeholder__remove"
          onClick={handleRemove}
          aria-label="Section entfernen"
        >
          ×
        </button>
      </div>
    );
  }

  SB5.components.SectionPlaceholder = SectionPlaceholder;
})(window);


