self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('pnr-cache').then(cache => cache.addAll([
      '/resataxi/',
      '/resataxi/index.html',
      '/resataxi/app.js',
      '/resataxi/manifest.json',
      '/resataxi/icon-192.png',
      '/resataxi/icon-512.png',
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
