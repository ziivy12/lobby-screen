// يحفظ ملفات الموقع على الجهاز: يجلب الأحدث من الإنترنت، وعند انقطاعه يستخدم آخر نسخة محفوظة
const CACHE = 'lobby-screen';
const CORE = ['./', 'index.html', 'schedule.js', 'video/v0.mp4', 'video/v1.mp4', 'video/v2.mp4', 'video/v3.mp4'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  // طلبات قاعدة البيانات ومقاطع الفيديو الجزئية تذهب للإنترنت مباشرة
  if (req.method !== 'GET' || url.origin !== location.origin || req.headers.has('range')) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(url.pathname, copy)); }
      return res;
    }).catch(() => caches.match(url.pathname).then(hit => hit || caches.match('./')))
  );
});
