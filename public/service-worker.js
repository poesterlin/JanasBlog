// @ts-check
const CACHE = 'cache-and-update';

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
    evt.waitUntil(precache(evt));
});

self.addEventListener('fetch', function (evt) {
    evt.respondWith(fromCache(evt.request));
});

async function precache() {
    const cache = await caches.open(CACHE);
    const hasFallback = await cache.match('/fallback.png');
    if (hasFallback) {
        return;
    }

    const fallbackImg = new Request('/fallback.png');
    const response = await fetch(fallbackImg)
    console.log('[oninstall] Cached fallback', response.url);
    await cache.put(fallbackImg, response);
}

async function fromCache(request) {
    const cache = await caches.open(CACHE);
    let resp = await cache.match(request);
    const useCache = request.url.endsWith(".png");
    if (resp && useCache) {
        fetch(request).then(r => cache.put(request, r)).catch();
    } else {
        resp = await fetch(request);
        try {
            await cache.put(request, resp.clone());
        } catch { }
    }
    return resp;
}