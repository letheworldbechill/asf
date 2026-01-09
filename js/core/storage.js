/* ============================================
   SMOOTH BUILDER 5.0 - STORAGE (LOCALSTORAGE)
   ============================================
   No build step. Exposes: window.SB5.core.storage
   Includes migration from Smooth Builder Pro v3.7 keys.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.core = SB5.core || {};

  const utils = SB5.core.utils || {};

  const STORAGE_KEY = 'sb5_state_v5';
  const STORAGE_META_KEY = 'sb5_state_v5_meta';
  const LEGACY_PREFIX = 'smooth_builder_';

  function isAvailable() {
    try {
      const k = '__sb5_storage_test__';
      global.localStorage.setItem(k, '1');
      global.localStorage.removeItem(k);
      return true;
    } catch (_) {
      return false;
    }
  }

  function _safeGet(key) {
    try {
      return global.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function _safeSet(key, value) {
    try {
      global.localStorage.setItem(key, value);
      return true;
    } catch (_) {
      return false;
    }
  }

  function _safeRemove(key) {
    try {
      global.localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  function loadRaw() {
    if (!isAvailable()) return null;
    const serialized = _safeGet(STORAGE_KEY);
    if (!serialized) return null;
    return (utils.safeJsonParse ? utils.safeJsonParse(serialized, null) : JSON.parse(serialized));
  }

  function saveRaw(stateEnvelope) {
    if (!isAvailable()) return false;
    const serialized = JSON.stringify(stateEnvelope);
    const ok = _safeSet(STORAGE_KEY, serialized);
    if (ok) {
      _safeSet(STORAGE_META_KEY, JSON.stringify({ savedAt: Date.now(), version: stateEnvelope.version || 5 }));
    }
    return ok;
  }

  function remove() {
    _safeRemove(STORAGE_KEY);
    _safeRemove(STORAGE_META_KEY);
  }

  function clearAll() {
    if (!isAvailable()) return false;
    try {
      const toRemove = [];
      for (let i = 0; i < global.localStorage.length; i++) {
        const key = global.localStorage.key(i);
        if (!key) continue;
        if (key === STORAGE_KEY || key === STORAGE_META_KEY || key.startsWith(LEGACY_PREFIX)) {
          toRemove.push(key);
        }
      }
      toRemove.forEach(k => global.localStorage.removeItem(k));
      return true;
    } catch (_) {
      return false;
    }
  }

  function getMeta() {
    const raw = _safeGet(STORAGE_META_KEY);
    const meta = raw ? (utils.safeJsonParse ? utils.safeJsonParse(raw, {}) : JSON.parse(raw)) : {};
    return meta || {};
  }

  function serializeState(state, options = {}) {
    // Persist everything except ephemeral UI selections (keep toggles for convenience)
    const out = utils.deepClone ? utils.deepClone(state) : JSON.parse(JSON.stringify(state));
    if (out && out.ui) {
      out.ui.activeSection = null;
      // optional: keep sidebarTab and grid toggles
    }
    if (options.stripRuntime === true) {
      delete out.__runtime;
    }
    return out;
  }

  function saveState(state, options = {}) {
    const version = 5;
    const env = {
      version,
      savedAt: Date.now(),
      state: serializeState(state, options)
    };
    return saveRaw(env);
  }

  function loadState() {
    // New format first
    const env = loadRaw();
    if (env && env.state) {
      return env.state;
    }

    // Migration path from legacy (SB Pro v3.7)
    const migrated = migrateLegacy();
    if (migrated) return migrated;

    return null;
  }

  function migrateLegacy() {
    if (!isAvailable()) return null;

    // Legacy keys from original index.html:
    // smooth_builder_builderTheme, smooth_builder_components, smooth_builder_order, smooth_builder_settings
    const builderTheme = _safeGet(LEGACY_PREFIX + 'builderTheme');
    const componentsRaw = _safeGet(LEGACY_PREFIX + 'components');
    const orderRaw = _safeGet(LEGACY_PREFIX + 'order');
    const settingsRaw = _safeGet(LEGACY_PREFIX + 'settings');

    const components = componentsRaw ? (utils.safeJsonParse ? utils.safeJsonParse(componentsRaw, null) : JSON.parse(componentsRaw)) : null;
    const order = orderRaw ? (utils.safeJsonParse ? utils.safeJsonParse(orderRaw, null) : JSON.parse(orderRaw)) : null;
    const settings = settingsRaw ? (utils.safeJsonParse ? utils.safeJsonParse(settingsRaw, null) : JSON.parse(settingsRaw)) : null;

    if (!components && !order && !settings && !builderTheme) return null;

    // Map legacy component-order model to Canvas-first layout.
    // Each legacy type becomes one section instance (type-1).
    const sections = [];
    const orderIds = [];
    const spacing = {};
    const content = {};

    const normalizeType = (t) => {
      if (t === 'trust') return 'trustbar';
      if (t === 'stickyCta') return 'cta';
      return t;
    };

    const uniqueId = (type, n) => `${type}-${n}`;

    const legacyOrder = Array.isArray(order) ? order : Object.keys(components || {});

    const counters = {};
    for (const legacyType of legacyOrder) {
      const type = normalizeType(legacyType);
      counters[type] = (counters[type] || 0) + 1;
      const id = uniqueId(type, counters[type]);

      const comp = components && components[legacyType] ? components[legacyType] : null;
      const enabled = comp ? !!comp.enabled : true;

      sections.push({ id, type, variant: 'default', enabled });
      orderIds.push(id);

      // Default spacing similar to previous layout density (balanced)
      spacing[id] = { pt: 64, pb: 64 };

      if (comp && comp.data && typeof comp.data === 'object') {
        content[id] = utils.deepClone ? utils.deepClone(comp.data) : JSON.parse(JSON.stringify(comp.data));
      }
    }

    const brand = {
      logo: null,
      colors: {
        primary: (settings && settings.primaryColor) ? settings.primaryColor : '#0f766e',
        accent: (settings && settings.accentColor) ? settings.accentColor : '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
        textLight: '#64748b',
        border: 'rgba(0,0,0,0.08)'
      },
      font: (settings && settings.fontStack) ? settings.fontStack : 'system',
      radius: 'rounded'
    };

    const next = {
      mode: 'structure',
      layout: { sections, order: orderIds, spacing },
      brand,
      content,
      settings: {
        siteName: (settings && settings.siteName) || 'Meine Website',
        siteDescription: (settings && settings.siteDescription) || '',
        favicon: '🏠',
        language: 'de',
        consent: {
          enabled: true,
          analytics: 'none',
          privacyLink: '/datenschutz'
        },
        features: {
          darkModeToggle: !!(settings && settings.darkModeToggle),
          stickyHeader: true,
          smoothScroll: true
        }
      },
      ui: {
        activeSection: null,
        showGrid: true,
        show8pxRaster: false,
        sidebarTab: 'sections',
        builderTheme: (builderTheme ? (utils.safeJsonParse ? utils.safeJsonParse(builderTheme, 'light') : builderTheme) : 'light') || 'light'
      }
    };

    // Persist migrated state immediately (best effort)
    try { saveState(next); } catch (_) {}

    return next;
  }

  function createDebouncedSaver(options = {}) {
    const wait = Number(options.wait || 500);
    const stripRuntime = !!options.stripRuntime;

    const debounced = (utils.debounce ? utils.debounce((state) => {
      saveState(state, { stripRuntime });
    }, wait) : null);

    const api = {
      save(state) {
        if (!debounced) return saveState(state, { stripRuntime });
        debounced(state);
        return true;
      },
      flush() {
        if (debounced && debounced.flush) debounced.flush();
      },
      cancel() {
        if (debounced && debounced.cancel) debounced.cancel();
      }
    };

    return api;
  }

  SB5.core.storage = {
    STORAGE_KEY,
    LEGACY_PREFIX,
    isAvailable,
    getMeta,
    loadState,
    saveState,
    serializeState,
    remove,
    clearAll,
    createDebouncedSaver
  };
})(window);



