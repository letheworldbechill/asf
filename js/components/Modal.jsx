/* ============================================
   SMOOTH BUILDER 5.0 - MODAL
   ============================================
   No build step. Exposes: window.SB5.components.Modal
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};

  const React = global.React;
  const ReactDOM = global.ReactDOM;

  if (!React) throw new Error('React missing. Load React before Modal.jsx');
  if (!ReactDOM) throw new Error('ReactDOM missing. Load ReactDOM before Modal.jsx');

  const { useEffect, useMemo, useRef, useCallback } = React;

  function getFocusable(container) {
    if (!container) return [];
    const selectors = [
      'a[href]',
      'area[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable="true"]',
      '[tabindex]:not([tabindex="-1"])'
    ];
    const nodes = Array.from(container.querySelectorAll(selectors.join(',')));
    return nodes.filter(el => {
      const style = global.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none' && !el.hasAttribute('disabled');
    });
  }

  function lockBodyScroll(locked) {
    const body = document.body;
    if (!body) return;
    if (locked) {
      const prev = body.style.overflow;
      body.dataset.sb5PrevOverflow = prev || '';
      body.style.overflow = 'hidden';
    } else {
      const prev = body.dataset.sb5PrevOverflow;
      body.style.overflow = prev || '';
      delete body.dataset.sb5PrevOverflow;
    }
  }

  function Modal({
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
    closeLabel = 'Schließen',
    initialFocusRef = null
  }) {
    const overlayRef = useRef(null);
    const dialogRef = useRef(null);
    const closeBtnRef = useRef(null);
    const prevActiveRef = useRef(null);

    const sizeClass = useMemo(() => {
      const s = String(size || 'md');
      return ['sm', 'md', 'lg', 'xl'].includes(s) ? `modal__dialog--${s}` : 'modal__dialog--md';
    }, [size]);

    const handleClose = useCallback(() => {
      if (typeof onClose === 'function') onClose();
    }, [onClose]);

    useEffect(() => {
      if (!open) return;

      prevActiveRef.current = document.activeElement;

      lockBodyScroll(true);

      const dialog = dialogRef.current;
      const focusTarget =
        (initialFocusRef && initialFocusRef.current) ||
        closeBtnRef.current ||
        (dialog ? getFocusable(dialog)[0] : null);

      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus();
      }

      function onKeyDown(e) {
        if (!open) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
          return;
        }
        if (e.key !== 'Tab') return;

        const focusables = getFocusable(dialogRef.current);
        if (!focusables.length) {
          e.preventDefault();
          return;
        }
        const current = document.activeElement;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (current === first || current === dialogRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (current === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      document.addEventListener('keydown', onKeyDown, true);
      return () => {
        document.removeEventListener('keydown', onKeyDown, true);
        lockBodyScroll(false);
        const prev = prevActiveRef.current;
        if (prev && typeof prev.focus === 'function') prev.focus();
      };
    }, [open, handleClose, initialFocusRef]);

    if (!open) return null;

    const modal = (
      <div
        className="modal"
        ref={overlayRef}
        onMouseDown={(e) => {
          if (e.target === overlayRef.current) handleClose();
        }}
      >
        <div
          className={`modal__dialog ${sizeClass}`}
          role="dialog"
          aria-modal="true"
          aria-label={title ? String(title) : 'Dialog'}
          ref={dialogRef}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal__header">
            <div className="modal__title">{title}</div>
            <button
              type="button"
              className="modal__close"
              ref={closeBtnRef}
              onClick={handleClose}
              aria-label={closeLabel}
            >
              ×
            </button>
          </div>

          <div className="modal__content">
            {children}
          </div>

          {footer && (
            <div className="modal__footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    );

    return ReactDOM.createPortal(modal, document.body);
  }

  SB5.components.Modal = Modal;
})(window);


