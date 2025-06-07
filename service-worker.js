self.addEventListener('install', e => {
  console.log('Service Worker installé');
  e.waitUntil(
    caches.open('pnr-cache').then(cache => {
      return cache.addAll([
        'https://pnrtaxi.com/resataxi/',
        'https://pnrtaxi.com/resataxi/index.html',
        'https://pnrtaxi.com/resataxi/manifest.json',
        'https://pnrtaxi.com/resataxi/icon-192.png',
        'https://pnrtaxi.com/resataxi/icon-512.png'
      ]);
    })
  );
});