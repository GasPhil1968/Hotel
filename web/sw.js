// Offline-Speicher für Mala – Kapitel 1 (Split), Kapitel 2 (Sarajevo) und Kapitel 3 (Mostar). VERSION wird beim Bauen aus dem Inhalt gesetzt.
var VERSION = 'mala-split-4e8def4f77';
var FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));   // am HTTP-Cache vorbei, damit ein Update wirklich die neuen Dateien holt
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }).then(notifyReady));
});
function notifyReady() {
  return caches.open(VERSION).then(function (c) { return c.keys(); }).then(function (keys) {
    if (keys.length < FILES.length) return;
    return self.clients.matchAll({ includeUncontrolled: true }).then(function (cl) { cl.forEach(function (x) { x.postMessage('offline-ready'); }); });
  });
}
self.addEventListener('message', function (e) { if (e.data === 'check') e.waitUntil(notifyReady()); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    return fetch(e.request).catch(function () { if (e.request.mode === 'navigate') return caches.match('./index.html'); });
  }));
});
