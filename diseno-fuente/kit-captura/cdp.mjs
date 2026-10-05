// Arranca Chrome sin ventana, abre el juego en modo ?foto y corre los trabajos de trabajos.mjs; guarda cada imagen.
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const S = path.dirname(new URL(import.meta.url).pathname), PUERTO = 9333, dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=' + PUERTO, '--user-data-dir=' + S + '/chrome', '--window-size=1280,800', '--hide-scrollbars', '--no-first-run', '--force-device-scale-factor=1', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
try {
  let lista = null; for (let i = 0; i < 60 && !lista; i++) { await dormir(250); try { lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json`)).json(); } catch {} }
  const pag = lista.find((t) => t.type === 'page'), ws = new WebSocket(pag.webSocketDebuggerUrl); await new Promise((r, n) => { ws.onopen = r; ws.onerror = n; });
  let id = 0; const pend = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await cmd('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 900)); return r.result.result.value; };
  await cmd('Page.enable'); await cmd('Page.navigate', { url: 'http://localhost:8791/?foto' }); await dormir(4000);
  await ev(fs.readFileSync(S + '/pagina.js', 'utf8'));
  const { trabajos } = await import(S + '/trabajos.mjs?' + Date.now());
  const solo = process.argv[2];
  for (const [nombre, expr] of trabajos) {
    if (solo && !nombre.includes(solo)) continue;
    const v = await ev(expr);
    if (typeof v === 'string' && v.startsWith('data:image/png;base64,')) { fs.writeFileSync(`${S}/raw/${nombre}.png`, Buffer.from(v.slice(22), 'base64')); console.log('✔', nombre); }
    else if (v !== undefined && nombre.endsWith('.json')) { fs.writeFileSync(`${S}/raw/${nombre}`, typeof v === 'string' ? v : JSON.stringify(v)); console.log('✔', nombre); }
    else console.log('·', nombre, String(v).slice(0, 80));
  }
  ws.close();
} finally { chrome.kill(); }
