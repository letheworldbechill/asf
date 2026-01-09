/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: BENEFITS
   Variants: grid-2 | grid-3 | list
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/Benefits.jsx');

  const { useMemo, useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function normalize(items){
    if (!Array.isArray(items) || !items.length) {
      return [
        { title: 'Schnell', text: 'Keine Build-Tools nötig.', icon: '⚡' },
        { title: 'Sauber', text: 'Modulare Architektur.', icon: '✓' },
        { title: 'Offline', text: 'PWA-ready Export.', icon: '⬣' }
      ];
    }
    return items.slice(0, 12).map(it => ({
      title: String(it.title || 'Benefit'),
      text: String(it.text || ''),
      icon: String(it.icon || '★')
    }));
  }

  function cols(v){
    if (v === 'grid-2') return 2;
    if (v === 'grid-3') return 3;
    return 1;
  }

  function Benefits({ id, variant, spacing, content, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const v = variant || 'grid-3';
    const headline = c.headline || 'Vorteile';
    const items = useMemo(() => normalize(c.benefits), [c.benefits]);

    const cls = ['sb-section','sb-benefits','sb-benefits--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    return (
      <section
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="Benefits"
      >
        <div className="sb-container">
          <div className="sb-sectionHead">
            <h2 className="sb-h2" onClick={(e)=>{e.stopPropagation(); activate('headline');}}>{headline}</h2>
          </div>

          {v === 'list' ? (
            <div className="sb-benefits__list" role="list">
              {items.map((it, idx) => (
                <div key={idx} className="sb-benefits__listItem" role="listitem">
                  <div className="sb-benefits__icon" aria-hidden="true">{it.icon}</div>
                  <div>
                    <div className="sb-benefits__title">{it.title}</div>
                    <div className="sb-benefits__text">{it.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sb-benefits__grid" style={{ ['--sb-cols']: cols(v) }} role="list">
              {items.map((it, idx) => (
                <div key={idx} className="sb-card sb-benefits__card" role="listitem">
                  <div className="sb-card__icon" aria-hidden="true">{it.icon}</div>
                  <div className="sb-card__title">{it.title}</div>
                  <div className="sb-card__text">{it.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  SB5.preview.Benefits = Benefits;
})(window);

