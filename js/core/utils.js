/* ============================================
   SMOOTH BUILDER 5.0 - CORE UTILS
   ============================================
   No build step. Exposes: window.SB5.core.utils
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.core = SB5.core || {};

  const hasCrypto = typeof global.crypto !== 'undefined' && typeof global.crypto.getRandomValues === 'function';

  function noop() {}

  function isObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }

  function clamp(n, min, max) {
    const x = Number(n);
    return Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : min;
  }

  function deepMerge(target, source) {
    const out = Array.isArray(target) ? target.slice() : { ...(target || {}) };
    if (!source) return out;

    for (const key of Object.keys(source)) {
      const s = source[key];
      const t = out[key];

      if (isObject(t) && isObject(s)) {
        out[key] = deepMerge(t, s);
      } else {
        // Arrays are replaced (not merged) to avoid surprising behavior
        out[key] = Array.isArray(s) ? s.slice() : s;
      }
    }
    return out;
  }

  function deepClone(value) {
    // Prefer structuredClone when available (faster, safer)
    try {
      if (typeof global.structuredClone === 'function') return global.structuredClone(value);
    } catch (_) {}
    return JSON.parse(JSON.stringify(value));
  }

  function safeJsonParse(str, fallback = null) {
    try {
      if (typeof str !== 'string') return fallback;
      return JSON.parse(str);
    } catch (_) {
      return fallback;
    }
  }

  function stableStringify(obj) {
    // Deterministic JSON for hashing/comparisons
    const seen = new WeakSet();
    return JSON.stringify(obj, function (k, v) {
      if (isObject(v)) {
        if (seen.has(v)) return;
        seen.add(v);
        return Object.keys(v).sort().reduce((acc, key) => {
          acc[key] = v[key];
          return acc;
        }, {});
      }
      return v;
    });
  }

  function isEqual(a, b) {
    // Fast path for referential equality
    if (a === b) return true;
    // Deterministic stringify to reduce false positives when key order changes
    return stableStringify(a) === stableStringify(b);
  }

  function uid(prefix = '') {
    // RFC4122-ish (not strictly UUID v4), good enough for local IDs
    if (hasCrypto) {
      const bytes = new Uint8Array(16);
      global.crypto.getRandomValues(bytes);
      // Set version/variant bits
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      const id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      return prefix ? `${prefix}-${id}` : id;
    }
    // Fallback
    return (prefix ? prefix + '-' : '') + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function slugify(input = '') {
    return String(input)
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function debounce(fn, wait = 200) {
    let t = null;
    let lastArgs = null;
    let lastThis = null;

    function debounced(...args) {
      lastArgs = args;
      lastThis = this;
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        t = null;
        fn.apply(lastThis, lastArgs);
      }, wait);
    }

    debounced.cancel = () => {
      if (t) clearTimeout(t);
      t = null;
      lastArgs = null;
      lastThis = null;
    };

    debounced.flush = () => {
      if (!t) return;
      clearTimeout(t);
      t = null;
      fn.apply(lastThis, lastArgs);
    };

    return debounced;
  }

  function throttle(fn, limit = 100) {
    let inThrottle = false;
    let queued = null;
    let lastThis = null;

    function run() {
      if (!queued) return;
      const { args } = queued;
      queued = null;
      fn.apply(lastThis, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        run();
      }, limit);
    }

    return function throttled(...args) {
      lastThis = this;
      if (!inThrottle) {
        fn.apply(lastThis, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
          run();
        }, limit);
      } else {
        queued = { args };
      }
    };
  }

  function getByPath(obj, path, fallback) {
    if (!obj) return fallback;
    const parts = Array.isArray(path) ? path : String(path).split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return fallback;
      cur = cur[p];
    }
    return cur === undefined ? fallback : cur;
  }

  function setByPath(obj, path, value) {
    const parts = Array.isArray(path) ? path : String(path).split('.');
    const out = Array.isArray(obj) ? obj.slice() : { ...(obj || {}) };
    let cur = out;
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      const isLast = i === parts.length - 1;
      const next = cur[key];

      if (isLast) {
        cur[key] = value;
      } else {
        const nextObj = isObject(next) ? { ...next } : {};
        cur[key] = nextObj;
        cur = nextObj;
      }
    }
    return out;
  }

  function pick(obj, keys) {
    const out = {};
    for (const k of keys) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
    }
    return out;
  }

  function omit(obj, keys) {
    const out = { ...(obj || {}) };
    for (const k of keys) delete out[k];
    return out;
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = () => reject(r.error || new Error('FileReader failed'));
      r.readAsDataURL(file);
    });
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = () => reject(r.error || new Error('FileReader failed'));
      r.readAsText(file);
    });
  }

  function downloadBlob(blob, filename) {
    // Prefer FileSaver if available (used elsewhere in project)
    if (global.saveAs && typeof global.saveAs === 'function') {
      global.saveAs(blob, filename);
      return;
    }
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  function downloadText(text, filename, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([text], { type: mime });
    downloadBlob(blob, filename);
  }

  function normalizeHex(hex) {
    let h = String(hex || '').trim();
    if (!h) return null;
    if (h[0] !== '#') h = '#' + h;
    if (h.length === 4) {
      // #rgb -> #rrggbb
      h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(h)) return null;
    return h.toLowerCase();
  }

  function hexToRgb(hex) {
    const h = normalizeHex(hex);
    if (!h) return null;
    const int = parseInt(h.slice(1), 16);
    return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
  }

  function luminance({ r, g, b }) {
    // WCAG relative luminance
    const srgb = [r, g, b].map(v => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  function contrastRatio(fgHex, bgHex) {
    const fg = hexToRgb(fgHex);
    const bg = hexToRgb(bgHex);
    if (!fg || !bg) return null;
    const L1 = luminance(fg);
    const L2 = luminance(bg);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function prefersReducedMotion() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  }

  function isMac() {
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || '');
  }

  function formatBytes(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
    const v = n / Math.pow(1024, i);
    return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  }

  SB5.core.utils = {
    noop,
    isObject,
    clamp,
    deepMerge,
    deepClone,
    safeJsonParse,
    stableStringify,
    isEqual,
    uid,
    slugify,
    escapeHtml,
    debounce,
    throttle,
    getByPath,
    setByPath,
    pick,
    omit,
    readFileAsDataURL,
    readFileAsText,
    downloadBlob,
    downloadText,
    normalizeHex,
    hexToRgb,
    contrastRatio,
    prefersReducedMotion,
    isMac,
    formatBytes
  };
})(window);



