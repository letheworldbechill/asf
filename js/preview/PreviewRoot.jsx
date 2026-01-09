/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW ROOT
   ============================================
   No build step. Exposes: window.SB5.preview.PreviewRoot
   Renders the live site preview from builder state.
   Supports section click-selection + element path activation.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};
  SB5.core = SB5.core || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before PreviewRoot.jsx');

  const { useMemo, useCallback, useEffect } = React;

  // Components (registered in this folder)
  const Header = () => SB5.preview.Header;
  const Hero = () => SB5.preview.Hero;
  const TrustBar = () => SB5.preview.TrustBar;
  const Services = () => SB5.preview.Services;
  const Benefits = () => SB5.preview.Benefits;
  const Team = () => SB5.preview.Team;
  const Testimonials = () => SB5.preview.Testimonials;
  const FAQ = () => SB5.preview.FAQ;
  const CTA = () => SB5.preview.CTA;
  const Footer = () => SB5.preview.Footer;
  const CookieBanner = () => SB5.preview.CookieBanner;

  function safeObj(x) { return x && typeof x === 'object' ? x : {}; }

  function getSpacing(layout, id) {
    const s = (layout && layout.spacing && layout.spacing[id]) ? layout.spacing[id] : null;
    const pt = s && Number.isFinite(Number(s.pt)) ? Number(s.pt) : 64;
    const pb = s && Number.isFinite(Number(s.pb)) ? Number(s.pb) : 64;
    return { pt, pb };
  }

  function applyBrandTokens(brand) {
    const colors = safeObj(brand && brand.colors);
    const font = (brand && brand.font) ? brand.font : 'inter';
    const radius = (brand && brand.radius) ? brand.radius : 'rounded';

    const fontMap = (global.SB5 && global.SB5.data && global.SB5.data.fontsById) ? global.SB5.data.fontsById : null;
    const fontStack = fontMap && fontMap[font] ? fontMap[font].stack : null;

    const root = document.documentElement;

    // Tokens used by preview.css (keep stable)
    root.style.setProperty('--sb-primary', colors.primary || '#0f766e');
    root.style.setProperty('--sb-accent', colors.accent || '#f59e0b');
    root.style.setProperty('--sb-bg', colors.background || '#ffffff');
    root.style.setProperty('--sb-surface', colors.surface || '#f8fafc');
    root.style.setProperty('--sb-text', colors.text || '#0f172a');
    root.style.setProperty('--sb-text-muted', colors.textLight || '#64748b');
    root.style.setProperty('--sb-border', colors.border || 'rgba(0,0,0,0.08)');

    // Radius presets
    const radiusPx = radius === 'pill' ? '999px' : radius === 'sharp' ? '6px' : '14px';
    root.style.setProperty('--sb-radius', radiusPx);

    if (fontStack) root.style.setProperty('--sb-font', fontStack);
    else {
      const fallback = font === 'serif'
        ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
        : font === 'mono'
          ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          : 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';
      root.style.setProperty('--sb-font', fallback);
    }
  }

  function PreviewRoot({
    state,
    dispatch,
    viewport = 'desktop',
    onSelectSection,
    onActivateElementPath,
    readOnly = false
  }) {
    const layout = safeObj(state && state.layout);
    const brand = safeObj(state && state.brand);
    const content = safeObj(state && state.content);
    const ui = safeObj(state && state.ui);
    const settings = safeObj(state && state.settings);

    useEffect(() => {
      applyBrandTokens(brand);
    }, [brand]);

    const byId = useMemo(() => {
      const m = new Map();
      const sections = Array.isArray(layout.sections) ? layout.sections : [];
      for (const s of sections) m.set(s.id, s);
      return m;
    }, [layout.sections]);

    const ordered = useMemo(() => {
      const ids = Array.isArray(layout.order) ? layout.order : [];
      const out = [];
      for (const id of ids) {
        const s = byId.get(id);
        if (s && s.enabled !== false) out.push(s);
      }
      return out;
    }, [layout.order, byId]);

    const selectSection = useCallback((id) => {
      if (typeof onSelectSection === 'function') onSelectSection(id);
    }, [onSelectSection]);

    const activatePath = useCallback((payload) => {
      if (readOnly) return;
      if (typeof onActivateElementPath === 'function') onActivateElementPath(payload);
    }, [onActivateElementPath, readOnly]);

    const renderSection = (s) => {
      const type = s.type;
      const variant = s.variant || 'default';
      const sectionContent = safeObj(content[s.id]);
      const spacing = getSpacing(layout, s.id);
      const common = {
        id: s.id,
        type,
        variant,
        spacing,
        brand,
        content: sectionContent,
        settings,
        isActive: ui.activeSection === s.id,
        onSelect: selectSection,
        onActivate: activatePath,
        readOnly
      };

      // Map type to component
      if (type === 'header') {
        const C = Header();
        return C ? <C {...common} /> : null;
      }
      if (type === 'hero') {
        const C = Hero();
        return C ? <C {...common} /> : null;
      }
      if (type === 'trustbar') {
        const C = TrustBar();
        return C ? <C {...common} /> : null;
      }
      if (type === 'services') {
        const C = Services();
        return C ? <C {...common} /> : null;
      }
      if (type === 'benefits') {
        const C = Benefits();
        return C ? <C {...common} /> : null;
      }
      if (type === 'team') {
        const C = Team();
        return C ? <C {...common} /> : null;
      }
      if (type === 'testimonials') {
        const C = Testimonials();
        return C ? <C {...common} /> : null;
      }
      if (type === 'faq') {
        const C = FAQ();
        return C ? <C {...common} /> : null;
      }
      if (type === 'cta') {
        const C = CTA();
        return C ? <C {...common} /> : null;
      }
      if (type === 'footer') {
        const C = Footer();
        return C ? <C {...common} /> : null;
      }
      if (type === 'custom') {
        // Basic custom renderer for Design Mode: renders elements vertically.
        return (
          <section
            className={`sb-section sb-custom ${ui.activeSection === s.id ? 'is-active' : ''}`}
            style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
            onClick={() => selectSection(s.id)}
            role="region"
            aria-label="Custom Section"
          >
            <div className="sb-container">
              <div className="sb-custom__stack">
                {Array.isArray(sectionContent.elements) && sectionContent.elements.length ? sectionContent.elements.map((el) => {
                  const key = el.id || Math.random().toString(16).slice(2);
                  const t = el.type;
                  const c = safeObj(el.content);
                  if (t === 'headline') return <h2 key={key} className="sb-h2" onClick={(e)=>{e.stopPropagation(); activatePath({ sectionId: s.id, key: `elements.${key}.headline` });}}>{c.text || 'Headline'}</h2>;
                  if (t === 'text') return <p key={key} className="sb-p" onClick={(e)=>{e.stopPropagation(); activatePath({ sectionId: s.id, key: `elements.${key}.text` });}}>{c.text || 'Text…'}</p>;
                  if (t === 'button') return <a key={key} className="sb-btn sb-btn--primary" href={c.href || '#'} onClick={(e)=>{e.stopPropagation(); activatePath({ sectionId: s.id, key: `elements.${key}.button` });}}>{c.label || 'Button'}</a>;
                  if (t === 'image') return c.src ? <img key={key} className="sb-img" src={c.src} alt={c.alt || ''} /> : <div key={key} className="sb-img sb-img--empty">Bild</div>;
                  if (t === 'spacer') return <div key={key} style={{ height: Number(c.height) || 24 }} aria-hidden="true" />;
                  if (t === 'divider') return <hr key={key} className="sb-hr" />;
                  if (t === 'columns') return (
                    <div key={key} className="sb-columns">
                      <div className="sb-columns__col"><p className="sb-p">{(c.left && c.left.text) || ''}</p></div>
                      <div className="sb-columns__col"><p className="sb-p">{(c.right && c.right.text) || ''}</p></div>
                    </div>
                  );
                  return null;
                }) : (
                  <div className="sb-empty">Custom Section – füge Elemente im Sidebar Editor hinzu.</div>
                )}
              </div>
            </div>
          </section>
        );
      }

      // Unknown type: render nothing (safe)
      return null;
    };

    const showCookie = !!(settings && settings.consent && settings.consent.enabled);

    return (
      <div className={`sb-preview sb-preview--${viewport}`}>
        <div className="sb-site" style={{ fontFamily: 'var(--sb-font)' }}>
          {ordered.map(s => (
            <div key={s.id} className="sb-sectionWrap">
              {renderSection(s)}
            </div>
          ))}
        </div>

        {showCookie && CookieBanner() && (
          <CookieBanner
            settings={settings}
            brand={brand}
            readOnly={readOnly}
          />
        )}
      </div>
    );
  }

  SB5.preview.PreviewRoot = PreviewRoot;
})(window);




