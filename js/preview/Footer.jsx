/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: FOOTER
   Variants: simple | columns | minimal
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/Footer.jsx');

  const { useMemo, useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function normalizeLinks(items){
    if (!Array.isArray(items) || !items.length) return [
      { label: 'Datenschutz', href: '#privacy' },
      { label: 'Impressum', href: '#impressum' }
    ];
    return items.slice(0, 10).map(it => ({ label: String(it.label||'Link'), href: String(it.href||'#') }));
  }

  function Footer({ id, variant, spacing, content, settings, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const s = safeObj(settings);
    const v = variant || 'simple';

    const companyName = c.companyName || s.siteName || 'Meine Website';
    const address = c.address || 'Musterstrasse 1\n8000 Zürich';
    const email = c.email || 'hello@example.com';
    const phone = c.phone || '+41 44 000 00 00';
    const links = useMemo(() => normalizeLinks(c.links), [c.links]);

    const year = new Date().getFullYear();

    const cls = ['sb-section','sb-footer','sb-footer--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    return (
      <footer
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="Footer"
      >
        <div className="sb-container">
          {v === 'minimal' ? (
            <div className="sb-footer__minimal">
              <div className="sb-footer__copy">© {year} {companyName}</div>
              <div className="sb-footer__links">
                {links.map((l, idx) => <a key={idx} href={l.href} onClick={(e)=>e.stopPropagation()}>{l.label}</a>)}
              </div>
            </div>
          ) : v === 'columns' ? (
            <div className="sb-footer__cols">
              <div className="sb-footer__col">
                <div className="sb-footer__brand" onClick={(e)=>{e.stopPropagation(); activate('companyName');}}>
                  {companyName}
                </div>
                <pre className="sb-footer__address" onClick={(e)=>{e.stopPropagation(); activate('address');}}>
{address}
                </pre>
              </div>
              <div className="sb-footer__col">
                <div className="sb-footer__title">Kontakt</div>
                <a href={`mailto:${email}`} onClick={(e)=>e.stopPropagation()}>{email}</a>
                <a href={`tel:${phone}`} onClick={(e)=>e.stopPropagation()}>{phone}</a>
              </div>
              <div className="sb-footer__col">
                <div className="sb-footer__title">Links</div>
                {links.map((l, idx) => <a key={idx} href={l.href} onClick={(e)=>e.stopPropagation()}>{l.label}</a>)}
              </div>
            </div>
          ) : (
            <div className="sb-footer__simple">
              <div>
                <div className="sb-footer__brand" onClick={(e)=>{e.stopPropagation(); activate('companyName');}}>
                  {companyName}
                </div>
                <div className="sb-footer__meta sb-muted">
                  {email} · {phone}
                </div>
              </div>
              <div className="sb-footer__links">
                {links.map((l, idx) => <a key={idx} href={l.href} onClick={(e)=>e.stopPropagation()}>{l.label}</a>)}
              </div>
              <div className="sb-footer__copy">© {year}</div>
            </div>
          )}
        </div>
      </footer>
    );
  }

  SB5.preview.Footer = Footer;
})(window);



