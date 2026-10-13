// Libro de Obra Diario — funcionamiento sin conexión.
// Cambia el número de VERSION cuando publiques una versión nueva de index.html.
const VERSION = 'libro-obra-v42';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const req = e.request; if(req.method!=='GET') return;
  const url = new URL(req.url);
  const mismo = url.origin===location.origin, fuente = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if(!mismo && !fuente) return;               // clima, WhatsApp, etc.: siempre por internet
  e.respondWith(
    fetch(req).then(r=>{ if(r && (r.ok || r.type==='opaque')){ const copia = r.clone(); caches.open(VERSION).then(c=>c.put(req, copia)); } return r; })
      .catch(()=> caches.match(req).then(r=> r || (req.mode==='navigate' ? caches.match('./index.html') : Response.error())))
  );
});
