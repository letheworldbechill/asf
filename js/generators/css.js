/* ============================================
   SMOOTH BUILDER 5.0 - GENERATOR: CSS
   ============================================
   No build step. Exposes:
   - window.SB5.generators.generateTokensCSS(state)
   - window.SB5.generators.generateComponentsCSS(state)
   - window.SB5.generators.generateStylesCSS(state)
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.generators = SB5.generators || {};
  SB5.data = SB5.data || {};

  function safeObj(x) { return x && typeof x === 'object' ? x : {}; }

  function fontStackById(id) {
    const map = SB5.data.fontsById;
    if (map && map[id] && map[id].stack) return map[id].stack;
    if (id === 'serif') return 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
    if (id === 'mono') return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    // inter/system: no remote dependency
    return 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';
  }

  function radiusPx(radius) {
    if (radius === 'pill') return '999px';
    if (radius === 'sharp') return '6px';
    return '14px';
  }

  function generateTokensCSS(state) {
    const st = safeObj(state);
    const brand = safeObj(st.brand);
    const colors = safeObj(brand.colors);

    const fontId = brand.font || 'inter';
    const rad = brand.radius || 'rounded';

    return `:root{
  --sb-primary:${colors.primary || '#0f766e'};
  --sb-accent:${colors.accent || '#f59e0b'};
  --sb-bg:${colors.background || '#ffffff'};
  --sb-surface:${colors.surface || '#f8fafc'};
  --sb-text:${colors.text || '#0f172a'};
  --sb-text-muted:${colors.textLight || '#64748b'};
  --sb-border:${colors.border || 'rgba(0,0,0,0.08)'};
  --sb-radius:${radiusPx(rad)};
  --sb-font:${fontStackById(fontId)};

  --sb-container:1200px;
  --sb-gutter:24px;

  --sb-shadow: 0 10px 30px rgba(2,6,23,0.08);
  --sb-shadow-sm: 0 6px 18px rgba(2,6,23,0.08);

  --sb-btn-h: 44px;
  --sb-btn-pad: 16px;
  --sb-trans: 160ms ease;
}\n`;
  }

  function generateComponentsCSS(_state) {
    // Production CSS for exported site preview components.
    // Keep classnames aligned with js/preview components + html generator.
    return `/* ===== Base ===== */
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family:var(--sb-font);
  color:var(--sb-text);
  background:var(--sb-bg);
  line-height:1.5;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
a{color:inherit;text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;display:block}
pre{margin:0;white-space:pre-wrap}
:focus-visible{outline:3px solid color-mix(in srgb, var(--sb-accent) 70%, white); outline-offset:2px}

.sb-container{
  max-width:var(--sb-container);
  margin:0 auto;
  padding:0 var(--sb-gutter);
}
.sb-site{min-height:100vh}
.sb-section{position:relative}
.sb-section.is-active{outline:2px solid color-mix(in srgb, var(--sb-accent) 55%, transparent); outline-offset:-2px}

.sb-h2{margin:0 0 10px;font-size:clamp(22px, 2.1vw, 32px);letter-spacing:-0.02em}
.sb-p{margin:0}
.sb-muted{color:var(--sb-text-muted)}
.sb-sectionHead{margin-bottom:24px}
.sb-empty{padding:16px;border:1px dashed var(--sb-border);border-radius:var(--sb-radius);color:var(--sb-text-muted);background:color-mix(in srgb, var(--sb-surface) 70%, white)}

/* ===== Buttons ===== */
.sb-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  height:var(--sb-btn-h);
  padding:0 var(--sb-btn-pad);
  border-radius:var(--sb-radius);
  border:1px solid transparent;
  font-weight:600;
  letter-spacing:-0.01em;
  transition:transform var(--sb-trans), background var(--sb-trans), border-color var(--sb-trans), box-shadow var(--sb-trans);
  cursor:pointer;
  user-select:none;
}
.sb-btn:hover{transform:translateY(-1px); text-decoration:none}
.sb-btn:active{transform:translateY(0)}
.sb-btn--primary{
  background:var(--sb-primary);
  color:white;
  box-shadow:var(--sb-shadow-sm);
}
.sb-btn--primary:hover{filter:brightness(1.02)}
.sb-btn--ghost{
  background:transparent;
  border-color:var(--sb-border);
  color:var(--sb-text);
}
.sb-btn--ghost:hover{background:color-mix(in srgb, var(--sb-surface) 55%, white)}

/* ===== Cards ===== */
.sb-card{
  border:1px solid var(--sb-border);
  border-radius:var(--sb-radius);
  background:color-mix(in srgb, var(--sb-surface) 70%, white);
  padding:18px;
  box-shadow:0 1px 0 rgba(2,6,23,0.02);
}
.sb-card__icon{
  width:38px;height:38px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  background:color-mix(in srgb, var(--sb-primary) 12%, white);
  color:var(--sb-primary);
  margin-bottom:12px;
  font-weight:800;
}
.sb-card__title{font-weight:700;margin-bottom:6px}
.sb-card__text{color:var(--sb-text-muted)}
.sb-card__meta{font-size:13px}

/* ===== Header ===== */
.sb-header{position:relative;background:rgba(255,255,255,0.85);backdrop-filter:saturate(140%) blur(10px);border-bottom:1px solid var(--sb-border)}
.sb-header.is-sticky{position:sticky;top:0;z-index:50}
.sb-header__inner{display:flex;align-items:center;justify-content:space-between;gap:16px}
.sb-header__brand{display:flex;align-items:center;gap:10px}
.sb-header__logoMark{color:var(--sb-primary)}
.sb-header__company{font-weight:800;letter-spacing:-0.02em}
.sb-header__tagline{display:block;font-size:12px;color:var(--sb-text-muted)}
.sb-header__nav{display:none;gap:18px}
.sb-header__link{font-weight:600;font-size:14px;color:var(--sb-text)}
.sb-header__actions{display:flex;align-items:center;gap:10px}
.sb-header__cta{display:none}
.sb-header__burger{width:44px;height:44px;border-radius:var(--sb-radius);border:1px solid var(--sb-border);background:white;cursor:pointer}
.sb-header__burgerLines{display:block;width:18px;height:2px;background:var(--sb-text);position:relative;margin:0 auto}
.sb-header__burgerLines:before,.sb-header__burgerLines:after{content:"";position:absolute;left:0;right:0;height:2px;background:var(--sb-text)}
.sb-header__burgerLines:before{top:-6px}
.sb-header__burgerLines:after{top:6px}
.sb-header__mobile{border-top:1px solid var(--sb-border);background:white}
.sb-header__mobileInner{padding:14px var(--sb-gutter);display:flex;flex-direction:column;gap:10px}
.sb-header__mobileLink{padding:10px 12px;border-radius:var(--sb-radius);border:1px solid var(--sb-border);background:color-mix(in srgb, var(--sb-surface) 60%, white)}
.sb-header__mobileCta{margin-top:6px}
@media (min-width: 860px){
  .sb-header__nav{display:flex}
  .sb-header__cta{display:inline-flex}
  .sb-header__burger{display:none}
  .sb-header__mobile{display:none !important}
}

/* ===== Hero ===== */
.sb-hero{position:relative}
.sb-hero__inner{display:grid;grid-template-columns:1fr;gap:22px;align-items:center}
.sb-hero__title{margin:0;font-size:clamp(30px, 3.2vw, 56px);letter-spacing:-0.03em;line-height:1.05}
.sb-hero__text{margin:10px 0 0;color:var(--sb-text-muted);max-width:60ch}
.sb-hero__actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.sb-hero__media{border-radius:var(--sb-radius);overflow:hidden;border:1px solid var(--sb-border);background:color-mix(in srgb, var(--sb-surface) 70%, white)}
.sb-hero__img{width:100%;height:auto}
.sb-hero__img--empty{display:flex;align-items:center;justify-content:center;min-height:260px;color:var(--sb-text-muted)}
.sb-hero--centered .sb-hero__inner{justify-items:start}
.sb-hero--centered .sb-hero__copy{max-width:720px}
.sb-hero--minimal .sb-hero__text{display:none}
.sb-hero--split .sb-hero__inner,.sb-hero--split-reverse .sb-hero__inner{grid-template-columns:1.05fr 0.95fr}
.sb-hero--split-reverse .sb-hero__copy{order:2}
.sb-hero--split-reverse .sb-hero__media{order:1}
.sb-hero--fullscreen{border-radius:0}
.sb-hero__bg{position:absolute;inset:0;background:
  radial-gradient(800px 400px at 10% 20%, color-mix(in srgb, var(--sb-primary) 18%, transparent) 0%, transparent 60%),
  radial-gradient(800px 420px at 90% 30%, color-mix(in srgb, var(--sb-accent) 16%, transparent) 0%, transparent 60%),
  linear-gradient(180deg, color-mix(in srgb, var(--sb-surface) 70%, white), var(--sb-bg));
}
.sb-hero__overlay{position:relative}
@media (max-width: 900px){
  .sb-hero--split .sb-hero__inner,.sb-hero--split-reverse .sb-hero__inner{grid-template-columns:1fr}
}

/* ===== Trust ===== */
.sb-trust__title{font-size:13px;font-weight:700;color:var(--sb-text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px}
.sb-trust__items{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.sb-trust__item{border:1px solid var(--sb-border);border-radius:var(--sb-radius);padding:12px;background:white}
.sb-trust__logo{display:flex;align-items:center;justify-content:center;min-height:44px}
.sb-trust__logoText{font-weight:800;color:var(--sb-text)}
.sb-trust__label{font-size:12px;color:var(--sb-text-muted);text-align:center;margin-top:6px}
.sb-trust__stat{font-weight:900;font-size:18px;text-align:center}
.sb-trust__badge{display:inline-flex;align-items:center;justify-content:center;min-height:44px;font-weight:800;background:color-mix(in srgb, var(--sb-primary) 10%, white)}
@media (min-width: 860px){
  .sb-trust__items{grid-template-columns:repeat(4,1fr)}
}

/* ===== Services ===== */
.sb-services__grid{display:grid;grid-template-columns:repeat(var(--sb-cols, 3), 1fr);gap:14px}
.sb-services__list{display:flex;flex-direction:column;gap:12px}
.sb-services__listItem{display:flex;gap:12px;padding:14px;border:1px solid var(--sb-border);border-radius:var(--sb-radius);background:white}
.sb-services__icon{width:36px;height:36px;border-radius:12px;background:color-mix(in srgb, var(--sb-primary) 12%, white);color:var(--sb-primary);display:flex;align-items:center;justify-content:center;font-weight:900}
.sb-services__title{font-weight:800;margin-bottom:4px}
.sb-services__text{color:var(--sb-text-muted)}
@media (max-width: 900px){
  .sb-services__grid{grid-template-columns:repeat(1,1fr)}
}

/* ===== Benefits ===== */
.sb-benefits__grid{display:grid;grid-template-columns:repeat(var(--sb-cols, 3), 1fr);gap:14px}
.sb-benefits__list{display:flex;flex-direction:column;gap:12px}
.sb-benefits__listItem{display:flex;gap:12px;padding:14px;border:1px solid var(--sb-border);border-radius:var(--sb-radius);background:white}
.sb-benefits__icon{width:36px;height:36px;border-radius:12px;background:color-mix(in srgb, var(--sb-accent) 14%, white);color:color-mix(in srgb, var(--sb-accent) 70%, black);display:flex;align-items:center;justify-content:center;font-weight:900}
.sb-benefits__title{font-weight:800;margin-bottom:4px}
.sb-benefits__text{color:var(--sb-text-muted)}
@media (max-width: 900px){
  .sb-benefits__grid{grid-template-columns:repeat(1,1fr)}
}

/* ===== Team ===== */
.sb-team__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.sb-team__cards{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.sb-team__minimal{display:grid;grid-template-columns:1fr;gap:10px}
.sb-team__minimalItem{border:1px solid var(--sb-border);border-radius:var(--sb-radius);padding:12px;background:white}
.sb-team__name{font-weight:800}
.sb-team__avatar{width:52px;height:52px;border-radius:999px;background:color-mix(in srgb, var(--sb-primary) 14%, white);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:10px;font-weight:900;color:var(--sb-primary)}
.sb-team__avatar img{width:100%;height:100%;object-fit:cover}
@media (max-width: 900px){
  .sb-team__grid,.sb-team__cards{grid-template-columns:1fr}
}

/* ===== Testimonials ===== */
.sb-testimonials__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.sb-testimonials__quote{font-weight:700}
.sb-testimonials__by{margin-top:10px;font-size:13px}
.sb-testimonials__sliderActions{display:flex;gap:10px;margin-top:12px}
.sb-testimonials__sliderActions .btn{min-width:44px}
@media (max-width: 900px){
  .sb-testimonials__grid{grid-template-columns:1fr}
}

/* ===== FAQ ===== */
.sb-faq__list{display:flex;flex-direction:column;gap:10px}
.sb-faq__item{border:1px solid var(--sb-border);border-radius:var(--sb-radius);background:white;overflow:hidden}
.sb-faq__q{padding:14px 14px;cursor:pointer;font-weight:800}
.sb-faq__q::-webkit-details-marker{display:none}
.sb-faq__a{padding:0 14px 14px}
.sb-faq__qStatic{padding:14px 14px 6px;font-weight:800}
.sb-faq__aStatic{padding:0 14px 14px}
.sb-faq__cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width: 900px){
  .sb-faq__cols{grid-template-columns:1fr}
}

/* ===== CTA ===== */
.sb-cta__center{display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.sb-cta__actions{display:flex;flex-wrap:wrap;gap:10px}
.sb-cta__banner{background:color-mix(in srgb, var(--sb-primary) 12%, white);border-top:1px solid var(--sb-border);border-bottom:1px solid var(--sb-border)}
.sb-cta__split{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}
@media (max-width: 900px){
  .sb-cta__split{grid-template-columns:1fr}
}

/* ===== Footer ===== */
.sb-footer{border-top:1px solid var(--sb-border);background:color-mix(in srgb, var(--sb-surface) 70%, white)}
.sb-footer__simple{display:flex;flex-direction:column;gap:10px}
.sb-footer__links{display:flex;gap:12px;flex-wrap:wrap}
.sb-footer__brand{font-weight:900}
.sb-footer__meta{font-size:13px}
.sb-footer__cols{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:16px}
.sb-footer__title{font-weight:900;margin-bottom:8px}
.sb-footer__address{color:var(--sb-text-muted)}
.sb-footer__minimal{display:flex;flex-direction:column;gap:10px}
@media (min-width: 860px){
  .sb-footer__simple{flex-direction:row;align-items:center;justify-content:space-between}
  .sb-footer__minimal{flex-direction:row;align-items:center;justify-content:space-between}
}
@media (max-width: 900px){
  .sb-footer__cols{grid-template-columns:1fr}
}

/* ===== Cookie Banner ===== */
.sb-cookie{position:fixed;inset:0;z-index:999}
.sb-cookie__backdrop{position:absolute;inset:0;background:rgba(2,6,23,0.55)}
.sb-cookie__card{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:min(560px, calc(100% - 32px));
  background:white;border-radius:var(--sb-radius);
  border:1px solid var(--sb-border);
  box-shadow:var(--sb-shadow);
}
.sb-cookie__head{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 0}
.sb-cookie__title{font-weight:900}
.sb-cookie__close{width:36px;height:36px;border-radius:var(--sb-radius);border:1px solid var(--sb-border);background:white;cursor:pointer}
.sb-cookie__body{padding:12px 16px}
.sb-cookie__note{margin-top:10px;padding:10px;border-radius:var(--sb-radius);background:color-mix(in srgb, var(--sb-surface) 70%, white);border:1px solid var(--sb-border);font-size:13px}
.sb-cookie__prefs{margin-top:12px;display:flex;flex-direction:column;gap:10px}
.sb-cookie__pref{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;border:1px solid var(--sb-border);border-radius:var(--sb-radius);background:white}
.sb-cookie__prefTitle{font-weight:800}
.sb-cookie__prefText{font-size:12px}
.sb-cookie__actions{display:flex;gap:10px;justify-content:flex-end;padding:0 16px 16px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:var(--sb-radius);border:1px solid var(--sb-border);background:white;height:38px;padding:0 12px;font-weight:700;cursor:pointer}
.btn--sm{height:36px}
.btn--primary{background:var(--sb-primary);color:white;border-color:transparent}
.btn--ghost{background:transparent}
.btn--danger{background:#ef4444;color:white;border-color:transparent}

/* ===== Utility images/dividers ===== */
.sb-img{border-radius:var(--sb-radius);border:1px solid var(--sb-border);background:white}
.sb-img--empty{min-height:220px;display:flex;align-items:center;justify-content:center;color:var(--sb-text-muted)}
.sb-hr{border:none;border-top:1px solid var(--sb-border);margin:18px 0}
.sb-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media (max-width:900px){.sb-columns{grid-template-columns:1fr}}
`;
  }

  function generateStylesCSS(state) {
    return `/* Smooth Builder 5 Export - styles.css */
${generateTokensCSS(state)}
${generateComponentsCSS(state)}
`;
  }

  SB5.generators.generateTokensCSS = generateTokensCSS;
  SB5.generators.generateComponentsCSS = generateComponentsCSS;
  SB5.generators.generateStylesCSS = generateStylesCSS;
})(window);



