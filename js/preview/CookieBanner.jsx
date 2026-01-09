/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: COOKIE BANNER
   Swiss Consent Engine (offline, no deps)
   - LocalStorage persistence
   - Categories: necessary (always), statistics, marketing
   - Presets: none | ga4 | matomo (gated by consent)
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};
  SB5.features = SB5.features || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/CookieBanner.jsx');

  const { useEffect, useMemo, useState, useCallback } = React;

  const LS_KEY = 'sb5_consent_v1';

  function safeObj(x){return x && typeof x==='object'?x:{};}
  function nowISO(){ return new Date().toISOString(); }

  function readConsent() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (!v || typeof v !== 'object') return null;
      return v;
    } catch (_) {
      return null;
    }
  }

  function writeConsent(consent) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(consent)); } catch (_) {}
  }

  function emitConsent(consent) {
    try { global.dispatchEvent(new CustomEvent('sb5:consent', { detail: consent })); } catch (_) {}
  }

  function defaultConsent() {
    return { version: 1, decidedAt: null, necessary: true, statistics: false, marketing: false };
  }

  function CookieBanner({ settings, readOnly = false }) {
    const s = safeObj(settings);
    const cfg = safeObj(s.consent);

    const enabled = !!cfg.enabled;
    const analytics = cfg.analytics || 'none';
    const privacyLink = cfg.privacyLink || '/datenschutz';

    const [open, setOpen] = useState(false);
    const [customize, setCustomize] = useState(false);
    const [consent, setConsent] = useState(() => readConsent() || defaultConsent());

    useEffect(() => {
      if (!enabled) return;
      const existing = readConsent();
      if (!existing || !existing.decidedAt) setOpen(true);
      else {
        setOpen(false);
        setConsent(existing);
        emitConsent(existing);
      }
    }, [enabled]);

    // Small API for exported site JS later (same contract)
    useEffect(() => {
      SB5.features.consent = SB5.features.consent || {};
      SB5.features.consent.get = () => readConsent();
      SB5.features.consent.has = (category) => {
        const c = readConsent();
        if (!c) return false;
        if (category === 'necessary') return true;
        return !!c[category];
      };
    }, []);

    const canClose = !!(consent && consent.decidedAt);

    const acceptAll = useCallback(() => {
      const next = { version: 1, decidedAt: nowISO(), necessary: true, statistics: true, marketing: true };
      setConsent(next);
      writeConsent(next);
      emitConsent(next);
      setOpen(false);
      setCustomize(false);
    }, []);

    const acceptNecessaryOnly = useCallback(() => {
      const next = { version: 1, decidedAt: nowISO(), necessary: true, statistics: false, marketing: false };
      setConsent(next);
      writeConsent(next);
      emitConsent(next);
      setOpen(false);
      setCustomize(false);
    }, []);

    const saveCustom = useCallback(() => {
      const next = { ...consent, version: 1, decidedAt: nowISO(), necessary: true };
      setConsent(next);
      writeConsent(next);
      emitConsent(next);
      setOpen(false);
      setCustomize(false);
    }, [consent]);

    const analyticsStatus = useMemo(() => {
      const c = consent;
      if (!c || !c.decidedAt) return 'pending';
      if (analytics === 'none') return 'off';
      if (analytics === 'ga4' || analytics === 'matomo') return c.statistics ? 'allowed' : 'blocked';
      return 'off';
    }, [consent, analytics]);

    if (!enabled) return null;
    if (!open && canClose) return null;

    return (
      <div className="sb-cookie" role="dialog" aria-modal="true" aria-label="Cookie Einstellungen">
        <div className="sb-cookie__backdrop" />
        <div className="sb-cookie__card">
          <div className="sb-cookie__head">
            <div className="sb-cookie__title">Cookies & Datenschutz</div>
            {canClose && (
              <button
                type="button"
                className="sb-cookie__close"
                aria-label="Schließen"
                onClick={() => setOpen(false)}
                disabled={readOnly}
              >
                ×
              </button>
            )}
          </div>

          <div className="sb-cookie__body">
            <p className="sb-p">
              Wir verwenden Cookies, um die Website zuverlässig zu betreiben und – optional – anonymisierte Statistiken zu erfassen.
              Details findest du in der{' '}
              <a href={privacyLink} onClick={(e)=>e.stopPropagation()}>Datenschutzerklärung</a>.
            </p>

            {analytics !== 'none' && (
              <div className="sb-cookie__note" role="status" aria-live="polite">
                Analytics: <strong>{analytics === 'ga4' ? 'Google Analytics 4 (Opt-in)' : 'Matomo (Self-Hosted)'}</strong> — Status:{' '}
                <strong>{analyticsStatus === 'allowed' ? 'aktiv' : analyticsStatus === 'blocked' ? 'inaktiv' : 'ausstehend'}</strong>
              </div>
            )}

            {customize && (
              <div className="sb-cookie__prefs" onClick={(e)=>e.stopPropagation()}>
                <div className="sb-cookie__pref">
                  <div>
                    <div className="sb-cookie__prefTitle">Notwendig</div>
                    <div className="sb-cookie__prefText sb-muted">Immer aktiv (für Grundfunktionen)</div>
                  </div>
                  <input type="checkbox" checked disabled aria-label="Notwendig" />
                </div>

                <div className="sb-cookie__pref">
                  <div>
                    <div className="sb-cookie__prefTitle">Statistik</div>
                    <div className="sb-cookie__prefText sb-muted">Hilft uns, die Website zu verbessern</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!consent.statistics}
                    onChange={(e) => setConsent({ ...consent, statistics: !!e.target.checked })}
                    aria-label="Statistik"
                    disabled={readOnly}
                  />
                </div>

                <div className="sb-cookie__pref">
                  <div>
                    <div className="sb-cookie__prefTitle">Marketing</div>
                    <div className="sb-cookie__prefText sb-muted">Personalisierung & Kampagnen</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!consent.marketing}
                    onChange={(e) => setConsent({ ...consent, marketing: !!e.target.checked })}
                    aria-label="Marketing"
                    disabled={readOnly}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="sb-cookie__actions">
            {!customize ? (
              <>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => setCustomize(true)} disabled={readOnly}>
                  Einstellungen
                </button>
                <button type="button" className="btn btn--sm" onClick={acceptNecessaryOnly} disabled={readOnly}>
                  Nur notwendig
                </button>
                <button type="button" className="btn btn--sm btn--primary" onClick={acceptAll} disabled={readOnly}>
                  Alle akzeptieren
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => setCustomize(false)} disabled={readOnly}>
                  Zurück
                </button>
                <button type="button" className="btn btn--sm btn--primary" onClick={saveCustom} disabled={readOnly}>
                  Speichern
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  SB5.preview.CookieBanner = CookieBanner;
})(window);




