/* ============================================
   SMOOTH BUILDER 5.0 - GENERATOR: LEGAL
   ============================================
   No build step. Exposes:
   - window.SB5.generators.generatePrivacyPage(state, opts)
   - window.SB5.generators.generateImpressum(state, opts)
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.generators = SB5.generators || {};

  function safeObj(x){ return x && typeof x === 'object' ? x : {}; }
  function esc(s){
    return String(s ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function wrapPage(title, bodyHtml, lang = 'de') {
    return `<!doctype html>
<html lang="${esc(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="styles.css">
  <script src="main.js" defer></script>
</head>
<body>
  <div class="sb-site">
    <section class="sb-section">
      <div class="sb-container">
        <div class="sb-sectionHead">
          <h1 class="sb-hero__title" style="font-size:clamp(28px,3vw,44px);margin:0">${esc(title)}</h1>
        </div>
        <div class="sb-legal">
          ${bodyHtml}
        </div>
      </div>
    </section>
  </div>
  <div id="sb-cookie-root"></div>
</body>
</html>`;
  }

  function generatePrivacyBody(state) {
    const st = safeObj(state);
    const settings = safeObj(st.settings);
    const consent = safeObj(settings.consent);

    const site = esc(settings.siteName || 'Meine Website');
    const analytics = consent.analytics || 'none';

    const analyticsText = analytics === 'none'
      ? `<p class="sb-p">Wir verwenden keine Analyse- oder Tracking-Tools, die personenbezogene Daten zu Statistikzwecken auswerten.</p>`
      : analytics === 'ga4'
        ? `<p class="sb-p">Wenn du zustimmst, verwenden wir Google Analytics 4 (Opt-in) zur anonymisierten Reichweitenmessung. Ohne deine Zustimmung wird GA4 nicht geladen.</p>`
        : `<p class="sb-p">Wenn du zustimmst, verwenden wir Matomo (Self-Hosted) zur anonymisierten Reichweitenmessung. Ohne deine Zustimmung wird Matomo nicht geladen.</p>`;

    return `
      <h2 class="sb-h2">1. Verantwortliche Stelle</h2>
      <p class="sb-p">Diese Datenschutzerklärung informiert dich darüber, wie ${site} Personendaten verarbeitet. Die verantwortliche Stelle ist der Betreiber der Website.</p>

      <h2 class="sb-h2">2. Welche Daten wir verarbeiten</h2>
      <ul>
        <li>Server-Logdaten (z. B. IP-Adresse, Zeitpunkt, angeforderte Ressource, User-Agent) zur Sicherstellung des Betriebs.</li>
        <li>Cookies/LocalStorage-Einträge für deine Einwilligungspräferenzen (Consent).</li>
        <li>Optional: Statistikdaten, wenn du dem zustimmst (siehe Abschnitt 4).</li>
      </ul>

      <h2 class="sb-h2">3. Cookies & Einwilligung</h2>
      <p class="sb-p">Wir nutzen ein Einwilligungsbanner. Notwendige Cookies/Storage sind immer aktiv. Statistik/Marketing werden nur aktiviert, wenn du zustimmst.</p>
      <p class="sb-p">Du kannst deine Auswahl jederzeit anpassen, indem du die Seite neu lädst und im Cookie-Banner deine Entscheidung änderst (sofern angezeigt).</p>

      <h2 class="sb-h2">4. Statistik / Analytics</h2>
      ${analyticsText}

      <h2 class="sb-h2">5. Weitergabe an Dritte</h2>
      <p class="sb-p">Wir geben Personendaten nicht an Dritte weiter, außer wenn dies zur Bereitstellung der Website erforderlich ist (z. B. Hosting) oder eine gesetzliche Pflicht besteht.</p>

      <h2 class="sb-h2">6. Deine Rechte</h2>
      <p class="sb-p">Du hast im Rahmen des anwendbaren Rechts insbesondere das Recht auf Auskunft, Berichtigung, Löschung sowie Widerspruch gegen bestimmte Verarbeitungen.</p>

      <h2 class="sb-h2">7. Kontakt</h2>
      <p class="sb-p">Für Datenschutzanfragen kontaktiere bitte den Betreiber dieser Website.</p>

      <p class="sb-muted" style="margin-top:18px;font-size:13px">Stand: ${esc(new Date().toISOString().slice(0,10))}</p>
    `;
  }

  function generateImpressumBody(state) {
    const st = safeObj(state);
    const settings = safeObj(st.settings);
    const site = esc(settings.siteName || 'Meine Website');

    return `
      <h2 class="sb-h2">Betreiber</h2>
      <p class="sb-p"><strong>${site}</strong></p>

      <h2 class="sb-h2">Kontakt</h2>
      <p class="sb-p">E-Mail: <a href="mailto:hello@example.com">hello@example.com</a></p>

      <h2 class="sb-h2">Haftungsausschluss</h2>
      <p class="sb-p">Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>

      <h2 class="sb-h2">Urheberrecht</h2>
      <p class="sb-p">Die Inhalte und Werke auf dieser Website unterliegen dem Urheberrecht. Die Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.</p>

      <p class="sb-muted" style="margin-top:18px;font-size:13px">Stand: ${esc(new Date().toISOString().slice(0,10))}</p>
    `;
  }

  function generatePrivacyPage(state, opts = {}) {
    const st = safeObj(state);
    const settings = safeObj(st.settings);
    const lang = settings.language || 'de';
    return wrapPage('Datenschutzerklärung', generatePrivacyBody(st), lang);
  }

  function generateImpressum(state, opts = {}) {
    const st = safeObj(state);
    const settings = safeObj(st.settings);
    const lang = settings.language || 'de';
    return wrapPage('Impressum', generateImpressumBody(st), lang);
  }

  SB5.generators.generatePrivacyPage = generatePrivacyPage;
  SB5.generators.generateImpressum = generateImpressum;
})(window);




