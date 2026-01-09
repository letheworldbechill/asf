/* ============================================
   Smooth Builder 5 - Service Worker (PWA)
   ============================================
   Strategy:
   - App shell: cache-first for navigations -> index.html fallback
   - Same-origin assets: stale-while-revalidate
   - CDN libs: cache-first (opaque responses are OK)
   - Offline: all previously cached resources available
   ============================================ */

const SW_VERSION = 'sb5-sw-v1.0.0';
const CACHE_STATIC = `${SW_VERSION}-static`;
const CACHE_RUNTIME = `${SW_VERSION}-runtime`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',

  // CSS
  './css/builder.css',
  './css/canvas.css',
  './css/preview.css',

  // Data
  './data/icons.js',
  './data/sections.json',
  './data/templates.json',
  './data/fonts.json',

  // Core
  './js/core/utils.js',
  './js/core/history.js',
  './js/core/storage.js',
  './js/core/state.js',

  // Features
  './js/features/colorStack.js',
  './js/features/consent.js',
  './js/features/dragDrop.js',

  // Generators/Exporters
  './js/generators/css.js',
  './js/generators/html.js',
  './js/generators/js.js',
  './js/generators/legal.js',
  './js/generators/export.js',

  // App (JSX via Babel)
  './js/app.jsx',

  // Components (JSX)
  './js/components/Icon.jsx',
  './js/components/Toast.jsx',
  './js/components/Modal.jsx',
  './js/components/Toolbar.jsx',
  './js/components/Sidebar.jsx',
  './js/components/GridOverlay.jsx',
  './js/components/SectionPlaceholder.jsx',
  './js/components/SpacingSlider.jsx',
  './js/components/VariantPicker.jsx',
  './js/components/DraggableList.jsx',
  './js/components/Canvas.jsx',
  './js/components/LogoUpload.jsx',
  './js/components/ColorPalette.jsx',
  './js/components/ColorStack.jsx',
  './js/components/FontPicker.jsx',
  './js/components/RadiusPicker.jsx',
  './js/components/ContentEditor.jsx',

  // Preview (JSX)
  './js/preview/PreviewRoot.jsx',
  './js/preview/Header.jsx',
  './js/preview/Hero.jsx',
  './js/preview/TrustBar.jsx',
  './js/preview/Services.jsx',
  './js/preview/Benefits.jsx',
  './js/preview/Team.jsx',
  './js/preview/Testimonials.jsx',
  './js/preview/FAQ.jsx',
  './js/preview/CTA.jsx',
  './js/preview/Footer.jsx',
  './js/preview/CookieBanner.jsx',

  // Modes (JSX)
  './js/modes/StructureMode.jsx',
  './js/modes/DesignMode.jsx',
  './js/modes/ExportMode.jsx',

  // CDN libs (cached as opaque responses)
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7/babel.min.js',
  'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_STATIC);
    // Use Request objects to avoid some edge cases with caching
    const requests = PRECACHE_URLS.map((url) => new Request(url, { mode: 'no-cors' }));
    await cache.addAll(requests);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => {
      if (k.startsWith('sb5-sw-') && k !== CACHE_STATIC && k !== CACHE_RUNTIME) {
        return caches.delete(k);
      }
      return Promise.resolve();
    }));
    self.clients.claim();
  })());
});

function isNavigation(request) {
  return request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');
}

function sameOrigin(url) {
  try { return new URL(url).origin === self.location.origin; }
  catch (_) { return false; }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_RUNTIME);
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;

  const res = await fetch(request);
  if (res && (res.status === 200 || res.type === 'opaque')) {
    cache.put(request, res.clone());
  }
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_RUNTIME);
  const cached = await cache.match(request, { ignoreVary: true });

  const fetchPromise = fetch(request).then((res) => {
    if (res && (res.status === 200 || res.type === 'opaque')) {
      cache.put(request, res.clone());
    }
    return res;
  }).catch(() => null);

  return cached || (await fetchPromise) || cached;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;

  // Navigation: serve cached index.html as app shell fallback
  if (isNavigation(req)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_STATIC);
      const cached = await cache.match('./index.html') || await cache.match('./') || await cache.match('index.html');
      try {
        const net = await fetch(req);
        // Update shell opportunistically
        if (net && net.status === 200) {
          const runtime = await caches.open(CACHE_RUNTIME);
          runtime.put(req, net.clone());
        }
        return net;
      } catch (_) {
        return cached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  // Same-origin: stale-while-revalidate
  if (sameOrigin(url)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Cross-origin (CDN): cache-first
  event.respondWith(cacheFirst(req));
});
