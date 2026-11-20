/* Verhaaltjes – offline service worker.
   After changing index.html, raise the version number below so tablets pick up the new version. */
const VERSION = "verhaaltjes-v2";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const isAudio = /\/audio\//.test(req.url);

  // Audio in an audio/ folder next to the app: cache it the first time it plays.
  if (isAudio) {
    e.respondWith(
      caches.match(req.url).then(hit => hit || fetch(req).then(res => {
        if (res.ok && res.status === 200 && !req.headers.has("range")) {
          const copy = res.clone(); caches.open(VERSION).then(c => c.put(req.url, copy));
        }
        return res;
      }))
    );
    return;
  }

  // App files: answer from the offline copy straight away, refresh it in the background.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit || caches.match("./index.html"));
      return hit || net;
    })
  );
});
