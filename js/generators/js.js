/* ============================================
   SMOOTH BUILDER 5.0 - GENERATOR: MAIN JS
   ============================================
   No build step. Exposes:
   - window.SB5.generators.generateMainJS(state, opts)
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.generators = SB5.generators || {};

  function safeObj(x) { return x && typeof x === 'object' ? x : {}; }
  function json(x){ return JSON.stringify(x); }

  function generateMainJS(state, opts = {}) {
    const st = safeObj(state);
    const settings = safeObj(st.settings);
    const consentCfg = safeObj(settings.consent);
    const features = safeObj(settings.features);

    const enableConsent = !!consentCfg.enabled;
    const analytics = consentCfg.analytics || 'none';
    const privacyLink = consentCfg.privacyLink || 'privacy.html';

    const enableSmoothScroll = !!features.smoothScroll;
    const enableStickyHeader = !!features.stickyHeader;
    const enableDarkToggle = !!features.darkModeToggle;

    // Embed config as constants (no external dependency in exported site)
    return `(function(){
'use strict';

const CONFIG = ${json({
      consent: { enabled: enableConsent, analytics, privacyLink },
      features: { smoothScroll: enableSmoothScroll, stickyHeader: enableStickyHeader, darkModeToggle: enableDarkToggle }
    })};

const LS_CONSENT = 'sb5_consent_v1';
const LS_THEME = 'sb5_theme_v1';

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
function on(el, ev, fn, opts){ if (el) el.addEventListener(ev, fn, opts); }

function readConsent(){
  try{
    const raw = localStorage.getItem(LS_CONSENT);
    if(!raw) return null;
    const v = JSON.parse(raw);
    if(!v || typeof v !== 'object') return null;
    return v;
  }catch(_){ return null; }
}
function writeConsent(c){
  try{ localStorage.setItem(LS_CONSENT, JSON.stringify(c)); }catch(_){}
}
function emitConsent(c){
  try{ window.dispatchEvent(new CustomEvent('sb5:consent', { detail: c })); }catch(_){}
}

function mountCookieBanner(){
  const host = qs('#sb-cookie-root');
  if(!host) return;

  // If already decided, do nothing
  const existing = readConsent();
  if(existing && existing.decidedAt){
    emitConsent(existing);
    return;
  }

  const el = document.createElement('div');
  el.className = 'sb-cookie';
  el.innerHTML = \`
    <div class="sb-cookie__backdrop"></div>
    <div class="sb-cookie__card" role="dialog" aria-modal="true" aria-label="Cookie Einstellungen">
      <div class="sb-cookie__head">
        <div class="sb-cookie__title">Cookies & Datenschutz</div>
      </div>
      <div class="sb-cookie__body">
        <p class="sb-p">
          Wir verwenden Cookies, um die Website zuverlässig zu betreiben und – optional – anonymisierte Statistiken zu erfassen.
          Details findest du in der <a href="\${CONFIG.consent.privacyLink}">Datenschutzerklärung</a>.
        </p>

        <div class="sb-cookie__prefs" hidden>
          <div class="sb-cookie__pref">
            <div>
              <div class="sb-cookie__prefTitle">Notwendig</div>
              <div class="sb-cookie__prefText sb-muted">Immer aktiv (für Grundfunktionen)</div>
            </div>
            <input type="checkbox" checked disabled aria-label="Notwendig">
          </div>

          <div class="sb-cookie__pref">
            <div>
              <div class="sb-cookie__prefTitle">Statistik</div>
              <div class="sb-cookie__prefText sb-muted">Hilft uns, die Website zu verbessern</div>
            </div>
            <input id="sb-cookie-stat" type="checkbox" aria-label="Statistik">
          </div>

          <div class="sb-cookie__pref">
            <div>
              <div class="sb-cookie__prefTitle">Marketing</div>
              <div class="sb-cookie__prefText sb-muted">Personalisierung & Kampagnen</div>
            </div>
            <input id="sb-cookie-mkt" type="checkbox" aria-label="Marketing">
          </div>
        </div>
      </div>

      <div class="sb-cookie__actions">
        <button type="button" class="btn btn--sm btn--ghost" data-action="prefs">Einstellungen</button>
        <button type="button" class="btn btn--sm" data-action="necessary">Nur notwendig</button>
        <button type="button" class="btn btn--sm btn--primary" data-action="all">Alle akzeptieren</button>
        <button type="button" class="btn btn--sm btn--primary" data-action="save" hidden>Speichern</button>
      </div>
    </div>
  \`;

  host.appendChild(el);

  const prefs = qs('.sb-cookie__prefs', el);
  const btnPrefs = qs('[data-action="prefs"]', el);
  const btnNec = qs('[data-action="necessary"]', el);
  const btnAll = qs('[data-action="all"]', el);
  const btnSave = qs('[data-action="save"]', el);
  const stat = qs('#sb-cookie-stat', el);
  const mkt = qs('#sb-cookie-mkt', el);

  let customizing = false;

  function close(){
    el.remove();
  }

  function acceptAll(){
    const c = { version: 1, decidedAt: new Date().toISOString(), necessary: true, statistics: true, marketing: true };
    writeConsent(c); emitConsent(c); close();
  }

  function acceptNecessary(){
    const c = { version: 1, decidedAt: new Date().toISOString(), necessary: true, statistics: false, marketing: false };
    writeConsent(c); emitConsent(c); close();
  }

  function saveCustom(){
    const c = { version: 1, decidedAt: new Date().toISOString(), necessary: true, statistics: !!stat.checked, marketing: !!mkt.checked };
    writeConsent(c); emitConsent(c); close();
  }

  on(btnPrefs, 'click', () => {
    customizing = !customizing;
    prefs.hidden = !customizing;
    btnSave.hidden = !customizing;
    btnAll.hidden = customizing;
    btnNec.hidden = customizing;
    btnPrefs.textContent = customizing ? 'Zurück' : 'Einstellungen';
  });

  on(btnAll, 'click', acceptAll);
  on(btnNec, 'click', acceptNecessary);
  on(btnSave, 'click', saveCustom);
}

function initHeaderMenu(){
  const header = qs('.sb-header');
  if(!header) return;
  const burger = qs('.sb-header__burger', header);
  const mobile = qs('.sb-header__mobile', header);
  if(!burger || !mobile) return;

  function setOpen(open){
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobile.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }

  let open = false;
  on(burger, 'click', () => { open = !open; setOpen(open); });

  qsa('a', mobile).forEach(a => on(a, 'click', () => { open = false; setOpen(false); }));
  on(document, 'keydown', (e) => {
    if(e.key === 'Escape' && open){ open = false; setOpen(false); }
  });
}

function initTestimonialsSlider(){
  const root = qs('[data-slider="testimonials"]');
  if(!root) return;
  const slides = qsa('.sb-testimonials__slide', root);
  if(slides.length <= 1) return;

  let idx = 0;
  const show = (i) => {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, j) => { s.hidden = j !== idx; });
  };
  const prev = qs('[data-slider-prev]', root);
  const next = qs('[data-slider-next]', root);
  on(prev, 'click', () => show(idx - 1));
  on(next, 'click', () => show(idx + 1));
}

function initSmoothScroll(){
  if(!CONFIG.features.smoothScroll) return;
  on(document, 'click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href || href === '#') return;
    const target = qs(href);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', href);
  });
}

function initDarkModeToggle(){
  if(!CONFIG.features.darkModeToggle) return;

  const btn = document.createElement('button');
  btn.className = 'btn btn--sm btn--ghost';
  btn.style.position = 'fixed';
  btn.style.right = '14px';
  btn.style.bottom = '14px';
  btn.style.zIndex = '60';
  btn.setAttribute('aria-label', 'Dark Mode umschalten');

  function apply(mode){
    document.documentElement.setAttribute('data-theme', mode);
    try{ localStorage.setItem(LS_THEME, mode); }catch(_){}
    btn.textContent = mode === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  const saved = (function(){ try{ return localStorage.getItem(LS_THEME); }catch(_){ return null; }})();
  const initial = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  apply(initial);

  on(btn, 'click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    apply(current === 'dark' ? 'light' : 'dark');
  });

  document.body.appendChild(btn);

  // Minimal dark mode tokens
  const style = document.createElement('style');
  style.textContent = \`
    :root[data-theme="dark"]{
      --sb-bg:#0b1220;
      --sb-surface:#0f172a;
      --sb-text:#e5e7eb;
      --sb-text-muted:rgba(229,231,235,0.72);
      --sb-border:rgba(255,255,255,0.12);
    }
    :root[data-theme="dark"] .sb-header{background:rgba(15,23,42,0.7)}
    :root[data-theme="dark"] .sb-cookie__card{background:#0f172a}
    :root[data-theme="dark"] .btn{background:rgba(255,255,255,0.05); color: var(--sb-text)}
  \`;
  document.head.appendChild(style);
}

function initAnalyticsGate(){
  if(!CONFIG.consent.enabled) return;

  function isStatsAllowed(){
    const c = readConsent();
    return !!(c && c.decidedAt && c.statistics);
  }

  function enableGa4(){
    // Intentionally no measurement ID baked in.
    // Export pipeline may inject it later.
    // This hook exists to keep contract stable.
  }

  function enableMatomo(){
    // Self-hosted matomo can be injected via export pipeline.
  }

  function apply(){
    if(CONFIG.consent.analytics === 'none') return;
    if(!isStatsAllowed()) return;

    if(CONFIG.consent.analytics === 'ga4') enableGa4();
    if(CONFIG.consent.analytics === 'matomo') enableMatomo();
  }

  on(window, 'sb5:consent', apply);
  apply();
}

function init(){
  initHeaderMenu();
  initTestimonialsSlider();
  initSmoothScroll();
  initDarkModeToggle();

  if(CONFIG.consent.enabled){
    mountCookieBanner();
    initAnalyticsGate();
  }
}

if(document.readyState === 'loading'){
  on(document, 'DOMContentLoaded', init);
}else{
  init();
}
})();`;
  }

  SB5.generators.generateMainJS = generateMainJS;
})(window);




