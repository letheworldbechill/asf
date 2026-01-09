/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: FAQ
   Variants: accordion | two-column
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/FAQ.jsx');

  const { useMemo, useState, useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function normalize(items){
    if (!Array.isArray(items) || !items.length) {
      return [
        { q: 'Wie exportiere ich?', a: 'Im Export-Modus kannst du Preview HTML, ZIP oder JSON downloaden.' },
        { q: 'Bleibt alles offline?', a: 'Ja. PWA + Service Worker funktionieren ohne Backend.' },
        { q: 'Kann ich Sections reorder?', a: 'Ja – per Drag & Drop in Struktur.' }
      ];
    }
    return items.slice(0, 12).map(it => ({ q: String(it.q || ''), a: String(it.a || '') }));
  }

  function FAQ({ id, variant, spacing, content, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const v = variant || 'accordion';
    const headline = c.headline || 'FAQ';
    const items = useMemo(() => normalize(c.items), [c.items]);

    const [open, setOpen] = useState(0);

    const cls = ['sb-section','sb-faq','sb-faq--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    const Item = ({ it, idx }) => (
      <div className="sb-faq__item">
        <button
          type="button"
          className="sb-faq__q"
          aria-expanded={open === idx}
          onClick={(e)=>{e.stopPropagation(); setOpen(open===idx? -1 : idx);}}
        >
          {it.q}
          <span className="sb-faq__chev" aria-hidden="true">{open === idx ? '–' : '+'}</span>
        </button>
        {v === 'accordion' ? (
          <div className={`sb-faq__a ${open === idx ? 'is-open' : ''}`}>
            <p className="sb-p">{it.a}</p>
          </div>
        ) : (
          <p className="sb-p sb-faq__aStatic">{it.a}</p>
        )}
      </div>
    );

    const half = Math.ceil(items.length / 2);
    const left = items.slice(0, half);
    const right = items.slice(half);

    return (
      <section
        id="faq"
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="FAQ"
      >
        <div className="sb-container">
          <div className="sb-sectionHead">
            <h2 className="sb-h2" onClick={(e)=>{e.stopPropagation(); activate('headline');}}>{headline}</h2>
          </div>

          {v === 'two-column' ? (
            <div className="sb-faq__cols">
              <div className="sb-faq__col">{left.map((it, idx) => <Item key={idx} it={it} idx={idx} />)}</div>
              <div className="sb-faq__col">{right.map((it, idx) => <Item key={idx+half} it={it} idx={idx+half} />)}</div>
            </div>
          ) : (
            <div className="sb-faq__list">
              {items.map((it, idx) => <Item key={idx} it={it} idx={idx} />)}
            </div>
          )}
        </div>
      </section>
    );
  }

  SB5.preview.FAQ = FAQ;
})(window);





