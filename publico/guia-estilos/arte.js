/* RLR · ArteMina — el generador de arte con gemas de la guía de estilos · Ricardo López Reyero · mina.capitaltorreon.com
   Acomoda las 22 gemas del juego en figuras simétricas (mandala, corona, sol, espiral, caleidoscopio, rombo, panal, flor)
   alrededor de la palabra MINA. Cada imagen sale de una semilla: la misma semilla, el mismo estilo y el mismo fondo dan
   siempre la misma imagen. Sin librerías: un lienzo, las gemas del kit y un poco de geometría. */
(() => {
  'use strict';
  const _RLR = 'Ricardo López Reyero', _k = 'EYE', _rev = 181218;
  const ARCH = ['hierro', 'cobre', 'plata', 'oro', 'platino', 'einstenio', 'esmeralda', 'rubi', 'diamante', 'amazonita', 'aguamarina', 'zafiro', 'perla-negra', 'onix', 'topacio', 'jade-imperial', 'amatista', 'tanzanita', 'alejandrita', 'paladio', 'rodio', 'osmio'];
  const FONDOS = {
    noche: { n: 'Noche de mina', c: ['#4a2c1c', '#1b120e', '#070403'], rayo: '255,210,63' },
    tierra: { n: 'Tierra', c: ['#9a6644', '#4f3020', '#1c110b'], rayo: '255,226,168' },
    atardecer: { n: 'Atardecer', c: ['#f2a868', '#8f4a72', '#161c4a'], rayo: '255,243,200' },
    acuifero: { n: 'Acuífero', c: ['#1f7396', '#0f3d5c', '#04101a'], rayo: '159,224,255' },
    cristalera: { n: 'Cristalera', c: ['#7240b4', '#34185c', '#0d0519'], rayo: '224,184,255' },
    presion: { n: 'Zona de presión', c: ['#b23c22', '#52150e', '#100403'], rayo: '255,176,112' },
    jade: { n: 'Jade', c: ['#2f8f5e', '#14472f', '#05130c'], rayo: '200,255,216' },
  };
  const PALETAS = {
    todas: { n: 'Las 22', g: [...Array(22).keys()] },
    corteza: { n: 'Corteza', g: [3, 6, 7, 8, 9, 5, 4, 2, 1, 0] },
    acuifero: { n: 'Acuífero', g: [10, 11, 12, 8, 4] },
    cavernas: { n: 'Cavernas', g: [14, 15, 13, 3] },
    cristalera: { n: 'Cristalera', g: [16, 17, 18, 9, 8] },
    presion: { n: 'Zona de presión', g: [21, 20, 19, 7] },
    joyas: { n: 'Joyas', g: [7, 6, 11, 14, 16, 18, 8] },
    oro: { n: 'Oro y rubí', g: [3, 7, 14, 20] },
    hielo: { n: 'Hielo', g: [8, 10, 4, 19, 21, 2] },
  };
  const FORMATOS = { vertical: [1080, 1920, 'Vertical 9:16'], cuatro5: [1080, 1350, 'Vertical 4:5'], cuadrado: [1080, 1080, 'Cuadrado'], horizontal: [1920, 1080, 'Horizontal 16:9'] };
  const TAU = Math.PI * 2;
  function azar(s) { let a = (s >>> 0) || 1; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const de = (r, l) => l[Math.floor(r() * l.length)];

  // ── las figuras: cada una devuelve la lista de gemas {i, x, y, s, rot} y los radios de sus anillos ──────────────────────
  const ESTILOS = {
    mandala: { n: 'Mandala', f(e) {
      const o = [], an = []; let r = e.r0 + 34 * e.U, j = 0;
      while (r < e.RM + 220 * e.U) {
        const s = (150 + 34 * j) * e.U, m = Math.max(1, Math.round((TAU * r) / (s * 0.66) / e.N)), n = e.N * m, dos = m % 2 === 0 && e.rnd() < 0.75;
        for (let k = 0; k < n; k++) { const a = e.rot + (k + (j % 2) * 0.5) * TAU / n; o.push({ i: e.pal[(j + (dos && k % 2 ? 1 : 0)) % e.pal.length], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2 }); }
        an.push(r); r += s * 0.6; j++;
      }
      return { o, an };
    } },
    corona: { n: 'Corona de las 22', todas: true, f(e) {
      // las 22 gemas, once por anillo en el lado derecho y su reflejo en el izquierdo: cada dos anillos están todas
      const o = [], an = [], orden = [...Array(22).keys()]; for (let k = 21; k > 0; k--) { const j = Math.floor(e.rnd() * (k + 1)); [orden[k], orden[j]] = [orden[j], orden[k]]; }
      let r = e.r0 + 60 * e.U, j = 0;
      while (r < e.RM + 240 * e.U) {
        const s = (TAU * r) / 22 / 0.84;
        for (let k = 0; k < 11; k++) for (const lado of [1, -1]) { const a = -Math.PI / 2 + lado * (k + 0.5) * Math.PI / 11; o.push({ i: orden[k + 11 * (j % 2)], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2, fx: lado }); }
        an.push(r); r += s * 0.8; j++;
      }
      return { o, an, N: 11, rot: -Math.PI / 2 };
    } },
    sol: { n: 'Sol', f(e) {
      const o = [], n = de(e.rnd, [12, 16, 20, 24]), an = [e.r0 + 40 * e.U];
      for (let k = 0; k < n; k++) {
        const a = e.rot + k * TAU / n, corto = k % 2 === 1; let r = e.r0 + (corto ? 100 : 40) * e.U, t = 0;
        while (r < (corto ? e.RM * 0.62 : e.RM + 200 * e.U)) { const s = ((corto ? 96 : 122) + t * (corto ? 12 : 18)) * e.U; o.push({ i: e.pal[(t + (corto ? 1 : 0)) % e.pal.length], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2 }); r += s * 0.72; t++; }
      }
      return { o, an, N: n / 2 };
    } },
    espiral: { n: 'Espiral', f(e) {
      // anillos de 24 gemas que crecen hacia afuera; cada anillo va medio paso girado y los colores se recorren: salen brazos que se enroscan
      const o = [], an = [], n = 24, dir = e.rnd() < 0.5 ? 1 : -1, c = Math.min(e.pal.length, de(e.rnd, [2, 3, 3, 4, 4, 6])), salto = de(e.rnd, [1, 1, 2]);
      let r = e.r0 + 36 * e.U, t = 0;
      while (r < e.RM + 260 * e.U) {
        const s = (TAU * r) / n / 0.8;
        for (let k = 0; k < n; k++) { const a = e.rot + (k + dir * t * 0.5) * TAU / n; o.push({ i: e.pal[(((k + t * salto) % c) + c) % c], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2 + dir * 0.5 }); }
        an.push(r); r += s * 0.6; t++;
      }
      return { o, an, N: n / 2 };
    } },
    caleidoscopio: { n: 'Caleidoscopio', f(e) {
      const o = [], pts = [], N = e.N, medio = Math.PI / N;
      for (let t = 0; t < 500 && pts.length < 16; t++) {
        const enEje = e.rnd() < 0.3, th = enEje ? (e.rnd() < 0.5 ? 0 : medio) : e.rnd() * medio, r = e.r0 + 40 * e.U + Math.sqrt(e.rnd()) * (e.RM - e.r0), s = (96 + e.rnd() * 110) * e.U * (0.75 + 0.7 * r / e.RM), x = Math.cos(th) * r, y = Math.sin(th) * r;
        if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < (p.s + s) * 0.34)) continue;
        if (!enEje && (y < s * 0.3 || Math.sin(medio - th) * r < s * 0.3)) continue;          // que no se encime con su reflejo
        pts.push({ x, y, s, th, r, enEje, i: de(e.rnd, e.pal) });
      }
      for (const p of pts) for (let k = 0; k < N; k++) for (const lado of p.enEje ? [1] : [1, -1]) { const a = e.rot + lado * p.th + k * TAU / N; o.push({ i: p.i, x: e.cx + Math.cos(a) * p.r, y: e.cy + Math.sin(a) * p.r, s: p.s, rot: a + Math.PI / 2 }); }
      return { o, an: [] };
    } },
    rombo: { n: 'Rombos', f(e) {
      const o = [], d = de(e.rnd, [150, 170, 196]) * e.U, p = d * 0.62, n = Math.ceil(e.RM / p) + 2;
      for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) { if ((i + j) & 1) continue; o.push({ i: e.pal[((Math.abs(i) + Math.abs(j)) / 2) % e.pal.length], x: e.cx + i * p, y: e.cy + j * p, s: d, rot: 0 }); }
      return { o, an: [], N: 4, rot: Math.PI / 4 };
    } },
    panal: { n: 'Panal', f(e) {
      const sinBarras = e.pal.filter((i) => ![4, 19, 20, 21].includes(i)); e.pal = sinBarras.length > 1 ? sinBarras : sinBarras.concat([8, 7, 6]);      // en el panal las barras se vuelven rayas: mejor gemas redondas
      const o = [], d = de(e.rnd, [150, 172, 200]) * e.U, p = d * 0.74, n = Math.ceil(e.RM / p) + 2;
      for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) { const anillo = Math.max(Math.abs(a), Math.abs(b), Math.abs(a + b)); o.push({ i: e.pal[anillo % e.pal.length], x: e.cx + p * (a + b / 2), y: e.cy + p * b * 0.866, s: d, rot: 0 }); }
      return { o, an: [], N: 6, rot: 0 };
    } },
    flor: { n: 'Flor', f(e) {
      const o = [], an = [], N = de(e.rnd, [5, 6, 8]), n = N * 10;
      for (let L = 0, rb = e.r0 + 24 * e.U; rb < e.RM + 100 * e.U; L++, rb += 190 * e.U) {
        for (let k = 0; k < n; k++) { const a = e.rot + k * TAU / n, pet = Math.pow(Math.abs(Math.cos(N * (a - e.rot) / 2)), 0.85); o.push({ i: e.pal[(L + (pet > 0.62 ? 1 : 0)) % e.pal.length], x: e.cx + Math.cos(a) * (rb + pet * 215 * e.U * (1 + L * 0.3)), y: e.cy + Math.sin(a) * (rb + pet * 215 * e.U * (1 + L * 0.3)), s: (88 + pet * 74 + L * 22) * e.U, rot: a + Math.PI / 2 }); }
        an.push(rb);
      }
      return { o, an, N };
    } },
  };

  // ── cargar las piezas (las gemas, la palabra y el cintillo) una sola vez ────────────────────────────────────────────────
  let piezas = null;
  function cargar(base = '') {
    if (piezas) return piezas;
    const img = (src) => new Promise((si, no) => { const i = new Image(); i.onload = () => si(i); i.onerror = () => no(new Error('No cargó ' + src)); i.src = base + src; });
    piezas = Promise.all([Promise.all(ARCH.map((a, k) => img(`kit/12-gemas/gema-${String(k + 1).padStart(2, '0')}-${a}.png`))), img('kit/03-logotipo/mina-palabra.png'), img('kit/09-video/cintillo-liga.png')]).then(([gemas, palabra, cintillo]) => ({ gemas, palabra, cintillo }));
    piezas.catch(() => { piezas = null; });
    return piezas;
  }

  async function pintar(canvas, op = {}) {
    const P = await cargar(op.base || ''), semilla = (op.semilla >>> 0) || (1 + Math.floor(Math.random() * 999999)), rnd = azar(semilla * 2654435761);
    const estilo = ESTILOS[op.estilo] ? op.estilo : de(rnd, Object.keys(ESTILOS)), E = ESTILOS[estilo];
    const fondo = FONDOS[op.fondo] ? op.fondo : de(rnd, Object.keys(FONDOS)), F = FONDOS[fondo];
    let paleta = PALETAS[op.paleta] ? op.paleta : de(rnd, Object.keys(PALETAS)); if (E.todas) paleta = 'todas';
    const pal = PALETAS[paleta].g.slice(); if (paleta !== 'todas' && paleta !== 'corteza') for (let k = pal.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [pal[k], pal[j]] = [pal[j], pal[k]]; }
    const [w, h] = FORMATOS[op.formato] || FORMATOS.vertical; canvas.width = w; canvas.height = h;
    const q = canvas.getContext('2d'), cx = w / 2, cy = h / 2, U = Math.min(w, h) / 1080, RM = Math.hypot(w, h) / 2, Wm = 600 * U, r0 = Wm * 0.66;
    const e = { w, h, cx, cy, U, RM, r0, pal, rnd, N: de(rnd, [6, 8, 10, 12]), rot: -Math.PI / 2 }, fig = E.f(e), N = fig.N || e.N, rot = fig.rot !== undefined ? fig.rot : e.rot;
    // el fondo: tres tonos desde el centro, rayos tenues y polvo de luz, todo con la misma simetría de la figura
    const g = q.createRadialGradient(cx, cy, 0, cx, cy, RM); g.addColorStop(0, F.c[0]); g.addColorStop(0.5, F.c[1]); g.addColorStop(1, F.c[2]); q.fillStyle = g; q.fillRect(0, 0, w, h);
    q.fillStyle = `rgba(${F.rayo},0.05)`; for (let k = 0; k < N * 2; k += 2) { const a = rot + (k - 0.5) * TAU / (N * 2); q.beginPath(); q.moveTo(cx, cy); q.arc(cx, cy, RM * 1.1, a, a + TAU / (N * 2)); q.closePath(); q.fill(); }
    for (let t = 0; t < 16; t++) {
      const th = rnd() * Math.PI / N, r = r0 * 0.7 + rnd() * RM, ta = (4 + rnd() * 9) * U, alfa = 0.3 + rnd() * 0.55;
      for (let k = 0; k < N; k++) for (const lado of [1, -1]) { const a = rot + lado * th + k * TAU / N, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; q.fillStyle = `rgba(${F.rayo},${alfa})`; q.beginPath(); q.moveTo(x, y - ta * 2); q.quadraticCurveTo(x, y, x + ta * 2, y); q.quadraticCurveTo(x, y, x, y + ta * 2); q.quadraticCurveTo(x, y, x - ta * 2, y); q.quadraticCurveTo(x, y, x, y - ta * 2); q.fill(); }
    }
    q.strokeStyle = `rgba(${F.rayo},0.16)`; q.lineWidth = 2 * U; for (const r of [r0 * 0.94, ...fig.an]) { q.beginPath(); q.arc(cx, cy, r, 0, TAU); q.stroke(); }
    // las gemas: fuera del óvalo del centro, de afuera hacia adentro para que las de adentro queden encima
    const rx = Wm * 0.58, ry = Wm * 0.25;
    const lista = fig.o.filter((p) => { const dx = (p.x - cx) / (rx + p.s * 0.3), dy = (p.y - cy) / (ry + p.s * 0.3); return dx * dx + dy * dy >= 1 && p.x > -p.s && p.x < w + p.s && p.y > -p.s && p.y < h + p.s; }).sort((a, b) => Math.hypot(b.x - cx, b.y - cy) - Math.hypot(a.x - cx, a.y - cy));
    for (const p of lista) { q.save(); q.translate(p.x, p.y); if (p.rot) q.rotate(p.rot); if (p.fx === -1) q.scale(-1, 1); q.drawImage(P.gemas[p.i], -p.s / 2, -p.s / 2, p.s, p.s); q.restore(); }
    // la orilla se oscurece, y al centro va la palabra sobre un halo oscuro
    const v = q.createRadialGradient(cx, cy, Math.min(w, h) * 0.42, cx, cy, RM); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.6)'); q.fillStyle = v; q.fillRect(0, 0, w, h);
    q.save(); q.translate(cx, cy); q.scale(1, 0.5); const hl = q.createRadialGradient(0, 0, 0, 0, 0, Wm * 0.72); hl.addColorStop(0, 'rgba(10,6,4,0.9)'); hl.addColorStop(0.6, 'rgba(10,6,4,0.55)'); hl.addColorStop(1, 'rgba(10,6,4,0)'); q.fillStyle = hl; q.beginPath(); q.arc(0, 0, Wm * 0.72, 0, TAU); q.fill(); q.restore();
    const ph = Wm * P.palabra.height / P.palabra.width; q.drawImage(P.palabra, cx - Wm / 2, cy - ph / 2, Wm, ph);
    if (op.liga !== false) { const cw = (w > h ? 0.36 : 0.6) * w, ch = cw * P.cintillo.height / P.cintillo.width, y = h > w * 1.5 ? h * 0.75 - ch - 20 * U : h - ch - 26 * U; q.drawImage(P.cintillo, cx - cw / 2, y, cw, ch); }
    return { semilla, estilo, fondo, paleta, gemas: lista.length, texto: `${E.n} · ${PALETAS[paleta].n} · ${F.n} · semilla ${semilla}`, nombre: `mina-arte-${estilo}-${semilla}.png` };
  }

  // ── un zip sin comprimir (los PNG ya vienen comprimidos), para bajar varias imágenes de un jalón ───────────────────────
  const TABLA = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (u) => { let c = 0xffffffff; for (let i = 0; i < u.length; i++) c = TABLA[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  function zip(archivos) {            // [{ nombre, datos: Uint8Array }]
    const partes = [], central = []; let pos = 0; const txt = new TextEncoder();
    for (const a of archivos) {
      const n = txt.encode(a.nombre), crc = crc32(a.datos), cab = new DataView(new ArrayBuffer(30));
      cab.setUint32(0, 0x04034b50, true); cab.setUint16(4, 20, true); cab.setUint16(6, 0x0800, true); cab.setUint32(14, crc, true); cab.setUint32(18, a.datos.length, true); cab.setUint32(22, a.datos.length, true); cab.setUint16(26, n.length, true);
      const cen = new DataView(new ArrayBuffer(46)); cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true); cen.setUint32(16, crc, true); cen.setUint32(20, a.datos.length, true); cen.setUint32(24, a.datos.length, true); cen.setUint16(28, n.length, true); cen.setUint32(42, pos, true);
      partes.push(cab, n, a.datos); central.push(cen, n); pos += 30 + n.length + a.datos.length;
    }
    const tam = central.reduce((s, x) => s + x.byteLength, 0), fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, archivos.length, true); fin.setUint16(10, archivos.length, true); fin.setUint32(12, tam, true); fin.setUint32(16, pos, true);
    return new Blob([...partes, ...central, fin], { type: 'application/zip' });
  }
  const aPng = (canvas) => new Promise((si) => canvas.toBlob(si, 'image/png'));
  window.ArteMina = { pintar, zip, aPng, ESTILOS, FONDOS, PALETAS, FORMATOS };
})();
