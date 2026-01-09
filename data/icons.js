/* ============================================
   SMOOTH BUILDER 5.0 - ICONS (SVG STRINGS)
   ============================================
   Extracted from original index.html (Smooth Builder Pro v3.7).
   Exposes: window.SB5.data.icons
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.data = SB5.data || {};

  const Icons = {
  // UI Icons
  drag: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="4" r="1.5" fill="currentColor"/><circle cx="11" cy="4" r="1.5" fill="currentColor"/><circle cx="5" cy="8" r="1.5" fill="currentColor"/><circle cx="11" cy="8" r="1.5" fill="currentColor"/><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="11" cy="12" r="1.5" fill="currentColor"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  minus: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.333 8h9.334" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  x: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.4l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevronDown: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 3.5L2 8l4.5 4.5M2 8h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9.5 3.5L14 8l-4.5 4.5M14 8H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  undo: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.2 5.2H2V1M2.2 11.6a6 6 0 1 0 0-7.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  redo: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9.8 5.2H14V1M13.8 11.6a6 6 0 1 1 0-7.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v7m0 0l3-3m-3 3L5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  upload: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14V7m0 0l3 3m-3-3L5 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  eye: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.6 8s2.2-4.4 6.4-4.4S14.4 8 14.4 8s-2.2 4.4-6.4 4.4S1.6 8 1.6 8Z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="1.9" stroke="currentColor" stroke-width="1.3"/></svg>`,
  code: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.2 5L3.6 8l2.6 3M9.8 5l2.6 3-2.6 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  settings: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 10.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor" stroke-width="1.3"/><path d="M13.4 9.1v-2.2l-1.5-.5a5.3 5.3 0 0 0-.7-1.2l.7-1.5L10.4 2.6 9 3.3c-.4-.2-.8-.3-1.3-.4L7.2 1.4H8.8L8.3 2.9c-.5.1-.9.2-1.3.4L5.6 2.6 4.1 4.1l.7 1.5c-.3.4-.5.8-.7 1.2l-1.5.5v2.2l1.5.5c.2.4.4.8.7 1.2l-.7 1.5 1.5 1.5 1.4-.7c.4.2.8.3 1.3.4l.5 1.5h2.2l.5-1.5c.5-.1.9-.2 1.3-.4l1.4.7 1.5-1.5-.7-1.5c.3-.4.5-.8.7-1.2l1.5-.5Z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>`,
  grid: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.7 2.7h4.1v4.1H2.7V2.7Zm6.5 0h4.1v4.1H9.2V2.7ZM2.7 9.2h4.1v4.1H2.7V9.2Zm6.5 0h4.1v4.1H9.2V9.2Z" stroke="currentColor" stroke-width="1.1"/></svg>`,
  sun: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 11.2A3.2 3.2 0 1 0 8 4.8a3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.7v1.7M8 12.6v1.7M1.7 8h1.7M12.6 8h1.7M3.2 3.2l1.2 1.2M11.6 11.6l1.2 1.2M12.8 3.2l-1.2 1.2M4.4 11.6l-1.2 1.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  moon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 9.3A5.5 5.5 0 0 1 6.7 3a4.8 4.8 0 1 0 6.3 6.3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  shield: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.8 13 3.8v4.2c0 3.1-2.2 5.9-5 6.9-2.8-1-5-3.8-5-6.9V3.8l5-2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M6.2 8l1.1 1.1L9.8 6.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  file: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 1.8h5.2L12 4.6V14.2H4V1.8Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.2 1.8v2.8H12" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 6h8v8H6V6Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M2 10V2h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2.8h4V4m-5 1.3v8.9m4-8.9v8.9M4.5 4.7l.6 9.7h5.8l.6-9.7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="currentColor" stroke-width="1.2"/><path d="M8 7.2v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M8 4.8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  warning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.2 14 13.8H2L8 2.2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 6v3.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M8 11.7h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  success: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="currentColor" stroke-width="1.2"/><path d="M5.4 8.2 7 9.8l3.6-4.1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.6" stroke="currentColor" stroke-width="1.2"/><path d="M10.5 10.5 14 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  external: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8A1.5 1.5 0 0 0 13 12.5V10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M9 2h5v5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2 8 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  lock: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.6 7.3V5.8a3.4 3.4 0 0 1 6.8 0v1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M3.6 7.3h8.8v6H3.6v-6Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 9.2v2.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  unlock: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.4 7.3V5.8a3.4 3.4 0 0 0-6.8 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M3.6 7.3h8.8v6H3.6v-6Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 9.2v2.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  refresh: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 8A5.5 5.5 0 1 1 12 4.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M13.5 3.5v3.2h-3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sparkles: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.8l.7 2.6 2.6.7-2.6.7L8 8.4l-.7-2.6-2.6-.7 2.6-.7L8 1.8ZM12.2 8.7l.5 1.8 1.8.5-1.8.5-.5 1.8-.5-1.8-1.8-.5 1.8-.5.5-1.8Z" fill="currentColor"/></svg>`,
  // Consent / Legal / Brand Icons
  cookie: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.8a6.2 6.2 0 1 0 6.2 6.2 3.8 3.8 0 0 1-3.8-3.8A2.4 2.4 0 0 1 8 1.8Z" stroke="currentColor" stroke-width="1.2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="10" cy="7.5" r="1" fill="currentColor"/><circle cx="7" cy="10.5" r="1" fill="currentColor"/></svg>`,
  palette: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 1 0 0 12c1.1 0 2-.9 2-2 0-.6-.3-1.1-.7-1.5-.3-.3-.5-.7-.5-1.1 0-1.1.9-2 2-2h1.2A2.8 2.8 0 0 0 14 6.3 5.9 5.9 0 0 0 8 2Z" stroke="currentColor" stroke-width="1.2"/><circle cx="5.2" cy="6.2" r="1" fill="currentColor"/><circle cx="7.4" cy="4.7" r="1" fill="currentColor"/><circle cx="10.2" cy="5.4" r="1" fill="currentColor"/><circle cx="10.8" cy="8.2" r="1" fill="currentColor"/></svg>`,
  typography: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4V3h10v1M6 13h4M8 3v10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  radius: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12V6a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M4 12h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  // Export / File
  zip: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 1.8h6a2 2 0 0 1 2 2V14.2H3V3.8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M7 1.8v2h2v-2" stroke="currentColor" stroke-width="1.2"/><path d="M7 6h2M7 8h2M7 10h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  json: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.2 3.2C3.5 3.6 3 4.4 3 5.2V6c0 .6-.4 1-1 1 .6 0 1 .4 1 1v.8c0 .8.5 1.6 1.2 2M11.8 3.2c.7.4 1.2 1.2 1.2 2V6c0 .6.4 1 1 1-.6 0-1 .4-1 1v.8c0 .8-.5 1.6-1.2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M7 6.2h2M7 8h2M7 9.8h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  // Media
  play: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.3 3.016a2 2 0 0 0-2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 ....814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
};

  SB5.data.icons = Icons;
  // Backward compat (some legacy code referenced window.Icons)
  global.Icons = Icons;
})(window);

