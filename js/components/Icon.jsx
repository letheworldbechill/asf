/* ============================================
   SMOOTH BUILDER 5.0 - ICON
   ============================================
   No build step. Exposes: window.SB5.components.Icon
   Uses SVG strings from: window.SB5.data.icons
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.data = SB5.data || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before Icon.jsx');

  function setSvgSize(svg, size) {
    const w = Number(size);
    if (!Number.isFinite(w) || w <= 0) return svg;

    let out = String(svg || '');
    if (!out.trim().startsWith('<svg')) return out;

    out = out.replace(/\swidth=(['"])[^'"]*\1/, ` width="${w}"`);
    out = out.replace(/\sheight=(['"])[^'"]*\1/, ` height="${w}"`);

    if (!/\swidth=/.test(out)) out = out.replace('<svg', `<svg width="${w}"`);
    if (!/\sheight=/.test(out)) out = out.replace('<svg', `<svg height="${w}"`);

    if (!/focusable=/.test(out)) out = out.replace('<svg', '<svg focusable="false"');
    if (!/aria-hidden=/.test(out)) out = out.replace('<svg', '<svg aria-hidden="true"');

    return out;
  }

  function Icon({ name, size = 16, title = null, className = '', style = {}, ...rest }) {
    const icons = (SB5.data && SB5.data.icons) || global.Icons || {};
    const raw = icons && icons[name] ? icons[name] : null;

    if (!raw) return null;

    const svg = setSvgSize(raw, size);

    const ariaProps = title
      ? { role: 'img', 'aria-label': title, 'aria-hidden': 'false' }
      : { 'aria-hidden': 'true' };

    return (
      <span
        className={`icon ${className}`.trim()}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0, ...style }}
        {...ariaProps}
        {...rest}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  SB5.components.Icon = Icon;
})(window);


