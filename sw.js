/* Verhaaltjes – offline service worker (v3).
   After changing index.html, raise the version number below so tablets pick up the new version.
   Stories in the stories/ folder don't need this: the app checks stories/index.json every time it opens with wifi. */
const VERSION = "verhaaltjes-v3";
const LIBRARY = "verhaaltjes-library";   // pictures, MP3s and subtitles of the stories/ folder
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  // cache: "reload" = always the newest files from the website, never an old copy kept by the browser
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP_FILES.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== LIBRARY).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const path = new URL(req.url).pathname;

  // stories/…/*.json: newest version when online, saved copy when offline
  if (/\/stories\/.*\.json$/i.test(path)) {
    e.respondWith(
      fetch(req, { cache: "no-cache" }).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(LIBRARY).then(c => c.put(req.url, copy)); }
        return res;
      }).catch(() => caches.open(LIBRARY).then(c => c.match(req.url)).then(hit => hit || Response.error()))
    );
    return;
  }

  // stories/… pictures, MP3s, subtitles (and the old audio/ folder): saved copy first.
  // The ?v= number in the address changes when a story's "version" goes up, so new files are fetched.
  if (/\/(stories|audio)\//.test(path)) {
    e.respondWith(
      caches.open(LIBRARY).then(c => c.match(req.url).then(hit => hit || fetch(req.url).then(res => {
        if (res.ok && res.status === 200) c.put(req.url, res.clone());
        return res;
      })))
    );
    return;
  }

  // App files: answer from the offline copy straight away, refresh it in the background.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req, { cache: "no-cache" }).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit || caches.match("./index.html"));
      return hit || net;
    })
  );
});
