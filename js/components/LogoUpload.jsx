/* ============================================
   SMOOTH BUILDER 5.0 - LOGO UPLOAD
   ============================================
   No build step. Exposes: window.SB5.components.LogoUpload
   Reads file as DataURL (offline-friendly).
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before LogoUpload.jsx');

  const { useId, useRef } = React;

  const Icon = SB5.components.Icon;

  function hasIcon(name) {
    const icons = (global.SB5 && global.SB5.data && global.SB5.data.icons) ? global.SB5.data.icons : null;
    return !!(icons && icons[name]);
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
      r.readAsDataURL(file);
    });
  }

  function LogoUpload({
    value,
    onChange,
    onRemove,
    disabled = false,
    label = 'Logo'
  }) {
    const id = (typeof useId === 'function') ? useId() : `logo-${Math.random().toString(16).slice(2)}`;
    const inputRef = useRef(null);

    const pick = () => {
      if (disabled) return;
      inputRef.current && inputRef.current.click();
    };

    const handleFile = async (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;

      // basic validation
      if (!/image\/(png|jpeg|jpg|webp|gif|svg\+xml)/i.test(file.type)) {
        // still try, but warn
      }

      const dataUrl = await readAsDataURL(file);
      if (typeof onChange === 'function') onChange(dataUrl, { file });
    };

    return (
      <div className="logo-upload">
        <div className="logo-upload__header">
          <div className="logo-upload__label">{label}</div>
          <div className="logo-upload__actions">
            <button
              type="button"
              className="btn btn--sm"
              onClick={pick}
              disabled={disabled}
            >
              {(Icon && hasIcon('upload')) ? <Icon name="upload" size={14} /> : null}
              Upload
            </button>

            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => typeof onRemove === 'function' && onRemove()}
              disabled={!value || disabled}
            >
              Entfernen
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFile}
          aria-label="Logo Datei auswählen"
        />

        <div className="logo-upload__preview">
          {value ? (
            <img
              src={value}
              alt="Logo Vorschau"
              className="logo-upload__img"
              draggable={false}
            />
          ) : (
            <div className="logo-upload__empty" role="status" aria-live="polite">
              Kein Logo ausgewählt.
            </div>
          )}
        </div>
      </div>
    );
  }

  SB5.components.LogoUpload = LogoUpload;
})(window);



CHECKPOINT 8: Preview Components ✅
