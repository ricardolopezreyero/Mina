/* RLR · ArteMina — el generador de arte con gemas de la guía de estilos · Ricardo López Reyero · mina.capitaltorreon.com
   Acomoda las 22 gemas del juego en figuras simétricas (mandala, corona, sol, espiral, caleidoscopio, rombo, panal, flor)
   alrededor de la palabra MINA, quietas (PNG) o con movimiento en un bucle sin corte (GIF). Cada imagen sale de una semilla: la misma semilla, el mismo estilo y el mismo fondo dan
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
  // Las semillas de hasta 4,294,967,295 son las de siempre y dan lo de siempre. De ahí para arriba (hasta 2^53) la pieza es «única»:
  // su azar tiene 64 bits de arranque y, además de la figura, salen de la semilla una mezcla propia de gemas, un fondo de un tono
  // cualquiera del círculo de color y el tamaño de las gemas. Así hay muchísimas más piezas posibles que las que nadie alcanzará a ver.
  const GRANDE = 4294967296;
  function azarGrande(s) { let a = (s % GRANDE) | 0, b = Math.floor(s / GRANDE) | 0, c = 0x9e3779b9 | 0, d = 1; const r = () => { const t = (((a + b) | 0) + d) | 0; d = (d + 1) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); c = (c + t) | 0; return (t >>> 0) / GRANDE; }; for (let k = 0; k < 15; k++) r(); return r; }
  const FIGURAS_UNICAS = ['mandala', 'mandala', 'mandala', 'corona', 'corona', 'espiral', 'espiral', 'panal', 'panal', 'flor', 'flor', 'rombo', 'rombo', 'caleidoscopio', 'caleidoscopio'];      // el sol queda fuera: con mezclas al azar sale muy vacío
  const VISTOSAS = [3, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18], BARRAS = [4, 19, 20, 21];
  function mezclaUnica(rnd) {                 // de 3 a 6 gemas: dos vistosas seguro, y a lo mucho una barra
    const n = de(rnd, [3, 4, 4, 5, 5, 6]), m = []; let barra = false;
    while (m.length < 2) { const g = de(rnd, VISTOSAS); if (!m.includes(g)) m.push(g); }
    while (m.length < n) { const g = Math.floor(rnd() * 22); if (m.includes(g) || (BARRAS.includes(g) && barra)) continue; if (BARRAS.includes(g)) barra = true; m.push(g); }
    for (let k = m.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [m[k], m[j]] = [m[j], m[k]]; }
    return m;
  }
  const hsl = (h, s2, l) => `hsl(${(((h % 360) + 360) % 360).toFixed(1)},${s2.toFixed(1)}%,${l.toFixed(1)}%)`;
  function rgbDe(h, s2, l) { s2 /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s2 * Math.min(l, 1 - l), f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))); return `${f(0)},${f(8)},${f(4)}`; }
  const TONOS = [[20, 'rojo'], [45, 'naranja'], [70, 'ámbar'], [100, 'lima'], [160, 'verde'], [200, 'turquesa'], [245, 'azul'], [275, 'índigo'], [310, 'violeta'], [340, 'magenta'], [360, 'rojo']];
  function fondoUnico(rnd) {                  // tres tonos del mismo color, de claro a casi negro, como los fondos de siempre
    const h = rnd() * 360, sat = 46 + rnd() * 30, giro = rnd() * 36 - 18, luz = 30 + rnd() * 10;
    return { n: 'Fondo ' + TONOS.find((t) => h < t[0])[1], c: [hsl(h, sat, luz), hsl(h + giro * 0.5, sat + 6, luz * 0.52), hsl(h + giro, sat + 4, 4 + rnd() * 3)], rayo: rgbDe(h, 85, 86) };
  }

  // ── las figuras: cada una devuelve la lista de gemas {i, x, y, s, rot} y los radios de sus anillos ──────────────────────
  const ESTILOS = {
    mandala: { n: 'Mandala', f(e) {
      const o = [], an = []; let r = e.r0 + 34 * e.U, j = 0;
      while (r < e.RM + 220 * e.U) {
        const s = (150 + 34 * j) * e.U, m = Math.max(1, Math.round((TAU * r) / (s * 0.66) / e.N)), n = e.N * m, dos = m % 2 === 0 && e.rnd() < 0.75;
        const paso = (dos ? 2 : 1) * TAU / n, w = (j % 2 ? -1 : 1) * paso * Math.max(1, Math.round((TAU / e.N) * 0.5 / paso));
        for (let k = 0; k < n; k++) { const a = e.rot + (k + (j % 2) * 0.5) * TAU / n; o.push({ i: e.pal[(j + (dos && k % 2 ? 1 : 0)) % e.pal.length], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2, j, q: k % 2 ? 1 : -1, w }); }
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
        for (let k = 0; k < 11; k++) for (const lado of [1, -1]) { const a = -Math.PI / 2 + lado * (k + 0.5) * Math.PI / 11; o.push({ i: orden[k + 11 * (j % 2)], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2, fx: lado, j, q: lado * (k % 2 ? 1 : -1), w: 0 }); }
        an.push(r); r += s * 0.8; j++;
      }
      return { o, an, N: 11, rot: -Math.PI / 2 };
    } },
    sol: { n: 'Sol', f(e) {
      const o = [], n = de(e.rnd, [12, 16, 20, 24]), an = [e.r0 + 40 * e.U];
      for (let k = 0; k < n; k++) {
        const a = e.rot + k * TAU / n, corto = k % 2 === 1; let r = e.r0 + (corto ? 100 : 40) * e.U, t = 0;
        while (r < (corto ? e.RM * 0.62 : e.RM + 200 * e.U)) { const s = ((corto ? 96 : 122) + t * (corto ? 12 : 18)) * e.U; o.push({ i: e.pal[(t + (corto ? 1 : 0)) % e.pal.length], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2, j: t, q: corto ? 1 : -1, w: 2 * TAU / n }); r += s * 0.72; t++; }
      }
      return { o, an, N: n / 2 };
    } },
    espiral: { n: 'Espiral', f(e) {
      // anillos de 24 gemas que crecen hacia afuera; cada anillo va medio paso girado y los colores se recorren: salen brazos que se enroscan
      const o = [], an = [], n = 24, dir = e.rnd() < 0.5 ? 1 : -1, c = Math.min(e.pal.length, de(e.rnd, [2, 3, 3, 4, 4, 6])), salto = de(e.rnd, [1, 1, 2]);
      let r = e.r0 + 36 * e.U, t = 0;
      while (r < e.RM + 260 * e.U) {
        const s = (TAU * r) / n / 0.8;
        for (let k = 0; k < n; k++) { const a = e.rot + (k + dir * t * 0.5) * TAU / n; o.push({ i: e.pal[(((k + t * salto) % c) + c) % c], x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r, s, rot: a + Math.PI / 2 + dir * 0.5, j: t, q: k % 2 ? 1 : -1, w: n % c || c > 3 ? 0 : (t % 2 ? -1 : 1) * c * TAU / n }); }      // con más de tres colores el paso sería de 60° o 90°: demasiado rápido, mejor otro movimiento
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
        pts.push({ x, y, s, th, r, enEje, i: de(e.rnd, e.pal), j: pts.length });
      }
      for (const p of pts) for (let k = 0; k < N; k++) for (const lado of p.enEje ? [1] : [1, -1]) { const a = e.rot + lado * p.th + k * TAU / N; o.push({ i: p.i, x: e.cx + Math.cos(a) * p.r, y: e.cy + Math.sin(a) * p.r, s: p.s, rot: a + Math.PI / 2, j: Math.round((p.r - e.r0) / (120 * e.U)), q: lado, w: TAU / N }); }
      return { o, an: [] };
    } },
    rombo: { n: 'Rombos', f(e) {
      const o = [], d = de(e.rnd, [150, 170, 196]) * e.U, p = d * 0.62, n = Math.ceil(e.RM / p) + 2;
      for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) { if ((i + j) & 1) continue; o.push({ i: e.pal[((Math.abs(i) + Math.abs(j)) / 2) % e.pal.length], x: e.cx + i * p, y: e.cy + j * p, s: d, rot: 0, j: (Math.abs(i) + Math.abs(j)) / 2, q: (Math.abs(i) % 2 ? 1 : -1) * (i * j < 0 ? -1 : 1), w: 0 }); }
      return { o, an: [], N: 4, rot: Math.PI / 4 };
    } },
    panal: { n: 'Panal', f(e) {
      const sinBarras = e.pal.filter((i) => ![4, 19, 20, 21].includes(i)); e.pal = sinBarras.length > 1 ? sinBarras : sinBarras.concat([8, 7, 6]);      // en el panal las barras se vuelven rayas: mejor gemas redondas
      const o = [], d = de(e.rnd, [150, 172, 200]) * e.U, p = d * 0.74, n = Math.ceil(e.RM / p) + 2;
      for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) { const anillo = Math.max(Math.abs(a), Math.abs(b), Math.abs(a + b)); o.push({ i: e.pal[anillo % e.pal.length], x: e.cx + p * (a + b / 2), y: e.cy + p * b * 0.866, s: d, rot: 0, j: anillo, q: (a + b / 2) < 0 ? -1 : 1, w: 0 }); }
      return { o, an: [], N: 6, rot: 0 };
    } },
    flor: { n: 'Flor', f(e) {
      const o = [], an = [], N = de(e.rnd, [5, 6, 8]), n = N * 10;
      for (let L = 0, rb = e.r0 + 24 * e.U; rb < e.RM + 100 * e.U; L++, rb += 190 * e.U) {
        for (let k = 0; k < n; k++) { const a = e.rot + k * TAU / n, pet = Math.pow(Math.abs(Math.cos(N * (a - e.rot) / 2)), 0.85); o.push({ i: e.pal[(L + (pet > 0.62 ? 1 : 0)) % e.pal.length], x: e.cx + Math.cos(a) * (rb + pet * 215 * e.U * (1 + L * 0.3)), y: e.cy + Math.sin(a) * (rb + pet * 215 * e.U * (1 + L * 0.3)), s: (88 + pet * 74 + L * 22) * e.U, rot: a + Math.PI / 2, j: L * 2 + (pet > 0.62 ? 1 : 0), q: k % 2 ? 1 : -1, w: (L % 2 ? -1 : 1) * TAU / N }); }
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

  // ── de la semilla a la escena: todo lo que se decide al azar, siempre en el mismo orden (así cada semilla da lo mismo) ──
  async function derivar(op = {}) {
    const P = await cargar(op.base || ''), s0 = Math.floor(+op.semilla || 0), semilla = s0 >= 1 && s0 <= Number.MAX_SAFE_INTEGER ? s0 : 1 + Math.floor(Math.random() * 999999);
    const unica = semilla >= GRANDE, rnd = unica ? azarGrande(semilla) : azar(semilla * 2654435761);
    let estilo, E, fondo, F, paleta, pal, palN;
    if (!unica) {
      estilo = ESTILOS[op.estilo] ? op.estilo : de(rnd, Object.keys(ESTILOS)); E = ESTILOS[estilo];
      fondo = FONDOS[op.fondo] ? op.fondo : de(rnd, Object.keys(FONDOS)); F = FONDOS[fondo];
      paleta = PALETAS[op.paleta] ? op.paleta : de(rnd, Object.keys(PALETAS)); if (E.todas) paleta = 'todas';
      pal = PALETAS[paleta].g.slice(); if (paleta !== 'todas' && paleta !== 'corteza') for (let k = pal.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [pal[k], pal[j]] = [pal[j], pal[k]]; }
      palN = PALETAS[paleta].n;
    } else {
      estilo = ESTILOS[op.estilo] ? op.estilo : de(rnd, FIGURAS_UNICAS); E = ESTILOS[estilo];
      if (FONDOS[op.fondo]) { fondo = op.fondo; F = FONDOS[fondo]; } else { fondo = 'unico'; F = fondoUnico(rnd); }
      if (E.todas) { paleta = 'todas'; pal = PALETAS.todas.g.slice(); palN = PALETAS.todas.n; }
      else if (PALETAS[op.paleta]) { paleta = op.paleta; pal = PALETAS[paleta].g.slice(); for (let k = pal.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [pal[k], pal[j]] = [pal[j], pal[k]]; } palN = PALETAS[paleta].n; }
      else { paleta = 'unica'; pal = mezclaUnica(rnd); palN = pal.length + ' gemas'; }
    }
    const [W0, H0] = FORMATOS[op.formato] || FORMATOS.vertical, esc = Math.min(1, Math.max(0.15, +op.escala || 1)), w = esc === 1 ? W0 : Math.round(W0 * esc / 2) * 2, h = esc === 1 ? H0 : Math.round(H0 * esc / 2) * 2;
    const cx = w / 2, cy = h / 2, U = Math.min(w, h) / 1080, RM = Math.hypot(w, h) / 2, Wm = 600 * U, r0 = Wm * 0.66;
    const e = { w, h, cx, cy, U, RM, r0, pal, rnd, N: de(rnd, unica ? [5, 6, 7, 8, 9, 10, 12, 14] : [6, 8, 10, 12]), rot: -Math.PI / 2 };
    if (unica) { e.U = U * (0.86 + rnd() * 0.3); if ((estilo === 'mandala' || estilo === 'caleidoscopio') && rnd() < 0.5) e.rot += Math.PI / e.N; }      // gemas más chicas o más grandes, y la figura con un pico o con un valle hacia arriba
    const fig = E.f(e), N = fig.N || e.N, rot = fig.rot !== undefined ? fig.rot : e.rot;
    const chispas = []; for (let t = 0; t < 16; t++) chispas.push({ th: rnd() * Math.PI / N, r: r0 * 0.7 + rnd() * RM, ta: (4 + rnd() * 9) * U, alfa: 0.3 + rnd() * 0.55 });
    return { P, semilla, unica, estilo, E, fondo, F, paleta, palN, w, h, cx, cy, U, RM, Wm, r0, fig, N, rot, chispas, liga: op.liga !== false, rx: Wm * 0.58, ry: Wm * 0.25 };
  }
  // el fondo: tres tonos desde el centro y rayos tenues, con la misma simetría de la figura
  function fondoEn(q, D) {
    const { w, h, cx, cy, RM, F, N, rot } = D, g = q.createRadialGradient(cx, cy, 0, cx, cy, RM); g.addColorStop(0, F.c[0]); g.addColorStop(0.5, F.c[1]); g.addColorStop(1, F.c[2]); q.fillStyle = g; q.fillRect(0, 0, w, h);
    q.fillStyle = `rgba(${F.rayo},0.05)`; for (let k = 0; k < N * 2; k += 2) { const a = rot + (k - 0.5) * TAU / (N * 2); q.beginPath(); q.moveTo(cx, cy); q.arc(cx, cy, RM * 1.1, a, a + TAU / (N * 2)); q.closePath(); q.fill(); }
  }
  // el polvo de luz; con t (0 a 1) cada chispa parpadea a su ritmo y vuelve a donde empezó
  function chispasEn(q, D, t, fases) {
    const { cx, cy, F, N, rot } = D;
    D.chispas.forEach((c, n) => {
      const alfa = t === null ? c.alfa : c.alfa * (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(TAU * (t * (1 + n % 2) + fases[n])))), ta = t === null ? c.ta : c.ta * (0.7 + 0.5 * (0.5 + 0.5 * Math.sin(TAU * (t * (1 + n % 2) + fases[n]))));
      q.fillStyle = `rgba(${F.rayo},${alfa})`;
      for (let k = 0; k < N; k++) for (const lado of [1, -1]) { const a = rot + lado * c.th + k * TAU / N, x = cx + Math.cos(a) * c.r, y = cy + Math.sin(a) * c.r; q.beginPath(); q.moveTo(x, y - ta * 2); q.quadraticCurveTo(x, y, x + ta * 2, y); q.quadraticCurveTo(x, y, x, y + ta * 2); q.quadraticCurveTo(x, y, x - ta * 2, y); q.quadraticCurveTo(x, y, x, y - ta * 2); q.fill(); }
    });
  }
  function anillosEn(q, D) { q.strokeStyle = `rgba(${D.F.rayo},0.16)`; q.lineWidth = 2 * D.U; for (const r of [D.r0 * 0.94, ...D.fig.an]) { q.beginPath(); q.arc(D.cx, D.cy, r, 0, TAU); q.stroke(); } }
  const fueraDelCentro = (D, p) => { const dx = (p.x - D.cx) / (D.rx + p.s * 0.3), dy = (p.y - D.cy) / (D.ry + p.s * 0.3); return dx * dx + dy * dy >= 1; };
  const deAfuera = (D) => (a, b) => Math.hypot(b.x - D.cx, b.y - D.cy) - Math.hypot(a.x - D.cx, a.y - D.cy);
  const gemaEn = (q, D, i, x, y, s, rot, fx) => { q.save(); q.translate(x, y); if (rot) q.rotate(rot); if (fx === -1) q.scale(-1, 1); q.drawImage(D.P.gemas[i], -s / 2, -s / 2, s, s); q.restore(); };
  // lo que va encima: la orilla que se oscurece, el halo, la palabra y el cintillo con la liga
  function encimaEn(q, D) {
    const { w, h, cx, cy, U, RM, Wm, P } = D;
    const v = q.createRadialGradient(cx, cy, Math.min(w, h) * 0.42, cx, cy, RM); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.6)'); q.fillStyle = v; q.fillRect(0, 0, w, h);
    q.save(); q.translate(cx, cy); q.scale(1, 0.5); const hl = q.createRadialGradient(0, 0, 0, 0, 0, Wm * 0.72); hl.addColorStop(0, 'rgba(10,6,4,0.9)'); hl.addColorStop(0.6, 'rgba(10,6,4,0.55)'); hl.addColorStop(1, 'rgba(10,6,4,0)'); q.fillStyle = hl; q.beginPath(); q.arc(0, 0, Wm * 0.72, 0, TAU); q.fill(); q.restore();
    const ph = Wm * P.palabra.height / P.palabra.width; q.drawImage(P.palabra, cx - Wm / 2, cy - ph / 2, Wm, ph);
    if (D.liga) { const cw = (w > h ? 0.36 : 0.6) * w, ch = cw * P.cintillo.height / P.cintillo.width, y = h > w * 1.5 ? h * 0.75 - ch - 20 * U : h - ch - 26 * U; q.drawImage(P.cintillo, cx - cw / 2, y, cw, ch); }
  }
  const datos = (D, n, mov) => ({ semilla: D.semilla, unica: D.unica, estilo: D.estilo, fondo: D.fondo, paleta: D.paleta, gemas: n, movimiento: mov || '', nombres: { figura: D.E.n, gemas: D.palN, fondo: D.F.n, movimiento: mov ? MOVIMIENTOS[mov] : '' }, texto: `${D.E.n} · ${D.palN} · ${D.F.n}${mov ? ' · ' + MOVIMIENTOS[mov] : ''} · semilla ${D.semilla}`, nombre: `mina-arte-${D.estilo}-${D.semilla}.${mov ? 'gif' : 'png'}` });

  // ── la imagen quieta ───────────────────────────────────────────────────────────────────────────────────────────────────
  async function pintar(canvas, op = {}) {
    const D = await derivar(op); canvas.width = D.w; canvas.height = D.h; const q = canvas.getContext('2d');
    fondoEn(q, D); chispasEn(q, D, null); anillosEn(q, D);
    // las gemas: fuera del óvalo del centro, de afuera hacia adentro para que las de adentro queden encima
    const lista = D.fig.o.filter((p) => fueraDelCentro(D, p) && p.x > -p.s && p.x < D.w + p.s && p.y > -p.s && p.y < D.h + p.s).sort(deAfuera(D));
    for (const p of lista) gemaEn(q, D, p.i, p.x, p.y, p.s, p.rot, p.fx);
    encimaEn(q, D);
    return datos(D, lista.length);
  }

  // ── la imagen con movimiento ───────────────────────────────────────────────────────────────────────────────────────────
  // Todo movimiento es una función del tiempo t (de 0 a 1) que en t = 1 vale lo mismo que en t = 0: por eso el bucle no tiene corte.
  //   giro    · cada anillo da un paso de su propia simetría (los vecinos, en sentidos contrarios): al terminar, cada gema está donde había otra igual
  //   latido  · las gemas crecen en dos golpes, como corazón, y la onda sale del centro hacia la orilla
  //   ola     · los anillos se acercan y se alejan del centro, uno tras otro
  //   vaiven  · cada gema se mece sobre su sitio, las vecinas al revés, como caleidoscopio
  //   cascada · un brillo baja desde arriba por los dos lados a la vez y enciende cada gema al pasar
  const MOVIMIENTOS = { giro: 'Giro', latido: 'Latido', ola: 'Ola', vaiven: 'Vaivén', cascada: 'Cascada' };
  const golpe = (x, c, ancho) => (x < c || x > c + ancho ? 0 : Math.pow(Math.sin(Math.PI * (x - c) / ancho), 2));
  async function preparar(op = {}) {
    const D = await derivar(op), r2 = azar((D.semilla ^ 0x51f15e) * 40503 + 7);
    const lista = D.fig.o.filter((p) => fueraDelCentro(D, p)).sort(deAfuera(D));
    for (const p of lista) { p.a0 = Math.atan2(p.y - D.cy, p.x - D.cx); p.rr = Math.hypot(p.x - D.cx, p.y - D.cy); p.cima = Math.abs(Math.atan2(Math.sin(p.a0 + Math.PI / 2), Math.cos(p.a0 + Math.PI / 2))) / Math.PI; }      // cima: 0 arriba, 1 abajo, igual a la izquierda que a la derecha
    const gira = lista.some((p) => p.w), posibles = gira ? ['giro', 'giro', 'latido', 'ola', 'vaiven', 'cascada'] : ['latido', 'ola', 'vaiven', 'cascada'];
    let mov = MOVIMIENTOS[op.movimiento] ? op.movimiento : de(r2, posibles); if (mov === 'giro' && !gira) mov = 'ola';
    const jMax = Math.max(1, ...lista.map((p) => p.j || 0));
    const capa = (dibuja) => { const c = document.createElement('canvas'); c.width = D.w; c.height = D.h; dibuja(c.getContext('2d')); return c; };
    return { D, lista, mov, jMax, fases: D.chispas.map(() => r2()), fondoC: capa((q) => { fondoEn(q, D); anillosEn(q, D); }), encimaC: capa((q) => encimaEn(q, D)), info: datos(D, lista.length, mov) };
  }
  // El bucle dura lo que se pida. El movimiento principal se repite cada 3 segundos (k veces por bucle) y, de 4 segundos en adelante,
  // se le suma un «acento» que pasa una sola vez por bucle: así un bucle de 6 o de 12 segundos no se siente como uno de 3 repetido.
  const coreografia = (A, seg) => { A.seg = seg; A.k = Math.max(1, Math.round(seg / 3)); A.acento = seg >= 4; return A; };
  const frac = (x) => ((x % 1) + 1) % 1;
  function cuadro(q, A, t) {
    const { D, mov, jMax, k, acento } = A, { cx, cy, w, h } = D, tp = t * k, T = TAU * tp, Tl = TAU * t, tg = acento ? tp + 0.1 * Math.sin(Tl) : tp;      // tg: el giro toma vuelo y se frena una vez por bucle
    q.drawImage(A.fondoC, 0, 0); chispasEn(q, D, t, A.fases);
    for (const p of A.lista) {
      const f = (p.j || 0) / jMax, pq = p.q || 1;      // f: 0 en el anillo de adentro, 1 en el de afuera
      let a = p.a0, r = p.rr, s = p.s, rot = p.rot || 0;
      if (mov === 'giro') {
        a += p.w * tg; rot += p.w * tg; s *= 1 + 0.045 * Math.sin(T * 2 - f * 5);
        if (acento) s *= 1 + 0.2 * golpe(frac(t - f * 0.45), 0, 0.2);                                   // un latido que sale del centro
      } else if (mov === 'latido') {
        const x = frac(tp - f * 0.42); s *= 1 + 0.2 * (golpe(x, 0, 0.2) + 0.55 * golpe(x, 0.24, 0.2));
        if (acento) { const g = golpe(frac(t - 0.5 - p.cima * 0.5 - f * 0.1), 0, 0.16); s *= 1 + 0.22 * g; rot += pq * 0.25 * g; }      // entre latido y latido, un brillo que baja por los dos lados
      } else if (mov === 'ola') {
        r *= 1 + 0.05 * Math.sin(T - f * 7); s *= 1 + 0.1 * Math.sin(T - f * 7 + 1.3); rot += pq * 0.1 * Math.sin(T - f * 7);
        if (acento) { const g = golpe(frac(t - p.cima * 0.8 - f * 0.18), 0, 0.2); s *= 1 + 0.24 * g; }  // un brillo que baja por los dos lados
      } else if (mov === 'cascada') {
        const g = golpe(frac(tp - p.cima * 0.8 - f * 0.18), 0, 0.3); s *= 1 + 0.3 * g; rot += pq * 0.22 * g;
        if (acento) r *= 1 + 0.035 * Math.sin(Tl - f * 5);                                              // y los anillos respiran
      } else {
        rot += pq * 0.42 * Math.sin(T - f * 4.5); s *= 1 + 0.05 * Math.sin(T * 2 - f * 4.5);
        if (acento) s *= 1 + 0.2 * golpe(frac(t - f * 0.45), 0, 0.2);                                   // un latido que sale del centro
      }
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (x > -s && x < w + s && y > -s && y < h + s) gemaEn(q, D, p.i, x, y, s, rot, p.fx);
    }
    q.drawImage(A.encimaC, 0, 0);
  }
  // La vista en vivo: pinta el bucle en el lienzo hasta que se llama a parar().
  async function animar(canvas, op = {}) {
    const seg = Math.max(1, +op.segundos || 6), A = coreografia(await preparar({ escala: 0.5, ...op }), seg), q = canvas.getContext('2d'); canvas.width = A.D.w; canvas.height = A.D.h;
    let vivo = true, t0 = performance.now(), ult = 0; const cada = op.fps ? 1000 / op.fps - 2 : 0;      // fps: para pintar menos seguido cuando hay muchas a la vez (la galería)
    const paso = (ahora) => { if (!vivo) return; if (canvas.isConnected !== false && ahora - ult >= cada) { ult = ahora; cuadro(q, A, (((ahora - t0) / (seg * 1000)) % 1 + 1) % 1); } requestAnimationFrame(paso); };
    cuadro(q, A, 0); requestAnimationFrame(paso);
    return { info: A.info, parar() { vivo = false; } };
  }

  // ── el GIF: paleta de 255 colores sacada de la propia imagen (más uno transparente) y compresión LZW, sin librerías ─────
  function paletaDe(H, cuantos) {             // H: cuántas veces sale cada color, a 6 bits por canal. Corte por la mediana, repartido para que las gemas no se queden sin tonos.
    const todos = []; for (let i = 0; i < H.length; i++) if (H[i]) todos.push(i);
    const caja = (l) => { let a = [63, 63, 63], b = [0, 0, 0], n = 0; for (const c of l) { const v = [c >> 12, (c >> 6) & 63, c & 63]; for (let k = 0; k < 3; k++) { if (v[k] < a[k]) a[k] = v[k]; if (v[k] > b[k]) b[k] = v[k]; } n += H[c]; } const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], eje = d[0] >= d[1] && d[0] >= d[2] ? 0 : d[1] >= d[2] ? 1 : 2; return { l, n, eje, peso: l.length > 1 ? d[eje] * Math.sqrt(n) : -1 }; };
    const cajas = [caja(todos)];
    while (cajas.length < cuantos) {
      let m = -1, mejor = 0; for (let k = 0; k < cajas.length; k++) if (cajas[k].peso > mejor) { mejor = cajas[k].peso; m = k; }
      if (m < 0) break;
      const c = cajas[m], corr = [12, 6, 0][c.eje]; c.l.sort((x, y) => ((x >> corr) & 63) - ((y >> corr) & 63));
      let acum = 0, corte = 1; for (let k = 0; k < c.l.length - 1; k++) { acum += H[c.l[k]]; corte = k + 1; if (acum >= c.n / 2) break; }
      cajas.splice(m, 1, caja(c.l.slice(0, corte)), caja(c.l.slice(corte)));
    }
    const pal = new Uint8Array(256 * 3);
    cajas.forEach((c, k) => { let r = 0, g = 0, b = 0; for (const x of c.l) { const n = H[x]; r += (x >> 12) * n; g += ((x >> 6) & 63) * n; b += (x & 63) * n; } const v = (t) => { const s6 = Math.round(t / c.n); return (s6 << 2) | (s6 >> 4); }; pal[k * 3] = v(r); pal[k * 3 + 1] = v(g); pal[k * 3 + 2] = v(b); });
    return { pal, n: cajas.length };
  }
  const lzwTabla = new Int16Array(1 << 20), lzwGen = new Int32Array(1 << 20); let lzwG = 0;
  function lzw(idx, sal) {                    // idx: un índice de la paleta por pixel. Escribe en sal los bloques del GIF.
    const LIMPIA = 256, FIN = 257; let bits = 9, tope = 511, libre = 258, limpiar = false, acum = 0, n = 0, g = ++lzwG;
    const blo = new Uint8Array(255); let nb = 0;
    const byte = (v) => { blo[nb++] = v; if (nb === 255) { sal.push(255); for (let k = 0; k < 255; k++) sal.push(blo[k]); nb = 0; } };
    const emite = (cod) => {
      acum |= cod << n; n += bits; while (n >= 8) { byte(acum & 255); acum >>>= 8; n -= 8; }
      if (limpiar) { bits = 9; tope = 511; limpiar = false; } else if (libre > tope) { bits++; tope = bits === 12 ? 4096 : (1 << bits) - 1; }
    };
    emite(LIMPIA); let pre = idx[0];
    for (let i = 1; i < idx.length; i++) {
      const c = idx[i], llave = (pre << 8) | c;
      if (lzwGen[llave] === g) { pre = lzwTabla[llave]; continue; }
      emite(pre); pre = c;
      if (libre < 4096) { lzwTabla[llave] = libre++; lzwGen[llave] = g; } else { g = ++lzwG; libre = 258; limpiar = true; emite(LIMPIA); }
    }
    emite(pre); emite(FIN); if (n > 0) byte(acum & 255);
    if (nb) { sal.push(nb); for (let k = 0; k < nb; k++) sal.push(blo[k]); }
    sal.push(0);
  }
  // El armador de GIF, suelto: sirve para el arte con gemas y para cualquier otra cosa que entregue cuadros (el gameplay).
  // Uso: muestra(pixeles) con unos cuantos cuadros de todo el clip → cuadro(pixeles) con cada uno, en orden → blob().
  function armador(w, h, espera) {
    const H = new Uint32Array(1 << 18), clave = (d, i) => ((d[i] >> 2) << 12) | ((d[i + 1] >> 2) << 6) | (d[i + 2] >> 2);
    let pal = null, nPal = 0, cerca = null, k = 0; const sal = [], partes = [], u16 = (v) => { sal.push(v & 255, (v >> 8) & 255); };
    const idx = new Uint8Array(w * h), visto = new Uint8Array(w * h), fuera = new Uint8Array(w * h);
    const masCerca = (c) => { const r = ((c >> 12) << 2) | 2, g2 = (((c >> 6) & 63) << 2) | 2, b = ((c & 63) << 2) | 2; let m = 0, dm = 1e9; for (let j = 0; j < nPal; j++) { const dr = pal[j * 3] - r, dg = pal[j * 3 + 1] - g2, db = pal[j * 3 + 2] - b, dd = dr * dr * 2 + dg * dg * 4 + db * db * 3; if (dd < dm) { dm = dd; m = j; } } return m; };
    return {
      muestra(d) { for (let i = 0; i < d.length; i += 8) H[clave(d, i)]++; },
      cuadro(d) {
        if (!pal) {                         // con el primer cuadro se cierra la paleta y se escribe el encabezado
          ({ pal, n: nPal } = paletaDe(H, 255)); cerca = new Int16Array(1 << 18).fill(-1);
          for (const ch of 'GIF89a') sal.push(ch.charCodeAt(0));
          u16(w); u16(h); sal.push(0xf7, 0, 0); for (let j = 0; j < 768; j++) sal.push(pal[j]);
          sal.push(0x21, 0xff, 0x0b); for (const ch of 'NETSCAPE2.0') sal.push(ch.charCodeAt(0)); sal.push(3, 1, 0, 0, 0);      // se repite para siempre
        }
        for (let i = 0, p = 0; p < idx.length; i += 4, p++) { const kk = clave(d, i); let m = cerca[kk]; if (m < 0) m = cerca[kk] = masCerca(kk); idx[p] = m; }
        // lo que no cambió desde el cuadro anterior va transparente: se comprime mucho mejor
        if (k === 0) fuera.set(idx); else for (let p = 0; p < idx.length; p++) fuera[p] = idx[p] === visto[p] ? 255 : idx[p];
        visto.set(idx);
        sal.push(0x21, 0xf9, 4, k === 0 ? 0x04 : 0x05); u16(espera); sal.push(255, 0, 0x2c); u16(0); u16(0); u16(w); u16(h); sal.push(0, 8);
        lzw(fuera, sal); k++;
        if (sal.length > 4e6) partes.push(new Uint8Array(sal.splice(0)));
      },
      blob() { sal.push(0x3b); partes.push(new Uint8Array(sal.splice(0))); return new Blob(partes, { type: 'image/gif' }); },
    };
  }
  // Devuelve el GIF listo (Blob). ajustes: segundos (duración del bucle), fps (si no se dice: 20 hasta 4 s, 16.7 hasta 8 s y 12.5 de ahí en adelante, para que no pese de más), alAvance(0 a 1).
  async function gif(op = {}, ajustes = {}) {
    const seg = Math.max(1, +ajustes.segundos || 6), fps = +ajustes.fps || (seg <= 4 ? 20 : seg <= 8 ? 16.7 : 12.5), A = coreografia(await preparar({ escala: 0.5, ...op }), seg), { w, h } = A.D, espera = Math.max(4, Math.min(10, Math.round(100 / fps))), cuadros = Math.max(8, Math.round(seg * 100 / espera));
    const c = document.createElement('canvas'); c.width = w; c.height = h; const q = c.getContext('2d', { willReadFrequently: true }), G = armador(w, h, espera);
    for (let k = 0; k < 6; k++) { cuadro(q, A, k / 6); G.muestra(q.getImageData(0, 0, w, h).data); }      // la paleta sale de seis cuadros repartidos por todo el bucle
    for (let k = 0; k < cuadros; k++) {
      cuadro(q, A, k / cuadros); G.cuadro(q.getImageData(0, 0, w, h).data);
      if (ajustes.alAvance) ajustes.alAvance((k + 1) / cuadros); await new Promise((r) => setTimeout(r, 0));
    }
    return Object.assign(G.blob(), { info: { ...A.info, cuadros, segundos: cuadros * espera / 100, ancho: w, alto: h } });
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
  window.ArteMina = { pintar, animar, gif, armador, zip, aPng, ESTILOS, FONDOS, PALETAS, FORMATOS, MOVIMIENTOS };
})();
