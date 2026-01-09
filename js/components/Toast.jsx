/* ============================================
   SMOOTH BUILDER 5.0 - TOASTS
   ============================================
   No build step. Exposes: window.SB5.components.ToastProvider,
   window.SB5.components.useToast
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.core = SB5.core || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before Toast.jsx');

  const { useCallback, useEffect, useMemo, useRef, useState, createContext, useContext } = React;

  const utils = SB5.core.utils;

  const ToastContext = createContext(null);

  const DEFAULT_DURATION = 4200; // ms
  const MAX_TOASTS = 4;

  function normalizeType(t) {
    const type = String(t || 'info').toLowerCase();
    if (type === 'success' || type === 'error' || type === 'info') return type;
    return 'info';
  }

  function makeId() {
    if (utils && utils.generateId) return utils.generateId('toast');
    return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function ToastItem({ toast, onDismiss }) {
    const type = normalizeType(toast.type);
    const title = toast.title ? String(toast.title) : null;
    const message = toast.message ? String(toast.message) : null;
    const role = type === 'error' ? 'alert' : 'status';

    return (
      <div className={`toast toast--${type}`} role={role} aria-live={type === 'error' ? 'assertive' : 'polite'}>
        <div className="toast__body">
          <div className="toast__content">
            {title && <div className="toast__title">{title}</div>}
            {message && <div className="toast__message">{message}</div>}
          </div>

          <button
            type="button"
            className="toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Toast schließen"
          >
            ×
          </button>
        </div>

        {toast.action && toast.action.label && typeof toast.action.onClick === 'function' && (
          <button
            type="button"
            className="toast__action"
            onClick={() => {
              try { toast.action.onClick(); } finally { onDismiss(toast.id); }
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
    );
  }

  function ToastViewport({ toasts, dismiss }) {
    return (
      <div className="toast-viewport" aria-label="Benachrichtigungen">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    );
  }

  function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef(new Map());

    const dismiss = useCallback((id) => {
      setToasts(prev => prev.filter(t => t.id !== id));
      const timers = timersRef.current;
      const timer = timers.get(id);
      if (timer) {
        clearTimeout(timer);
        timers.delete(id);
      }
    }, []);

    const clear = useCallback(() => {
      const timers = timersRef.current;
      for (const [, timer] of timers) clearTimeout(timer);
      timers.clear();
      setToasts([]);
    }, []);

    const push = useCallback((opts) => {
      const next = {
        id: makeId(),
        type: normalizeType(opts && opts.type),
        title: opts && opts.title ? String(opts.title) : null,
        message: opts && opts.message ? String(opts.message) : null,
        action: opts && opts.action ? opts.action : null,
        duration: typeof (opts && opts.duration) === 'number' ? Math.max(0, opts.duration) : DEFAULT_DURATION
      };

      setToasts(prev => {
        const updated = [next, ...prev].slice(0, MAX_TOASTS);
        return updated;
      });

      if (next.duration > 0) {
        const timers = timersRef.current;
        const existing = timers.get(next.id);
        if (existing) clearTimeout(existing);
        const t = setTimeout(() => dismiss(next.id), next.duration);
        timers.set(next.id, t);
      }

      return next.id;
    }, [dismiss]);

    useEffect(() => () => clear(), [clear]);

    const api = useMemo(() => ({
      push,
      dismiss,
      clear,
      success: (message, opts = {}) => push({ ...opts, type: 'success', message }),
      error: (message, opts = {}) => push({ ...opts, type: 'error', message }),
      info: (message, opts = {}) => push({ ...opts, type: 'info', message })
    }), [push, dismiss, clear]);

    return (
      <ToastContext.Provider value={api}>
        {children}
        <ToastViewport toasts={toasts} dismiss={dismiss} />
      </ToastContext.Provider>
    );
  }

  function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
      const noop = () => {};
      return { push: noop, dismiss: noop, clear: noop, success: noop, error: noop, info: noop };
    }
    return ctx;
  }

  SB5.components.ToastProvider = ToastProvider;
  SB5.components.useToast = useToast;
})(window);

