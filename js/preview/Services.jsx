/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: SERVICES
   Variants: grid-2 | grid-3 | grid-4 | list
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/Services.jsx');

  const { useMemo, useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function normalize(items){
    if (!Array.isArray(items) || !items.length) {
      return [
        { title: 'Webdesign', text: 'Modern, schnell, conversion-stark.', icon: '✓' },
        { title: 'SEO', text: 'Saubere Struktur für gute Rankings.', icon: '⌁' },
        { title: 'Content', text: 'Texte, die verkaufen.', icon: '✎' },
        { title: 'Performance', text: 'Lighthouse-ready.', icon: '⚡' }
      ];
    }
    return items.slice(0, 12).map(it => ({
      title: String(it.title || 'Service'),
      text: String(it.text || ''),
      icon: String(it.icon || '•')
    }));
  }

  function colsFromVariant(v){
    if (v === 'grid-2') return 2;
    if (v === 'grid-4') return 4;
    return 3;
  }

  function Services({ id, variant, spacing, content, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const v = variant || 'grid-3';
    const headline = c.headline || 'Unsere Leistungen';
    const subline = c.subline || 'Alles, was du für einen sauberen Launch brauchst.';
    const items = useMemo(() => normalize(c.services), [c.services]);

    const cls = ['sb-section','sb-services','sb-services--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    return (
      <section
        id="services"
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="Services"
      >
        <div className="sb-container">
          <div className="sb-sectionHead">
            <h2 className="sb-h2" onClick={(e)=>{e.stopPropagation(); activate('headline');}}>{headline}</h2>
            <p className="sb-p sb-muted" onClick={(e)=>{e.stopPropagation(); activate('subline');}}>{subline}</p>
          </div>

          {v === 'list' ? (
            <div className="sb-services__list" role="list">
              {items.map((it, idx) => (
                <div key={idx} className="sb-services__listItem" role="listitem">
                  <div className="sb-services__icon" aria-hidden="true">{it.icon}</div>
                  <div className="sb-services__body">
                    <div className="sb-services__title">{it.title}</div>
                    <div className="sb-services__text">{it.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="sb-services__grid"
              style={{ ['--sb-cols']: colsFromVariant(v) }}
              role="list"
            >
              {items.slice(0, colsFromVariant(v) * 3).map((it, idx) => (
                <div key={idx} className="sb-card sb-services__card" role="listitem">
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

  SB5.preview.Services = Services;
})(window);



