/* ============================================
   SMOOTH BUILDER 5.0 - APP STATE (STORE + REDUCER)
   ============================================
   No build step. Exposes: window.SB5.core.state
   Implements a small external store (useSyncExternalStore-ready)
   with reducer-style actions, history, and storage persistence.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.core = SB5.core || {};

  const utils = SB5.core.utils;
  const storage = SB5.core.storage;
  const HistoryManager = SB5.core.history && SB5.core.history.HistoryManager;

  if (!utils) {
    throw new Error('SB5.core.utils missing. Load js/core/utils.js before state.js');
  }

  const MODES = ['structure', 'design', 'export'];

  const initialState = {
    // Mode system
    mode: 'structure',

    // Structure
    layout: {
      sections: [],
      order: [],
      spacing: {}
    },

    // Design
    brand: {
      logo: null, // Base64 (data URL) or URL
      colors: {
        primary: '#0f766e',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
        textLight: '#64748b',
        border: 'rgba(0,0,0,0.08)'
      },
      font: 'inter',   // 'inter' | 'system' | 'serif' | 'mono' | ...
      radius: 'rounded' // 'sharp' | 'rounded' | 'pill'
    },

    // Content per section instance id
    content: {},

    // Export settings
    settings: {
      siteName: 'Meine Website',
      siteDescription: '',
      favicon: '🏠',
      language: 'de',
      consent: {
        enabled: true,
        analytics: 'none', // 'none' | 'ga4' | 'matomo'
        privacyLink: '/datenschutz',
        categories: {
          necessary: true,
          statistics: false,
          marketing: false
        }
      },
      features: {
        darkModeToggle: false,
        stickyHeader: true,
        smoothScroll: true
      }
    },

    // UI state (builder-only)
    ui: {
      activeSection: null,
      activeElementPath: null, // design direct edit: e.g. "hero-1.headline"
      showGrid: true,
      show8pxRaster: false,
      sidebarTab: 'sections',
      builderTheme: 'light'
    }
  };

  const ActionTypes = {
    // Mode
    SET_MODE: 'SET_MODE',

    // Layout / structure
    ADD_SECTION: 'ADD_SECTION',
    ADD_SECTIONS_BULK: 'ADD_SECTIONS_BULK',
    REMOVE_SECTION: 'REMOVE_SECTION',
    TOGGLE_SECTION: 'TOGGLE_SECTION',
    SELECT_SECTION: 'SELECT_SECTION',
    UPDATE_SECTION: 'UPDATE_SECTION',
    UPDATE_SECTION_VARIANT: 'UPDATE_SECTION_VARIANT',
    REORDER: 'REORDER',
    MOVE_SECTION: 'MOVE_SECTION',
    UPDATE_SPACING: 'UPDATE_SPACING',
    APPLY_SPACING_PRESET: 'APPLY_SPACING_PRESET',

    // Brand
    SET_LOGO: 'SET_LOGO',
    SET_COLORS: 'SET_COLORS',
    SET_FONT: 'SET_FONT',
    SET_RADIUS: 'SET_RADIUS',

    // Content
    UPDATE_CONTENT: 'UPDATE_CONTENT',
    REPLACE_CONTENT: 'REPLACE_CONTENT',
    REMOVE_CONTENT: 'REMOVE_CONTENT',

    // Settings
    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
    UPDATE_CONSENT: 'UPDATE_CONSENT',
    UPDATE_FEATURES: 'UPDATE_FEATURES',

    // UI
    TOGGLE_GRID: 'TOGGLE_GRID',
    TOGGLE_8PX: 'TOGGLE_8PX',
    SET_SIDEBAR_TAB: 'SET_SIDEBAR_TAB',
    SET_BUILDER_THEME: 'SET_BUILDER_THEME',
    SET_ACTIVE_ELEMENT_PATH: 'SET_ACTIVE_ELEMENT_PATH',

    // Data lifecycle
    LOAD_STATE: 'LOAD_STATE',
    RESET_PROJECT: 'RESET_PROJECT',

    // History
    UNDO: 'UNDO',
    REDO: 'REDO'
  };

  const SPACING_PRESETS = {
    compact: { pt: 32, pb: 32 },
    balanced: { pt: 64, pb: 64 },
    spacious: { pt: 96, pb: 96 },
    hero: { pt: 80, pb: 120 }
  };

  function normalizeMode(mode) {
    return MODES.includes(mode) ? mode : 'structure';
  }

  function normalizeSectionType(type) {
    // Backward compatibility aliases
    if (type === 'trust') return 'trustbar';
    return String(type || '').trim().toLowerCase();
  }

  function nextSectionId(state, type) {
    const t = normalizeSectionType(type);
    const nums = state.layout.sections
      .filter(s => s.type === t)
      .map(s => {
        const m = String(s.id).match(/-(\d+)$/);
        return m ? Number(m[1]) : 0;
      });
    const n = nums.length ? Math.max(...nums) + 1 : 1;
    return `${t}-${n}`;
  }

  function ensureOrderConsistency(layout) {
    const ids = new Set(layout.sections.map(s => s.id));
    const order = Array.isArray(layout.order) ? layout.order.filter(id => ids.has(id)) : [];
    // Append missing sections (if any)
    for (const s of layout.sections) {
      if (!order.includes(s.id)) order.push(s.id);
    }
    return { ...layout, order };
  }

  function reducer(state, action) {
    const type = action && action.type ? action.type : null;
    const payload = action ? action.payload : undefined;

    switch (type) {
      case ActionTypes.SET_MODE: {
        const mode = normalizeMode(payload);
        return { ...state, mode };
      }

      case ActionTypes.LOAD_STATE: {
        // payload should be a full state object
        if (!payload || typeof payload !== 'object') return state;
        // Merge with initialState to ensure new fields exist
        const merged = utils.deepMerge(initialState, payload);
        // Ensure layout order is consistent with sections
        merged.layout = ensureOrderConsistency(merged.layout);
        return merged;
      }

      case ActionTypes.RESET_PROJECT: {
        // Keep builder theme preference by default
        const keepTheme = state.ui && state.ui.builderTheme ? state.ui.builderTheme : initialState.ui.builderTheme;
        const next = utils.deepClone(initialState);
        next.ui.builderTheme = keepTheme;
        return next;
      }

      case ActionTypes.ADD_SECTION: {
        const sectionType = normalizeSectionType(payload && payload.type ? payload.type : payload);
        if (!sectionType) return state;

        const id = (payload && payload.id) ? String(payload.id) : nextSectionId(state, sectionType);
        const variant = (payload && payload.variant) ? String(payload.variant) : 'default';
        const enabled = payload && typeof payload.enabled === 'boolean' ? payload.enabled : true;

        const newSection = { id, type: sectionType, variant, enabled };
        const sections = state.layout.sections.concat([newSection]);
        const order = state.layout.order.concat([id]);

        const spacing = { ...state.layout.spacing };
        spacing[id] = spacing[id] || { pt: 64, pb: 64 };

        const ui = { ...state.ui, activeSection: id };

        return {
          ...state,
          layout: ensureOrderConsistency({ ...state.layout, sections, order, spacing }),
          ui
        };
      }

      case ActionTypes.ADD_SECTIONS_BULK: {
        const items = Array.isArray(payload) ? payload : [];
        let next = state;
        for (const item of items) {
          next = reducer(next, { type: ActionTypes.ADD_SECTION, payload: item });
        }
        return next;
      }

      case ActionTypes.REMOVE_SECTION: {
        const id = String(payload && payload.id ? payload.id : payload);
        if (!id) return state;

        const sections = state.layout.sections.filter(s => s.id !== id);
        const order = state.layout.order.filter(x => x !== id);

        const spacing = { ...state.layout.spacing };
        delete spacing[id];

        const content = { ...state.content };
        delete content[id];

        const activeSection = state.ui.activeSection === id ? null : state.ui.activeSection;

        return {
          ...state,
          layout: ensureOrderConsistency({ ...state.layout, sections, order, spacing }),
          content,
          ui: { ...state.ui, activeSection }
        };
      }

      case ActionTypes.TOGGLE_SECTION: {
        const id = String(payload && payload.id ? payload.id : payload);
        const sections = state.layout.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
        return { ...state, layout: ensureOrderConsistency({ ...state.layout, sections }) };
      }

      case ActionTypes.SELECT_SECTION: {
        const id = payload ? String(payload) : null;
        if (id && !state.layout.sections.some(s => s.id === id)) return state;
        return { ...state, ui: { ...state.ui, activeSection: id } };
      }

      case ActionTypes.UPDATE_SECTION: {
        const id = payload && payload.id ? String(payload.id) : null;
        if (!id) return state;

        const patch = { ...(payload || {}) };
        delete patch.id;

        const sections = state.layout.sections.map(s => {
          if (s.id !== id) return s;
          const next = { ...s, ...patch };
          if (patch.type) next.type = normalizeSectionType(patch.type);
          if (patch.variant) next.variant = String(patch.variant);
          if (typeof patch.enabled === 'boolean') next.enabled = patch.enabled;
          return next;
        });

        return { ...state, layout: ensureOrderConsistency({ ...state.layout, sections }) };
      }

      case ActionTypes.UPDATE_SECTION_VARIANT: {
        const id = payload && payload.id ? String(payload.id) : null;
        const variant = payload && payload.variant ? String(payload.variant) : null;
        if (!id || !variant) return state;
        return reducer(state, { type: ActionTypes.UPDATE_SECTION, payload: { id, variant } });
      }

      case ActionTypes.REORDER: {
        const newOrder = Array.isArray(payload) ? payload.slice() : [];
        // filter invalid IDs, then append missing
        const ids = new Set(state.layout.sections.map(s => s.id));
        const order = newOrder.filter(id => ids.has(id));
        for (const s of state.layout.sections) {
          if (!order.includes(s.id)) order.push(s.id);
        }
        return { ...state, layout: { ...state.layout, order } };
      }

      case ActionTypes.MOVE_SECTION: {
        const { fromIndex, toIndex } = payload || {};
        const order = state.layout.order.slice();
        const from = Number(fromIndex);
        const to = Number(toIndex);
        if (!Number.isInteger(from) || !Number.isInteger(to)) return state;
        if (from < 0 || from >= order.length || to < 0 || to >= order.length) return state;
        const [moved] = order.splice(from, 1);
        order.splice(to, 0, moved);
        return { ...state, layout: { ...state.layout, order } };
      }

      case ActionTypes.UPDATE_SPACING: {
        const id = payload && payload.id ? String(payload.id) : null;
        if (!id) return state;

        const prev = state.layout.spacing[id] || { pt: 64, pb: 64 };
        const next = { ...prev };

        if (payload.pt !== undefined) next.pt = utils.clamp(payload.pt, 0, 160);
        if (payload.pb !== undefined) next.pb = utils.clamp(payload.pb, 0, 160);

        // normalize to 8px steps
        next.pt = Math.round(next.pt / 8) * 8;
        next.pb = Math.round(next.pb / 8) * 8;

        return {
          ...state,
          layout: {
            ...state.layout,
            spacing: { ...state.layout.spacing, [id]: next }
          }
        };
      }

      case ActionTypes.APPLY_SPACING_PRESET: {
        const id = payload && payload.id ? String(payload.id) : null;
        const presetKey = payload && payload.preset ? String(payload.preset) : null;
        if (!id || !presetKey || !SPACING_PRESETS[presetKey]) return state;
        const preset = SPACING_PRESETS[presetKey];
        return reducer(state, { type: ActionTypes.UPDATE_SPACING, payload: { id, pt: preset.pt, pb: preset.pb } });
      }

      case ActionTypes.SET_LOGO: {
        return { ...state, brand: { ...state.brand, logo: payload || null } };
      }

      case ActionTypes.SET_COLORS: {
        const colors = payload && typeof payload === 'object' ? payload : {};
        return {
          ...state,
          brand: {
            ...state.brand,
            colors: utils.deepMerge(state.brand.colors, colors)
          }
        };
      }

      case ActionTypes.SET_FONT: {
        const font = String(payload || 'system');
        return { ...state, brand: { ...state.brand, font } };
      }

      case ActionTypes.SET_RADIUS: {
        const radius = String(payload || 'rounded');
        return { ...state, brand: { ...state.brand, radius } };
      }

      case ActionTypes.UPDATE_CONTENT: {
        const id = payload && payload.id ? String(payload.id) : null;
        if (!id) return state;
        const patch = { ...(payload || {}) };
        delete patch.id;

        const prev = state.content[id] || {};
        const next = utils.deepMerge(prev, patch);

        return {
          ...state,
          content: { ...state.content, [id]: next }
        };
      }

      case ActionTypes.REPLACE_CONTENT: {
        const id = payload && payload.id ? String(payload.id) : null;
        if (!id) return state;
        const nextVal = payload && payload.value ? payload.value : {};
        return { ...state, content: { ...state.content, [id]: utils.deepClone(nextVal) } };
      }

      case ActionTypes.REMOVE_CONTENT: {
        const id = payload && payload.id ? String(payload.id) : null;
        if (!id) return state;
        const next = { ...state.content };
        delete next[id];
        return { ...state, content: next };
      }

      case ActionTypes.UPDATE_SETTINGS: {
        const patch = payload && typeof payload === 'object' ? payload : {};
        return { ...state, settings: utils.deepMerge(state.settings, patch) };
      }

      case ActionTypes.UPDATE_CONSENT: {
        const patch = payload && typeof payload === 'object' ? payload : {};
        return { ...state, settings: { ...state.settings, consent: utils.deepMerge(state.settings.consent, patch) } };
      }

      case ActionTypes.UPDATE_FEATURES: {
        const patch = payload && typeof payload === 'object' ? payload : {};
        return { ...state, settings: { ...state.settings, features: utils.deepMerge(state.settings.features, patch) } };
      }

      case ActionTypes.TOGGLE_GRID: {
        return { ...state, ui: { ...state.ui, showGrid: !state.ui.showGrid } };
      }

      case ActionTypes.TOGGLE_8PX: {
        return { ...state, ui: { ...state.ui, show8pxRaster: !state.ui.show8pxRaster } };
      }

      case ActionTypes.SET_SIDEBAR_TAB: {
        return { ...state, ui: { ...state.ui, sidebarTab: String(payload || 'sections') } };
      }

      case ActionTypes.SET_BUILDER_THEME: {
        const theme = payload === 'dark' ? 'dark' : 'light';
        return { ...state, ui: { ...state.ui, builderTheme: theme } };
      }

      case ActionTypes.SET_ACTIVE_ELEMENT_PATH: {
        return { ...state, ui: { ...state.ui, activeElementPath: payload || null } };
      }

      default:
        return state;
    }
  }

  function defaultHistoryPolicy(action) {
    const type = action && action.type ? action.type : '';
    const payload = action ? action.payload : null;

    // UI-only actions should not create history entries
    const noRecord = new Set([
      ActionTypes.SELECT_SECTION,
      ActionTypes.TOGGLE_GRID,
      ActionTypes.TOGGLE_8PX,
      ActionTypes.SET_SIDEBAR_TAB,
      ActionTypes.SET_BUILDER_THEME,
      ActionTypes.SET_ACTIVE_ELEMENT_PATH,
      ActionTypes.SET_MODE
    ]);

    if (noRecord.has(type)) return { record: false };

    // Coalesce high-frequency updates (sliders, typing) to keep history usable
    const coalesce = new Set([
      ActionTypes.UPDATE_SPACING,
      ActionTypes.UPDATE_CONTENT,
      ActionTypes.SET_COLORS
    ]);

    if (coalesce.has(type)) {
      const key = type + ':' + (payload && payload.id ? payload.id : 'global');
      return { record: true, coalesceKey: key, coalesceWindowMs: 450 };
    }

    return { record: true };
  }

  /**
   * createStore: minimal external store compatible with React 18 useSyncExternalStore.
   */
  function createStore(options = {}) {
    const historyLimit = Number(options.historyLimit || 50);
    const history = HistoryManager ? new HistoryManager({ maxSize: historyLimit }) : null;

    const saver = storage && storage.createDebouncedSaver
      ? storage.createDebouncedSaver({ wait: Number(options.saveDebounceMs || 450) })
      : null;

    const historyPolicy = typeof options.historyPolicy === 'function' ? options.historyPolicy : defaultHistoryPolicy;

    let state = (options.initialState ? utils.deepClone(options.initialState) : utils.deepClone(initialState));
    const listeners = new Set();

    function emit() {
      for (const l of listeners) l();
    }

    function getState() { return state; }

    function setState(next, meta = {}) {
      state = next;
      if (meta.persist !== false && saver) saver.save(state);
      emit();
    }

    function subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function dispatch(action) {
      if (!action || !action.type) return;

      // History commands
      if (action.type === ActionTypes.UNDO && history) {
        const prev = history.undo();
        if (prev) setState(prev, { persist: true });
        return;
      }
      if (action.type === ActionTypes.REDO && history) {
        const next = history.redo();
        if (next) setState(next, { persist: true });
        return;
      }

      const next = reducer(state, action);
      if (utils.isEqual(state, next)) return;

      const policy = historyPolicy(action) || { record: true };

      setState(next, { persist: true });

      if (history && policy.record) {
        history.record(next, { coalesceKey: policy.coalesceKey, coalesceWindowMs: policy.coalesceWindowMs });
      }
    }

    function canUndo() { return history ? history.canUndo() : false; }
    function canRedo() { return history ? history.canRedo() : false; }

    function flush() { if (saver && saver.flush) saver.flush(); }

    // Initialize history with initial state
    if (history) history.init(state);

    return { getState, setState, subscribe, dispatch, canUndo, canRedo, flush, __history: history };
  }

  function createBuilderStore(options = {}) {
    // Load persisted state (if any), else use initialState.
    let loaded = null;
    if (storage && storage.loadState) {
      loaded = storage.loadState();
    }

    const baseState = loaded ? utils.deepMerge(initialState, loaded) : initialState;
    baseState.layout = ensureOrderConsistency(baseState.layout);

    const store = createStore({ ...options, initialState: baseState });

    // Apply builder theme to document root immediately for a flicker-free start
    try {
      const theme = store.getState().ui.builderTheme;
      if (theme === 'light') document.documentElement.classList.add('builder-light');
      else document.documentElement.classList.remove('builder-light');
    } catch (_) {}

    return store;
  }

  SB5.core.state = {
    MODES,
    ActionTypes,
    SPACING_PRESETS,
    initialState,
    reducer,
    createStore,
    createBuilderStore
  };
})(window);



