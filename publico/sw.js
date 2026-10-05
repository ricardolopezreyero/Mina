// RLR · Mina — la app instalada: guarda el juego completo en el equipo para que abra aunque no haya internet.
// Con señal siempre se pide lo más nuevo (así llega cada versión); sin señal, o si tarda, sale lo guardado.
// Ricardo López Reyero
const VERSION = 'mina-43';
const ARCHIVOS = ['/', '/juego.js', '/three.min.js', '/escaparate.js', '/manifest.webmanifest', '/iconos/icono-32.png', '/iconos/icono-180.png', '/iconos/icono-192.png', '/iconos/icono-512.png', '/iconos/icono-mascara-512.png', '/mina.jpg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== 'mina-mapas').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// Lo de la red, con un tope de espera; si no llega, lo guardado.
function conTope(pedido, ms) {
  return new Promise((si, no) => {
    const t = setTimeout(() => no(new Error('tarda')), ms);
    fetch(pedido).then((r) => { clearTimeout(t); si(r); }, (x) => { clearTimeout(t); no(x); });
  });
}
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.startsWith('/api/') || u.pathname.startsWith('/ws/') || u.pathname.startsWith('/og/')) return;
  if (/^\/(guia-estilos|guia-de-estilos|gu(i|%C3%AD|í)a(-de)?(-estilos)?|marca|kit)(\/|$)/i.test(u.pathname)) return;      // la guía de estilos no es el juego: va directo a la red
  // Cualquier página del juego (el inicio o la liga de un mundo) es la misma: se guarda una sola.
  const pagina = e.request.mode === 'navigate', llave = pagina ? '/' : u.pathname;
  if (!pagina && !ARCHIVOS.includes(u.pathname)) return;
  e.respondWith((async () => {
    const guardado = await caches.match(llave);
    try {
      const r = await conTope(pagina ? new Request('/', { cache: 'no-cache' }) : new Request(u.pathname, { cache: 'no-cache' }), guardado ? 2500 : 15000);
      if (r.ok) { const c = await caches.open(VERSION); c.put(llave, r.clone()); }
      return r;
    } catch (x) {
      if (guardado) return guardado;
      throw x;
    }
  })());
});
