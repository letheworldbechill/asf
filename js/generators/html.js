/* ============================================
   SMOOTH BUILDER 5.0 - GENERATOR: HTML
   ============================================
   No build step. Exposes:
   - window.SB5.generators.generateHTML(state, opts)
   - window.SB5.generators.generateBodyContent(state, opts)
   - window.SB5.generators.generateSectionHTML(section, ctx)
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.generators = SB5.generators || {};
  SB5.core = SB5.core || {};
  SB5.data = SB5.data || {};

  const utils = SB5.core.utils || {};

  function safeObj(x) { return x && typeof x === 'object' ? x : {}; }
  function safeStr(x, fallback = '') { return (x === null || x === undefined) ? fallback : String(x); }

  function escapeHtml(s) {
    if (typeof utils.escapeHtml === 'function') return utils.escapeHtml(s);
    return safeStr(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function attr(name, value) {
    if (value === null || value === undefined || value === '') return '';
    return ` ${name}="${escapeHtml(value)}"`;
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function spacingStyle(layout, id) {
    const sp = (layout && layout.spacing && layout.spacing[id]) ? layout.spacing[id] : null;
    const pt = clamp(Number(sp && sp.pt || 64), 0, 999);
    const pb = clamp(Number(sp && sp.pb || 64), 0, 999);
    return `style="padding-top:${pt}px;padding-bottom:${pb}px"`;
  }

  function normalizeNav(nav) {
    if (!Array.isArray(nav) || !nav.length) {
      return [
        { label: 'Leistungen', href: '#services' },
        { label: 'Team', href: '#team' },
        { label: 'FAQ', href: '#faq' }
      ];
    }
    return nav.slice(0, 10).map(it => ({
      label: safeStr(it && it.label, 'Link'),
      href: safeStr(it && it.href, '#')
    }));
  }

  function normalizeList(items, fallback) {
    if (!Array.isArray(items) || !items.length) return fallback;
    return items;
  }

  function sectionWrapperOpen(section, layout) {
    const sId = section.id;
    const cls = `sb-section sb-${escapeHtml(section.type)} sb-${escapeHtml(section.type)}--${escapeHtml(section.variant || 'default')}`;
    const idAttr = `data-section-id="${escapeHtml(sId)}"`;
    return `<section class="${cls}" ${idAttr} ${spacingStyle(layout, sId)}>`;
  }

  function sectionWrapperClose() {
    return `</section>`;
  }

  function containerOpen() { return `<div class="sb-container">`; }
  function containerClose() { return `</div>`; }

  // ---- Section renderers (exported HTML, no React) ----

  function renderHeader(section, ctx) {
    const { content, settings } = ctx;
    const c = safeObj(content[section.id]);
    const s = safeObj(settings);
    const features = safeObj(s.features);

    const variant = section.variant || 'left';
    const sticky = !!features.stickyHeader;

    const companyName = escapeHtml(c.companyName || s.siteName || 'Meine Website');
    const tagline = escapeHtml(c.tagline || '');
    const nav = normalizeNav(c.nav);

    const ctaText = escapeHtml(c.ctaText || 'Kontakt');
    const ctaHref = escapeHtml(c.ctaHref || '#cta');

    const cls = [
      'sb-header',
      `sb-header--${escapeHtml(variant)}`,
      sticky ? 'is-sticky' : ''
    ].filter(Boolean).join(' ');

    const navHtml = (variant === 'minimal') ? '' : `
      <nav class="sb-header__nav" aria-label="Navigation">
        ${nav.map(it => `<a class="sb-header__link" href="${escapeHtml(it.href)}">${escapeHtml(it.label)}</a>`).join('')}
      </nav>
    `;

    return `
      <header class="${cls}" role="banner">
        <div class="sb-container sb-header__inner">
          <a class="sb-header__brand" href="#">
            <span class="sb-header__logoMark" aria-hidden="true">●</span>
            <span class="sb-header__brandText">
              <span class="sb-header__company">${companyName}</span>
              ${tagline ? `<span class="sb-header__tagline">${tagline}</span>` : ''}
            </span>
          </a>
          ${navHtml}
          <div class="sb-header__actions">
            <a class="sb-btn sb-btn--primary sb-header__cta" href="${ctaHref}">${ctaText}</a>
            <button type="button" class="sb-header__burger" aria-label="Menü öffnen" aria-expanded="false">
              <span class="sb-header__burgerLines" aria-hidden="true"></span>
            </button>
          </div>
        </div>
        <div class="sb-header__mobile" hidden>
          <div class="sb-container sb-header__mobileInner">
            ${nav.map(it => `<a class="sb-header__mobileLink" href="${escapeHtml(it.href)}">${escapeHtml(it.label)}</a>`).join('')}
            <a class="sb-btn sb-btn--primary sb-header__mobileCta" href="${ctaHref}">${ctaText}</a>
          </div>
        </div>
      </header>
    `;
  }

  function renderHero(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'centered';

    const headline = escapeHtml(c.headline || 'Wir bauen Websites, die verkaufen.');
    const subline = escapeHtml(c.subline || 'Canvas-first Builder. Saubere Struktur. Schneller Export.');
    const ctaText = escapeHtml(c.ctaText || 'Angebot anfordern');
    const ctaHref = escapeHtml(c.ctaHref || '#cta');

    // image may be injected as <img src="...">; src will be rewritten by export.js if extracted to assets.
    const image = c.image ? escapeHtml(c.image) : null;

    const media =
      (variant === 'split' || variant === 'split-reverse')
        ? `<div class="sb-hero__media">${image ? `<img class="sb-hero__img" src="${image}" alt="">` : `<div class="sb-hero__img sb-hero__img--empty" aria-hidden="true">Bild</div>`}</div>`
        : '';

    const inner = `
      <div class="sb-container sb-hero__inner">
        <div class="sb-hero__copy">
          <h1 class="sb-hero__title">${headline}</h1>
          ${variant === 'minimal' ? '' : `<p class="sb-hero__text">${subline}</p>`}
          <div class="sb-hero__actions">
            <a class="sb-btn sb-btn--primary" href="${ctaHref}">${ctaText}</a>
            <a class="sb-btn sb-btn--ghost" href="#services">Mehr erfahren</a>
          </div>
        </div>
        ${media}
      </div>
    `;

    if (variant === 'fullscreen') {
      return `
        <div class="sb-hero sb-hero--fullscreen">
          <div class="sb-hero__bg" aria-hidden="true"></div>
          <div class="sb-hero__overlay">${inner}</div>
        </div>
      `;
    }

    return `<div class="sb-hero sb-hero--${escapeHtml(variant)}">${inner}</div>`;
  }

  function renderTrustBar(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'logos';

    const title = escapeHtml(c.title || 'Vertraut von');
    const items = normalizeList(c.items, [
      { label: 'Partner A', value: '120+', logo: null },
      { label: 'Partner B', value: '4.9/5', logo: null },
      { label: 'Partner C', value: '10 Jahre', logo: null }
    ]).slice(0, 10);

    const titleHtml = (variant === 'logos') ? '' : `<div class="sb-trust__title">${title}</div>`;

    const itemHtml = items.map((it) => {
      const label = escapeHtml(it.label || 'Partner');
      const value = escapeHtml(it.value || '');
      const logo = it.logo ? escapeHtml(it.logo) : null;

      if (variant === 'stats') {
        return `<div class="sb-trust__item"><div class="sb-trust__stat">${value || '—'}</div><div class="sb-trust__label">${label}</div></div>`;
      }
      if (variant === 'badges') {
        return `<div class="sb-trust__item"><div class="sb-trust__badge">${label}</div></div>`;
      }

      return `
        <div class="sb-trust__item">
          <div class="sb-trust__logo" aria-hidden="true">
            ${logo ? `<img src="${logo}" alt="">` : `<span class="sb-trust__logoText">${label}</span>`}
          </div>
          ${variant === 'logos-text' ? `<div class="sb-trust__label">${value || 'Empfohlen'}</div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="sb-trust sb-trust--${escapeHtml(variant)}">
        ${containerOpen()}
          ${titleHtml}
          <div class="sb-trust__items" role="list">${itemHtml}</div>
        ${containerClose()}
      </div>
    `;
  }

  function renderServices(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'grid-3';

    const headline = escapeHtml(c.headline || 'Unsere Leistungen');
    const subline = escapeHtml(c.subline || 'Alles, was du für einen sauberen Launch brauchst.');

    const services = normalizeList(c.services, [
      { title: 'Webdesign', text: 'Modern, schnell, conversion-stark.', icon: '✓' },
      { title: 'SEO', text: 'Saubere Struktur für gute Rankings.', icon: '⌁' },
      { title: 'Content', text: 'Texte, die verkaufen.', icon: '✎' },
      { title: 'Performance', text: 'Lighthouse-ready.', icon: '⚡' }
    ]).slice(0, 12);

    const head = `
      <div class="sb-sectionHead">
        <h2 class="sb-h2">${headline}</h2>
        <p class="sb-p sb-muted">${subline}</p>
      </div>
    `;

    if (variant === 'list') {
      const items = services.map(it => `
        <div class="sb-services__listItem" role="listitem">
          <div class="sb-services__icon" aria-hidden="true">${escapeHtml(it.icon || '•')}</div>
          <div class="sb-services__body">
            <div class="sb-services__title">${escapeHtml(it.title || 'Service')}</div>
            <div class="sb-services__text">${escapeHtml(it.text || '')}</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="sb-services sb-services--list" id="services">
          ${containerOpen()}
            ${head}
            <div class="sb-services__list" role="list">${items}</div>
          ${containerClose()}
        </div>
      `;
    }

    const cols = variant === 'grid-2' ? 2 : (variant === 'grid-4' ? 4 : 3);
    const cards = services.slice(0, cols * 3).map(it => `
      <div class="sb-card sb-services__card" role="listitem">
        <div class="sb-card__icon" aria-hidden="true">${escapeHtml(it.icon || '•')}</div>
        <div class="sb-card__title">${escapeHtml(it.title || 'Service')}</div>
        <div class="sb-card__text">${escapeHtml(it.text || '')}</div>
      </div>
    `).join('');

    return `
      <div class="sb-services sb-services--${escapeHtml(variant)}" id="services">
        ${containerOpen()}
          ${head}
          <div class="sb-services__grid" style="--sb-cols:${cols}" role="list">${cards}</div>
        ${containerClose()}
      </div>
    `;
  }

  function renderBenefits(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'grid-3';
    const headline = escapeHtml(c.headline || 'Vorteile');

    const items = normalizeList(c.benefits, [
      { title: 'Schnell', text: 'Keine Build-Tools nötig.', icon: '⚡' },
      { title: 'Sauber', text: 'Modulare Architektur.', icon: '✓' },
      { title: 'Offline', text: 'PWA-ready Export.', icon: '⬣' }
    ]).slice(0, 12);

    const head = `
      <div class="sb-sectionHead">
        <h2 class="sb-h2">${headline}</h2>
      </div>
    `;

    if (variant === 'list') {
      const list = items.map(it => `
        <div class="sb-benefits__listItem" role="listitem">
          <div class="sb-benefits__icon" aria-hidden="true">${escapeHtml(it.icon || '★')}</div>
          <div>
            <div class="sb-benefits__title">${escapeHtml(it.title || 'Benefit')}</div>
            <div class="sb-benefits__text">${escapeHtml(it.text || '')}</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="sb-benefits sb-benefits--list">
          ${containerOpen()}
            ${head}
            <div class="sb-benefits__list" role="list">${list}</div>
          ${containerClose()}
        </div>
      `;
    }

    const cols = variant === 'grid-2' ? 2 : 3;
    const cards = items.map(it => `
      <div class="sb-card sb-benefits__card" role="listitem">
        <div class="sb-card__icon" aria-hidden="true">${escapeHtml(it.icon || '★')}</div>
        <div class="sb-card__title">${escapeHtml(it.title || 'Benefit')}</div>
        <div class="sb-card__text">${escapeHtml(it.text || '')}</div>
      </div>
    `).join('');

    return `
      <div class="sb-benefits sb-benefits--${escapeHtml(variant)}">
        ${containerOpen()}
          ${head}
          <div class="sb-benefits__grid" style="--sb-cols:${cols}" role="list">${cards}</div>
        ${containerClose()}
      </div>
    `;
  }

  function renderTeam(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'grid';
    const headline = escapeHtml(c.headline || 'Team');

    const members = normalizeList(c.members, [
      { name: 'Alex Muster', role: 'Founder', bio: 'Produkt & Strategie', avatar: null },
      { name: 'Sam Beispiel', role: 'Design', bio: 'UI/UX & Branding', avatar: null },
      { name: 'Pat Demo', role: 'Engineering', bio: 'Frontend & Export', avatar: null }
    ]).slice(0, 12);

    const head = `
      <div class="sb-sectionHead">
        <h2 class="sb-h2">${headline}</h2>
      </div>
    `;

    function initials(name) {
      return escapeHtml(safeStr(name).split(' ').filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('') || '•');
    }

    if (variant === 'minimal') {
      const list = members.map(m => `
        <div class="sb-team__minimalItem" role="listitem">
          <div class="sb-team__name">${escapeHtml(m.name || 'Name')}</div>
          <div class="sb-team__role sb-muted">${escapeHtml(m.role || '')}</div>
        </div>
      `).join('');

      return `
        <div class="sb-team sb-team--minimal" id="team">
          ${containerOpen()}
            ${head}
            <div class="sb-team__minimal" role="list">${list}</div>
          ${containerClose()}
        </div>
      `;
    }

    const cards = members.map(m => {
      const avatar = m.avatar ? escapeHtml(m.avatar) : null;
      return `
        <div class="sb-card sb-team__card" role="listitem">
          <div class="sb-team__avatar" aria-hidden="true">
            ${avatar ? `<img src="${avatar}" alt="">` : `<span>${initials(m.name)}</span>`}
          </div>
          <div class="sb-card__title">${escapeHtml(m.name || 'Name')}</div>
          <div class="sb-card__meta sb-muted">${escapeHtml(m.role || '')}</div>
          ${m.bio ? `<div class="sb-card__text">${escapeHtml(m.bio)}</div>` : ''}
        </div>
      `;
    }).join('');

    const gridCls = variant === 'cards' ? 'sb-team__cards' : 'sb-team__grid';

    return `
      <div class="sb-team sb-team--${escapeHtml(variant)}" id="team">
        ${containerOpen()}
          ${head}
          <div class="${gridCls}" role="list">${cards}</div>
        ${containerClose()}
      </div>
    `;
  }

  function renderTestimonials(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'grid';
    const headline = escapeHtml(c.headline || 'Testimonials');

    const items = normalizeList(c.items, [
      { quote: 'Extrem sauberer Builder – Export funktioniert sofort.', name: 'Kundin A', role: 'CEO' },
      { quote: 'Struktur → Design → Export fühlt sich richtig an.', name: 'Kunde B', role: 'Marketing' },
      { quote: 'Offline-fähig und schnell. Genau was wir wollten.', name: 'Kunde C', role: 'Founder' }
    ]).slice(0, 10);

    const head = `
      <div class="sb-sectionHead">
        <h2 class="sb-h2">${headline}</h2>
      </div>
    `;

    const card = (t) => `
      <div class="sb-card sb-testimonials__card">
        <div class="sb-testimonials__quote">“${escapeHtml(t.quote || '')}”</div>
        <div class="sb-testimonials__by">
          <span class="sb-testimonials__name">${escapeHtml(t.name || '')}</span>
          ${t.role ? `<span class="sb-testimonials__role sb-muted"> · ${escapeHtml(t.role)}</span>` : ''}
        </div>
      </div>
    `;

    if (variant === 'single') {
      return `
        <div class="sb-testimonials sb-testimonials--single">
          ${containerOpen()}
            ${head}
            ${card(items[0] || {})}
          ${containerClose()}
        </div>
      `;
    }

    if (variant === 'slider') {
      const slides = items.map((t, idx) => `<div class="sb-testimonials__slide" data-slide="${idx}" ${idx ? 'hidden' : ''}>${card(t)}</div>`).join('');
      return `
        <div class="sb-testimonials sb-testimonials--slider">
          ${containerOpen()}
            ${head}
            <div class="sb-testimonials__slider" data-slider="testimonials">
              ${slides}
              <div class="sb-testimonials__sliderActions">
                <button type="button" class="btn btn--sm" data-slider-prev aria-label="Vorheriges">←</button>
                <button type="button" class="btn btn--sm" data-slider-next aria-label="Nächstes">→</button>
              </div>
            </div>
          ${containerClose()}
        </div>
      `;
    }

    const grid = items.map(t => `<div role="listitem">${card(t)}</div>`).join('');
    return `
      <div class="sb-testimonials sb-testimonials--grid">
        ${containerOpen()}
          ${head}
          <div class="sb-testimonials__grid" role="list">${grid}</div>
        ${containerClose()}
      </div>
    `;
  }

  function renderFAQ(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'accordion';
    const headline = escapeHtml(c.headline || 'FAQ');

    const items = normalizeList(c.items, [
      { q: 'Wie exportiere ich?', a: 'Im Export-Modus kannst du Preview HTML, ZIP oder JSON downloaden.' },
      { q: 'Bleibt alles offline?', a: 'Ja. PWA + Service Worker funktionieren ohne Backend.' },
      { q: 'Kann ich Sections reorder?', a: 'Ja – per Drag & Drop in Struktur.' }
    ]).slice(0, 16);

    const head = `
      <div class="sb-sectionHead">
        <h2 class="sb-h2">${headline}</h2>
      </div>
    `;

    const itemHtml = (it, idx) => {
      const q = escapeHtml(it.q || '');
      const a = escapeHtml(it.a || '');
      if (variant === 'two-column') {
        return `
          <div class="sb-faq__item">
            <div class="sb-faq__qStatic">${q}</div>
            <div class="sb-faq__aStatic sb-muted">${a}</div>
          </div>
        `;
      }
      // accordion uses details/summary for native accessibility
      return `
        <details class="sb-faq__item" ${idx === 0 ? 'open' : ''}>
          <summary class="sb-faq__q">${q}</summary>
          <div class="sb-faq__a"><p class="sb-p">${a}</p></div>
        </details>
      `;
    };

    if (variant === 'two-column') {
      const half = Math.ceil(items.length / 2);
      const left = items.slice(0, half).map(itemHtml).join('');
      const right = items.slice(half).map(itemHtml).join('');
      return `
        <div class="sb-faq sb-faq--two-column" id="faq">
          ${containerOpen()}
            ${head}
            <div class="sb-faq__cols">
              <div class="sb-faq__col">${left}</div>
              <div class="sb-faq__col">${right}</div>
            </div>
          ${containerClose()}
        </div>
      `;
    }

    return `
      <div class="sb-faq sb-faq--accordion" id="faq">
        ${containerOpen()}
          ${head}
          <div class="sb-faq__list">${items.map(itemHtml).join('')}</div>
        ${containerClose()}
      </div>
    `;
  }

  function renderCTA(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const variant = section.variant || 'centered';

    const headline = escapeHtml(c.headline || 'Bereit für den Launch?');
    const subline = escapeHtml(c.subline || 'In wenigen Minuten zur exportierbaren Website.');
    const buttonText = escapeHtml(c.buttonText || 'Jetzt starten');
    const buttonHref = escapeHtml(c.buttonHref || '#');

    const body = `
      <div class="sb-cta__copy">
        <h2 class="sb-h2">${headline}</h2>
        <p class="sb-p sb-muted">${subline}</p>
      </div>
      <div class="sb-cta__actions">
        <a class="sb-btn sb-btn--primary" href="${buttonHref}">${buttonText}</a>
        <a class="sb-btn sb-btn--ghost" href="#faq">Fragen?</a>
      </div>
    `;

    if (variant === 'banner') {
      return `
        <div class="sb-cta sb-cta--banner" id="cta">
          <div class="sb-cta__banner">
            <div class="sb-cta__center">${body}</div>
          </div>
        </div>
      `;
    }

    if (variant === 'split') {
      return `
        <div class="sb-cta sb-cta--split" id="cta">
          ${containerOpen()}
            <div class="sb-cta__split">${body}</div>
          ${containerClose()}
        </div>
      `;
    }

    return `
      <div class="sb-cta sb-cta--centered" id="cta">
        ${containerOpen()}
          <div class="sb-cta__center">${body}</div>
        ${containerClose()}
      </div>
    `;
  }

  function renderFooter(section, ctx) {
    const { content, settings } = ctx;
    const c = safeObj(content[section.id]);
    const s = safeObj(settings);

    const variant = section.variant || 'simple';
    const year = new Date().getFullYear();

    const companyName = escapeHtml(c.companyName || s.siteName || 'Meine Website');
    const address = escapeHtml(c.address || 'Musterstrasse 1\n8000 Zürich');
    const email = escapeHtml(c.email || 'hello@example.com');
    const phone = escapeHtml(c.phone || '+41 44 000 00 00');
    const links = normalizeList(c.links, [
      { label: 'Datenschutz', href: 'privacy.html' },
      { label: 'Impressum', href: 'impressum.html' }
    ]).slice(0, 10);

    const linksHtml = links.map(l => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`).join('');

    if (variant === 'minimal') {
      return `
        <footer class="sb-footer sb-footer--minimal" role="contentinfo">
          ${containerOpen()}
            <div class="sb-footer__minimal">
              <div class="sb-footer__copy">© ${year} ${companyName}</div>
              <div class="sb-footer__links">${linksHtml}</div>
            </div>
          ${containerClose()}
        </footer>
      `;
    }

    if (variant === 'columns') {
      return `
        <footer class="sb-footer sb-footer--columns" role="contentinfo">
          ${containerOpen()}
            <div class="sb-footer__cols">
              <div class="sb-footer__col">
                <div class="sb-footer__brand">${companyName}</div>
                <pre class="sb-footer__address">${address}</pre>
              </div>
              <div class="sb-footer__col">
                <div class="sb-footer__title">Kontakt</div>
                <a href="mailto:${email}">${email}</a>
                <a href="tel:${phone}">${phone}</a>
              </div>
              <div class="sb-footer__col">
                <div class="sb-footer__title">Links</div>
                ${linksHtml}
              </div>
            </div>
          ${containerClose()}
        </footer>
      `;
    }

    return `
      <footer class="sb-footer sb-footer--simple" role="contentinfo">
        ${containerOpen()}
          <div class="sb-footer__simple">
            <div>
              <div class="sb-footer__brand">${companyName}</div>
              <div class="sb-footer__meta sb-muted">${email} · ${phone}</div>
            </div>
            <div class="sb-footer__links">${linksHtml}</div>
            <div class="sb-footer__copy">© ${year}</div>
          </div>
        ${containerClose()}
      </footer>
    `;
  }

  function renderCustom(section, ctx) {
    const { content } = ctx;
    const c = safeObj(content[section.id]);
    const elements = Array.isArray(c.elements) ? c.elements : [];

    const blocks = elements.map((el) => {
      const t = el && el.type;
      const ec = safeObj(el && el.content);
      if (t === 'headline') return `<h2 class="sb-h2">${escapeHtml(ec.text || 'Headline')}</h2>`;
      if (t === 'text') return `<p class="sb-p">${escapeHtml(ec.text || 'Text…')}</p>`;
      if (t === 'button') return `<a class="sb-btn sb-btn--primary" href="${escapeHtml(ec.href || '#')}">${escapeHtml(ec.label || 'Button')}</a>`;
      if (t === 'image') return ec.src ? `<img class="sb-img" src="${escapeHtml(ec.src)}" alt="${escapeHtml(ec.alt || '')}">` : `<div class="sb-img sb-img--empty" aria-hidden="true">Bild</div>`;
      if (t === 'spacer') return `<div style="height:${clamp(Number(ec.height || 24),0,400)}px" aria-hidden="true"></div>`;
      if (t === 'divider') return `<hr class="sb-hr">`;
      if (t === 'columns') {
        const left = escapeHtml(ec.left && ec.left.text || '');
        const right = escapeHtml(ec.right && ec.right.text || '');
        return `<div class="sb-columns"><div class="sb-columns__col"><p class="sb-p">${left}</p></div><div class="sb-columns__col"><p class="sb-p">${right}</p></div></div>`;
      }
      return '';
    }).join('');

    return `
      <div class="sb-custom sb-custom--${escapeHtml(section.variant || 'full')}">
        ${containerOpen()}
          <div class="sb-custom__stack">
            ${blocks || `<div class="sb-empty">Custom Section – keine Elemente.</div>`}
          </div>
        ${containerClose()}
      </div>
    `;
  }

  function generateSectionHTML(section, ctx) {
    const { layout } = ctx;

    // Outer wrapper (spacing lives on wrapper section)
    let inner = '';
    if (section.type === 'header') inner = renderHeader(section, ctx);
    else if (section.type === 'hero') inner = renderHero(section, ctx);
    else if (section.type === 'trustbar') inner = renderTrustBar(section, ctx);
    else if (section.type === 'services') inner = renderServices(section, ctx);
    else if (section.type === 'benefits') inner = renderBenefits(section, ctx);
    else if (section.type === 'team') inner = renderTeam(section, ctx);
    else if (section.type === 'testimonials') inner = renderTestimonials(section, ctx);
    else if (section.type === 'faq') inner = renderFAQ(section, ctx);
    else if (section.type === 'cta') inner = renderCTA(section, ctx);
    else if (section.type === 'footer') inner = renderFooter(section, ctx);
    else if (section.type === 'custom') inner = renderCustom(section, ctx);
    else inner = ''; // unknown

    if (!inner) return '';

    // header/footer are already full tags. Still wrap for spacing consistency.
    return `${sectionWrapperOpen(section, layout)}${inner}${sectionWrapperClose()}`;
  }

  function generateBodyContent(state, opts = {}) {
    const st = safeObj(state);
    const layout = safeObj(st.layout);
    const content = safeObj(st.content);
    const settings = safeObj(st.settings);

    const byId = new Map();
    (Array.isArray(layout.sections) ? layout.sections : []).forEach(s => byId.set(s.id, s));

    const ordered = (Array.isArray(layout.order) ? layout.order : [])
      .map(id => byId.get(id))
      .filter(Boolean)
      .filter(s => s.enabled !== false);

    const ctx = { layout, content, settings };

    const sectionsHtml = ordered.map(s => generateSectionHTML(s, ctx)).join('\n');

    // cookie banner placeholder host (generated by JS)
    const cookieHost = (settings && settings.consent && settings.consent.enabled)
      ? `<div id="sb-cookie-root"></div>`
      : '';

    return `
      <div class="sb-site">
        ${sectionsHtml}
      </div>
      ${cookieHost}
    `;
  }

  function generateHTML(state, opts = {}) {
    const st = safeObj(state);
    const settings = safeObj(st.settings);
    const brand = safeObj(st.brand);

    const lang = safeStr(settings.language || 'de');
    const title = escapeHtml(settings.siteName || 'Meine Website');
    const desc = escapeHtml(settings.siteDescription || '');
    const favicon = safeStr(settings.favicon || '🏠');

    const mode = safeStr(opts.mode || 'production'); // 'preview' | 'production'
    const inlineCss = safeStr(opts.inlineCss || '');
    const inlineJs = safeStr(opts.inlineJs || '');
    const cssHref = safeStr(opts.cssHref || 'styles.css');
    const jsSrc = safeStr(opts.jsSrc || 'main.js');

    // basic theme-color (uses primary)
    const primary = safeObj(brand.colors).primary || '#0f766e';

    const headCss = mode === 'preview'
      ? `<style>\n${inlineCss}\n</style>`
      : `<link rel="stylesheet" href="${escapeHtml(cssHref)}">`;

    const headJs = mode === 'preview'
      ? `<script>\n${inlineJs}\n</script>`
      : `<script src="${escapeHtml(jsSrc)}" defer></script>`;

    // favicon: emoji => data URI
    const iconData = opts.faviconDataUrl
      ? safeStr(opts.faviconDataUrl)
      : `data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">${favicon}</text></svg>`
        )}`;

    const body = generateBodyContent(st, opts);

    return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="${escapeHtml(primary)}">
  ${desc ? `<meta name="description" content="${desc}">` : ''}
  <title>${title}</title>
  <link rel="icon" href="${iconData}">
  ${headCss}
  ${headJs}
</head>
<body>
  ${body}
</body>
</html>`;
  }

  SB5.generators.generateHTML = generateHTML;
  SB5.generators.generateBodyContent = generateBodyContent;
  SB5.generators.generateSectionHTML = generateSectionHTML;
})(window);



