// BNI 富鼎演講追蹤 · Service Worker
// 設計目標：讓二次進站不再重打 CDN；JSONBin proxy 永遠走網路，不快取。
// 版本號變更時會自動淘汰舊快取。

const CACHE_VERSION = 'bni-fuding-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

// 可以快取的外部資源白名單（全部是穩定版本號鎖住的）
const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

self.addEventListener('install', (event) => {
  // 立即啟用新版 SW，不用等所有分頁關閉
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 清掉舊版本快取
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.startsWith(CACHE_VERSION)).map(k => caches.delete(k)));
    // 直接接管現有分頁
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 絕不快取 JSONBin proxy（那是動態資料）
  if (url.pathname.startsWith('/api/') || url.hostname.includes('railway.app')) return;

  // 本頁 HTML / sw.js 走 network-first（保證拿到新版，離線 fallback 舊版）
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req));
    return;
  }

  // CDN 資產走 cache-first（版本鎖住的 URL 不會變，快取越久越好）
  if (CDN_HOSTS.some(h => url.hostname === h || url.hostname.endsWith('.' + h))) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // 其他走預設（瀏覽器自己的網路行為，不干涉）
});

async function cacheFirst(req) {
  const cache = await caches.open(STATIC_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && (res.status === 200 || res.type === 'opaque')) {
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (e) {
    if (hit) return hit;
    throw e;
  }
}

async function networkFirst(req) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (e) {
    const hit = await cache.match(req);
    if (hit) return hit;
    throw e;
  }
}
