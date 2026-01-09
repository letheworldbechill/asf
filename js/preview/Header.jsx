/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: HEADER
   Variants: left | centered | minimal
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/Header.jsx');

  const { useMemo, useState, useCallback } = React;

  function safeObj(x) { return x && typeof x === 'object' ? x : {}; }

  function normalizeNav(items) {
    if (!Array.isArray(items)) return [];
    return items
      .filter(Boolean)
      .map((it) => ({ label: String(it.label || 'Link'), href: String(it.href || '#') }))
      .slice(0, 8);
  }

  function Header({
    id,
    variant,
    spacing,
    content,
    settings,
    isActive,
    onSelect,
    onActivate,
    readOnly
  }) {
    const c = safeObj(content);
    const s = safeObj(settings);
    const features = safeObj(s.features);
    const sticky = !!features.stickyHeader;

    const companyName = c.companyName || s.siteName || 'Meine Website';
    const tagline = c.tagline || '';

    const nav = useMemo(() => normalizeNav(c.nav || [
      { label: 'Leistungen', href: '#services' },
      { label: 'Team', href: '#team' },
      { label: 'FAQ', href: '#faq' }
    ]), [c.nav]);

    const ctaText = c.ctaText || 'Kontakt';
    const ctaHref = c.ctaHref || '#cta';

    const [open, setOpen] = useState(false);

    const v = variant || 'left';
    const cls = [
      'sb-section',
      'sb-header',
      `sb-header--${v}`,
      sticky ? 'is-sticky' : '',
      isActive ? 'is-active' : ''
    ].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    return (
      <header
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        role="banner"
      >
        <div className="sb-container sb-header__inner">
          <a
            className="sb-header__brand"
            href="#"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); activate('companyName'); }}
            aria-label="Start"
          >
            <span className="sb-header__logoMark" aria-hidden="true">●</span>
            <span className="sb-header__brandText">
              <span className="sb-header__company">{companyName}</span>
              {tagline ? <span className="sb-header__tagline">{tagline}</span> : null}
            </span>
          </a>

          {v !== 'minimal' && (
            <nav className="sb-header__nav" aria-label="Navigation">
              {nav.map((it, idx) => (
                <a
                  key={idx}
                  className="sb-header__link"
                  href={it.href}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  {it.label}
                </a>
              ))}
            </nav>
          )}

          <div className="sb-header__actions">
            <a
              className="sb-btn sb-btn--primary sb-header__cta"
              href={ctaHref}
              onClick={(e) => { e.stopPropagation(); activate('ctaText'); }}
            >
              {ctaText}
            </a>

            <button
              type="button"
              className="sb-header__burger"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={open}
              onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
            >
              <span className="sb-header__burgerLines" aria-hidden="true" />
            </button>
          </div>
        </div>

        {open && (
          <div className="sb-header__mobile" onClick={(e) => e.stopPropagation()}>
            <div className="sb-container sb-header__mobileInner">
              {nav.map((it, idx) => (
                <a key={idx} className="sb-header__mobileLink" href={it.href} onClick={() => setOpen(false)}>
                  {it.label}
                </a>
              ))}
              <a className="sb-btn sb-btn--primary sb-header__mobileCta" href={ctaHref} onClick={() => setOpen(false)}>
                {ctaText}
              </a>
            </div>
          </div>
        )}
      </header>
    );
  }

  SB5.preview.Header = Header;
})(window);



