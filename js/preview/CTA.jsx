/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: CTA
   Variants: centered | split | banner
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/CTA.jsx');

  const { useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function CTA({ id, variant, spacing, content, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const v = variant || 'centered';
    const headline = c.headline || 'Bereit für den Launch?';
    const subline = c.subline || 'In wenigen Minuten zur exportierbaren Website.';
    const buttonText = c.buttonText || 'Jetzt starten';
    const buttonHref = c.buttonHref || '#';

    const cls = ['sb-section','sb-cta','sb-cta--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    const Body = () => (
      <>
        <div className="sb-cta__copy">
          <h2 className="sb-h2" onClick={(e)=>{e.stopPropagation(); activate('headline');}}>{headline}</h2>
          <p className="sb-p sb-muted" onClick={(e)=>{e.stopPropagation(); activate('subline');}}>{subline}</p>
        </div>
        <div className="sb-cta__actions">
          <a className="sb-btn sb-btn--primary" href={buttonHref} onClick={(e)=>{e.stopPropagation(); activate('buttonText');}}>
            {buttonText}
          </a>
          <a className="sb-btn sb-btn--ghost" href="#faq" onClick={(e)=>e.stopPropagation()}>
            Fragen?
          </a>
        </div>
      </>
    );

    return (
      <section
        id="cta"
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="CTA"
      >
        <div className={v === 'banner' ? 'sb-cta__banner' : 'sb-container'}>
          {v === 'split' ? (
            <div className="sb-cta__split">
              <Body />
            </div>
          ) : (
            <div className="sb-cta__center">
              <Body />
            </div>
          )}
        </div>
      </section>
    );
  }

  SB5.preview.CTA = CTA;
})(window);



