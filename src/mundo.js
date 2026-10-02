// ─────────────────────────────────────────────────────────────────────────────
// Mina · el mundo compartido — Ricardo López Reyero (RLR)
// Un Durable Object por mundo: es la única verdad sobre el terreno cavado y
// sobre quién está jugando. El terreno no se guarda: se calcula con la semilla;
// aquí solo vive un bit por celda cavada (6 KB por capa).
// ─────────────────────────────────────────────────────────────────────────────
import { DurableObject } from "cloudflare:workers";

const _RLR = "Ricardo López Reyero";
const _k = "EYE", _rev = 181218; // RLR · sello de autoría

const W = 96, H = 500, BYTES = (W * H) / 8;
const ZX0 = 39, ZX1 = 63;            // suelo firme bajo los edificios (filas 0 y 1)
const ALFA = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin 0/O ni 1/I
const MAX_CONECTADOS = 10, MAX_MAQUINITAS = 30;
const DIA = 86400000, CADUCA = 180 * DIA;
const MUNDOS_POR_DIA = 20;

const CFG_BASE = {
  modo: "clasico", comb: 1, caida: 1, lava: 1, gas: 1, verGas: 0,
  pierde: 2, rescates: 3, nombre: "", puerta: 0, reminTodos: 1, regalos: 1,
};

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

// Mandar nunca debe tumbar al mundo: un socket que se está cerrando solo devuelve false.
const crudo = (o) => typeof o === "string" || o instanceof ArrayBuffer || ArrayBuffer.isView(o);
const manda = (ws, o) => { try { ws.send(crudo(o) ? o : JSON.stringify(o)); return true; } catch { return false; } };

const entero = (v, min, max, def) => {
  v = Math.floor(Number(v));
  return Number.isFinite(v) && v >= min && v <= max ? v : def;
};
const limpio = (s, n) =>
  String(s ?? "").replace(/[\u0000-\u001f<>&"'`\\]/g, "").replace(/\s+/g, " ").trim().slice(0, n);

function nuevoId() {
  const b = crypto.getRandomValues(new Uint8Array(8));
  let s = "";
  for (const x of b) s += ALFA[x & 31];
  return s;
}

function cfgLimpia(c, antes) {
  c = c || {};
  const modo = ["paseo", "clasico", "rudo", "medida"].includes(c.modo) ? c.modo : antes.modo;
  return {
    modo,
    comb: entero(c.comb, 0, 1, antes.comb),
    caida: entero(c.caida, 0, 2, antes.caida),
    lava: entero(c.lava, 0, 2, antes.lava),
    gas: entero(c.gas, 0, 2, antes.gas),
    verGas: entero(c.verGas, 0, 1, antes.verGas),
    pierde: entero(c.pierde, 0, 3, antes.pierde),
    rescates: entero(c.rescates, -1, 3, antes.rescates),
    nombre: limpio(c.nombre, 24) || antes.nombre,
    puerta: entero(c.puerta, 0, 1, antes.puerta),
    reminTodos: entero(c.reminTodos, 0, 1, antes.reminTodos),
    regalos: entero(c.regalos, 0, 1, antes.regalos),
  };
}

// RLR · el mundo
export class Mundo extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.m = null;          // meta del mundo (null = sin leer, false = no existe)
    this.dug = null;        // bits de celdas cavadas
    this.jug = [];          // maquinitas registradas
    this.pos = new Map();   // última posición conocida de cada conectado
    this.sucio = { meta: false, dug: false, jug: new Set() };
    this.creados = new Map(); // portero: mundos creados hoy por visitante (solo en memoria)
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("p", "q"));
  }

  // ── Portero: tope de mundos nuevos por visitante al día (no guarda nada en disco)
  async permiso(quien) {
    const hoy = Math.floor(Date.now() / DIA);
    if (this.hoy !== hoy) { this.hoy = hoy; this.creados.clear(); }
    const n = (this.creados.get(quien) || 0) + 1;
    this.creados.set(quien, n);
    return n <= MUNDOS_POR_DIA;
  }

  async crear() {
    if (await this.ctx.storage.get("meta")) return false;
    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    const dueno = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const meta = { seed, remin: 0, reminAt: 0, cfg: { ...CFG_BASE }, creado: Date.now(), visto: Date.now(), n: 0, dueno, creador: -1 };
    await this.ctx.storage.put({ meta, dug: new Uint8Array(BYTES) });
    await this.ctx.storage.setAlarm(Date.now() + DIA);   // si nadie llega a bautizarse, se borra en un día
    this.m = null;
    return dueno;
  }

  async cargar() {
    if (this.m !== null) return this.m;
    const meta = await this.ctx.storage.get("meta");
    if (!meta) { this.m = false; return false; }
    const dug = await this.ctx.storage.get("dug");
    this.dug = dug instanceof Uint8Array && dug.length === BYTES ? dug : new Uint8Array(BYTES);
    this.jug = [];
    const lista = await this.ctx.storage.list({ prefix: "j:" });
    for (const [k, v] of lista) this.jug[Number(k.slice(2))] = v;
    this.m = meta;
    return meta;
  }

  conectados() {
    const s = new Set();
    for (const ws of this.ctx.getWebSockets()) {
      const a = ws.deserializeAttachment();
      if (a) s.add(a.i);
    }
    return s;
  }

  // Mundos anteriores a la llave de dueño: el creador es la primera maquinita.
  creador() { const m = this.m; return m.dueno ? m.creador : 0; }

  publico(i, on) {
    const j = this.jug[i];
    return { i, n: j.n, m: j.m, rec: j.rec || 0, tot: j.tot || 0, on: on ? 1 : 0 };
  }

  difundir(msg, menos) {
    const s = crudo(msg) ? msg : JSON.stringify(msg);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === menos || !ws.deserializeAttachment()) continue;
      manda(ws, s);
    }
  }

  socketDe(i) {
    for (const ws of this.ctx.getWebSockets()) {
      const a = ws.deserializeAttachment();
      if (a && a.i === i) return ws;
    }
    return null;
  }

  async programar() {
    const m = this.m;
    if (!m) return;
    let cuando = Math.max(Date.now() + 3600000, this.jug.length ? m.visto + CADUCA : m.creado + DIA);
    if (this.sucio.meta || this.sucio.dug || this.sucio.jug.size) cuando = Math.min(cuando, Date.now() + 5000);
    if (m.reminAt) cuando = Math.min(cuando, m.reminAt);
    const actual = await this.ctx.storage.getAlarm();
    if (actual === null || cuando < actual || actual < Date.now()) await this.ctx.storage.setAlarm(cuando);
  }

  // Guardado por lotes: una fila por cosa que cambió, nunca una por celda.
  async guardar() {
    const o = {};
    if (this.sucio.meta) o.meta = this.m;
    if (this.sucio.dug) o.dug = this.dug;
    for (const i of this.sucio.jug) o["j:" + i] = this.jug[i];
    this.sucio = { meta: false, dug: false, jug: new Set() };
    if (Object.keys(o).length) await this.ctx.storage.put(o);
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("Se esperaba websocket", { status: 426 });
    const [cliente, servidor] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(servidor);
    return new Response(null, { status: 101, webSocket: cliente });
  }

  // RLR · mensajes del juego
  async webSocketMessage(ws, msg) {
    const m = await this.cargar();
    const att = ws.deserializeAttachment();

    // Posición: 6 bytes binarios → se reenvía con el número de maquinita (7 bytes)
    if (typeof msg !== "string") {
      if (!att || msg.byteLength !== 6) return;
      const e = new Uint8Array(msg), s = new Uint8Array(7);
      s[0] = 1; s[1] = att.i; s.set(e.subarray(1), 2);
      this.pos.set(att.i, s);
      this.difundir(s, ws);
      return;
    }
    if (msg.length > 24000) return;
    let d;
    try { d = JSON.parse(msg); } catch { return; }
    if (!d || typeof d.t !== "string") return;

    if (d.t === "hola") return this.hola(ws, d);
    if (!m || !att) return;
    const i = att.i, yo = this.jug[i];
    if (!yo) return;

    switch (d.t) {
      case "cava": {
        if (!Array.isArray(d.c) || d.c.length > 30) return;
        const si = [], no = [];
        for (const c of d.c) {
          const idx = entero(c, 0, W * H - 1, -1);
          if (idx < 0) continue;
          const x = idx % W, y = (idx - x) / W;
          const firme = y < 2 && x >= ZX0 && x <= ZX1;
          if (firme || (this.dug[idx >> 3] & (1 << (idx & 7)))) { no.push(idx); continue; }
          this.dug[idx >> 3] |= 1 << (idx & 7);
          si.push(idx);
        }
        if (si.length) { this.sucio.dug = true; this.difundir({ t: "cava", i, c: si }, ws); }
        if (no.length) manda(ws, { t: "no", c: no });
        break;
      }
      case "est": {
        if (!d.e || typeof d.e !== "object") return;
        yo.est = d.e;
        const rec = entero(d.rec, 0, H * 2, yo.rec || 0), tot = Number.isFinite(d.tot) && d.tot >= 0 ? d.tot : yo.tot || 0;
        if (rec !== yo.rec || tot !== yo.tot) {
          yo.rec = rec; yo.tot = tot;
          this.difundir({ t: "j", i, rec, tot }, ws);
        }
        this.sucio.jug.add(i);
        break;
      }
      case "aviso":
        this.difundir({ t: "aviso", i, x: limpio(d.x, 90) }, ws);
        return;
      case "senal":
        this.difundir({ t: "senal", i, x: Number(d.x) || 0, y: Number(d.y) || 0 }, ws);
        return;
      case "fuel": {
        const otro = this.socketDe(entero(d.a, 0, MAX_MAQUINITAS, -1)), q = entero(d.q, 1, 50, 5);
        if (!otro || otro === ws || !manda(otro, { t: "fuel", i, q })) manda(ws, { t: "devuelve", fuel: q });
        return;
      }
      case "regalo": {
        const q = Number(d.q) > 0 ? Math.floor(Number(d.q)) : 0;
        const otro = m.cfg.regalos ? this.socketDe(entero(d.a, 0, MAX_MAQUINITAS, -1)) : null;
        if (!otro || otro === ws || !q || !manda(otro, { t: "regalo", i, q })) manda(ws, { t: "devuelve", d: q });
        return;
      }
      case "cfg":
        if (i !== this.creador()) return;
        m.cfg = cfgLimpia(d.cfg, m.cfg);
        this.sucio.meta = true;
        this.difundir({ t: "cfg", cfg: m.cfg, i });
        break;
      case "remin":
        if (m.reminAt || (!m.cfg.reminTodos && i !== this.creador())) return;
        m.reminAt = Date.now() + 10000;
        await this.ctx.storage.put("meta", m);
        this.difundir({ t: "cuenta", s: 10, i });
        break;
      case "borrar":
        if (i !== this.creador()) return;
        this.difundir({ t: "borrado" });
        for (const s of this.ctx.getWebSockets()) { try { s.close(4001, "borrado"); } catch {} }
        await this.ctx.storage.deleteAlarm();
        await this.ctx.storage.deleteAll();
        this.m = false;
        return;
      default:
        return;
    }
    await this.programar();
  }

  async hola(ws, d) {
    const m = this.m;
    const fin = (o) => { manda(ws, o); try { ws.close(4002, o.t); } catch {} };
    if (!m) return fin({ t: "noexiste" });
    const k = limpio(d.k, 64);
    if (k.length < 16) return fin({ t: "noexiste" });
    let i = this.jug.findIndex((j) => j && j.k === k);
    const previo = ws.deserializeAttachment();
    if (previo && previo.i !== i) { ws.serializeAttachment(null); this.pos.delete(previo.i); this.difundir({ t: "sale", i: previo.i }, ws); }
    const on = this.conectados();
    // el tope de conectados se revisa antes de registrar a nadie
    if ((i < 0 || !on.has(i)) && on.size >= MAX_CONECTADOS) return fin({ t: "lleno" });

    if (i < 0) {
      const n = limpio(d.n, 14);
      if (n.length < 2) {
        manda(ws, { t: "nuevo", nombre: m.cfg.nombre, puerta: m.cfg.puerta, hay: this.jug.filter(Boolean).length });
        return;
      }
      if (m.cfg.puerta && this.jug.length) return fin({ t: "cerrado" });
      if (this.jug.length >= MAX_MAQUINITAS) return fin({ t: "lleno" });
      i = this.jug.length;
      this.jug[i] = { k, n, m: entero(d.m, 0, 7, 0), est: null, rec: 0, tot: 0, alta: Date.now() };
      m.n = this.jug.length;
      await this.ctx.storage.put({ ["j:" + i]: this.jug[i], meta: m });
    }
    // La misma maquinita en otra pestaña: se queda la más reciente.
    const viejo = this.socketDe(i);
    if (viejo && viejo !== ws) { manda(viejo, '{"t":"otra"}'); viejo.serializeAttachment(null); try { viejo.close(4000, "otra"); } catch {} }

    ws.serializeAttachment({ i });
    on.add(i);
    if (m.dueno && m.creador !== i && d.d === m.dueno) m.creador = i;
    m.visto = Date.now();
    this.sucio.meta = true;

    let b = "";
    for (let x = 0; x < BYTES; x++) b += String.fromCharCode(this.dug[x]);
    manda(ws, {
      t: "mundo", i, seed: m.seed, remin: m.remin, cfg: m.cfg, creador: i === this.creador() ? 1 : 0,
      est: this.jug[i].est, cuenta: m.reminAt ? Math.max(0, Math.ceil((m.reminAt - Date.now()) / 1000)) : 0,
      jug: this.jug.map((j, x) => (j ? this.publico(x, on.has(x)) : null)).filter(Boolean),
      dug: btoa(b),
    });
    for (const [x, s] of this.pos) if (x !== i && on.has(x)) manda(ws, s);
    this.difundir({ t: "entra", j: this.publico(i, true) }, ws);
    await this.programar();
  }

  async webSocketClose(ws, code) {
    try { ws.close(code > 1000 && code < 5000 && code !== 1005 && code !== 1006 ? code : 1000); } catch {}
    const att = ws.deserializeAttachment();
    const m = await this.cargar();
    if (!m || !att) return;
    // Si la maquinita ya entró por otra pestaña, este cierre no la saca del mundo.
    const otro = this.ctx.getWebSockets().some((s) => s !== ws && s.deserializeAttachment()?.i === att.i);
    if (!otro) {
      this.pos.delete(att.i);
      this.difundir({ t: "sale", i: att.i }, ws);
    }
    m.visto = Date.now();
    this.sucio.meta = true;
    await this.guardar();
    await this.programar();
  }

  async webSocketError(ws) { return this.webSocketClose(ws, 1011); }

  async alarm() {
    const m = await this.cargar();
    if (!m) return;
    const ahora = Date.now();
    if (m.reminAt && ahora >= m.reminAt - 50) {
      // Remineralizar: semilla nueva para la capa y se borran los bits de lo cavado.
      m.remin++; m.reminAt = 0;
      this.dug.fill(0);
      this.sucio.meta = this.sucio.dug = true;
      this.difundir({ t: "remin", remin: m.remin });
    }
    await this.guardar();
    const caduco = this.jug.length ? ahora - m.visto >= CADUCA : ahora - m.creado >= DIA;
    if (!this.ctx.getWebSockets().length && caduco) {
      await this.ctx.storage.deleteAll();
      this.m = false;
      return;
    }
    await this.programar();
  }
}

// RLR · puerta de entrada
export default {
  async fetch(request, env) {
    const u = new URL(request.url);

    if (u.pathname === "/api/mundo" && request.method === "POST") {
      const quien = request.headers.get("CF-Connecting-IP") || "local";
      const portero = env.MUNDO.get(env.MUNDO.idFromName("~portero"));
      if (!(await portero.permiso(quien))) return json({ error: "limite" }, 429);
      for (let n = 0; n < 5; n++) {
        const id = nuevoId();
        const d = await env.MUNDO.get(env.MUNDO.idFromName(id)).crear();
        if (d) return json({ id, d });
      }
      return json({ error: "reintenta" }, 503);
    }

    const ws = u.pathname.match(/^\/ws\/([2-9A-HJ-NP-Z]{8})$/);
    if (ws) return env.MUNDO.get(env.MUNDO.idFromName(ws[1])).fetch(request);

    if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/ws/")) return json({ error: "no" }, 404);
    return env.ASSETS.fetch(request);
  },
};
