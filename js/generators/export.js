/* ============================================
   SMOOTH BUILDER 5.0 - EXPORT
   ============================================
   No build step. Exposes:
   - window.SB5.exporters.exportPreviewHTML(state)
   - window.SB5.exporters.exportProductionZip(state)
   - window.SB5.exporters.exportJSON(state)
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.exporters = SB5.exporters || {};
  SB5.generators = SB5.generators || {};
  SB5.core = SB5.core || {};

  const utils = SB5.core.utils || {};

  function safeObj(x){ return x && typeof x === 'object' ? x : {}; }
  function safeStr(x, fallback=''){ return (x === null || x === undefined) ? fallback : String(x); }

  function filenameSafe(name) {
    const n = safeStr(name, 'website').trim().toLowerCase();
    return (n || 'website')
      .replace(/[\s]+/g, '-')
      .replace(/[^a-z0-9\-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'website';
  }

  function blobFromText(text, type) {
    return new Blob([text], { type: type || 'text/plain;charset=utf-8' });
  }

  function saveFile(name, blob) {
    if (typeof global.saveAs === 'function') {
      global.saveAs(blob, name);
      return;
    }
    // fallback: create a link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 50);
  }

  function dataUrlToBytes(dataUrl) {
    const m = /^data:([^;]+);base64,(.*)$/i.exec(dataUrl || '');
    if (!m) return null;
    const mime = m[1];
    const b64 = m[2];
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { mime, bytes };
  }

  function guessExt(mime) {
    if (!mime) return 'bin';
    if (mime.includes('png')) return 'png';
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
    if (mime.includes('webp')) return 'webp';
    if (mime.includes('gif')) return 'gif';
    if (mime.includes('svg')) return 'svg';
    return 'bin';
  }

  function collectDataUrls(state) {
    const st = safeObj(state);
    const out = new Set();

    // brand logo
    const logo = safeObj(st.brand).logo;
    if (typeof logo === 'string' && logo.startsWith('data:')) out.add(logo);

    // content images
    const content = safeObj(st.content);
    Object.keys(content).forEach(sectionId => {
      const c = content[sectionId];
      if (!c || typeof c !== 'object') return;

      // common image fields
      Object.keys(c).forEach(k => {
        const v = c[k];
        if (typeof v === 'string' && v.startsWith('data:image/')) out.add(v);
      });

      // lists
      ['services','benefits','members','items','nav','links'].forEach(listKey => {
        const arr = c[listKey];
        if (!Array.isArray(arr)) return;
        arr.forEach(it => {
          if (!it || typeof it !== 'object') return;
          Object.keys(it).forEach(ik => {
            const v = it[ik];
            if (typeof v === 'string' && v.startsWith('data:image/')) out.add(v);
          });
        });
      });

      // custom elements
      const els = c.elements;
      if (Array.isArray(els)) {
        els.forEach(el => {
          const ec = el && el.content;
          if (!ec || typeof ec !== 'object') return;
          Object.keys(ec).forEach(k => {
            const v = ec[k];
            if (typeof v === 'string' && v.startsWith('data:image/')) out.add(v);
          });
        });
      }
    });

    return Array.from(out);
  }

  function replaceDataUrls(obj, map) {
    // Deep clone + replace strings in objects/arrays
    if (typeof obj === 'string') {
      return map[obj] || obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(x => replaceDataUrls(x, map));
    }
    if (obj && typeof obj === 'object') {
      const out = {};
      Object.keys(obj).forEach(k => out[k] = replaceDataUrls(obj[k], map));
      return out;
    }
    return obj;
  }

  async function exportPreviewHTML(state) {
    const st = safeObj(state);
    const styles = SB5.generators.generateStylesCSS(st);
    const main = SB5.generators.generateMainJS(st);

    const html = SB5.generators.generateHTML(st, {
      mode: 'preview',
      inlineCss: styles,
      inlineJs: main
    });

    const name = `${filenameSafe(safeObj(st.settings).siteName)}-preview.html`;
    saveFile(name, blobFromText(html, 'text/html;charset=utf-8'));
  }

  async function exportProductionZip(state) {
    if (!global.JSZip) throw new Error('JSZip fehlt. Lade JSZip via CDN.');
    const st = safeObj(state);

    const siteName = safeObj(st.settings).siteName || 'Meine Website';
    const base = filenameSafe(siteName);

    const zip = new global.JSZip();

    // 1) Extract data URLs into /assets and replace references
    const dataUrls = collectDataUrls(st);
    const map = {}; // dataUrl -> assets/path
    let idx = 1;

    for (const du of dataUrls) {
      const parsed = dataUrlToBytes(du);
      if (!parsed) continue;
      const ext = guessExt(parsed.mime);
      const fname = `assets/img-${idx}.${ext}`;
      idx += 1;
      map[du] = fname;
      zip.file(fname, parsed.bytes, { binary: true });
    }

    const stRewritten = replaceDataUrls(st, map);

    // 2) Build files
    const styles = SB5.generators.generateStylesCSS(stRewritten);
    const main = SB5.generators.generateMainJS(stRewritten);

    const html = SB5.generators.generateHTML(stRewritten, {
      mode: 'production',
      cssHref: 'styles.css',
      jsSrc: 'main.js'
    });

    // Optional legal pages
    const privacy = (typeof SB5.generators.generatePrivacyPage === 'function')
      ? SB5.generators.generatePrivacyPage(stRewritten)
      : null;
    const impressum = (typeof SB5.generators.generateImpressum === 'function')
      ? SB5.generators.generateImpressum(stRewritten)
      : null;

    zip.file('index.html', html);
    zip.file('styles.css', styles);
    zip.file('main.js', main);
    if (privacy) zip.file('privacy.html', privacy);
    if (impressum) zip.file('impressum.html', impressum);

    // 3) JSON backup inside ZIP (nice for restore)
    zip.file('backup.json', JSON.stringify(st, null, 2));

    // 4) Generate zip
    const blob = await zip.generateAsync({ type: 'blob' });
    saveFile(`${base}.zip`, blob);
  }

  async function exportJSON(state) {
    const st = safeObj(state);
    const siteName = safeObj(st.settings).siteName || 'Meine Website';
    const name = `${filenameSafe(siteName)}.json`;
    saveFile(name, blobFromText(JSON.stringify(st, null, 2), 'application/json;charset=utf-8'));
  }

  SB5.exporters.exportPreviewHTML = exportPreviewHTML;
  SB5.exporters.exportProductionZip = exportProductionZip;
  SB5.exporters.exportJSON = exportJSON;
})(window);



