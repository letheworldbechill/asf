/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: TRUSTBAR
   Variants: logos | logos-text | stats | badges
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/TrustBar.jsx');

  const { useMemo, useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function normalizeItems(items){
    if (!Array.isArray(items) || !items.length) {
      return [
        { label: 'Partner A', value: '120+', logo: null },
        { label: 'Partner B', value: '4.9/5', logo: null },
        { label: 'Partner C', value: '10 Jahre', logo: null }
      ];
    }
    return items.slice(0, 8).map(it => ({
      label: String(it.label || 'Partner'),
      value: String(it.value || ''),
      logo: it.logo || null
    }));
  }

  function TrustBar({ id, variant, spacing, content, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const v = variant || 'logos';
    const title = c.title || 'Vertraut von';
    const items = useMemo(() => normalizeItems(c.items), [c.items]);

    const cls = ['sb-section','sb-trust','sb-trust--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    return (
      <section
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="TrustBar"
      >
        <div className="sb-container">
          {(v !== 'logos') && (
            <div className="sb-trust__title" onClick={(e)=>{e.stopPropagation(); activate('title');}}>
              {title}
            </div>
          )}

          <div className="sb-trust__items" role="list">
            {items.map((it, idx) => (
              <div key={idx} className="sb-trust__item" role="listitem">
                {v === 'stats' ? (
                  <>
                    <div className="sb-trust__stat">{it.value || '—'}</div>
                    <div className="sb-trust__label">{it.label}</div>
                  </>
                ) : v === 'badges' ? (
                  <div className="sb-trust__badge">{it.label}</div>
                ) : (
                  <>
                    <div className="sb-trust__logo" aria-hidden="true">
                      {it.logo ? <img src={it.logo} alt="" /> : <span className="sb-trust__logoText">{it.label}</span>}
                    </div>
                    {v === 'logos-text' && (
                      <div className="sb-trust__label">{it.value || 'Empfohlen'}</div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  SB5.preview.TrustBar = TrustBar;
})(window);


