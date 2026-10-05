// Convierte el brochure (publico/guia-estilos/brochure/) en PDF tamaño carta y saca la miniatura de la portada. Uso: node pdf.mjs <salida.pdf> <portada.png>
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const S = path.dirname(new URL(import.meta.url).pathname), PUERTO = 9336, dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=' + PUERTO, '--user-data-dir=' + S + '/chrome4', '--window-size=816,1056', '--hide-scrollbars', '--no-first-run', '--force-device-scale-factor=2', 'about:blank'], { stdio: 'ignore' });
try {
  let t = null; for (let i = 0; i < 60 && !t; i++) { await dormir(250); try { t = await (await fetch(`http://127.0.0.1:${PUERTO}/json`)).json(); } catch {} }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r, n) => { ws.onopen = r; ws.onerror = n; });
  let id = 0; const pend = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await cmd('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 900)); return r.result.result.value; };
  await cmd('Page.enable'); await cmd('Page.navigate', { url: (process.env.BASE || 'http://localhost:8791') + '/guia-estilos/brochure/' }); await dormir(2500);
  console.log(await ev(`(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); return JSON.stringify({ hojas: document.querySelectorAll('.hoja').length, rotas: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src), desbordan: [...document.querySelectorAll('.hoja')].map((h, k) => [k + 1, h.scrollHeight - h.clientHeight]).filter((x) => x[1] > 0) }); })()`));
  if (process.argv[3]) { await ev(`document.body.style.padding = 0; document.querySelector('.barra').style.display = 'none'; document.querySelector('.hoja').style.margin = 0; scrollTo(0, 0); 'ok'`); await dormir(300); const f = await cmd('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 816, height: 1056, scale: 1 } }); fs.writeFileSync(process.argv[3], Buffer.from(f.result.data, 'base64')); }
  ws.close();
} finally { chrome.kill(); }
// el PDF sale por la línea de comandos de Chrome (por CDP se quedaba esperando): se espera a que el archivo exista y deje de crecer
const sal = process.argv[2]; fs.rmSync(sal, { force: true });
const c2 = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--user-data-dir=' + S + '/chrome5', '--no-first-run', '--no-pdf-header-footer', '--virtual-time-budget=9000', '--print-to-pdf=' + sal, (process.env.BASE || 'http://localhost:8791') + '/guia-estilos/brochure/'], { stdio: 'ignore' });
let antes = -1; for (let i = 0; i < 180; i++) { await dormir(1000); const t = fs.existsSync(sal) ? fs.statSync(sal).size : 0; if (t > 0 && t === antes) break; antes = t; }
c2.kill(); console.log('✔', sal, Math.round(fs.statSync(sal).size / 1024), 'KB'); process.exit(0);
