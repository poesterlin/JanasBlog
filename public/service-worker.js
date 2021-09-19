// @ts-check
const CACHE = 'cache-and-update';
const dev = true;

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
    evt.waitUntil(precache(evt));
});

self.addEventListener('fetch', function (evt) {
    console.log('The service worker is serving the asset.');
    evt.respondWith(fromCache(evt.request));
});

async function precache() {
    const cache = await caches.open(CACHE);
    // await cache.addAll([
    //     './fallback.png',
    //     'build',
    // ]);
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
    const skipCache = request.url.startsWith("http://localhost:");
    if (!resp || skipCache) {
        try {
            resp = await fetch(request);
            await cache.put(request, resp.clone());
        } catch {
            if (request.url.endsWith(".png")) {
                resp = await cache.match('/fallback.png');
            }
        }
    }
    return resp;
}

async function update(request) {
    const cache = await caches.open(CACHE);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.log(error)
    }
}