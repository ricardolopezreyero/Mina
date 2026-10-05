// Saca GIF del generador de arte (publico/guia-estilos/arte.js) con Chrome sin ventana. Uso: node gif.mjs <carpeta> <lista.json>
// lista: [{ nombre, op: { estilo, paleta, fondo, semilla, formato, movimiento, escala }, ajustes: { segundos, fps } }]
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const S = path.dirname(new URL(import.meta.url).pathname), PUERTO = 9337, dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const salida = process.argv[2], lista = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')); fs.mkdirSync(salida, { recursive: true });
const ARTE = path.resolve(S, '../../publico/guia-estilos/arte.js');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=' + PUERTO, '--user-data-dir=' + S + '/chrome6', '--window-size=1280,800', '--no-first-run', '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' });
try {
  let t = null; for (let i = 0; i < 60 && !t; i++) { await dormir(250); try { t = await (await fetch(`http://127.0.0.1:${PUERTO}/json`)).json(); } catch {} }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r, n) => { ws.onopen = r; ws.onerror = n; });
  let id = 0; const pend = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await cmd('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 900)); return r.result.result.value; };
  await cmd('Page.enable'); await cmd('Page.navigate', { url: 'http://localhost:8791/guia-estilos/kit.json' }); await dormir(1500);
  await ev(fs.readFileSync(ARTE, 'utf8') + "\n'ok'");
  for (const j of lista) {
    const r = JSON.parse(await ev(`(async () => { const t0 = performance.now(); const b = await ArteMina.gif(${JSON.stringify({ ...j.op, base: 'http://localhost:8791/guia-estilos/' })}, ${JSON.stringify(j.ajustes || {})}); window.__u = new Uint8Array(await b.arrayBuffer()); return JSON.stringify({ i: b.info, n: __u.length, ms: Math.round(performance.now() - t0) }); })()`));
    const partes = []; for (let p = 0; p < r.n; p += 600000) partes.push(Buffer.from(await ev(`(() => { let s = ''; const u = __u.subarray(${p}, ${p + 600000}); for (let k = 0; k < u.length; k += 8192) s += String.fromCharCode.apply(null, u.subarray(k, k + 8192)); return btoa(s); })()`), 'base64'));
    fs.writeFileSync(`${salida}/${j.nombre}.gif`, Buffer.concat(partes)); fs.writeFileSync(`${salida}/${j.nombre}.json`, JSON.stringify({ ...r.i, titulo: j.titulo || r.i.texto }));
    console.log('✔', j.nombre, r.i.texto, `${r.i.ancho}×${r.i.alto}`, r.i.cuadros + ' cuadros', (r.n / 1048576).toFixed(1) + ' MB', r.ms + ' ms');
  }
  ws.close();
} finally { chrome.kill(); }
