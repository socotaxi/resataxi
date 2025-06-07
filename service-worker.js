self.addEventListener('install', e => {
  console.log('Service Worker installé');
  e.waitUntil(
    caches.open('pnr-cache').then(cache => {
      return cache.addAll([
        './',
        'index.html',
        'manifest.json',
        'icon-192.png',
        'icon-512.png'
      ]);
    })
  );
});