/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: TESTIMONIALS
   Variants: grid | slider | single
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/Testimonials.jsx');

  const { useMemo, useState, useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function normalize(items){
    if (!Array.isArray(items) || !items.length) {
      return [
        { quote: 'Extrem sauberer Builder – Export funktioniert sofort.', name: 'Kundin A', role: 'CEO' },
        { quote: 'Struktur → Design → Export fühlt sich richtig an.', name: 'Kunde B', role: 'Marketing' },
        { quote: 'Offline-fähig und schnell. Genau was wir wollten.', name: 'Kunde C', role: 'Founder' }
      ];
    }
    return items.slice(0, 10).map(it => ({
      quote: String(it.quote || ''),
      name: String(it.name || ''),
      role: String(it.role || '')
    }));
  }

  function Testimonials({ id, variant, spacing, content, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const v = variant || 'grid';
    const headline = c.headline || 'Testimonials';
    const items = useMemo(() => normalize(c.items), [c.items]);

    const [index, setIndex] = useState(0);

    const cls = ['sb-section','sb-testimonials','sb-testimonials--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    const Card = ({ t }) => (
      <div className="sb-card sb-testimonials__card">
        <div className="sb-testimonials__quote">“{t.quote}”</div>
        <div className="sb-testimonials__by">
          <span className="sb-testimonials__name">{t.name}</span>
          {t.role ? <span className="sb-testimonials__role sb-muted"> · {t.role}</span> : null}
        </div>
      </div>
    );

    return (
      <section
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="Testimonials"
      >
        <div className="sb-container">
          <div className="sb-sectionHead">
            <h2 className="sb-h2" onClick={(e)=>{e.stopPropagation(); activate('headline');}}>{headline}</h2>
          </div>

          {v === 'single' ? (
            <Card t={items[0]} />
          ) : v === 'slider' ? (
            <div className="sb-testimonials__slider" onClick={(e)=>e.stopPropagation()}>
              <Card t={items[index % items.length]} />
              <div className="sb-testimonials__sliderActions">
                <button type="button" className="btn btn--sm" onClick={() => setIndex((i)=> (i-1+items.length)%items.length)} aria-label="Vorheriges">←</button>
                <button type="button" className="btn btn--sm" onClick={() => setIndex((i)=> (i+1)%items.length)} aria-label="Nächstes">→</button>
              </div>
            </div>
          ) : (
            <div className="sb-testimonials__grid" role="list">
              {items.map((t, idx) => <div key={idx} role="listitem"><Card t={t} /></div>)}
            </div>
          )}
        </div>
      </section>
    );
  }

  SB5.preview.Testimonials = Testimonials;
})(window);


