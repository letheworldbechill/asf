/* ============================================
   SMOOTH BUILDER 5.0 - GRID OVERLAY
   ============================================
   No build step. Exposes: window.SB5.components.GridOverlay
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before GridOverlay.jsx');

  function GridOverlay({
    columns = 12,
    show8px = false
  }) {
    const count = Number(columns) > 0 ? Number(columns) : 12;

    return (
      <div className="grid-overlay" aria-hidden="true">
        <div className="grid-columns">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="grid-column" />
          ))}
        </div>
        {show8px && <div className="grid-8px" />}
      </div>
    );
  }

  SB5.components.GridOverlay = GridOverlay;
})(window);




