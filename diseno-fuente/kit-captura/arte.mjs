// Saca imágenes del generador de arte (publico/guia-estilos/arte.js) con Chrome sin ventana. Uso: node arte.mjs <carpeta> <lista.json>
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const S = path.dirname(new URL(import.meta.url).pathname), PUERTO = 9334, dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const salida = process.argv[2], lista = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')); fs.mkdirSync(salida, { recursive: true });
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=' + PUERTO, '--user-data-dir=' + S + '/chrome2', '--window-size=1280,800', '--no-first-run', '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' });
try {
  let t = null; for (let i = 0; i < 60 && !t; i++) { await dormir(250); try { t = await (await fetch(`http://127.0.0.1:${PUERTO}/json`)).json(); } catch {} }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r, n) => { ws.onopen = r; ws.onerror = n; });
  let id = 0; const pend = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await cmd('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 900)); return r.result.result.value; };
  await cmd('Page.enable'); await cmd('Page.navigate', { url: 'http://localhost:8791/guia-estilos/kit.json' }); await dormir(1500);
  await ev(fs.readFileSync(path.resolve(S, '../../publico/guia-estilos/arte.js'), 'utf8') + "\n'ok'");
  for (const j of lista) {
    const r = JSON.parse(await ev(`(async () => { const c = document.createElement('canvas'); const i = await ArteMina.pintar(c, ${JSON.stringify({ ...j.op, base: 'http://localhost:8791/guia-estilos/' })}); return JSON.stringify({ i, u: c.toDataURL('image/png') }); })()`));
    fs.writeFileSync(`${salida}/${j.nombre}.png`, Buffer.from(r.u.slice(22), 'base64')); fs.writeFileSync(`${salida}/${j.nombre}.json`, JSON.stringify({ ...r.i, titulo: j.titulo || r.i.texto })); console.log('✔', j.nombre, r.i.texto, r.i.gemas);
  }
  ws.close();
} finally { chrome.kill(); }
