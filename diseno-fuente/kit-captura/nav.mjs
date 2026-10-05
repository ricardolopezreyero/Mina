// Navegador sin ventana para sacar capturas del juego real (con el juego en local, puerto 8791). Deja las imágenes en cap/.
// Uso: TAM=1200x760 node nav.mjs brochure-capturas.mjs   ·   MOVIL=1 TAM=390x844 node nav.mjs brochure-celular.mjs
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const S = path.dirname(new URL(import.meta.url).pathname), PUERTO = 9335, dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const [W, H] = (process.env.TAM || '1440x900').split('x').map(Number);
fs.rmSync(S + '/chrome3', { recursive: true, force: true });
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=' + PUERTO, '--user-data-dir=' + S + '/chrome3', `--window-size=${W},${H}`, '--hide-scrollbars', '--no-first-run', '--force-device-scale-factor=' + (process.env.DPR || 2), '--autoplay-policy=no-user-gesture-required', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
try {
  let t = null; for (let i = 0; i < 60 && !t; i++) { await dormir(250); try { t = await (await fetch(`http://127.0.0.1:${PUERTO}/json`)).json(); } catch {} }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r, n) => { ws.onopen = r; ws.onerror = n; });
  let id = 0; const pend = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await cmd('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 900)); return r.result.result.value; };
  const foto = async (nombre) => { const r = await cmd('Page.captureScreenshot', { format: 'png' }); fs.mkdirSync(S + '/cap', { recursive: true }); fs.writeFileSync(`${S}/cap/${nombre}.png`, Buffer.from(r.result.data, 'base64')); console.log('📸', nombre); };
  const COD = { ArrowDown: 40, ArrowUp: 38, ArrowLeft: 37, ArrowRight: 39, Enter: 13, Escape: 27 };
  const tecla = async (k, ms = 80) => { const p = { key: k, code: k.length === 1 ? 'Key' + k.toUpperCase() : k, windowsVirtualKeyCode: COD[k] || k.toUpperCase().charCodeAt(0) }; await cmd('Input.dispatchKeyEvent', { type: 'keyDown', ...p }); await dormir(ms); await cmd('Input.dispatchKeyEvent', { type: 'keyUp', ...p }); await dormir(60); };
  const clic = async (x, y) => { for (const type of ['mousePressed', 'mouseReleased']) await cmd('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }); await dormir(120); };
  const ir = async (url, ms = 4000) => { await cmd('Page.navigate', { url }); await dormir(ms); };
  await cmd('Page.enable');
  if (process.env.MOVIL) { await cmd('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 3, mobile: true }); await cmd('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); await cmd('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' }); }
  const pasos = (await import(path.resolve(process.argv[2]) + '?' + Date.now())).default;
  await pasos({ cmd, ev, foto, tecla, clic, ir, dormir, fs, S });
  ws.close();
} finally { chrome.kill(); }
