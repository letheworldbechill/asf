/* ============================================
   SMOOTH BUILDER 5.0 - COLOR STACK
   ============================================
   No build step. Exposes: window.SB5.components.ColorStack
   Offline palette extraction via Canvas API (no dependencies).
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.features = SB5.features || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before ColorStack.jsx');

  const { useEffect, useRef, useState, useCallback } = React;

  const LogoUpload = SB5.components.LogoUpload;
  const ColorPalette = SB5.components.ColorPalette;
  const Toast = SB5.components.Toast;

  // ---------- Color math ----------
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function hex2rgb(hex) {
    if (!hex) return null;
    const h = String(hex).trim().replace(/^#/, '');
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b };
    }
    if (h.length !== 6) return null;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }

  function rgb2hex(r, g, b) {
    const to2 = (v) => clamp(v | 0, 0, 255).toString(16).padStart(2, '0');
    return `#${to2(r)}${to2(g)}${to2(b)}`;
  }

  function srgbToLin(c) {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function relLuminance(rgb) {
    const r = srgbToLin(rgb.r);
    const g = srgbToLin(rgb.g);
    const b = srgbToLin(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrastRatio(hexA, hexB) {
    const a = hex2rgb(hexA);
    const b = hex2rgb(hexB);
    if (!a || !b) return 1;
    const L1 = relLuminance(a);
    const L2 = relLuminance(b);
    const hi = Math.max(L1, L2);
    const lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function pickTextOn(bgHex, minRatio) {
    const ratioBlack = contrastRatio('#0f172a', bgHex);
    const ratioWhite = contrastRatio('#ffffff', bgHex);
    if (ratioBlack >= minRatio && ratioBlack >= ratioWhite) return '#0f172a';
    if (ratioWhite >= minRatio) return '#ffffff';
    // fallback: whichever higher
    return ratioBlack >= ratioWhite ? '#0f172a' : '#ffffff';
  }

  function colorDistanceSq(a, b) {
    const ar = a.r - b.r;
    const ag = a.g - b.g;
    const ab = a.b - b.b;
    return ar * ar + ag * ag + ab * ab;
  }

  // ---------- Palette extraction ----------
  async function extractPaletteFromDataUrl(dataUrl, {
    maxSize = 96,
    sampleStride = 1,
    maxCandidates = 48,
    outColors = 8,
    minAlpha = 32
  } = {}) {
    // If a dedicated feature module exists, use it (allows swapping implementations later).
    if (SB5.features && typeof SB5.features.extractPalette === 'function') {
      return await SB5.features.extractPalette(dataUrl);
    }

    const img = new Image();
    img.decoding = 'async';
    img.crossOrigin = 'anonymous';

    const loaded = new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('Logo konnte nicht geladen werden.'));
    });
    img.src = dataUrl;
    await loaded;

    const w0 = img.naturalWidth || img.width || 0;
    const h0 = img.naturalHeight || img.height || 0;
    if (!w0 || !h0) throw new Error('Ungültiges Bild.');

    const scale = Math.min(1, maxSize / Math.max(w0, h0));
    const w = Math.max(1, Math.round(w0 * scale));
    const h = Math.max(1, Math.round(h0 * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas nicht verfügbar.');

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;

    // Quantize to 4-bit per channel histogram: 4096 buckets.
    const hist = new Map();

    for (let i = 0; i < d.length; i += 4 * sampleStride) {
      const a = d[i + 3];
      if (a < minAlpha) continue;

      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];

      // Skip near-white background pixels aggressively (common for logos).
      if (r > 248 && g > 248 && b > 248) continue;

      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      const prev = hist.get(key);
      hist.set(key, prev ? prev + 1 : 1);
    }

    const candidates = Array.from(hist.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxCandidates)
      .map(([key, count]) => {
        const r = ((key >> 8) & 0x0f) * 17;
        const g = ((key >> 4) & 0x0f) * 17;
        const b = (key & 0x0f) * 17;
        return { r, g, b, count, key };
      });

    if (!candidates.length) {
      // fallback if histogram empty (e.g., fully white logo)
      return {
        palette: ['#0f766e', '#f59e0b', '#0f172a', '#64748b'],
        debug: { w, h, candidates: 0 }
      };
    }

    // Greedy diverse picking: start with most frequent, then maximize min distance.
    const picked = [candidates[0]];
    while (picked.length < outColors && picked.length < candidates.length) {
      let best = null;
      let bestScore = -1;

      for (const c of candidates) {
        if (picked.includes(c)) continue;
        let minDist = Infinity;
        for (const p of picked) {
          minDist = Math.min(minDist, colorDistanceSq(c, p));
        }
        // weight by frequency lightly so we don't pick absurd outliers
        const score = minDist * (0.65 + 0.35 * (c.count / candidates[0].count));
        if (score > bestScore) {
          bestScore = score;
          best = c;
        }
      }
      if (!best) break;
      picked.push(best);
    }

    const palette = picked.map(c => rgb2hex(c.r, c.g, c.b));

    return {
      palette,
      debug: { w, h, candidates: candidates.length }
    };
  }

  function buildBrandFromPalette(palette, currentColors) {
    const base = currentColors || {};
    const primary = palette[0] || base.primary || '#0f766e';
    const accent = palette[1] || base.accent || '#f59e0b';

    const background = base.background || '#ffffff';
    const surface = base.surface || '#f8fafc';
    const border = base.border || 'rgba(0,0,0,0.08)';

    // Prefer strong contrast for text on background (WCAG AA for body: 4.5)
    const text = base.text || pickTextOn(background, 4.5);
    // Muted text can be looser; keep readable (>= 3.0)
    const textLight = base.textLight || (pickTextOn(background, 3.0) === '#ffffff' ? 'rgba(255,255,255,0.72)' : '#64748b');

    return {
      primary,
      accent,
      background,
      surface,
      text,
      textLight,
      border
    };
  }

  function ColorStack({
    logo,
    colors,
    onLogoChange,
    onColorsChange,
    autoApply = true
  }) {
    const [palette, setPalette] = useState([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const lastLogoRef = useRef(null);

    const runExtract = useCallback(async (logoDataUrl) => {
      if (!logoDataUrl) return;
      setBusy(true);
      setError(null);

      try {
        const res = await extractPaletteFromDataUrl(logoDataUrl);
        const pal = Array.isArray(res.palette) ? res.palette : [];
        setPalette(pal);

        if (autoApply && typeof onColorsChange === 'function') {
          onColorsChange(buildBrandFromPalette(pal, colors));
        }

        if (Toast && Toast.success) Toast.success('Palette aus Logo extrahiert.');
      } catch (e) {
        const msg = (e && e.message) ? e.message : 'Palette konnte nicht extrahiert werden.';
        setError(msg);
        if (Toast && Toast.error) Toast.error(msg);
      } finally {
        setBusy(false);
      }
    }, [autoApply, onColorsChange, colors]);

    useEffect(() => {
      if (!logo) return;
      if (logo === lastLogoRef.current) return;
      lastLogoRef.current = logo;
      runExtract(logo);
    }, [logo, runExtract]);

    const handleUpload = useCallback((dataUrl) => {
      if (typeof onLogoChange === 'function') onLogoChange(dataUrl);
      // extraction runs via effect
    }, [onLogoChange]);

    const handleApplyAll = useCallback(() => {
      if (!palette.length) return;
      if (typeof onColorsChange === 'function') onColorsChange(buildBrandFromPalette(palette, colors));
      if (Toast && Toast.success) Toast.success('Palette übernommen.');
    }, [palette, onColorsChange, colors]);

    const handleAssign = useCallback((key, hex) => {
      if (!hex) return;
      if (typeof onColorsChange !== 'function') return;
      const next = { ...(colors || {}) };
      next[key] = hex;
      // keep text contrast sane if background changes
      if (key === 'background') {
        next.text = pickTextOn(next.background, 4.5);
        next.textLight = pickTextOn(next.background, 3.0) === '#ffffff' ? 'rgba(255,255,255,0.72)' : '#64748b';
      }
      onColorsChange(next);
    }, [onColorsChange, colors]);

    return (
      <div className="color-stack">
        <div className="color-stack__header">
          <div className="color-stack__title">Color Stack</div>
          <div className="color-stack__subtitle">Logo → Palette → Tokens</div>
        </div>

        {LogoUpload ? (
          <LogoUpload
            value={logo}
            onChange={handleUpload}
            onRemove={() => {
              if (typeof onLogoChange === 'function') onLogoChange(null);
              setPalette([]);
              setError(null);
            }}
            disabled={busy}
          />
        ) : (
          <div className="color-stack__error">
            LogoUpload fehlt (js/components/LogoUpload.jsx).
          </div>
        )}

        <div className="color-stack__panel">
          <div className="color-stack__panelHeader">
            <div className="color-stack__panelTitle">Extrahierte Palette</div>
            <div className="color-stack__panelActions">
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => logo && runExtract(logo)}
                disabled={!logo || busy}
              >
                {busy ? 'Analysiere…' : 'Neu extrahieren'}
              </button>

              <button
                type="button"
                className="btn btn--sm btn--primary"
                onClick={handleApplyAll}
                disabled={!palette.length}
              >
                Übernehmen
              </button>
            </div>
          </div>

          {error && (
            <div className="color-stack__message color-stack__message--error" role="alert">
              {error}
            </div>
          )}

          {!palette.length && (
            <div className="color-stack__message" role="status" aria-live="polite">
              Lade ein Logo hoch, um automatisch eine Farbpalette zu generieren.
            </div>
          )}

          {!!palette.length && (
            <div className="color-stack__swatches" role="list" aria-label="Palette">
              {palette.slice(0, 10).map((hex) => (
                <div key={hex} className="color-stack__swatch" role="listitem">
                  <button
                    type="button"
                    className="color-stack__swatchChip"
                    style={{ background: hex }}
                    aria-label={`Farbe ${hex}`}
                    title={hex}
                    onClick={() => handleAssign('primary', hex)}
                  />
                  <div className="color-stack__swatchMeta">
                    <div className="color-stack__swatchHex">{hex}</div>
                    <div className="color-stack__swatchActions">
                      <button type="button" className="btn btn--xs" onClick={() => handleAssign('primary', hex)}>
                        Primary
                      </button>
                      <button type="button" className="btn btn--xs" onClick={() => handleAssign('accent', hex)}>
                        Accent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {ColorPalette && (
          <div className="color-stack__panel">
            <div className="color-stack__panelHeader">
              <div className="color-stack__panelTitle">Brand Tokens</div>
            </div>
            <ColorPalette
              colors={colors}
              onChange={onColorsChange}
            />
          </div>
        )}
      </div>
    );
  }

  // Export small helpers for other modules (optional)
  SB5.features.colorMath = SB5.features.colorMath || {
    contrastRatio,
    pickTextOn
  };

  SB5.components.ColorStack = ColorStack;
})(window);



