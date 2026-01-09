/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: HERO
   Variants: centered | split | split-reverse | fullscreen | minimal
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/Hero.jsx');

  const { useCallback } = React;

  function safeObj(x) { return x && typeof x === 'object' ? x : {}; }

  function Hero({
    id,
    variant,
    spacing,
    content,
    isActive,
    onSelect,
    onActivate,
    readOnly
  }) {
    const c = safeObj(content);
    const headline = c.headline || 'Wir bauen Websites, die verkaufen.';
    const subline = c.subline || 'Canvas-first Builder. Saubere Struktur. Schneller Export.';
    const ctaText = c.ctaText || 'Angebot anfordern';
    const ctaHref = c.ctaHref || '#cta';
    const image = c.image || null;

    const v = variant || 'centered';

    const cls = [
      'sb-section',
      'sb-hero',
      `sb-hero--${v}`,
      isActive ? 'is-active' : ''
    ].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    const Inner = () => (
      <div className="sb-container sb-hero__inner">
        <div className="sb-hero__copy">
          <h1 className="sb-hero__title" onClick={(e)=>{e.stopPropagation(); activate('headline');}}>
            {headline}
          </h1>
          {v !== 'minimal' && (
            <p className="sb-hero__text" onClick={(e)=>{e.stopPropagation(); activate('subline');}}>
              {subline}
            </p>
          )}
          <div className="sb-hero__actions">
            <a className="sb-btn sb-btn--primary" href={ctaHref} onClick={(e)=>{e.stopPropagation(); activate('ctaText');}}>
              {ctaText}
            </a>
            <a className="sb-btn sb-btn--ghost" href="#services" onClick={(e)=>e.stopPropagation()}>
              Mehr erfahren
            </a>
          </div>
        </div>

        {(v === 'split' || v === 'split-reverse') && (
          <div className="sb-hero__media" onClick={(e)=>{e.stopPropagation(); activate('image');}}>
            {image ? (
              <img className="sb-hero__img" src={image} alt="" />
            ) : (
              <div className="sb-hero__img sb-hero__img--empty" aria-hidden="true">Bild</div>
            )}
          </div>
        )}
      </div>
    );

    if (v === 'fullscreen') {
      return (
        <section
          className={cls}
          style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
          onClick={() => typeof onSelect === 'function' && onSelect(id)}
          aria-label="Hero"
        >
          <div className="sb-hero__bg" aria-hidden="true" />
          <div className="sb-hero__overlay">
            <Inner />
          </div>
        </section>
      );
    }

    return (
      <section
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="Hero"
      >
        <Inner />
      </section>
    );
  }

  SB5.preview.Hero = Hero;
})(window);


