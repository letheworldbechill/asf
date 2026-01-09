/* ============================================
   SMOOTH BUILDER 5.0 - APP ENTRY
   ============================================
   No build step.

   Exposes:
   - window.SB5.app.mount(rootId?)

   Integration contract:
   - Core:
     SB5.core.state: { initialState, reducer, createStore? }
     SB5.core.storage: { loadState?, saveState? }
     SB5.core.history: { createHistory? }
     SB5.core.utils: { deepClone?, debounce?, isMac? ... }

   - UI:
     SB5.components.Toolbar
     SB5.components.Sidebar
     SB5.components.Canvas (optional)

   - Modes:
     SB5.modes.StructureMode
     SB5.modes.DesignMode
     SB5.modes.ExportMode

   This file is defensive: if a helper is missing, it falls back gracefully.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.app = SB5.app || {};
  SB5.core = SB5.core || {};
  SB5.components = SB5.components || {};
  SB5.modes = SB5.modes || {};

  const React = global.React;
  const ReactDOM = global.ReactDOM;
  if (!React || !ReactDOM) throw new Error('React/ReactDOM missing. Load CDN UMD builds before app.jsx');

  const { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } = React;

  // ---------- Utilities ----------

  function safeObj(x) { return x && typeof x === 'object' ? x : {}; }

  function deepClone(obj) {
    const u = SB5.core.utils;
    if (u && typeof u.deepClone === 'function') return u.deepClone(obj);
    try { return global.structuredClone(obj); } catch (_) {}
    return JSON.parse(JSON.stringify(obj));
  }

  function debounce(fn, ms) {
    const u = SB5.core.utils;
    if (u && typeof u.debounce === 'function') return u.debounce(fn, ms);
    let t = null;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function isMac() {
    const u = SB5.core.utils;
    if (u && typeof u.isMac === 'function') return u.isMac();
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || '');
  }

  function hasRequiredContent(state) {
    const u = SB5.core.utils;
    if (u && typeof u.hasRequiredContent === 'function') return u.hasRequiredContent(state);
    return Array.isArray(state?.layout?.order) && state.layout.order.length > 0;
  }

  // ---------- History (undo/redo) ----------

  function createHistory(limit) {
    const h = SB5.core.history;
    if (h && typeof h.createHistory === 'function') return h.createHistory(limit);

    const stack = [];
    const future = [];

    return {
      push(snapshot) {
        stack.push(snapshot);
        while (stack.length > limit) stack.shift();
        future.length = 0;
      },
      canUndo() { return stack.length > 0; },
      canRedo() { return future.length > 0; },
      undo(current) {
        if (!stack.length) return current;
        const prev = stack.pop();
        future.push(current);
        return prev;
      },
      redo(current) {
        if (!future.length) return current;
        const next = future.pop();
        stack.push(current);
        return next;
      },
      clear() {
        stack.length = 0;
        future.length = 0;
      }
    };
  }

  // ---------- Storage (local persistence) ----------

  function loadState() {
    const s = SB5.core.storage;
    if (s && typeof s.loadState === 'function') return s.loadState();

    try {
      const raw = localStorage.getItem('sb5_state_v1');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function saveState(state) {
    const s = SB5.core.storage;
    if (s && typeof s.saveState === 'function') return s.saveState(state);

    try {
      localStorage.setItem('sb5_state_v1', JSON.stringify(state));
    } catch (_) {}
  }

  // ---------- Store ----------

  function createFallbackStore(initial, reducer) {
    let state = initial;
    const listeners = new Set();

    return {
      getState() { return state; },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      dispatch(action) {
        const next = reducer(state, action);
        if (next !== state) {
          state = next;
          listeners.forEach(l => l());
        }
      }
    };
  }

  function useStore(store, selector) {
    const selRef = useRef(selector);
    selRef.current = selector;

    const getSnapshot = useCallback(() => selRef.current(store.getState()), [store]);
    const subscribe = useCallback((cb) => store.subscribe(cb), [store]);

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

  // ---------- App ----------

  function SmoothBuilderApp() {
    const stateMod = safeObj(SB5.core.state);
    const initialState = stateMod.initialState;
    const reducer = stateMod.reducer;

    if (!initialState || typeof reducer !== 'function') {
      return (
        <div style={{ padding: 16, fontFamily: 'system-ui' }}>
          <h2 style={{ marginTop: 0 }}>Smooth Builder 5</h2>
          <p>Fehler: <code>SB5.core.state</code> ist nicht korrekt geladen.</p>
          <p>Bitte stelle sicher, dass <code>js/core/state.js</code> vor <code>js/app.jsx</code> geladen wird.</p>
        </div>
      );
    }

    const storeRef = useRef(null);
    const historyRef = useRef(null);

    if (!storeRef.current) {
      const persisted = loadState();
      const boot = persisted ? { ...deepClone(initialState), ...persisted } : deepClone(initialState);

      const createStore = stateMod.createStore;
      storeRef.current = (typeof createStore === 'function')
        ? createStore(boot, reducer)
        : createFallbackStore(boot, reducer);

      historyRef.current = createHistory(50);
      historyRef.current.push(deepClone(boot));
    }

    const store = storeRef.current;
    const history = historyRef.current;

    const state = useStore(store, s => s);

    const persistDebounced = useMemo(() => debounce((next) => saveState(next), 250), []);

    useEffect(() => {
      persistDebounced(state);
    }, [state, persistDebounced]);

    const dispatch = useCallback((action) => {
      if (!action || typeof action.type !== 'string') return;

      if (action.type === 'UNDO') {
        const cur = deepClone(store.getState());
        const prev = history.undo(cur);
        store.dispatch({ type: '__REPLACE_STATE__', payload: prev });
        return;
      }
      if (action.type === 'REDO') {
        const cur = deepClone(store.getState());
        const next = history.redo(cur);
        store.dispatch({ type: '__REPLACE_STATE__', payload: next });
        return;
      }

      const before = store.getState();
      store.dispatch(action);
      const after = store.getState();

      if (after !== before) {
        const skipHistory = !!action.meta?.skipHistory;
        if (!skipHistory) history.push(deepClone(after));
      }
    }, [store, history]);

    useEffect(() => {
      const handler = (e) => {
        const mod = isMac() ? e.metaKey : e.ctrlKey;
        if (!mod) return;

        const key = (e.key || '').toLowerCase();
        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) dispatch({ type: 'REDO' });
          else dispatch({ type: 'UNDO' });
        }
        if (key === 'y') {
          e.preventDefault();
          dispatch({ type: 'REDO' });
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [dispatch]);

    const Toolbar = SB5.components.Toolbar;
    const Sidebar = SB5.components.Sidebar;
    const Canvas = SB5.components.Canvas;

    const StructureMode = SB5.modes.StructureMode;
    const DesignMode = SB5.modes.DesignMode;
    const ExportMode = SB5.modes.ExportMode;

    const mode = state.mode;

    const canDesign = Array.isArray(state?.layout?.order) && state.layout.order.length > 0;
    const canExport = canDesign && hasRequiredContent(state);

    const onModeChange = (nextMode) => dispatch({ type: 'SET_MODE', payload: nextMode });

    const onUndo = () => dispatch({ type: 'UNDO' });
    const onRedo = () => dispatch({ type: 'REDO' });

    const canUndo = history.canUndo();
    const canRedo = history.canRedo();

    const modeNode = (() => {
      if (mode === 'structure') return StructureMode ? <StructureMode state={state} dispatch={dispatch} /> : null;
      if (mode === 'design') return DesignMode ? <DesignMode state={state} dispatch={dispatch} /> : null;
      if (mode === 'export') return ExportMode ? <ExportMode state={state} dispatch={dispatch} /> : null;
      return null;
    })();

    const body = (
      <div className="builder__body">
        {Sidebar ? <Sidebar mode={mode} state={state} dispatch={dispatch} /> : null}
        <main className="builder__canvas" role="main">
          {modeNode}
        </main>
      </div>
    );

    return (
      <div className="builder" data-theme={state?.ui?.builderTheme || 'light'}>
        {Toolbar ? (
          <Toolbar
            mode={mode}
            canDesign={canDesign}
            canExport={canExport}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
            onModeChange={onModeChange}
            state={state}
            dispatch={dispatch}
          />
        ) : null}

        {Canvas ? (
          <Canvas mode={mode} state={state} dispatch={dispatch}>
            {modeNode}
          </Canvas>
        ) : body}
      </div>
    );
  }

  // ---------- Mount ----------

  function mount(rootId = 'root') {
    const el = document.getElementById(rootId);
    if (!el) throw new Error(`Root element #${rootId} not found`);

    const root = ReactDOM.createRoot(el);
    root.render(<SmoothBuilderApp />);
  }

  SB5.app.mount = mount;
})(window);




{
  "name": "Smooth Builder 5",
  "short_name": "SB5",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0f766e",
  "description": "Canvas-first Website Builder (offline-fähig).",
  "icons": [
    {
      "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%230f766e%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f59e0b%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20rx%3D%22112%22%20fill%3D%22url(%23g)%22/%3E%3Cpath%20d%3D%22M170%20330c0-62%2044-110%20106-110%2031%200%2059%2012%2079%2033l-34%2034c-12-12-27-19-45-19-36%200-60%2027-60%2062%200%2036%2024%2062%2060%2062%2018%200%2033-6%2045-18l34%2034c-20%2020-48%2032-79%2032-62%200-106-48-106-110z%22%20fill%3D%22%23fff%22/%3E%3C/svg%3E",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%230f766e%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f59e0b%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20rx%3D%22112%22%20fill%3D%22url(%23g)%22/%3E%3Cpath%20d%3D%22M170%20330c0-62%2044-110%20106-110%2031%200%2059%2012%2079%2033l-34%2034c-12-12-27-19-45-19-36%200-60%2027-60%2062%200%2036%2024%2062%2060%2062%2018%200%2033-6%2045-18l34%2034c-20%2020-48%2032-79%2032-62%200-106-48-106-110z%22%20fill%3D%22%23fff%22/%3E%3C/svg%3E",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}




