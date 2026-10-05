// Se inyecta en la página del juego (modo ?foto) para sacar arte crudo: escenas limpias y maquinitas sin fondo.
window.__kit = (() => {
  const cava = (a, b, c, d) => { for (let x = a; x <= c; x++) for (let y = b; y <= d; y++) ponerCavada(y * W + x); };
  const mineral = (x, y, k) => { const i = y * W + x; base[i] = 10 + k; mapa[i] = 255; };
  function montar(esc) {
    dug.fill(0); mapa.fill(255); bloques.clear(); otros.clear(); flot = []; parts = [];
    for (const [x, y, k] of esc.min || []) mineral(x, y, k);
    for (const r of esc.cava) cava(...r);
    const h = esc.heroe; yo.x = h.x; yo.y = h.y; yo.dir = h.dir || 1; yo.vuela = !!h.vuela; yo.planea = false;
    yo.perf = h.perf ? { tx: Math.floor(h.x), ty: Math.floor(h.y) + 1, t: 0.1, dur: 0.3, tipo: 1, ox: h.x, oy: h.y, idx: 0 } : null;
    vis.x = yo.x; vis.y = yo.y; miNombre = h.n; miModelo = h.m | 0; miPinta = h.p || {};
    (esc.otros || []).forEach((o, k) => otros.set(k + 1, { i: k + 1, n: o.n, m: o.m, on: 1, x: o.x, y: o.y, fl: o.fl | 0, p: o.p || {} }));
    flot = (esc.flot || []).map(([x, y, txt, col]) => ({ x, y, txt, col: col || '#ffd23f', t: 1.2 }));
    op.nombres = esc.nombres === false ? 0 : 1; reloj = esc.reloj || 2.2; tiempo = 100; pozoHondo.x = -1; pozoHondo.v = dugCambios; pozoHondo.t = performance.now() + 1e9;
  }
  function escena(w, h, celdas, cx, cy) {
    RES = 1; lienzo.width = w; lienzo.height = h; T = Math.round(w / celdas); cols = w / T; filas = h / T;
    tiles.clear(); casas.clear(); sprites.clear(); bloques.clear(); bloquesLibres.length = 0; bloquesTope = (Math.ceil(cols / BL) + 1) * (Math.ceil(filas / BL) + 1) + 6;
    camX = cx - cols / 2; camY = cy - filas / 2; temblor = 0;
    dibujar(); dibujar();
    return lienzo.toDataURL('image/png');
  }
  function maq(modelo, pinta, t, pose, dir) {
    const c = document.createElement('canvas'); c.width = c.height = Math.round(t * 1.9); const q = c.getContext('2d');
    reloj = 2.2; dibMaq(q, c.width / 2, c.height * 0.55, t, modelo, dir || 1, pose === 'vuela' ? 1 : 0, pose === 'perfora' ? 2 : pose === 'lado' ? (dir || 1) : 0, '', '', 0, pinta || null);
    return c.toDataURL('image/png');
  }
  function qrMatriz(texto) { const R = qr(texto); return R ? R.map((f) => [...f].map((v) => (v ? 1 : 0))) : null; }
  return { montar, escena, maq, qrMatriz };
})();
'ok'
