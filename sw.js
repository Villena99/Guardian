// Guardian móvil: guarda solo la «carcasa» de la app para abrirla sin conexión. Los datos nunca pasan por aquí.
const V = "guardian-movil-3";
const CARCASA = ["./", "./index.html", "./manifest.webmanifest", "./icono-180.png", "./icono-192.png", "./icono-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CARCASA)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;       // Supabase y ntfy: directo a la red
  e.respondWith(fetch(e.request).then(r => { caches.open(V).then(c => c.put(e.request, r.clone())); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
